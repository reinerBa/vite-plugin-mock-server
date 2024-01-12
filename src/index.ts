import { Plugin, ViteDevServer, Connect } from 'vite'
import * as http from 'http'
import AntPathMatcher from '@howiefh/ant-path-matcher'

const PLUGIN_NAME = 'vite-plugin-mock-simple'
const mockRoutes: MockHandlerInternal[] = []
const logs: LogEntry[] = []

type Request = Connect.IncomingMessage & {
  body?: any
  params?: { [key: string]: string }
  query?: { [key: string]: string }
  cookies?: { [key: string]: string }
  session?: any
}

export type MockFunction = (
  req: Request,
  res: http.ServerResponse,
) => void

interface MockHandlerAll {
  pattern: string
  method?: string
  handle?: MockFunction 
  jsonBody?: Object
  delay?: number
}
interface MockHandlerInternal {
  pattern: string
  method: string
  handle: MockFunction
  delay?: number
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
            Required<Pick<T, K>>
            & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys]
   
export type MockHandler = RequireOnlyOne<MockHandlerAll, 'jsonBody' | 'handle'>

interface LogEntry {
  timestamp: string
  requestUrl: string
  matchedMock: string
}

export default (mocks: MockHandler[]): Plugin => {
  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    configureServer: async (server: ViteDevServer) => {
      // build url matcher
      const matcher = new AntPathMatcher()
      if ((mocks == null) || !Array.isArray(mocks) || mocks.length === 0)
        throw new Error('No routes to mock found for vite-plugin-mock-simple')
      
      if(mocks.some(e => !e.pattern?.length)) 
        console.error('All routes need to define patterns. Some of the inserted objects don`t match the type MockHandler: ' 
        + JSON.stringify(mocks.filter(e => !e.pattern),  null, "\t"))

      const foundMocks: MockHandlerInternal[] = mocks
        .flatMap((r: MockHandler) => {
          r.method = r.method?.toUpperCase() || 'GET'

          if (r.method.includes(',')) {
            return r.method
              .split(/, ?/g)
              .flatMap(str => {

                return methodIsValid({
                  handle: r.handle,
                  pattern: r.pattern,
                  delay: r.delay,
                  method: str
                })
              })
          } else
            return methodIsValid(r)
        }
      )
      .map((r: MockHandlerAll) => {
        if(typeof r.jsonBody !== 'object') 
          return  r as MockHandlerInternal
        return {
          pattern: r.pattern,
          method: r.method,
          delay: r.delay,
          handle: (_, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(r.jsonBody))
          }
        } as MockHandlerInternal})

      mockRoutes.push(...foundMocks)

      server.middlewares.use((
        req: Connect.IncomingMessage,
        res: http.ServerResponse,
        next: Connect.NextFunction
      ) => {
        doHandle(matcher, req, res, next)
      })
    }
  }
}

async function doHandle (
  matcher: AntPathMatcher,
  req: Request,
  res: http.ServerResponse,
  next: Connect.NextFunction
): Promise<void> {
  if (req.url === '/mock-simple/') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(
      {
        includedMockRoutes: mockRoutes,
        mockRoutes_Log: logs
      }))
    return
  }

  const [path, qs] = req.url!.split('?')
  const pathVars: { [key: string]: string } = {}

  const match = mockRoutes.find(e =>
    matcher.doMatch(e.pattern, path, true, pathVars) &&
    (req.method?.toUpperCase() ?? 'GET') === e.method
  )

  if (match != null) {
    req.params = pathVars
    req.query = parseQueryString(qs)
    // log request
    logs.push(
      {
        timestamp: new Date().toISOString(),
        requestUrl: req.url ?? '',
        matchedMock: `[${match.method}]${match.pattern}`
      })
    if(match.delay)
      setTimeout(() => match.handle(req, res), match.delay ?? 1)
    else
      match.handle(req, res)
  } else {
    next()
  }
}

const parseQueryString = (qs: string): { [key: string]: string } => !qs
  ? {}
  : decodeURI(qs)
    .split('&')
    .map(param => param.split('='))
    .reduce((values: { [key: string]: string }, [key, value]) => {
      values[key] = value
      return values
    }, {})

const validMethods: string[] = [
  'GET', 'POST', 'TRACE', 'PATCH', 'DELETE', 'HEAD', 'CONNECT', 'TRACE', 'OPTIONS', 'PUT'
]

function methodIsValid (mock: MockHandlerAll): MockHandlerAll | never[] {
  if (!validMethods.includes(mock.method || '')) {
    console.error(`The given method ${mock.method} is not valid in mock ${mock.pattern}. \nIgnoring that mock-element.`)
    return []
  }
  return mock
}
