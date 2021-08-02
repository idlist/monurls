import axios from 'axios'
import React, { useEffect, useState } from 'react'

import UrlShortener from './components/url-shortener'
import LoginPanel from './components/login-panel'
import './layout.sass'

const Header = () => {
  return (
    <header className='header'>
      monurls - My own Node.js URL shortener
    </header>
  )
}

const App = () => {
  const [login, setLogin] = useState(false)

  const updateLoginState = async (key?: string) => {
    if (typeof key == 'undefined') {
      const storedKey = localStorage.getItem('key')
      if (typeof storedKey == 'string') {
        key = storedKey
      }
    }

    if (typeof key == 'undefined') return

    const res = await axios.get('http://localhost:17777/api/auth', {
      params: {
        key: key
      }
    })

    if ('code' in res.data && res.data.code === 0) {
      setLogin(true)
      localStorage.setItem('key', key)
    }
  }

  useEffect(() => {
    updateLoginState()
  })

  return (
    <div className='app'>
      { login
        ? <UrlShortener />
        : <LoginPanel
          onLoginUpdate={ (key) => { updateLoginState(key) } } />
      }
    </div>
  )
}

const Layout = () => {
  return (
    <>
      <Header />
      <div className='container'>
        <App />
      </div>
    </>
  )
}

export default Layout