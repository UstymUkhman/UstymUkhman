var path       = require('path'),
    httpServer = require('http-server');

exports.config = { baseUrl: 'http://localhost:3000/' };

httpServer.createServer().listen(3000, function () {
  console.log('HTTP server started at http://localhost:3000');
});
