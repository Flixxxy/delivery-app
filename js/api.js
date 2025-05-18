// js/api.js
const API_BASE = ''
// вместо 'http://localhost:8888'
// а при запросах:
fetch(`${API_BASE}/api/orders`)

async function request(path, method = 'GET', body) {
	const opts = { method, headers: {} }
	if (body) {
		opts.headers['Content-Type'] = 'application/json'
		opts.body = JSON.stringify(body)
	}
	const res = await fetch(`${API_BASE}${path}`, opts)
	if (!res.ok) {
		throw new Error(`API error: ${res.status}`)
	}
	return res.json()
}

// Пользователи
export function fetchUsers() {
	return request('/users')
}
export function fetchUser(id) {
	return request(`/users/${id}`)
}
export function createUser(data) {
	return request('/users', 'POST', data)
}
export function updateUser(id, data) {
	return request(`/users/${id}`, 'PATCH', data)
}
export function deleteUser(id) {
	return request(`/users/${id}`, 'DELETE')
}

// Авторизация
export async function loginUser(email, password) {
	const users = await request(
		`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(
			password
		)}`
	)
	return users.length ? users[0] : null
}

// Заказы
// filter принимает строку вида '?clientId=1' или '?status=Новый'
export function fetchOrders(filter = '') {
	return request(`/orders${filter}`)
}
export function fetchOrder(id) {
	return request(`/orders/${id}`)
}
export function createOrder(data) {
	return request('/orders', 'POST', data)
}
export function updateOrder(id, data) {
	return request(`/orders/${id}`, 'PATCH', data)
}
export function deleteOrder(id) {
	return request(`/orders/${id}`, 'DELETE')
}
