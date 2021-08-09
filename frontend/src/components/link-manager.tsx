import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DateTime } from 'luxon'

import MessageBar from './message-bar'
import { MessageAction, useHidden, useMessage } from '../common/custom-hooks'
import config from '../config'
import './link-manager.sass'

import IconJumpTo from '../assets/jump-to.png'
import IconExpire from '../assets/expire.png'

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
    const endLimit = Math.max(1, props.length - PagerLimit + 1)
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
  expire: number
}

const TestData: LinkData[] = [
  {
    id: 1,
    full: 'https://github.com/',
    shortened: 'gh',
    expire: 1624245450000
  },
  {
    id: 2,
    full: 'https://bbs.saraba1st.com/2b/forum.php',
    shortened: 's1',
    expire: 1624245450000
  },
  {
    id: 3,
    full: `https://url.is.v${'e'.repeat(200)}ry.long/`,
    shortened: 'long',
    expire: 1624245450000
  }
]

interface LinkListProps {
  list: LinkData[]
  onMessage(action: MessageAction): void
  onDelete(id: number): void
}

const LinkList = (props: LinkListProps) => {
  const copyToClipboard = (shortened: string) => {
    navigator.clipboard.writeText(window.location.href + shortened)
    props.onMessage({ success: 'Copied to clipboard!' })
  }

  return (
    <ul className='link-manager__list'>
      {props.list.map(item => (
        <li className='link-item' key={item.id}>
          <div className='link-item__row-1'>
            <span className='link-item__id'>
              <span className='link-item__id__icon'>#</span>
              <span className='link-item__id__content'>{item.id}</span>
            </span>
            <a className='link-item__full'
              href={item.full}
              target='_blank' rel='noreferrer noopener'>
              {item.full}
            </a>
          </div>
          <div className='link-item__row-2'>
            <div className='link-item__info'>
              <a className='link-item__shortened'
                href={window.location.href + item.shortened}
                target='_blank' rel='noreferrer noopener'>
                <img className='icon-jump-to'
                  src={IconJumpTo} alt='jump-to' />
                <span>{item.shortened}</span>
              </a>
              <span className='link-item__expire'>
                <span>
                  {item.expire
                    ? DateTime.fromMillis(item.expire).toFormat('yyyy/MM/dd hh:mm:ss')
                    : 'No expire date'
                  }
                </span>
                <img className='icon-expire'
                  src={IconExpire} alt='expire' />
              </span>
            </div>
            <button className='link-item--button link-item__copy'
              onClick={() => { copyToClipboard(item.shortened) }}>
              Copy
            </button>
            <button className='link-item--button link-item__manage'
              onClick={() => { props.onMessage({ error: '"Manage" is still under working...' }) /* TODO */ }}>
              Manage
            </button>
            <button className='link-item--button link-item__delete'
              onClick={() => { props.onDelete(item.id) }}>
              Delete
            </button>
            {/* TODO: Simple manager */}
          </div>
        </li>
      ))}
    </ul>
  )
}

interface UpdateLinkOptions {
  updateMessage?: boolean
}

const LinkManager = () => {
  const hidden = useHidden()
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const [pageNum, setPageNum] = useState(1)
  const [keyword, setKeyword] = useState('')

  const [linkCount, setLinkCount] = useState(0)
  const [pageLength, setPageLength] = useState(1)
  const [list, setList] = useState<LinkData[]>([])

  const [message, setMessage] = useMessage('All links are here!')

  const updateLinkList = async (page: number, options: UpdateLinkOptions = {}) => {
    try {
      if (isLoading) setMessage({ success: 'Now loading...' })

      const { data } = await axios.get(`https://localhost:${config.port}/api/get-list`, {
        params: {
          page,
          limit: 20,
          keyword: isSearching ? keyword : ''
        }
      })

      if (!data.code) {
        setPageNum(data.page)
        setLinkCount(data.count)
        setPageLength(data.length)
        setList(data.list)

        if (isLoading) setIsLoading(false)
        if (isSearching) setMessage({ success: 'Search completed!' })
        if (options.updateMessage) setMessage({ info: true })
      } else {
        setMessage({ error: data.message })
      }
    } catch (err) {
      console.error(err)
      setMessage({ error: 'Something\'s wrong with the network...' })
    }
  }

  const deleteLink = async (id: number) => {
    try {
      const { data } = await axios.get(`https://localhost:${config.port}/api/delete`, {
        params: { id }
      })

      if (!data.code) {
        setMessage({ success: 'Link deleted!' })
      } else {
        setMessage({ error: data.message })
      }

      updateLinkList(pageNum)
    } catch (err) {
      console.error(err)
      setMessage({ error: 'Something\'s wrong with the network...' })
    }
  }

  const searchKeyword = () => {
    if (keyword) {
      setIsSearching(true)
      if (isSearching) updateLinkList(pageNum)
    }
    else setIsSearching(false)
  }

  useEffect(() => {
    updateLinkList(pageNum, { updateMessage: true })
  }, [pageNum, isSearching])

  return (
    <div className={`link-manager ${hidden}`.trim()}>
      <MessageBar message={message} />
      <div className='link-manager__space-half' />
      <div className='link-manager__search'>
        <input
          type='text' value={keyword}
          onClick={() => { setMessage({ info: true }) }}
          onChange={(e) => { setKeyword(e.target.value) }}
          onKeyUp={(e) => {
            if (e.key == 'Enter') searchKeyword()
          }}
          placeholder='Full URL, shortened URL or ID...' />
        <button
          onClick={() => { searchKeyword() }}>
          Search
        </button>
      </div>
      <div className='link-manager__space-2' />
      <div className={isLoading ? 'hidden' : ''}>
        {linkCount
          ? (
            <>
              <Pager
                length={pageLength}
                selected={pageNum}
                onUpdate={(page) => { setPageNum(page) }} />
              <LinkList
                list={list}
                onMessage={(action) => { setMessage(action) }}
                onDelete={(id) => { deleteLink(id) }} />
              <Pager
                length={pageLength}
                selected={pageNum}
                onUpdate={(page) => { setPageNum(page) }} />
            </>
          ) : (
            <div className='link-manager__text'>
              There are no shortened links!
            </div>
          )
        }
      </div>
      <div className='link-manager__space-2' />
    </div>
  )
}

export default LinkManager
