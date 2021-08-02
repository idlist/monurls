import React, { useState } from 'react'

import './login-panel.sass'

interface LoginPanelProps {
  onLoginUpdate(key: string): void
}

const LoginPanel = (props: LoginPanelProps) => {
  const [key, setKey] = useState('')

  return (
    <div className='login-panel'>
      <input
        type='text' value={ key }
        placeholder='Key'
        onChange={ (e) => { setKey(e.target.value) } } />
      <button onClick={ () => { props.onLoginUpdate(key) } }>
        Login
      </button>
    </div>
  )
}

export default LoginPanel