const express = require('express')
const fs = require('fs')

const userRoutes = express.Router()

// READ
userRoutes.get('/users', (req, res) => {
  // task setelah menerima request dari user, ke endpoint '/users' harapannya dari API yang dibikin akan memberikan response berupa data user, untuk kali ini data usernya kita ambil dari db/users.json
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
    if (error) res.send("Terjadi kesalahan pada pembacaan file")
    // if (error) throw err 
    res.status(200).send({
      message: "Sukses mengambil user",
      data: JSON.parse(data)
    })
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
    res.status(200).send({
      message: "Success mendapatkan user",
      data: user
    })
  });
})

// create new user
userRoutes.post('/users', (req, res) => {
  console.log(req.body)
  // destructuring an object
  const { name, age, cars } = req.body

  // validasi untuk mengecek apakah data yang dikirimkan oleh user sudah lengkap atau belum
  if (!name || !age || !cars) res.send("Data yang dikirimkan tidak lengkap")

  // lalu kita akan menambahkan user baru ke dalam database
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
    if (error) res.send('gagal dalam pembacaan database')
    const users = JSON.parse(data)
    // kita akan membuat user baru dengan id yang unik
    // apabila nanti sudah menggunakan database, kita tidak perlu melakukan penambahan id seperti ini secara manual, nanti bisa otomatis
    const newUser = {
      id: users.length + 1,
      name,
      age,
      cars
    }

    // kita push user baru ke dalam database. Ketika sudah menggunakan database, kita tidak perlu melakukan push seperti ini, nanti bisa menggunakan query INSERT INTO users VALUES (name, age, cars)

    // contoh request body pada postman dengan mode RAW -> JSON
    // {
    //   "name": "Budi",
    //   "age": 24,
    //   "cars": [
    //     {
    //       "name": "Toyota"
    //       "models": [ "Prius" ]
    //     }
    //   ]
    // }
    users.push(newUser)

    fs.writeFile('./db/users.json', JSON.stringify(users, '', 2), (error) => {
      if (error) res.send("Gagal menambahkan user baru")
      res.status(201).send({
        message: "Success menambahkan user",
        data: newUser
      })
    })
  })
})

// update user
// untuk membuat update user, kita perlu mengirimkan data user yang sudah diupdate melalui request body dan kita perlu tau user mana yang akan di update melalui req.params

userRoutes.put('/users/:id', (req, res) => {
  const { id } = req.params
  const { name, age, cars } = req.body

  // kita akan mengupdate data user yang ada pada database
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
    if (error) res.send('gagal dalam pembacaan database')
    const users = JSON.parse(data)

    // cari usernya dulu
    // logika ini nanti akan berubah sesuai dengan database yang digunakan
    const user = users.find(user => user.id === Number(id))

    // error handling apabila user tidak ditemukan
    if (!user) res.send("User tidak ditemukan")

    // kita akan mengupdate data user yang ada pada database
    user.name = name
    user.age = age
    user.cars = cars

    // kita akan mengupdate data user yang ada pada database
    // logika ini nanti akan berubah sesuai dengan database yang digunakan
    users[user.id - 1] = user

    fs.writeFile('./db/users.json', JSON.stringify(users, '', 2), (error) => {
      if (error) res.send("Gagal mengupdate user")
      res.status(200).send({
        message: "Success mengupdate user",
        data: user
      })
    });
  })
});

// delete user
userRoutes.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // kita akan menghapus user yang ada pada database
  fs.readFile('./db/users.json', 'utf-8', (error, data) => {
    if (error) res.send('gagal dalam pembacaan database')
    const users = JSON.parse(data)

    // cari user di db
    const filteredUser = users.filter(user => user.id !== Number(id))

    if (!filteredUser) res.status(404).send("User tidak ditemukan")

    // simpan perubahan ke db
    // saat menggunakan database, logika ini akan berubah
    fs.writeFile('./db/users.json', JSON.stringify(filteredUser, '', 2), (error) => {
      if (error) res.send("Gagal menghapus user")
      res.status(200).send({
        message: "Success menghapus user",
        data: filteredUser
      })
    });
  });
})


module.exports = { userRoutes }