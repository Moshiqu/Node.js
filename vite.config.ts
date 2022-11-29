import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import styleImport, { AntdResolve } from "vite-plugin-style-import";
import configObj from './src/assets/js/config'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // styleImport({
        //   resolves: [AntdResolve()],
        // }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        open: true,
        host: configObj.clientAddress,
        port: configObj.clientPort,
        // 是否开启 https
        https: false,
        proxy: {
            "/apis": {
                target: "http://127.0.0.1:3001/",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/apis/, ""),
            },
        },
    },
});
