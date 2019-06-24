const rm = [
  {
    method: 'get',
    url: '/',
    handler: (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('GET /')
    }
  },
  {
    method: 'post',
    url: '/',
    handler: (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('POST /')
    }
  },
  {
    method: 'get',
    url: /^\/page\/(\d)/,
    handler: (req, res) => {
      res.statusCode = 200
      res.end('GET /page/\\d')
    }
  },
  {
    method: 'get',
    url: '/secret',
    intercept: [(req, res) => {
      if (!('secret' in req.headers) || req.headers.secret !== 'secret') {
        res.statusCode = 403
        res.end('Forbidden')
      } else {
        res.next()
      }
    }],
    handler: (req, res) => {
      res.statusCode = 200
      res.end('GET /secret')
    }
  },
  {
    method: 'get',
    url: '/secret2',
    intercept: [
      (req, res) => {
        if (!('secret' in req.headers) ||
            req.headers.secret !== 'secret') {
          res.statusCode = 403
          res.end('Forbidden')
        } else {
          res.next()
        }
      },
      (req, res) => {
        if (!('Content-Type' in req.headers) ||
            req.headers['Content-Type'] !== 'application/json') {
          res.statusCode = 403
          res.end('Wrong Content-Type')
        } else {
          res.next()
        }
      }
    ],
    handler: (req, res) => {
      res.statusCode = 200
      res.end('GET /secret2')
    }
  }
]

module.exports = {
  rm
}
