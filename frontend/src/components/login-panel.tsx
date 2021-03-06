import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import MessageBar from './message-bar'
import { LoginContext } from '../app'
import { useHidden, useMessage } from '../common/custom-hooks'
import config from '../config'
import './login-panel.sass'

const LoginPanel: React.FunctionComponent = () => {
  const hidden = useHidden()

  const [key, setKey] = useState('')
  const [message, setMessage] = useMessage('Please verify that you are you!')

  const loginState = useContext(LoginContext)

  const loginProcess = async (key?: string) => {
    const useKey = (typeof key == 'string')
    if (key === '') {
      setMessage({ error: 'No input.' })
      return
    }

    try {
      const res = await axios.get(`${config.url}/auth/login`, {
        params: {
          key: useKey ? key : '',
        },
        withCredentials: true,
      })

      if ('code' in res.data) {
        if (res.data.code === 0) {
          setMessage({ info: true })
          loginState.setLogin(true)
        } else if (key) {
          setMessage({ error: res.data.message })
        }
      }
    } catch (err) {
      if (useKey) {
        setMessage({ error: 'Something\'s wrong with the network...' })
        console.error(err)
      }
    }
  }

  useEffect(() => { loginProcess() }, [])

  return (
    <div className={`login-panel ${hidden ? 'hidden' : ''}`}>
      <MessageBar message={message} />
      <div className='login-panel__w-btn'>
        <input
          type='text' value={key}
          placeholder='Key'
          onChange={(e) => { setKey(e.target.value) }}
          onKeyUp={(e) => {
            if (e.key == 'Enter') loginProcess(key)
          }} />
        <button onClick={() => { loginProcess(key) }}>
          Log In
        </button>
      </div>
    </div>
  )
}

export default LoginPanel