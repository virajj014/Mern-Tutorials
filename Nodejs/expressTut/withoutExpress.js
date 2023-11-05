const http = require('http');
const url = require('url');
const querystring = require('querystring');

const users = [];

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  const pathname = reqUrl.pathname;

  if (req.method === 'GET' && pathname === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'POST' && pathname === '/users') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newUser = querystring.parse(body);
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else if (req.method === 'GET' && pathname.startsWith('/users/')) {
    const userId = parseInt(pathname.substring(7));
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404);
      res.end('User not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
