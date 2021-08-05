import React, { useState, useEffect, KeyboardEvent } from 'react'
import axios from 'axios'

import MessageBar from './message-bar'
import './login-panel.sass'

interface LoginPanelProps {
  onLogin(): void
}

const LoginPanel = (props: LoginPanelProps) => {
  const [key, setKey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loginProcess = async (key?: string) => {
    const useKey = (typeof key == 'string')

    try {
      const res = await axios.get('https://localhost:17777/auth/login', {
        params: {
          key: useKey ? key : ''
        }
      })

      if ('code' in res.data) {
        if (res.data.code === 0) {
          props.onLogin()
          setErrorMessage('')
        } else {
          setErrorMessage(res.data.message)
        }
      }
    } catch (err) {
      if (useKey) {
        setErrorMessage('Something\'s wrong with the network...')
      }
      console.log(err)
    }
  }

  const checkEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      loginProcess(key)
    }
  }

  useEffect(() => { loginProcess() }, [])

  return (
    <div className='login-panel'>
      <MessageBar
        success='Please verify that you are you!'
        error={errorMessage} />
      <div className='login-panel__row'>
        <input
          type='text' value={key}
          placeholder='Key'
          onChange={(e) => { setKey(e.target.value) }}
          onKeyUp={(e) => { checkEnter(e) }} />
        <button onClick={() => { loginProcess(key) }}>
          Login
        </button>
      </div>
    </div>
  )
}

export default LoginPanel