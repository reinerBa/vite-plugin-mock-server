import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockSimple from '../src'
import fetch from 'node-fetch-commonjs'
import routes1 from './mock/es.mock'
import routes2 from './mock/cjs.mock'
import routes3 from './mock/apis/es2.mock'
import routes4 from './mock/apis/cjs2.mock'

const port = 8000
export default defineConfig({
  server: { port },
  plugins: [
    vue(),
    mockSimple([...routes1, ...routes2, ...routes3(), ...routes4]),
    {
      name: `vite-plugin-stop`,
      apply: 'serve',
      configureServer(server) {
        setTimeout(async ()=> {
          const resp = await fetch(`http://127.0.0.1:${port}/api/test1/1`)
          const responseText = await resp.text()

          const resp2 = await fetch(`http:/127.0.0.1:${port}/api/test1/users/octoape`)
          const responseJson: any = await resp2.json()

          const userId = responseJson.params.userId
          
          await server.close()
          if(responseText !== 'Hello world!/api/test1/1' || userId !== "octoape") 
            throw new Error('wrong mock response')
          else 
          console.log('\x1b[32m ✓ correct mock response \x1b[0m');
        
          setTimeout(process.exit, 1e3)
        }
        , 3000)
      }
    }
  ]
})
