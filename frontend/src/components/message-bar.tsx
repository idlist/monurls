import React, { useEffect, useState } from 'react'

import './message-bar.sass'

interface MessageProps {
  info?: string
  success?: string
  error: string
}

const MessageBar = (props: MessageProps) => {
  const [state, setState] = useState<keyof MessageProps>('info')
  const [barClass, setBarClass] = useState('')
  const [barMessage, setBarMessage] = useState('')

  useEffect(() => {
    if (props.error) {
      setState('error')
    } else if (props.success) {
      setState('success')
    } else {
      setState('info')
    }
  }, [props])

  useEffect(() => {
    setBarClass(`message-bar__${state}`)

    switch (state) {
      case 'info':
        setBarMessage((props.info ?? '') + ' 	☆ ～(> ▽ < 人)')
        break
      case 'success':
        setBarMessage((props.success ?? '') + ' (´ ∀ ` *)	')
        break
      case 'error':
        setBarMessage(props.error + ' (つω ` ｡) ')
        break
    }
  }, [state])

  return (
    <div className={barClass}>
      {barMessage}
    </div>
  )
}

export default MessageBar