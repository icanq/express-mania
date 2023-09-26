const express = require('express')
const fs = require('fs')

const userRoutes = express.Router()

// READ
userRoutes.get('/users', (req, res) => {
  // task setelah menerima request dari user, ke endpoint '/users' harapannya dari API yang dibikin akan memberikan response berupa data user, untuk kali ini data usernya kita ambil dari db/users.json
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
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
userRoutes.get('/users/:id', (req, res) => {
  console.log(req.params)
  // destructuring an object
  const { id } = req.params

  // tampung ke dalam variabel
  // const id = req.params.id
  // const name = req.params.name


  // kita akan mengambil user pada database dengan user id = user id yang dikirimkan oleh user melalui request params
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
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

userRoutes.post('/users', (req, res) => {
  // destructure value from an object
  const { name, age } = req.body

  // kita akan menambahkan user baru ke database yang didapatkan dari request body
  
  // kalau databasenya json, kita perlu baca dulu isi dari database
  fs.readFile('./db/users.json', (error, data) => {
    // error handling saat tidak bisa membaca users.json
    if (error) res.send("Terjadi kesalahan saat membaca database")

    // kita akan mengubah data yang didapat dari database menjadi array of object
    const user = JSON.parse(data) 
    // array of user
    const newUser = {
      name,
      age
    }

    user.push(newUser)

    fs.writeFile('./db/users.json', JSON.stringify(user, null, 2), (error) => {
      if (error) res.send("Terjadi kesalahan saat menulis ke database")
      res.send("User berhasil ditambahkan")
    })
  })
})

module.exports = { userRoutes }