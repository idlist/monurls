import React, { useEffect, useState } from 'react'

import './message-bar.sass'

interface MessageProps {
  message: {
    info?: string
    success?: string
    error: string
  }
}

const MessageBar: React.FunctionComponent<MessageProps> = ({ message }) => {
  const [state, setState] = useState<keyof MessageProps['message']>('info')
  const [barClass, setBarClass] = useState('')
  const [barMessage, setBarMessage] = useState('')

  useEffect(() => {
    if (message.error) {
      setState('error')
    } else if (message.success) {
      setState('success')
    } else {
      setState('info')
    }
  }, [message])

  useEffect(() => {
    setBarClass(`message-bar__${state}`)

    switch (state) {
      case 'info':
        setBarMessage((message.info ?? '') + ' 	☆ ～(> ▽ < 人)')
        break
      case 'success':
        setBarMessage((message.success ?? '') + ' (´ ∀ ` *)	')
        break
      case 'error':
        setBarMessage(message.error + ' (つω ` ｡) ')
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