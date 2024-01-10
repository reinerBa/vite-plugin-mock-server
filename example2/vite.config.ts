import { ConfigEnv, UserConfigExport, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockSimple, { MockHandler } from '../src'
import mockRoutes from './mockRoutes'

export default defineConfig({
  plugins: [
    vue(),
    mockSimple([
      {
        pattern: '/api/test1/1',
        handle: (req, res) => {
        res.end('Hello world!' + req.url)
      }
    } as MockHandler,
    ...mockRoutes
    ])
  ]
})
