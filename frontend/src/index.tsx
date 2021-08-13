import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './app'
import config from './config'
import './index.sass'

ReactDOM.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>,
  document.getElementById('root')
)

document.title = config.title