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

  const loginProcess = async (key?: string) => {
    const res = await axios.get('https://localhost:17777/api/login', {
      params: {
        key: typeof key == 'string' ? key : ''
      }
    })

    if ('code' in res.data && res.data.code === 0) {
      setLogin(true)
    }
  }

  const logoutProcess = () => {
    setLogin(false)
  }

  useEffect(() => { loginProcess() }, [])

  return (
    <div className='app'>
      { login
        ? <UrlShortener
          onLogout={ () => { logoutProcess() } } />
        : <LoginPanel
          onLoginUpdate={ (key) => { loginProcess(key) } } />
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