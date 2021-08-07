import { useState, useLayoutEffect } from 'react'

type DisplayState = 'hidden' | ''

const useHidden = () => {
  const [hidden, setHidden] = useState<DisplayState>('hidden')

  useLayoutEffect(() => { setHidden('') }, [])

  return hidden
}

export { useHidden }