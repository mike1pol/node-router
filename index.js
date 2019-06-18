function notFound (nf, req, res) {
  if (nf) {
    return nf.handler(req, res)
  }
  res.statusCode = 404
  return res.end('Not found')
}

function route (r, req, res) {
  const { handler, intercept = [] } = r
  req.match = r
  if (intercept.length > 0) {
    let tick = intercept.length - 1
    res.next = () => {
      tick -= 1
      if (tick >= 0) {
        intercept[tick](req, res)
      } else {
        handler(req, res)
      }
    }
    return intercept[tick](req, res)
  }
  return handler(req, res)
}

function router (routes) {
  if (!(routes instanceof Object) || !Array.isArray(routes)) {
    throw new Error('Invalid routes format')
  }
  routes.forEach((v, i) => {
    if (!(v instanceof Object) || Object.keys(v).length === 0) {
      throw new Error(`Route is empty. Route index: ${i}`)
    }
    if (!('handler' in v) || !(v.handler instanceof Function)) {
      throw new Error(`Error route handler definition. Route index: ${i}`)
    }
    if ('intercept' in v && !(Array.isArray(v.intercept))) {
      throw new Error(`Wrong intercept in route index: ${i}`)
    }
  })
  const nf = routes.find(v => 'notFound' in v)
  return (request, res) => {
    const { method, url, headers, ...raw } = request
    const req = { method, url, headers, raw, routes }
    const match = routes.filter(v => v.url === url)
    if (match.length === 0) {
      return notFound(nf, req, res)
    }
    if (match.length === 1) {
      return route(match[0], req, res)
    }
    const m = match.find(v => v.method.toLowerCase() === method.toLowerCase())
    if (!m) {
      return notFound(nf, req, res)
    }
    return route(m, req, res)
  }
}

module.exports = router
