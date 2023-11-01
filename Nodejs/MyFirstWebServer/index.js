const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const path = req.url;

    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Define allowed HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Define allowed request headers

    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
    }
    else if (path == '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1>');

    }
    else if (path == '/users') {
        fs.readFile('./userdata.json', 'utf-8', (err, data) => {
            if (err) {
               res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>Internal Server Error</h1>');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        })
        }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Page Not Found</h1>');
    }
})


const port = 8000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
})