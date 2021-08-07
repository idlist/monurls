import React, { useState, useEffect } from 'react'

import { useHidden } from '../common/custom-hooks'
import './link-manager.sass'

interface PagerItemProps {
  display: number | string
  selected?: boolean
}

const PagerSize = '2.5rem'

const PagerItem = (props: PagerItemProps) => {
  return (
    <div className={'pager-item__container'}>
      <svg className='pager-item__hover'>
        <rect
          x='0' y='0'
          width={PagerSize} height={PagerSize}
          stroke='#999' strokeWidth='2px'
          fill='none' />
      </svg>
      {props.selected
        && (
          <svg className={'pager-item__selector'}>
            <rect
              x='0' y='0'
              width={PagerSize} height={PagerSize}
              fill='#333' />
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