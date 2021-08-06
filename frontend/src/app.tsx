import React, { createContext, useContext, useState } from 'react'

import AppMenu from './components/app-menu'
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

interface LoginContextType {
  login: boolean
  setLogin(state: boolean): void
}

const LoginContext = createContext<LoginContextType>({
  login: false,
  setLogin: () => { }
})

const App = () => {
  const loginState = useContext(LoginContext)

  return (
    <>
      {loginState.login
        ? (
          <>
            <AppMenu />
            <UrlShortener />
          </>
        )
        : <LoginPanel />
      }
    </>
  )
}

const AppContainer = () => {
  const [login, setLogin] = useState(false)

  const loginState = {
    login: login,
    setLogin: (state: boolean) => { setLogin(state) }
  }

  return (
    <LoginContext.Provider value={loginState}>
      <Header />
      <div className='container'>
        <App />
      </div>
    </LoginContext.Provider>
  )
}

export default AppContainer
export { LoginContext }