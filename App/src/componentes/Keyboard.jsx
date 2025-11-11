import React, { useEffect, useRef, useState } from 'react'
import './Keyboard.css'

// Import icons from the icons folder
import MySelfIcon from '../icons/myself_10012465.png'
import QuestionIcon from '../icons/question-mark.png'
import PlaceIcon from '../icons/place.png'
import PhoneIcon from '../icons/phone-call.png'
import ClockIcon from '../icons/wall-clock_5378485.png'
import HomeIcon from '../icons/home.png'
import EatIcon from '../icons/binge-eating.png'
import LikeIcon from '../icons/like.png'
import RainbowIcon from '../icons/rainbow_10129397.png'
import DrinkIcon from '../icons/soda_1652494.png'
import PlayIcon from '../icons/rc-car.png'
import StopIcon from '../icons/stop_5181609.png'
import AlphabetIcon from '../icons/alphabet.png'
import CancelIcon from '../icons/cancel_1721955.png'
import SmileIcon from '../icons/smile_9350598.png'
import CheckIcon from '../icons/check-mark_5299048.png'
import VideoIcon from '../icons/video.png'

const KEYBOARD_KEYS = [
  // Row 1 - Categories
  { id: 'i', label: 'I', type: 'pronoun', color: '#fff4d6' },
  { id: 'questions', label: 'QUESTIONS', icon: QuestionIcon, type: 'category', color: '#b3e5fc' },
  { id: 'places', label: 'PLACES', icon: PlaceIcon, type: 'category', color: '#f5f5f5' },
  { id: 'social', label: 'SOCIAL', icon: PhoneIcon, type: 'category', color: '#f5f5f5' },
  { id: 'time', label: 'TIME', icon: ClockIcon, type: 'category', color: '#ffd699' },
  { id: 'exit', label: 'EXIT', icon: HomeIcon, type: 'action', color: '#ffccbc' },
  
  // Row 2
  { id: 'my', label: 'my', icon: MySelfIcon, type: 'pronoun', color: '#fff4d6' },
  { id: 'can', label: 'can', type: 'verb', color: '#f5f5f5' },
  { id: 'to', label: 'to', type: 'preposition', color: '#f5f5f5' },
  { id: 'eat', label: 'eat', icon: EatIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'good', label: 'good', icon: LikeIcon, type: 'adjective', color: '#e1bee7' },
  { id: 'describe', label: 'DESCRIBE', icon: RainbowIcon, type: 'category', color: '#e1bee7' },
  
  // Row 3
  { id: 'you', label: 'you', type: 'pronoun', color: '#fff4d6' },
  { id: 'do', label: 'do', type: 'verb', color: '#f5f5f5' },
  { id: 'drink', label: 'drink', icon: DrinkIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'play', label: 'play', icon: PlayIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'stop', label: 'stop', icon: StopIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'vocab', label: 'VOCAB', icon: AlphabetIcon, type: 'category', color: '#80deea' },
  
  // Row 4
  { id: 'it', label: 'it', type: 'pronoun', color: '#fff4d6' },
  { id: 'dont', label: "don't", icon: CancelIcon, type: 'verb', color: '#ffcdd2' },
  { id: 'like', label: 'like', icon: SmileIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'yes', label: 'yes', icon: CheckIcon, type: 'response', color: '#c8e6c9' },
  { id: 'watch', label: 'watch', icon: VideoIcon, type: 'verb', color: '#c8e6c9' },
  { id: 'clear', label: 'clear', type: 'action', color: '#f5f5f5' },
]

const DWELL_TIME = 2000 // 2 seconds

export default function Keyboard({ onKeyPress, sentence = '', onSentenceChange }) {
  const [hoveredKey, setHoveredKey] = useState(null)
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

  // Dwell detection for keyboard keys
  useEffect(() => {
    const checkHover = () => {
      const { x, y } = mouseRef.current
      let found = null

      const keys = document.querySelectorAll('.keyboard-key')
      keys.forEach((keyEl) => {
        const rect = keyEl.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          found = keyEl.getAttribute('data-key-id')
        }
      })

      if (found !== hoveredKey) {
        setHoveredKey(found)
      }

      rafRef.current = requestAnimationFrame(checkHover)
    }

    rafRef.current = requestAnimationFrame(checkHover)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hoveredKey])

  // Handle dwell timer and actions
  useEffect(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }

    if (hoveredKey) {
      dwellTimerRef.current = setTimeout(() => {
        // Add the key text to the sentence
        if (onSentenceChange) {
          const key = KEYBOARD_KEYS.find(k => k.id === hoveredKey)
          if (key) {
            if (key.id === 'clear') {
              // Clear the sentence
              onSentenceChange('')
            } else {
              // Add the key label to the sentence with a space
              const newSentence = sentence ? `${sentence} ${key.label}` : key.label
              onSentenceChange(newSentence)
            }
          }
        }
        
        // Call onKeyPress with the key that was dwelled on
        if (onKeyPress) {
          const key = KEYBOARD_KEYS.find(k => k.id === hoveredKey)
          if (key) {
            onKeyPress(key)
          }
        }
      }, DWELL_TIME)
    }

    return () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current)
        dwellTimerRef.current = null
      }
    }
  }, [hoveredKey, onKeyPress, sentence, onSentenceChange])

  // Update cursor fill state
  useEffect(() => {
    if (hoveredKey) {
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
  }, [hoveredKey])

  return (
    <div className="keyboard-container">
      <div className="keyboard-header">CS435 HCI Vocab</div>
      
      <div className="keyboard-grid">
        {KEYBOARD_KEYS.map((key) => (
          <button
            key={key.id}
            data-key-id={key.id}
            className={`keyboard-key ${key.type} ${hoveredKey === key.id ? 'hovered' : ''}`}
            style={{ backgroundColor: key.color }}
            aria-label={key.label}
          >
            {key.icon && <img src={key.icon} alt={key.label} className="key-icon" />}
            <span className="key-label">{key.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
