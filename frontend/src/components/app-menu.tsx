import React, { useContext } from 'react'
import axios from 'axios'

import { LoginContext, AppState } from '../app'
import './app-menu.sass'

interface AppMenuProps {
  onSwitchApp(newApp: AppState): void
}

const AppMenu = (props: AppMenuProps) => {
  const loginState = useContext(LoginContext)

  const logoutProcess = async () => {
    try {
      const res = await axios.get(`https://localhost:17777/auth/logout`)

      if ('code' in res.data && res.data.code === 0) {
        loginState.setLogin(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='app-menu'>
      <div className='app-menu__tags'>
        <a
          className='app-menu__tags-item'
          onClick={() => { props.onSwitchApp('shortener') }}>
          Shortener
        </a>
        <div className='app-menu__divider'/>
        <a
          className='app-menu__tags-item'
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