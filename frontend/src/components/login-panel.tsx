import React, { useState, useEffect, useContext, KeyboardEvent } from 'react'
import axios from 'axios'

import MessageBar from './message-bar'
import { LoginContext } from '../app'
import { useHidden } from '../common/custom-hooks'
import './login-panel.sass'

const LoginPanel = () => {
  const hidden = useHidden()

  const [key, setKey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loginState = useContext(LoginContext)

  const loginProcess = async (key?: string) => {
    const useKey = (typeof key == 'string')
    if (key === '') {
      setErrorMessage('No input.')
      return
    }

    try {
      const res = await axios.get('https://localhost:17777/auth/login', {
        params: {
          key: useKey ? key : ''
        }
      })

      if ('code' in res.data) {
        if (res.data.code === 0) {
          setErrorMessage('')
          loginState.setLogin(true)
        } else if (key) {
          setErrorMessage(res.data.message)
        }
      }
    } catch (err) {
      if (useKey) {
        setErrorMessage('Something\'s wrong with the network...')
        console.log(err)
      }
    }
  }

  const checkEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      loginProcess(key)
    }
  }

  useEffect(() => { loginProcess() }, [])

  return (
    <div className={ `login-panel ${hidden ? 'hidden' : ''}` }>
      <MessageBar
        success='Please verify that you are you!'
        error={errorMessage} />
      <div className='login-panel__w-btn'>
        <input
          type='text' value={key}
          placeholder='Key'
          onChange={(e) => { setKey(e.target.value) }}
          onKeyUp={(e) => { checkEnter(e) }} />
        <button onClick={() => { loginProcess(key) }}>
          Log In
        </button>
      </div>
    </div>
  )
}

export default LoginPanel