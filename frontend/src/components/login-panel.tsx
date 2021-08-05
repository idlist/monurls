import React, { useState, KeyboardEvent, useEffect } from 'react'
import axios from 'axios'

import './login-panel.sass'

interface LoginPanelProps {
  onLogin(): void
}

const LoginPanel = (props: LoginPanelProps) => {
  const [key, setKey] = useState('')

  const loginProcess = async (key?: string) => {
    const res = await axios.get('https://localhost:17777/auth/login', {
      params: {
        key: typeof key == 'string' ? key : ''
      }
    })

    if ('code' in res.data && res.data.code === 0) {
      props.onLogin()
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
      <input
        type='text' value={key}
        placeholder='Key'
        onChange={(e) => { setKey(e.target.value) }}
        onKeyUp={(e) => { checkEnter(e) }} />
      <button onClick={() => { loginProcess(key) }}>
        Login
      </button>
    </div>
  )
}

export default LoginPanel