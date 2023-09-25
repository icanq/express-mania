// const http = require('http')
// buat import package express yang tadi kita install
const express = require('express')

// buat baca db boongan kita perlu pake fs;
const fs = require('fs');

const pathToPublicFolder = __dirname + 'public'

// C:\
// user/mnt/

// kalau nanti kita bakal baca dari database beneran, kita bakal install dulu database drivernya, contohnya mysql, mongodb, postgresql
// npm i mysql atau npm i pg atau npm i mongodb

// buat instance express
const app = express();
const PORT = 3000;

// express.static() adalah function middleware yang dibuat oleh express untuk membantu kita dalam memudahkan serving static files
app.use(express.static(pathToPublicFolder))

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

// READ
app.get('/users', (req, res) => {
  // task setelah menerima request dari user, ke endpoint '/users' harapannya dari API yang dibikin akan memberikan response berupa data user, untuk kali ini data usernya kita ambil dari db/fake_database.json
  fs.readFile('./db/fake_database.json', 'utf-8', (error, data) => {
    if (error) res.send("Terjadi kesalahan pada pembacaan file")
    // if (error) throw err 
    res.send(JSON.parse(data))
  })

  // nanti kalau pake database beneran kita perlu melakukan query ke database, misalnya kalau pake mysql atau PostgreSQL itu `SELECT * FROM users`
  // atau nanti kita bisa pakai bantuan biar gak perlu nulis query pakai yang namanya ORM -> Object Relational Mapping

  // kalau pake query
  // const users = db.query('SELECT * FROM users')

  // kalau pake ORM
  // const users = db.findAll('users')
})

// get by id
app.get('/users/:id', (req, res) => {
  console.log(req.params)
  // destructuring an object
  const { id } = req.params

  // tampung ke dalam variabel
  // const id = req.params.id
  // const name = req.params.name


  // kita akan mengambil user pada database dengan user id = user id yang dikirimkan oleh user melalui request params
  fs.readFile('./db/fake_database.json', 'utf-8', (error, data) => {
    if (error) res.send('gagal dalam pembacaan database')
    const users = JSON.parse(data)
    console.log(users)
    // filter data dari database, dan kita cari user dengan id sesuai dengan id yang dilempar melalui req.params
    const user = users.find(user => user.id === Number(id))
    // error handling apabila user tidak ada pada database
    if (!user) res.send("User tidak ditemukan")

    // melempar data user melalui response
    res.send(user)
  });

})

app.listen(PORT, () => {
  console.log(`Aplikasi sudah berjalan pada http://localhost:${PORT}`)
})