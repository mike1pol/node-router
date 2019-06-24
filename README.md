# Node-Router
Small router for node.js http/https

[![Build Status](https://travis-ci.org/mike1pol/node-router.svg?branch=master)](https://travis-ci.org/mike1pol/node-router)
[![npm version](https://badge.fury.io/js/%40mikepol%2Fnode-router.svg)](https://badge.fury.io/js/%40mikepol%2Fnode-router)
[![codecov](https://codecov.io/gh/mike1pol/node-router/branch/master/graph/badge.svg)](https://codecov.io/gh/mike1pol/node-router)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
`npm install @mikepol/node-router`

## Example
```js
const http = require('http')
const router = require('@mikepol/node-router')
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
    method: 'get,
    url: /^\/page\/(\d)/,
    handler: (req, res) => {
      console.log(req.route.match);
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
  },
  {
    notFound: true,
    handler: (req, res) => {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end('404 - Not found')
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
```
