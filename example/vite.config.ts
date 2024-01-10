import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockServer from '../src'
import routes1 from './mock/es.mock'
import routes2 from './mock/cjs.mock'
import routes3 from './mock/apis/es2.mock'
import routes4 from './mock/apis/cjs2.mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mockServer([...routes1, ...routes2, ...routes3(), ...routes4])
  ]
})
