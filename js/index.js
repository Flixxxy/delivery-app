// index.js
const path = require('path')
const express = require('express')
const jsonServer = require('json-server')

const app = express()
const PORT = process.env.PORT || 3000

// 1) JSON-API на /api
app.use(
	'/api',
	jsonServer.defaults(),
	jsonServer.router(path.join(__dirname, 'db.json'))
)

// 2) Статика из public/
app.use(express.static(path.join(__dirname, 'public')))

// 3) Все остальные запросы — отдаём index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(PORT, () => {
	console.log(`🚀 Server listening on port ${PORT}`)
})
