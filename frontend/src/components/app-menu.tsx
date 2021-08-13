import React, { useContext } from 'react'
import axios from 'axios'

import { LoginContext, AppState } from '../app'
import config from '../config'
import './app-menu.sass'

interface AppMenuProps {
  selected: AppState
  onSwitchApp(newApp: AppState): void
}

const AppMenu = (props: AppMenuProps) => {
  const loginState = useContext(LoginContext)

  const logoutProcess = async () => {
    try {
      const res = await axios.get(`${config.url}/auth/logout`, {
        withCredentials: true
      })

      if ('code' in res.data && res.data.code === 0) {
        loginState.setLogin(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='app-menu'>
      <div className='app-menu__tags'>
        <a
          className={`app-menu__tags-item${props.selected == 'shortener' ? '--selected' : ''}`}
          onClick={() => { props.onSwitchApp('shortener') }}>
          Shortener
        </a>
        <a
          className={`app-menu__tags-item${props.selected == 'manager' ? '--selected' : ''}`}
          onClick={() => { props.onSwitchApp('manager') }}>
          Link Manager
        </a>
      </div>
      <button onClick={() => { logoutProcess() }}>
        Log Out
      </button>
    </div>
  )
}

export default AppMenu