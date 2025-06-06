// index.js
const path = require('path')
const express = require('express')
const jsonServer = require('json-server')

const app = express()
const PORT = process.env.PORT || 3000

// 1) JSON-API на префиксе /api
app.use(
	'/api',
	jsonServer.defaults(),
	jsonServer.router(path.join(__dirname, 'db.json'))
)

// 2) Статика фронтенда из папки public
app.use(express.static(path.join(__dirname, 'public')))

// 3) На все «другие» запросы — отдаем index.html (для SPA-навигации)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(PORT, () => {
	console.log(`🚀 Server listening on port ${PORT}`)
})
