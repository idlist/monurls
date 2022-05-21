import React, { useState, useEffect } from 'react'
import { DateTime } from 'luxon'

import './input-date.sass'

interface InputDateProps {
  onClearMessage(): void
  onUpdateDate(date: DateTime | null): void
}

const validate = (num: string): number | undefined => {
  const value = parseInt(num)
  if (isNaN(value)) return undefined
  return value
}

const InputDate: React.FunctionComponent<InputDateProps> = props => {
  const [isEndDate, setIsEndDate] = useState(false)

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')

  useEffect(() => {
    if (!year && !month && !day) {
      props.onUpdateDate(null)
      return
    }

    const current = DateTime.local()
    let date: DateTime

    if (isEndDate) {
      date = DateTime.fromObject({
        year: validate(year) ?? current.year,
        month: validate(month) ?? current.month,
        day: validate(day) ?? current.day,
        hour: 23,
        minute: 59,
        second: 59,
      })
    } else {
      date = DateTime.local().plus({
        year: validate(year),
        month: validate(month),
        day: validate(day),
      })
    }

    props.onUpdateDate(date)
  }, [year, month, day, isEndDate])

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
            onClick={() => { props.onClearMessage() }}
            onChange={(e) => { setYear(e.target.value) }} />
          <input
            type='text'
            placeholder='Month'
            onClick={() => { props.onClearMessage() }}
            onChange={(e) => { setMonth(e.target.value) }} />
          <input
            type='text'
            placeholder='Day'
            onClick={() => { props.onClearMessage() }}
            onChange={(e) => { setDay(e.target.value) }} />
        </>
      ) : (
        <>
          <span className='input-date__duration'>Duration</span>
          <input
            type='text'
            placeholder='Year(s)'
            onClick={() => { props.onClearMessage() }}
            onChange={(e) => { setYear(e.target.value) }} />
          <input
            type='text'
            placeholder='Month(s)'
            onClick={() => { props.onClearMessage() }}
            onChange={(e) => { setMonth(e.target.value) }} />
          <input
            type='text'
            placeholder='Day(s)'
            onClick={() => { props.onClearMessage() }}
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