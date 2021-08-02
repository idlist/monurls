import axios from 'axios'
import React, { useState } from 'react'

import './url-shortener.sass'

const UrlShortener = () => {
  const [fullUrl, setFullUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')
  const [result, setResult] = useState('')

  const getShortenedURL = async () => {
    const res = await axios.get(`http://localhost:17777/api/shorten`, {
      params: {
        full: fullUrl,
        dest: destUrl,
        key: localStorage.getItem('key')
      }
    })

    if ('shortened' in res.data) {
      setResult(window.location.href + res.data.shortened)
    } else {
      console.log(res.data)
    }
  }

  return (
    <div className='url-shortener'>
      <input
        type='url' value={ fullUrl }
        placeholder='URL to be shorten'
        onChange={ (e) => { setFullUrl(e.target.value) } } />
      <div className='url-shortener__row'>
        <input
          type='text' value={ destUrl }
          placeholder='(Optional) destination URL'
          onChange={ (e) => { setDestUrl(e.target.value) } } />
        <button onClick={ () => { getShortenedURL() } }>
          Shorten
        </button>
      </div>
      <div className='url-shortener__hr'>
        <hr />
      </div>
      <div className='url-shortener__row'>
        <input
          type='url' value={ result } readOnly
          placeholder='Result' />
        <button onClick={ () => { navigator.clipboard.writeText(result) } }>
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}

export default UrlShortener