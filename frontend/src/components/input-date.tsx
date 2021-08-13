import React, { useState, useEffect } from 'react'
import { DateTime } from 'luxon'

import './input-date.sass'

const validate = (num: string): number | undefined => {
  const value = parseInt(num)
  if (isNaN(value)) return undefined
  return value
}

interface InputDateProps {
  onUpdateDate(date: DateTime | null): void
}

const InputDate = (props: InputDateProps) => {
  const [isEndDate, setIsEndDate] = useState(false)

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')

  useEffect(() => {
    if (!year && !month && !day) props.onUpdateDate(null)

    const current = DateTime.local()
    let date: DateTime

    if (isEndDate) {
      date = DateTime.fromObject({
        year: validate(year) ?? current.year,
        month: validate(month) ?? current.month,
        day: validate(day) ?? current.day
      })
    } else {
      date = DateTime.local().plus({
        year: validate(year),
        month: validate(month),
        day: validate(day)
      })
    }

    props.onUpdateDate(date)
  }, [year, month, day])

  const toggleMode = () => {
    setIsEndDate(!isEndDate)
  }

  return (
    <div className='input-date'>
      {isEndDate ? (
        <>
          <span className='input-date__end-date'>End date</span>
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
          <span className='input-date__duration'>Duration</span>
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
      <button className='input-date__toggle'
        onClick={() => { toggleMode() }}>
        {isEndDate
          ? '...or Duration'
          : '...or End Date'
        }
      </button>
    </div>
  )
}

export default InputDate