import React, { useState, useEffect } from 'react'

import { useHidden } from '../common/custom-hooks'
import './link-manager.sass'

interface PagerItemProps {
  display: number | string
  selected?: boolean
  onClick(): void
}

const PagerCenter = '1.5rem'

const PagerItem = (props: PagerItemProps) => {
  return (
    <div className={'pager-item__container'}
      onClick={() => props.onClick()}>
      <svg className='pager-item__hover'>
        <defs>
          <linearGradient id='gradient-hover-gray'
            gradientTransform='translate(-0.25, 0) rotate(-30)'>
            <stop offset='0%' stopColor='#666' />
            <stop offset='100%' stopColor='#999' />
          </linearGradient>
          <linearGradient id='gradient-hover-black'
            gradientTransform='translate(-0.25, 0) rotate(-30)'>
            <stop offset='0%' stopColor='#333' />
            <stop offset='100%' stopColor='#666' />
          </linearGradient>
        </defs>
        <circle className='inner'
          cx={PagerCenter} cy={PagerCenter} r='1rem'
          strokeWidth='0.25rem' stroke='#fff'
          fill='none' />
        <circle className='outer'
          cx={PagerCenter} cy={PagerCenter} r='1.125rem'
          strokeWidth='0.25rem' stroke='url(#gradient-hover-gray)'
          fill='none' />
      </svg>
      {props.selected
        && (
          <svg className={'pager-item__selector'}>
            <defs>
              <linearGradient
                id='gradient-selector'
                gradientTransform='translate(-0.25, 0) rotate(-30)'>
                <stop offset='0%' stopColor='#333' />
                <stop offset='100%' stopColor='#666' />
              </linearGradient>
            </defs>
            <circle
              cx={PagerCenter} cy={PagerCenter} r='1.25rem'
              fill='url(#gradient-selector)' />
          </svg>
        )
      }
      <div className={`pager-item${props.selected ? '--selected' : ''}`}>
        <a>{props.display}</a>
      </div>
    </div>
  )
}

interface PagerProps {
  length: number
  selected: number
  onUpdate(page: number): void
}

const PagerLimit = document.body.offsetWidth > 640 ? 8 : 5
const PagerHalfLimit = PagerLimit % 2 ? (PagerLimit - 1) / 2 : PagerLimit / 2

const Pager = (props: PagerProps) => {
  const [starting, setStarting] = useState(1)
  const [pageList, setPageList] = useState<number[]>([])
  const [viewing, setViewing] = useState(false)

  useEffect(() => {
    if (!viewing) {
      if (props.selected <= PagerHalfLimit) {
        setStarting(1)
      } else if (props.selected > props.length - PagerHalfLimit) {
        setStarting(Math.max(1, props.length - PagerLimit + 1))
      } else {
        setStarting(props.selected - PagerHalfLimit + (PagerLimit % 2 ? 0 : 1))
      }
    }
  }, [props.length, props.selected])

  useEffect(() => {
    setViewing(false)

    let newList: number[] = []

    let length = PagerLimit
    if (length > props.length) length = props.length

    for (let i = starting; i < starting + length; i++) {
      newList.push(i)
    }
    setPageList(newList)
  }, [props.length, starting])

  const findPreviousPages = () => {
    const nextStart = starting - PagerLimit
    setViewing(true)
    setStarting(nextStart < 1 ? 1 : nextStart)
  }

  const findNextPages = () => {
    const nextStart = starting + PagerLimit
    const endLimit = props.length - PagerLimit + 1
    setViewing(true)
    setStarting(nextStart > endLimit ? endLimit : nextStart)
  }

  return (
    <div className='link-manager__pager'>
      <PagerItem
        display={'<'}
        onClick={() => { findPreviousPages() }} />
      {pageList.map(pageNum =>
        <PagerItem key={pageNum}
          display={pageNum}
          selected={props.selected === pageNum}
          onClick={() => { props.onUpdate(pageNum) }} />
      )}
      <PagerItem
        display={'>'}
        onClick={() => { findNextPages() }} />
    </div>
  )
}

const testData = [
  { id: '5', }
]

const LinkManager = () => {
  const hidden = useHidden()

  const [keyword, setKeyword] = useState('')
  const [pageLength, setPageLength] = useState(20)
  const [pageNum, setPageNum] = useState(1)

  return (
    <div className={`link-manager ${hidden}`.trim()}>
      <div className='link-manager__search'>
        <input
          type='text' value={keyword}
          onChange={(e) => { setKeyword(e.target.value) }}
          placeholder='Full URL, shortened URL or ID...' />
        <button>
          Search
        </button>
      </div>
      <div className='link-manager__space'/>
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
      <div className='link-manager__list'>
      {testData.map(item => (
        <p>{item.id}</p>
      ))}
      </div>
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
    </div>
  )
}

export default LinkManager