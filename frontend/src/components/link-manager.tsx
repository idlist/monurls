import React, { useState, useEffect } from 'react'

import { useHidden } from '../common/custom-hooks'
import './link-manager.sass'

interface PagerItemProps {
  display: number | string
  selected?: boolean
}

const PagerCenter = '1.5rem'

const PagerItem = (props: PagerItemProps) => {
  return (
    <div className={'pager-item__container'}>
      <svg className='pager-item__hover'>
        <defs>
          <linearGradient
            id='gradient-hover-gray'
            gradientTransform='translate(-0.25, 0) rotate(-30)'>
            <stop offset='0%' stop-color='#666' />
            <stop offset='100%' stop-color='#999' />
          </linearGradient>
          <linearGradient
            id='gradient-hover-black'
            gradientTransform='translate(-0.25, 0) rotate(-30)'>
            <stop offset='0%' stop-color='#333' />
            <stop offset='100%' stop-color='#666' />
          </linearGradient>
        </defs>
        <circle
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
                <stop offset='0%' stop-color='#333' />
                <stop offset='100%' stop-color='#666' />
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

const PagerLimit = 8

const Pager = (props: PagerProps) => {
  const [pageList, setPageList] = useState<number[]>([])

  useEffect(() => {
    let newList: number[] = []
    for (let i = 1; i <= props.length; i++) {
      newList.push(i)
    }
    setPageList(newList)
  }, [props.length])

  return (
    <div className='link-manager__pager'>
      <PagerItem
        display={'<'} />
      {pageList.map(pageNum =>
        <PagerItem
          display={pageNum}
          selected={props.selected === pageNum} />
      )}
      <PagerItem
        display={'>'} />
    </div>
  )
}

const testData = [
  { id: '5', }
]

const LinkManager = () => {
  const hidden = useHidden()

  const [keyword, setKeyword] = useState('')
  const [pageLength, setPageLength] = useState(5)
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
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
    </div>
  )
}

export default LinkManager