import express from 'express'

const app = express()
const PORT = 9001

app.get('/', (req, res) => {
  res.json({ message: 'Hello' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
