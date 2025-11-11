import React, { useEffect, useRef, useState } from 'react'
import './VoiceFlow.css'
import Keyboard from './Keyboard'

const DWELL_TIME = 2000 // 2 seconds

export default function VoiceFlow({ onBack }) {
  const [step, setStep] = useState('listening') // 'listening' | 'keyboard'
  const [hoveredElement, setHoveredElement] = useState(null)
  const [sentence, setSentence] = useState('')
  const dwellTimerRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef(0)

  // Track mouse position
  useEffect(() => {
    const setVars = (x, y) => {
      mouseRef.current = { x, y }
      document.body.style.setProperty('--mouse-x', `${x}px`)
      document.body.style.setProperty('--mouse-y', `${y}px`)
    }

    const onMove = (e) => {
      setVars(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Dwell detection for buttons
  useEffect(() => {
    const checkHover = () => {
      const { x, y } = mouseRef.current
      let found = null

      const buttons = document.querySelectorAll('.close-btn')
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          found = btn.className
        }
      })

      if (found !== hoveredElement) {
        setHoveredElement(found)
      }

      rafRef.current = requestAnimationFrame(checkHover)
    }

    rafRef.current = requestAnimationFrame(checkHover)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hoveredElement])

  // Handle dwell timer and actions
  useEffect(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }

    if (hoveredElement) {
      dwellTimerRef.current = setTimeout(() => {
        if (hoveredElement.includes('close-btn')) {
          // Handle close action if needed
        }
      }, DWELL_TIME)
    }

    return () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current)
        dwellTimerRef.current = null
      }
    }
  }, [hoveredElement])

  // Update cursor fill state
  useEffect(() => {
    if (hoveredElement) {
      document.body.style.setProperty('--dwell-duration', `${DWELL_TIME}ms`)
      requestAnimationFrame(() => {
        document.body.style.setProperty('--cursor-fill', 'inset(0 0 0 0 round 50%)')
      })
    } else {
      document.body.style.setProperty('--dwell-duration', '0s')
      requestAnimationFrame(() => {
        document.body.style.setProperty('--cursor-fill', 'inset(100% 0 0 0 round 50%)')
      })
    }
  }, [hoveredElement])

  // Auto-transition from listening to keyboard after 5 seconds
  useEffect(() => {
    if (step === 'listening') {
      const timer = setTimeout(() => {
        setStep('keyboard')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [step])

  // Handle 'B' key press to go back to home
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'b' || e.key === 'B') {
        onBack && onBack()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onBack])

  return (
    <div className="voice-wrapper">

      {step === 'listening' && (
        <div className="listening-screen">
          <div className="listening-card">
            <input 
              type="text" 
              className="listening-input" 
              placeholder="Text Input here..."
              readOnly
            />
            <div className="listening-content">
              <div className="listening-label">Listening...</div>
              <div className="sound-wave">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
              <div className="kindly-speak">Kindly Speak</div>
            </div>
          </div>
        </div>
      )}

      {step === 'keyboard' && (
        <div className="keyboard-screen">
          <div className="input-display">
            <input 
              type="text" 
              className="sentence-input" 
              placeholder="Your sentence will appear here..."
              value={sentence}
              readOnly
            />
            <button className="close-btn" aria-label="Close">×</button>
          </div>
          
          <Keyboard sentence={sentence} onSentenceChange={setSentence} />
        </div>
      )}
    </div>
  )
}
