import React, { useContext } from 'react'
import axios from 'axios'

import { LoginContext } from '../app'
import './app-menu.sass'

const AppMenu = () => {
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
      <div>Menu</div>
      <button onClick={() => { logoutProcess() }}>
        Log Out
      </button>
    </div>
  )
}

export default AppMenu