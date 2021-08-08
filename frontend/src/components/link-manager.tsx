import React, { useState, useEffect } from 'react'

import MessageBar from './message-bar'
import { MessageAction, useHidden, useMessage } from '../common/custom-hooks'
import './link-manager.sass'

import IconJumpTo from '../assets/jump-to.png'
import IconExpire from '../assets/expire.png'
import IconHashtag from '../assets/hashtag.png'

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

interface LinkData {
  id: number
  full: string
  shortened: string
  expire: string
}

const TestData: LinkData[] = [
  {
    id: 1,
    full: 'https://github.com/',
    shortened: 'gh',
    expire: '2021/08/08 18:00:00'
  },
  {
    id: 2,
    full: 'https://bbs.saraba1st.com/2b/forum.php',
    shortened: 's1',
    expire: '2021/08/08 19:00:00'
  },
  {
    id: 3,
    full: 'https://short-now-7xmbudc9q-dragon-fish.vercel.app/',
    shortened: 'shortnow',
    expire: '2021/08/08 20:00:00'
  },
  {
    id: 4,
    full: 'https://url.is.veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.long/',
    shortened: 'long',
    expire: '2021/08/08 21:00:00'
  }
]

interface LinkListProps {
  list: LinkData[]
  onEmitMessage(action: MessageAction): void
  onDelete(id: number): void
}

const LinkList = (props: LinkListProps) => {
  const copyToClipboard = (shortened: string) => {
    navigator.clipboard.writeText(window.location.href + shortened)
    props.onEmitMessage({ success: 'Copied to clipboard!' })
  }

  return (
    <ul className='link-manager__list'>
      {props.list.map(item => (
        <li className='link-item' key={item.id}>
          <span className='link-item__id'>
            <img className='icon-sharp'
              src={IconHashtag} />
            <span>{item.id}</span>
          </span>
          <a className='link-item__full'
            href={item.full}
            target='_blank' rel='noreferrer noopener'>
            {item.full}
          </a>
          <a className='link-item__shortened'
            href={window.location.href + item.shortened}
            target='_blank' rel='noreferrer noopener'>
            <img className='icon-jump-to'
              src={IconJumpTo} alt='jump-to' />
            <span>{item.shortened}</span>
          </a>
          <span className='link-item__expire'>
            <span>{item.expire}</span>
            <img className='icon-expire'
              src={IconExpire} alt='expire' />
          </span>
          <button className='link-item--button link-item__copy'
            onClick={() => { copyToClipboard(item.shortened) }}>
            Copy
          </button>
          <button className='link-item--button link-item__manage'
            onClick={() => { /* TODO */ }}>
            Manage
          </button>
          <button className='link-item--button link-item__delete'
            onClick={() => { props.onDelete(item.id) }}>
            Delete
          </button>
          {/* TODO: Simple manager */}
        </li>
      ))}
    </ul>
  )
}

const LinkManager = () => {
  const hidden = useHidden()

  const [keyword, setKeyword] = useState('')
  const [pageLength, setPageLength] = useState(20 /* TODO */)
  const [pageNum, setPageNum] = useState(1 /* TODO */)
  const [list, setList] = useState(TestData /* TODO */)

  const [message, setMessage] = useMessage('All links are here!')

  return (
    <div className={`link-manager ${hidden}`.trim()}>
      <MessageBar message={message} />
      <div className='link-manager__space-half' />
      <div className='link-manager__search'>
        <input
          type='text' value={keyword}
          onClick={(e) => { setMessage({ info: true }) }}
          onChange={(e) => { setKeyword(e.target.value) }}
          placeholder='Full URL, shortened URL or ID...' />
        <button>
          Search
        </button>
      </div>
      <div className='link-manager__space-2' />
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
      <LinkList
        list={list}
        onEmitMessage={(action) => { setMessage(action) }}
        onDelete={(id) => { /* TODO */ }} />
      <Pager
        length={pageLength}
        selected={pageNum}
        onUpdate={(page) => { setPageNum(page) }} />
    </div>
  )
}

export default LinkManager
