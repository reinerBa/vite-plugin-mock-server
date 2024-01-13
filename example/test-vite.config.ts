import { ConfigEnv, UserConfigExport, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockSimple from '../src'
import fetch from 'node-fetch-commonjs'
import routes0 from '../example2/mockRoutes'
import routes1 from './mock/es.mock'
import routes2 from './mock/cjs.mock'
import routes3 from './mock/apis/es2.mock'
import routes4 from './mock/apis/cjs2.mock'

const port = 8000
let errors: string[]
let responseText, responseJson, userId
export default async ({ command, mode }: ConfigEnv): Promise<UserConfigExport> => {
  
  const runTestsI =await import('../example2/testMockRoutes')
  const runTests = runTestsI.default
  const stopdevI =await import('vite-plugin-stopdev')
  const stopdev = stopdevI.default
  return {
  server: { port },
  plugins: [
    vue(),
    mockSimple([...routes0, ...routes1, ...routes2, ...routes3(), ...routes4]),
    stopdev({
      afterIdle: 2e3,
      async beforeStop(){
        errors = await runTests(`http://127.0.0.1:${port}`, fetch)
      },
      async afterStop(){
        errors.forEach(console.error)
        if(errors.length)
          throw new Error('wrong mock response')
      }         
    })
  ]}
}
