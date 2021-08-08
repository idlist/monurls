import axios from 'axios'
import React, { useState } from 'react'

import MessageBar from './message-bar'
import { useHidden, useMessage } from '../common/custom-hooks'
import './url-shortener.sass'

const UrlShortener = () => {
  const hidden = useHidden()

  const [fullUrl, setFullUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')
  const [result, setResult] = useState('')

  const [message, setMessage] = useMessage('Waiting for input!')

  const getShortenedURL = async (): Promise<void> => {
    if (fullUrl == '') {
      setMessage({ error: 'No data sent.' })
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
        setMessage({ success: 'Shortened succesfully!'})
      } else {
        setMessage({ error: res.data.message })
      }
    } catch (err) {
      setMessage({ error: 'Something\'s wrong with the network...'})
      console.log(err)
    }
  }

  const copyToClipboard = (): void => {
    if (result != '') {
      navigator.clipboard.writeText(result)
      setMessage({ success: 'Copied to clipboard!' })
    }
  }

  return (
    <div className={`url-shortener ${hidden}`.trim()}>
      <input
        type='url' value={fullUrl}
        placeholder='URL to be shorten'
        onClick={() => { setMessage({ info: true }) }}
        onChange={(e) => { setFullUrl(e.target.value) }} />
      <div className='url-shortener__w-btn'>
        <input
          type='text' value={destUrl}
          placeholder='(Optional) destination URL'
          onClick={() => { setMessage({ info: true }) }}
          onChange={(e) => { setDestUrl(e.target.value) }} />
        <button onClick={() => { getShortenedURL() }}>
          Shorten
        </button>
      </div>
      <div className='url-shortener__divider'>
        <hr />
      </div>
      <MessageBar message={message} />
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