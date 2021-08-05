import axios from 'axios'
import React, { useState } from 'react'
import MessageBar from './message-bar'

import './url-shortener.sass'

interface UrlShortenerProps {
  onLogout(): void
}

const UrlShortener = (props: UrlShortenerProps) => {
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
        setSuccessMessage('URL shortened succesfully!')
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

  return (
    <div className='url-shortener'>
      <input
        type='url' value={fullUrl}
        placeholder='URL to be shorten'
        onChange={(e) => { setFullUrl(e.target.value) }} />
      <div className='url-shortener__row'>
        <input
          type='text' value={destUrl}
          placeholder='(Optional) destination URL'
          onChange={(e) => { setDestUrl(e.target.value) }} />
        <button onClick={() => { getShortenedURL() }}>
          Shorten
        </button>
      </div>
      <div className='url-shortener__hr'>
        <hr />
      </div>
      <MessageBar
        info='Waiting for input!'
        success={successMessage}
        error={errorMessage} />
      <div className='url-shortener__row'>
        <input
          type='url' value={result} readOnly
          placeholder='Result' />
        <button onClick={() => { copyToClipboard() }}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}

export default UrlShortener