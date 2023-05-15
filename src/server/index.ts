import cors from 'cors'
import express, { Application, NextFunction } from 'express'
import { expressjwt } from 'express-jwt'
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrl,
} from 'body-parser'

import { Server } from 'typescript-rest'
import * as Controllers from '../controllers'
import { apiConfig } from '../config'

const { JWT_SECRET } = apiConfig

export function getApp(): Application {
  console.log('Starting server...')
  const app: Application = express()
  app.use(bodyParserUrl())
  app.use(cors())

  app.use(bodyParserJson())

  // jwt middleware
  app.use(
    expressjwt({
      secret: JWT_SECRET,
      requestProperty: 'decoded',
      algorithms: ['HS256'],
    }).unless({ path: ['/auth', '/auth/register'] })
  )

  Object.values(Controllers).map((controller) => {
    Server.buildServices(app, controller)
  })

  app.use(function (err: any, _req: any, res: any, next: NextFunction) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('User Not Found...')
    } else if (err.name === 'ForbiddenError') {
      res.status(403).send('Forbidden...')
    } else if (err.code === 500) {
      res.status(400).send('Error processing request...')
    } else {
      next(err)
    }
  })

  return app
}
