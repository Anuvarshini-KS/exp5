const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define file path for storing data
const filePath = path.join(__dirname, 'data.txt');

// Function to write data to the file
function writeFile(content, callback) {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      callback({ status: 'error', message: 'Failed to write to file.' });
    } else {
      callback({ status: 'success', message: 'Content written to file!' });
    }
  });
}

// Function to read data from the file
function readFile(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback({ status: 'error', message: 'Failed to read file.' });
    } else {
      callback({ status: 'success', data: data || 'No content available.' });
    }
  });
}

// Function to delete data from the file
function deleteFile(callback) {
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      callback({ status: 'error', message: 'Failed to delete content.' });
    } else {
      callback({ status: 'success', message: 'Content deleted successfully!' });
    }
  });
}

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Serve the HTML form
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } 
  // Handle reading from the file
  else if (parsedUrl.pathname === '/read' && req.method === 'GET') {
    readFile((response) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  } 
  // Handle writing to the file
  else if (parsedUrl.pathname === '/write' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      writeFile(body, (response) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      });
    });
  } 
  // Handle deleting content from the file
  else if (parsedUrl.pathname === '/delete' && req.method === 'DELETE') {
    deleteFile((response) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  } 
  // Handle 404 for other routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
