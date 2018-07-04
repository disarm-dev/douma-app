const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser)


server.use(jsonServer.rewriter({
  '/v7/*': '/$1',
}))


// Add custom routes before JSON Server router
server.post('/login', (req, res) => {
  res.jsonp({
    '_id': 'dev2',
    'name': 'Jonathan',
    'username': 'js',
    'key': 'b48fbf5e746e6bfbd6c36dca5ff088b3',
    'instance_slug': 'all',
    'permissions': ['read:irs_monitor', 'read:irs_record_point', 'read:irs_plan', 'read:irs_tasker', 'read:structure_recorder', 'read:data_wizard', 'read:debug', 'read:unity_dashboard', 'read:foci', 'read:config', 'read:seasons', 'write:irs_monitor', 'write:irs_record_point', 'write:irs_plan', 'write:irs_tasker', 'write:structure_recorder', 'write:data_wizard', 'write:debug', 'write:unity_dashboard', 'write:foci', 'write:config', 'write:seasons'],
    'allowed_apps': {
      'read': ['irs_monitor', 'irs_record_point', 'irs_plan', 'irs_tasker', 'structure_recorder', 'data_wizard', 'debug', 'unity_dashboard', 'foci', 'config', 'seasons'],
      'write': ['irs_monitor', 'irs_record_point', 'irs_plan', 'irs_tasker', 'structure_recorder', 'data_wizard', 'debug', 'unity_dashboard', 'foci', 'config', 'seasons']
    }
  })
})

server.post('/record/create?', (req, res) => {
  console.log(req.body)
  res.send(201)
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})