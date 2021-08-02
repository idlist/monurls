import React, { useState } from 'react'

import './url-shortener.sass'

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')
  const [result, setResult] = useState('')

  const getShortenedURL = () => {
    setResult('https://idl.ist')
  }

  return (
    <div className='url-shortener'>
      <input
        type='url' value={ longUrl }
        onChange={ (e) => { setLongUrl(e.target.value) } }
        placeholder='URL to be shorten' />
      <div className='url-shortener__row'>
        <input
          type='text' value={ destUrl }
          onChange={ (e) => { setDestUrl(e.target.value) } }
          placeholder='(Optional) destination URL' />
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