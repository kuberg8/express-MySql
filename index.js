const express = require('express')
const cors = require('cors')

// routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

// app
const app = express()
const PORT = 3000

// middleware
app.use(express.json())
app.use(cors())

// use routes
app.use('/user', authRoutes)
app.use('/profile', userRoutes)

app.listen(PORT, () => {
  console.log(`Server has been started on port - ${PORT}`)
})
