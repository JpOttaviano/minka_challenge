import http from 'http'

import { getApp } from './src/server'

function start(): http.Server {
  const app = getApp()

  const server = app.listen(9090, () => {
    console.log('Server started at http://localhost:9090')
  })

  return server
}

start()
