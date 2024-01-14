import { ConfigEnv, defineConfig, Plugin, UserConfigExport, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import stopdev from 'vite-plugin-stopdev'
import fetch from 'node-fetch'
import mockSimple from '../src'
import mockRoutes from './mockRoutes'
import runTests from './testMockRoutes'

const port = 8000
let errors: string[]
export default ({ command, mode }: ConfigEnv): UserConfigExport => {

    // auto close after 4 secounds, to the runtime
    return {
      server: {
        port,
      },
      plugins: [
        vue(), 
        mockSimple(mockRoutes),
        stopdev({
          afterIdle: 2e3,
          async beforeStop(){
            errors = await runTests(`http://localhost:${port}`, fetch)
          },
          async afterStop(){
            errors.forEach(console.error)
            if(errors.length)
              throw new Error('wrong mock response')
          }         
        })
    ]}
}
