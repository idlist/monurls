import axios from 'axios'
import React, { useState } from 'react'
import { DateTime } from 'luxon'

import MessageBar from './message-bar'
import { useHidden, useMessage } from '../common/custom-hooks'
import config from '../config'
import './url-shortener.sass'

const validate = (num: string): number | undefined => {
  const value = parseInt(num)
  if (isNaN(value)) return undefined
  return value
}

const UrlShortener = () => {
  const hidden = useHidden()
  const [isEndDate, setIsEndDate] = useState(true)

  const [fullUrl, setFullUrl] = useState('')
  const [destUrl, setDestUrl] = useState('')

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')

  const [result, setResult] = useState('')
  const [message, setMessage] = useMessage('Waiting for input!')

  const CalcExpireDate = (): DateTime | null => {
    if (!year && !month && !day) return null

    const current = DateTime.local()

    if (isEndDate) {
      return DateTime.fromObject({
        year: validate(year) ?? current.year,
        month: validate(month) ?? current.month,
        day: validate(day) ?? current.day
      })
    } else {
      return DateTime.local().plus({
        year: validate(year),
        month: validate(month),
        day: validate(day)
      })
    }
  }

  const getShortenedURL = async (): Promise<void> => {
    if (fullUrl == '') {
      setMessage({ error: 'No data sent.' })
      return
    }

    const expire = CalcExpireDate()
    console.log(expire)

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
      const res = await axios.get(`https://localhost:${config.port}/api/shorten`, {
        params: {
          full: fullUrl,
          dest: destUrl,
          expire: expire instanceof DateTime ? expire.toMillis() : '',
          key: localStorage.getItem('key')
        }
      })

      if ('shortened' in res.data) {
        setResult(window.location.href + res.data.shortened)
        setMessage({ success: 'Shortened succesfully!' })
      } else {
        setMessage({ error: res.data.message })
      }
    } catch (err) {
      setMessage({ error: 'Something\'s wrong with the network...' })
      console.log(err)
    }
  }

  const copyToClipboard = (): void => {
    if (result != '') {
      navigator.clipboard.writeText(result)
      setMessage({ success: 'Copied to clipboard!' })
    }
  }

  const toggleMode = () => {
    setIsEndDate(!isEndDate)
  }

  return (
    <div className={`url-shortener ${hidden}`.trim()}>
      <input
        type='url' value={fullUrl}
        placeholder='URL to be shorten (Required)'
        onClick={() => { setMessage({ info: true }) }}
        onChange={(e) => { setFullUrl(e.target.value) }} />
      <div className='url-shortener__expire'>
        {isEndDate ? (
          <>
            <span className='url-shortener__end-date'>End date</span>
            <input
              type='text'
              placeholder='Year'
              onChange={(e) => { setYear(e.target.value) }} />
            <input
              type='text'
              placeholder='Month'
              onChange={(e) => { setMonth(e.target.value) }} />
            <input
              type='text'
              placeholder='Day'
              onChange={(e) => { setDay(e.target.value) }} />
          </>
        ) : (
          <>
            <span className='url-shortener__duration'>Duration</span>
            <input
              type='text'
              placeholder='Year(s)'
              onChange={(e) => { setYear(e.target.value) }} />
            <input
              type='text'
              placeholder='Month(s)'
              onChange={(e) => { setMonth(e.target.value) }} />
            <input
              type='text'
              placeholder='Day(s)'
              onChange={(e) => { setDay(e.target.value) }} />
          </>
        )}
        <button className='url-shortener__toggle'
          onClick={() => { toggleMode() }}>
          {isEndDate
            ? '...or Duration'
            : '...or End Date'
          }
        </button>
      </div>
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
