import type { IncomingMessage, ServerResponse } from 'http'
import app from '../src/index'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers['x-forwarded-host'] || req.headers.host}${req.url}`
  
  let body = ''
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise((resolve) => {
      let data = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => resolve(data))
    })
  }

  const response = await app.fetch(new Request(url, {
    method: req.method,
    headers: req.headers as any,
    body: body || undefined
  }))

  const responseBody = await response.text()
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  
  res.statusCode = response.status
  res.end(responseBody)
}
