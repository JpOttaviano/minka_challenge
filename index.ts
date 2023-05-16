import http from 'http'

import { getApp } from './src/server'
import { apiConfig } from './src/config'

const { PORT } = apiConfig

function start(): http.Server {
  const app = getApp()

  const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
  })

  return server
}

start()
