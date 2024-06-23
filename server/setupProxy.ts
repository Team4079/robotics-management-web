/* eslint-disable import/no-anonymous-default-export */
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app: { use: (arg0: string, arg1: any) => void; }) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
}