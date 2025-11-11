import React, { useState } from 'react'
import Home from '../src/componentes/Home'
import EyeGazeFlow from '../src/componentes/EyeGazeFlow'
import VoiceFlow from '../src/componentes/VoiceFlow'
import HeadTrackingFlow from '../src/componentes/HeadTrackingFlow'
import '../src/index.css'

import './App.css'

function App(){
	const [route, setRoute] = useState('home') // 'home' | 'eye' | 'voice' | 'head'

	const handleSelectModality = (id) => {
		setRoute(id)
	}

	if (route === 'eye') {
		return <EyeGazeFlow onBack={() => setRoute('home')} />
	}

	if (route === 'voice') {
		return <VoiceFlow onBack={() => setRoute('home')} />
	}

	if (route === 'head') {
		return <HeadTrackingFlow onBack={() => setRoute('home')} />
	}

	return <Home onSelectModality={handleSelectModality} />
}

export default App
