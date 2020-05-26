const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(createProxyMiddleware('/auth', { target: 'http://localhost:5000/', changeOrigin: true, }))
  app.use(createProxyMiddleware('/user/**', { target: 'http://localhost:5000/', changeOrigin: true, }))
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'ws://localhost:5000',
      ws: true,
    }),
  );
}