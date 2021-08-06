import React, { createContext, useContext, useState } from 'react'

import AppMenu from './components/app-menu'
import LoginPanel from './components/login-panel'
import UrlShortener from './components/url-shortener'
import LinkManager from './components/link-manager'
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

type AppState = 'shortener' | 'manager'

const App = () => {
  const [app, setApp] = useState<AppState>('shortener')
  const loginState = useContext(LoginContext)

  return (
    <>
      {loginState.login
        ? (
          <>
            <AppMenu
              onSwitchApp={ (newApp) => { setApp(newApp) } }/>
            {app == 'shortener'
              && <UrlShortener />
            }
            {app == 'manager'
              && <LinkManager />
            }
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
      <article className='container'>
        <App />
      </article>
    </LoginContext.Provider>
  )
}

export default AppContainer
export { LoginContext }
export type { AppState }