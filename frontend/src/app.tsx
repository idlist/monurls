import React, { useState } from 'react'

import UrlShortener from './components/url-shortener'
import LoginPanel from './components/login-panel'
import './app.sass'

const Header = () => {
  return (
    <header className='header'>
      monurls - My own Node.js URL shortener
    </header>
  )
}

const App = () => {
  const [login, setLogin] = useState(false)

  return (
    <div className='app'>
      {login
        ? <UrlShortener
          onLogout={() => { setLogin(false) }} />
        : <LoginPanel
          onLogin={() => { setLogin(true) }} />
      }
    </div>
  )
}

const AppContainer = () => {
  return (
    <>
      <Header />
      <div className='container'>
        <App />
      </div>
    </>
  )
}

export default AppContainer