import cv2
import mediapipe as mp
import pyautogui
import numpy as np

# Safety: disable corner-kill
pyautogui.FAILSAFE = False

mp_face_mesh = mp.solutions.face_mesh


class EyeGazeMouseController:
    """
    Eye-gaze-based mouse controller using MediaPipe FaceMesh + Iris.

    - Uses iris center relative to eye corners to estimate gaze.
    - Maps gaze to screen coordinates with a simple, reliable transform.
    - Includes smoothing + clean overlay for demos & debugging.
    """

    def __init__(self):
        # ===== TUNABLE CONFIG =====

        # More smoothing => less jitter, more lag (0.0 - 1.0)
        self.SMOOTHING = 0.5

        # Gaze calibration band in iris-in-eye space.
        # 0 = extreme left/up of eye, 1 = extreme right/down.
        # We'll map [MIN, MAX] -> full screen.
        # Start with a reasonably wide band; we can tune later.
        self.GAZE_X_MIN = 0.15
        self.GAZE_X_MAX = 0.85
        self.GAZE_Y_MIN = 0.20
        self.GAZE_Y_MAX = 0.80

        # ==========================
        self.screen_w, self.screen_h = pyautogui.size()
        self.prev_x = self.screen_w // 2
        self.prev_y = self.screen_h // 2

        # Landmark indices (MediaPipe with refine_landmarks=True)
        # These are standard for the FaceMesh iris model.
        self.LEFT_EYE = {
            "corner_outer": 33,
            "corner_inner": 133,
            "top": 159,
            "bottom": 145,
            "iris": [474, 475, 476, 477],  # left iris cluster
        }
        self.RIGHT_EYE = {
            "corner_outer": 362,
            "corner_inner": 263,
            "top": 386,
            "bottom": 374,
            "iris": [469, 470, 471, 472],  # right iris cluster
        }

    # ---------- Core geometry ----------

    def _get_iris_center(self, lm, iris_indices):
        """Return (x,y) of iris center in normalized image coords."""
        if len(lm) <= max(iris_indices):
            return None

        xs = [lm[i].x for i in iris_indices]
        ys = [lm[i].y for i in iris_indices]
        return float(np.mean(xs)), float(np.mean(ys))

    def _eye_gaze_from_landmarks(self, lm, eye_cfg):
        """
        Compute normalized iris position (hx, hy) within eye box for one eye.

        Returns:
            hx, hy in [0,1]  (0 = left/up within that eye, 1 = right/down),
            iris_x, iris_y  (normalized image coords for visualization)
        """
        try:
            c_outer = lm[eye_cfg["corner_outer"]]
            c_inner = lm[eye_cfg["corner_inner"]]
            t = lm[eye_cfg["top"]]
            b = lm[eye_cfg["bottom"]]
        except IndexError:
            return None

        iris_center = self._get_iris_center(lm, eye_cfg["iris"])
        if iris_center is None:
            return None

        iris_x, iris_y = iris_center

        # Eye bounding box in normalized image coordinates
        x_min = min(c_outer.x, c_inner.x)
        x_max = max(c_outer.x, c_inner.x)
        y_min = min(t.y, b.y)
        y_max = max(t.y, b.y)

        if x_max - x_min <= 1e-6 or y_max - y_min <= 1e-6:
            return None

        # Normalize iris position inside the eye box
        hx = (iris_x - x_min) / (x_max - x_min)
        hy = (iris_y - y_min) / (y_max - y_min)

        # Sanity range: if it's way off, ignore
        if not (0.0 <= hx <= 1.5 and 0.0 <= hy <= 1.5):
            return None

        return hx, hy, iris_x, iris_y

    def _combine_eyes(self, left_res, right_res):
        """
        Combine left & right eye gaze by averaging when possible.
        Returns:
            hx, hy, iris_points_list
        """
        vals = []
        iris_points = []

        if left_res is not None:
            hx, hy, ix, iy = left_res
            vals.append((hx, hy))
            iris_points.append((ix, iy))
        if right_res is not None:
            hx, hy, ix, iy = right_res
            vals.append((hx, hy))
            iris_points.append((ix, iy))

        if not vals:
            return None, None, []

        hx = float(np.mean([v[0] for v in vals]))
        hy = float(np.mean([v[1] for v in vals]))
        return hx, hy, iris_points

    # ---------- Mapping & smoothing ----------

    def _map_gaze_to_screen(self, hx, hy):
        """
        Map gaze (hx, hy) in [0,1] eye-space to screen coords.
        Strong, simple mapping so you SEE the cursor move.
        """

        # Clamp to our calibration window
        hx = np.clip(hx, self.GAZE_X_MIN, self.GAZE_X_MAX)
        hy = np.clip(hy, self.GAZE_Y_MIN, self.GAZE_Y_MAX)

        # Normalize inside that band to [0, 1]
        if self.GAZE_X_MAX > self.GAZE_X_MIN:
            hx_norm = (hx - self.GAZE_X_MIN) / (self.GAZE_X_MAX - self.GAZE_X_MIN)
        else:
            hx_norm = 0.5

        if self.GAZE_Y_MAX > self.GAZE_Y_MIN:
            hy_norm = (hy - self.GAZE_Y_MIN) / (self.GAZE_Y_MAX - self.GAZE_Y_MIN)
        else:
            hy_norm = 0.5

        # NOTE: No inversion here; make direction intuitive:
        # Looking right -> iris moves right -> cursor right.
        target_x = int(hx_norm * self.screen_w)
        target_y = int(hy_norm * self.screen_h)
        return target_x, target_y

    def _smooth(self, target_x, target_y):
        """Exponential smoothing to avoid jitter."""
        x = int(self.prev_x + self.SMOOTHING * (target_x - self.prev_x))
        y = int(self.prev_y + self.SMOOTHING * (target_y - self.prev_y))
        self.prev_x, self.prev_y = x, y
        return x, y

    # ---------- Visualization ----------

    def _draw_overlay(self, frame, iris_points, cursor_x, cursor_y, gaze_valid):
        """
        Minimal but aesthetic HUD:
        - Title bar
        - Calibration band hint (on full frame as a guide)
        - Iris markers
        - Cursor projection crosshair
        """
        h, w, _ = frame.shape

        # Top translucent bar
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 65), (0, 0, 0), -1)
        frame[:] = cv2.addWeighted(overlay, 0.35, frame, 0.65, 0)

        title = "HeadGazeFusion - Eye Gaze Mouse"
        subtitle = "ESC/Q: Quit  |  Keep head steady, move only eyes to control cursor."

        cv2.putText(
            frame,
            title,
            (10, 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )
        cv2.putText(
            frame,
            subtitle,
            (10, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (220, 220, 220),
            1,
        )

        # Calibration band hint (approximate, for user intuition)
        band_color = (180, 180, 255) if gaze_valid else (90, 90, 120)
        x1 = int(self.GAZE_X_MIN * w)
        x2 = int(self.GAZE_X_MAX * w)
        y1 = int(self.GAZE_Y_MIN * h)
        y2 = int(self.GAZE_Y_MAX * h)
        cv2.rectangle(frame, (x1, y1), (x2, y2), band_color, 1)

        # Draw iris centers
        for (ix, iy) in iris_points:
            cx = int(ix * w)
            cy = int(iy * h)
            cv2.circle(frame, (cx, cy), 3, (0, 255, 0), -1)

        # Draw cursor projection in camera space
        fx = int(cursor_x / self.screen_w * w)
        fy = int(cursor_y / self.screen_h * h)
        cv2.circle(frame, (fx, fy), 8, (255, 255, 255), 2)
        cv2.line(frame, (fx - 10, fy), (fx + 10, fy), (255, 255, 255), 1)
        cv2.line(frame, (fx, fy - 10), (fx, fy + 10), (255, 255, 255), 1)

        return frame

    # ---------- Main loop ----------

    def run(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open webcam.")
            return

        # Start from center
        pyautogui.moveTo(self.prev_x, self.prev_y, duration=0)

        with mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,          # IMPORTANT for iris landmarks
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6,
        ) as face_mesh:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Error: Failed to read frame from webcam.")
                    break

                # Mirror so control feels natural
                frame = cv2.flip(frame, 1)

                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = face_mesh.process(rgb)

                iris_points = []
                gaze_valid = False

                if results.multi_face_landmarks:
                    lm = results.multi_face_landmarks[0].landmark

                    left_res = self._eye_gaze_from_landmarks(lm, self.LEFT_EYE)
                    right_res = self._eye_gaze_from_landmarks(lm, self.RIGHT_EYE)

                    hx, hy, iris_points = self._combine_eyes(left_res, right_res)

                    if hx is not None and hy is not None:
                        gaze_valid = True
                        tx, ty = self._map_gaze_to_screen(hx, hy)
                        sx, sy = self._smooth(tx, ty)
                        pyautogui.moveTo(sx, sy, duration=0)
                        frame = self._draw_overlay(frame, iris_points, sx, sy, gaze_valid)
                    else:
                        # No valid gaze, keep last projected cursor position
                        frame = self._draw_overlay(
                            frame, iris_points, self.prev_x, self.prev_y, gaze_valid
                        )
                else:
                    # No face detected
                    frame = self._draw_overlay(
                        frame, iris_points, self.prev_x, self.prev_y, gaze_valid
                    )

                cv2.imshow("HeadGazeFusion - Eye Gaze Mouse", frame)

                key = cv2.waitKey(1) & 0xFF
                if key == 27 or key in (ord("q"), ord("Q")):
                    break

        cap.release()
        cv2.destroyAllWindows()


def main():
    controller = EyeGazeMouseController()
    controller.run()


if __name__ == "__main__":
    main()
