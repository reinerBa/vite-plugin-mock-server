import { ConfigEnv, defineConfig, Plugin, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import fetch from 'node-fetch'
import mockSimple from '../src'
import mockRoutes from './mockRoutes'

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
          configureServer(server) {
            setTimeout(async ()=> {
              const resp = await fetch(`http://localhost:${port}/api/test1/1`)
              const responseText = await resp.text()
              server.close()
              if(responseText !== 'Hello world!/api/test1/1') 
                throw new Error('wrong mock response')
              else 
                console.log('\x1b[32m ✓ correct mock response \x1b[0m');

              setTimeout(process.exit, 1e3)
            }
            , 5000)
          }
        }
    ]}
}
