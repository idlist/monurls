import axios from 'axios'
import React, { useLayoutEffect, useState } from 'react'

import MessageBar from './message-bar'
import './url-shortener.sass'

const UrlShortener = () => {
  const [hidden, setHidden] = useState(true)

  const [fullUrl, setFullUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')
  const [result, setResult] = useState('')

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const getShortenedURL = async (): Promise<void> => {
    if (fullUrl == '') {
      setErrorMessage('No data sent.')
      return
    }

    try {
      const res = await axios.get(`https://localhost:17777/api/shorten`, {
        params: {
          full: fullUrl,
          dest: destUrl,
          key: localStorage.getItem('key')
        }
      })

      if ('shortened' in res.data) {
        setResult(window.location.href + res.data.shortened)
        setSuccessMessage('Shortened succesfully!')
      } else {
        setErrorMessage(res.data.message)
      }
    } catch (err) {
      setErrorMessage('Something\'s wrong with the network...')
      console.log(err)
    }
  }

  const copyToClipboard = (): void => {
    if (result != '') {
      navigator.clipboard.writeText(result)
      setSuccessMessage('Copied to clipboard!')
    }
  }

  const cleanMessage = (): void => {
    setSuccessMessage('')
    setErrorMessage('')
  }

  useLayoutEffect(() => { setHidden(false) }, [])

  return (
    <div className={`url-shortener ${hidden ? 'hidden' : ''}`}>
      <input
        type='url' value={fullUrl}
        placeholder='URL to be shorten'
        onClick={() => { cleanMessage() }}
        onChange={(e) => { setFullUrl(e.target.value) }} />
      <div className='url-shortener__w-btn'>
        <input
          type='text' value={destUrl}
          placeholder='(Optional) destination URL'
          onClick={() => { cleanMessage() }}
          onChange={(e) => { setDestUrl(e.target.value) }} />
        <button onClick={() => { getShortenedURL() }}>
          Shorten
        </button>
      </div>
      <div className='url-shortener__divider'>
        <hr />
      </div>
      <MessageBar
        info='Waiting for input!'
        success={successMessage}
        error={errorMessage} />
      <div className='url-shortener__w-btn'>
        <input
          type='url' value={result} readOnly
          placeholder='Result'
          onDoubleClick={(e) => { (e.target as HTMLInputElement).select() }} />
        <button onClick={() => { copyToClipboard() }}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}

export default UrlShortener