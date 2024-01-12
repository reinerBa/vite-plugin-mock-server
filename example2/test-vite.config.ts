import { ConfigEnv, defineConfig, Plugin, UserConfigExport, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import fetch from 'node-fetch'
import mockSimple from '../src'
import mockRoutes from './mockRoutes'
import runTests from './testMockRoutes'

const port = 8000
export default ({ command, mode }: ConfigEnv): UserConfigExport => {

    // auto close after 4 secounds, to the runtime
    return {
      server: {
        port,
      },
      plugins: [
        vue(), 
        mockSimple(mockRoutes),
        {
          name: `vite-plugin-stop`,
          apply: 'serve',
          async configureServer(server: ViteDevServer) {
            setTimeout(async ()=> {
              const errors: string[] = await runTests(`http://localhost:${port}`)
              server.close()

              errors.forEach(console.error)
              if(errors.length)
                throw new Error('wrong mock response')

              setTimeout(process.exit, 1e3)
            }
            , 3000)
          }
        }
    ]}
}
