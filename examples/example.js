const http = require('http')

const router = require('../')

const routes = [
  {
    method: 'get',
    url: '/',
    handler: (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('get /')
    }
  },
  {
    method: 'post',
    url: '/',
    handler: (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('post /')
    }
  },
  {
    url: '/all',
    handler: (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('/all')
    }
  }
]

const srv = http.createServer(router(routes))
srv.listen(3000, (err) => {
  if (err) {
    console.error('server listen error:', err)
  }
  console.log(`server started on http://localhost:3000`)
})
