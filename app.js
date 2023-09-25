// const http = require('http')

// buat import package express yang tadi kita install
const express = require('express');

// buat instance express
const app = express();
const PORT = 3000;

/**
 * const server = http.createServer((req, res) => {
 *   if (req.url === '/') {
 *    res.write('Halo Dunia')
 *   res.end()
 *   }
 * })
 * 
 * server.listen(PORT, () => {})
 */

app.get('/', (req, res) => {
  res.send("Halo dari Aplikasi Express")
})

app.listen(PORT, () => {
  console.log(`Aplikasi sudah berjalan pada http://localhost:${PORT}`)
})