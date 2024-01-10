import { MockHandler } from '../src'

export default [
  {
    pattern: '/api/test1/1',
    handle: (req, res) => {
      res.end('Hello world!' + req.url)
    }
  },
  {
    pattern: '/config.json',
    response: { env: 'dev', databaseUrl: '//:firebaseio.com.'}
  },
  {
    // * matches zero or more characters
    pattern: '/api/test1/*',
    // use some comma-delimetered values to generate mocks for each of these
    method: 'POST, GET, DELETE, PUT, Patch', 
    handle: (req, res) => {
      res.end('Hello world star ' + req.url)
    }
  },
  {
    // send parameter {userId} and handle it in 'req.params.userId'
    pattern: '/api/test1/users/{userId}',
    handle: (req, res) => {
      const data = {
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    }
  },
  {
    pattern: '/api/test1/body/json',
    method: 'POST',
    handle: (req, res) => {
      res.setHeader('Content-Type', 'application/json')

      // req is incomingMessage which extends stream.Readable 
      // --> https://nodejs.org/api/stream.html#readablereadsize
      // res.end need to be within the function
      // there is a size limit for the bodyString to get parsed 
      req.on('data', (bodyString: string) => { 
        let body: object = JSON.parse(bodyString)
        res.end(JSON.stringify(body))
      })          
    }
  },
] as MockHandler[]
