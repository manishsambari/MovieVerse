import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const clientEnv = loadEnv(mode, process.cwd(), '')
    const serverEnv = loadEnv(mode, path.resolve(__dirname, '../server'), '')

    const proxyTarget = clientEnv.VITE_PROXY_TARGET || `http://localhost:${serverEnv.PORT || '5000'}`

    return {
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                },
                '/images': {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    }
})
