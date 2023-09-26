// const http = require('http')
// buat import package express yang tadi kita install
const express = require('express')

// buat baca db boongan kita perlu pake fs;
const fs = require('fs');

const { userRoutes } = require('./routes/userRoutes')
const { productRoutes } = require('./routes/productRoutes')
const pathToPublicFolder = __dirname + '/public'
const pathToCssFolder = __dirname + '/public/css'
console.log(__dirname)
console.log(pathToPublicFolder)
console.log(pathToCssFolder)

// C:\
// user/mnt/

// kalau nanti kita bakal baca dari database beneran, kita bakal install dulu database drivernya, contohnya mysql, mongodb, postgresql
// npm i mysql atau npm i pg atau npm i mongodb

// buat instance express
const app = express();
const PORT = 3000;

// express.static() adalah function middleware yang dibuat oleh express untuk membantu kita dalam memudahkan serving static files
app.use(express.static(pathToPublicFolder))
// fungsi dari `express.json()` adalah untuk parse data json yang dikirimkan dari request body
app.use(express.json())
// untuk parse data yang dikirim melalui req.body dalam bentuk Content-Type nya application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

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

app.get('/about', (req, res) => {
  console.log(__dirname)
  res.sendFile('./public/about.html', { root: __dirname })
})

// CRUD -> Create, Read, Update, Delete
// memecah rute yang banyak menjadi rute rute kecil
// kita bisa langsung pakai rute yang sudah dibuat di file lain dengan cara di import dulu, lalu kita pakai dengan app.use(namaRuteYangDiImport)
app.use(userRoutes)

// untuk memakai productRoutes
app.use("/products", productRoutes)


app.listen(PORT, () => {
  console.log(`Aplikasi sudah berjalan pada http://localhost:${PORT}`)
})