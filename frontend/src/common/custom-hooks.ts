import { useState, useLayoutEffect, useReducer } from 'react'

type DisplayState = 'hidden' | ''

const useHidden = () => {
  const [hidden, setHidden] = useState<DisplayState>('hidden')

  useLayoutEffect(() => { setHidden('') }, [])

  return hidden
}

interface MessageState {
  info: string
  success: string
  error: string
}

interface MessageAction {
  info?: string | true
  success?: string
  error?: string
}

const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  action = { ...action }

  if ('info' in action) {
    let info = state.info
    if (action.info && typeof action.info == 'string') info = action.info
    return {
      info: info,
      success: '',
      error: ''
    }
  } else if ('success' in action) {
    return {
      ...state,
      success: action.error ?? state.error
    }
  } else if ('error' in action) {
    return {
      ...state,
      error: action.error ?? state.error
    }
  } else return state
}

const useMessage = (message: string) => {
  const [state, dispatch] = useReducer(messageReducer, {
    info: message,
    success: '',
    error: ''
  })

  return [state, dispatch] as const
}

export { useHidden, useMessage }