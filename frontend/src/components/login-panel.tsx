import React, { useState, KeyboardEvent } from 'react'

import './login-panel.sass'

interface LoginPanelProps {
  onLoginUpdate(key: string): void
}

const LoginPanel = (props: LoginPanelProps) => {
  const [key, setKey] = useState('')

  const checkEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      props.onLoginUpdate(key)
    }
  }

  return (
    <div className='login-panel'>
      <input
        type='text' value={ key }
        placeholder='Key'
        onKeyUp={ (e) => { checkEnter(e) } }
        onChange={ (e) => { setKey(e.target.value) } } />
      <button onClick={ () => { props.onLoginUpdate(key) } }>
        Login
      </button>
    </div>
  )
}

export default LoginPanel