const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser)


server.use(jsonServer.rewriter({
  '/v1/*': '/$1',
}))


// Add custom routes before JSON Server router
server.post('/auth/login', (req, res) => {
  res.jsonp({
    'id': 'dev2',
    'name': 'Jonathan',
    'username': 'js',
    'token': 'b48fbf5e746e6bfbd6c36dca5ff088b3',
  })
})

server.post('/record/create?', (req, res) => {
  console.log(req.body)
  const fake_response = {
    successful_ids: [1,2,3,4]
  }
  res.status(201).send(fake_response)
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})