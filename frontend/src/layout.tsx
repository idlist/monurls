import React from 'react'

import UrlShortener from './components/url-shortener'
import ManageLinks from './components/manage-links'
import './layout.sass'

const Header = () => {
  return (
    <header className='header'>
      monurls - My own Node.js URL shortener
    </header>
  )
}

const App = () => {
  return (
    <div className='app'>
      <UrlShortener />
      <ManageLinks />
    </div>
  )
}

const Layout = () => {
  return (
    <>
      <Header />
      <div className='container'>
        <App />
      </div>
    </>
  )
}

export default Layout