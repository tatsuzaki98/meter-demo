import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// baseを'/meter-demo/'に指定する
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/meter-demo/',
})
