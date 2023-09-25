// import dulu expressnya, karena kita butuh express.Router() untuk membuat rute baru
const express = require('express')

const productRoutes = express.Router()

productRoutes.get("/", (req, res) => {
  res.send("response dari endpoint product")
})

module.exports = { productRoutes }