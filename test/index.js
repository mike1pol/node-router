/* eslint-env mocha */
const assert = require('assert')
const sinon = require('sinon')

const router = require('..')

const { rm } = require('./fixtures')

const res = {
  end: text => text,
  statusCode: null,
  headers: {},
  setHeader: (h, v) => {
    res.headers[h] = v
  }
}

let mock

describe('router', () => {
  describe('testing res', () => {
    it('#res.end()', () => {
      const spy = sinon.spy(res, 'end')
      res.end('text')
      assert(spy.calledWith('text'))
      res.end.restore()
    })
    it('#res.setHeader()', () => {
      const spy = sinon.spy(res, 'setHeader')
      res.setHeader('Content-Type', 'text/plain')
      assert(spy.calledWith('Content-Type', 'text/plain'))
      res.setHeader.restore()
    })
  })
  before(() => {
    mock = sinon.mock(res)
  })
  after(() => {
    mock.restore()
    mock.verify()
  })
  describe('#initRouter()', () => {
    it('catch error if send string to router', () => {
      assert.throws(() => router('string'), Error, 'Invalid routes format')
    })
    it('catch error if send number to router', () => {
      assert.throws(() => router(1), Error, 'Invalid routes format')
    })
    it('catch error if send array to router', () => {
      assert.throws(() => router({ a: true }), Error, 'Invalid routes format')
    })
    it('catch if some route not handler', () => {
      const rmt = [...rm]
      rmt.push({ method: 'get' })
      assert.throws(() => router(rmt), Error, `Error route definition. Route index: ${rmt.length - 1}`)
    })
    it('catch if some route is empty', () => {
      const rmt = [...rm]
      rmt.push({})
      assert.throws(() => router(rmt), Error, `Route is empty. Route index: ${rmt.length - 1}`)
    })
    it('catch if handler is not a function', () => {
      const rmt = [...rm]
      rmt.push({ handler: true })
      assert.throws(() => router(rmt), Error, `Wrong intercept in route index: ${rmt.length - 1}`)
    })
    it('catch if some route intercept is wrong type', () => {
      const rmt = [...rm]
      rmt.push({ intercept: true, handler: rm[0].handler })
      assert.throws(() => router(rmt), Error, `Wrong intercept in route index: ${rmt.length - 1}`)
    })
    const rt = router(rm)
    it('router is init', () => {
      assert(rt instanceof Function)
    })
    it('GET /', () => {
      mock.expects('end').withArgs('GET /')
      mock.expects('setHeader').withArgs('Content-Type', 'text/plain')
      rt({ method: 'GET', url: '/' }, res)
      assert.strictEqual(res.statusCode, 200)
      res.statusCode = null
    })
    it('POST /', () => {
      mock.expects('end').withArgs('POST /')
      mock.expects('setHeader').withArgs('Content-Type', 'text/plain')
      rt({ method: 'POST', url: '/' }, res)
      assert.strictEqual(res.statusCode, 200)
      res.statusCode = null
    })
    it('Not found - PUT /', () => {
      mock.expects('end').withArgs('Not found')
      rt({ method: 'PUT', url: '/' }, res)
      assert.strictEqual(res.statusCode, 404)
      res.statusCode = null
    })
    it('Not found', () => {
      mock.expects('end').withArgs('Not found')
      rt({ method: 'GET', url: '/404' }, res)
      assert.strictEqual(res.statusCode, 404)
      res.statusCode = null
    })
    it('Custom Not found', () => {
      const rmt = [...rm]
      rmt.push({
        notFound: true,
        handler: (req, res) => {
          res.statusCode = 404
          res.end('404')
        }
      })
      const rr = router(rmt)
      mock.expects('end').withArgs('404')
      rr({ method: 'GET', url: '/404' }, res)
      assert.strictEqual(res.statusCode, 404)
      res.statusCode = null
    })
    it('GET /secret', () => {
      mock.expects('end').withArgs('GET /secret')
      rt({ method: 'GET', headers: { secret: 'secret' }, url: '/secret' }, res)
      assert.strictEqual(res.statusCode, 200)
      res.statusCode = null
    })
    it('GET /secret - Forbidden', () => {
      mock.expects('end').withArgs('Forbidden')
      rt({ method: 'GET', headers: {}, url: '/secret' }, res)
      assert.strictEqual(res.statusCode, 403)
      res.statusCode = null
    })
    it('GET /secret2', () => {
      mock.expects('end').withArgs('GET /secret2')
      rt({
        method: 'GET',
        headers: {
          secret: 'secret',
          'Content-Type': 'application/json'
        },
        url: '/secret2'
      }, res)
      assert.strictEqual(res.statusCode, 200)
      res.statusCode = null
    })
    it('GET /secret2 - Wrong Content-Type', () => {
      mock.expects('end').withArgs('Wrong Content-Type')
      rt({
        method: 'GET',
        headers: {},
        url: '/secret2'
      }, res)
      assert.strictEqual(res.statusCode, 403)
      res.statusCode = null
    })
    it('GET /secret2 - Forbidden', () => {
      mock.expects('end').withArgs('Forbidden')
      rt({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: '/secret2'
      }, res)
      assert.strictEqual(res.statusCode, 403)
      res.statusCode = null
    })
  })
})
