import axios from 'axios'
import React, { useState } from 'react'
import { DateTime } from 'luxon'

import MessageBar from './message-bar'
import InputDate from './input-date'
import { useHidden, useMessage } from '../common/custom-hooks'
import config from '../config'
import './url-shortener.sass'

const UrlShortener: React.FunctionComponent = () => {
  const hidden = useHidden()

  const [fullUrl, setFullUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')
  const [expire, setExpire] = useState<DateTime | null>(null)

  const [result, setResult] = useState('')
  const [message, setMessage] = useMessage('Waiting for input!')

  const getShortenedURL = async (): Promise<void> => {
    if (fullUrl == '') {
      setMessage({ error: 'No data sent.' })
      return
    }

    if (expire instanceof DateTime) {
      if (!expire.isValid) {
        setMessage({ error: 'The expiring date is not valid.' })
        return
      }
      if (expire < DateTime.local()) {
        setMessage({ error: 'The expiring date is before today.' })
        return
      }
    }

    try {
      const res = await axios.post(`${config.url}/api/shorten`, {
        full: fullUrl,
        dest: destUrl,
        expire: expire instanceof DateTime ? expire.toMillis() : ''
      }, {
        withCredentials: true
      })

      if ('shortened' in res.data) {
        setResult(window.location.href + res.data.shortened)
        setMessage({ success: 'Shortened succesfully!' })
      } else {
        setMessage({ error: res.data.message })
      }
    } catch (err) {
      setMessage({ error: 'Something\'s wrong with the network...' })
      console.error(err)
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
        placeholder='URL to be shorten (Required)'
        onClick={() => { setMessage({ info: true }) }}
        onChange={(e) => { setFullUrl(e.target.value) }} />
      <InputDate
        onClearMessage={() => { setMessage({ info: true }) }}
        onUpdateDate={(date) => { setExpire(date) }} />
      <div className='url-shortener__with-button'>
        <input className='url-shortener__input'
          type='text' value={destUrl}
          placeholder='Destination URL'
          onClick={() => { setMessage({ info: true }) }}
          onChange={(e) => { setDestUrl(e.target.value) }} />
        <button className='url-shortener__button'
          onClick={() => { getShortenedURL() }}>
          Shorten
        </button>
      </div>
      <div className='url-shortener__divider'>
        <hr />
      </div>
      <MessageBar message={message} />
      <div className='url-shortener__with-button'>
        <input className='url-shortener__input'
          type='url' value={result} readOnly
          placeholder='Result'
          onDoubleClick={(e) => { (e.target as HTMLInputElement).select() }} />
        <button className='url-shortener__button'
          onClick={() => { copyToClipboard() }}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}

export default UrlShortener
