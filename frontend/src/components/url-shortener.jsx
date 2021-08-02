import React from 'react'

import 'url-shortener.sass'

const UrlShortener = () => {
  return (
    <div className='url-shortener'>
      <input placeholder='URL to be shorten' />
      <div className='url-shortener__row'>
        <input placeholder='(Optional) Specifiy the shortened URL' />
        <button>Shorten</button>
      </div>
      <div className='url-shortener__hr'>
        <hr />
      </div>
      <div className='url-shortener__row'>
        <input placeholder='Result' />
        <button>Copy to Clipboard</button>
      </div>
    </div>
  )
}

export default UrlShortener