// js/admin.js
import { fetchOrders, fetchUsers, updateOrder, updateUser } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', async () => {
	renderNavLinks()
	renderUserMenu()

	const user = JSON.parse(localStorage.getItem('currentUser'))
	const path = window.location.pathname

	// Если не залогинен — сразу на страницу входа
	if (!user) {
		return void (window.location.href = 'login.html')
	}

	// Страница управления пользователями — только для Administrators
	if (path.endsWith('admin-users.html')) {
		if (user.role !== 'Administrator') {
			return void (window.location.href = 'login.html')
		}

		const users = await fetchUsers()
		const tbody = document.getElementById('usersTableBody')
		tbody.innerHTML = ''
		users.forEach(u => {
			const tr = document.createElement('tr')
			tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <select data-id="${u.id}" class="form-select role-select">
            <option ${u.role === 'Client' ? 'selected' : ''}>Client</option>
            <option ${u.role === 'Courier' ? 'selected' : ''}>Courier</option>
            <option ${u.role === 'Operator' ? 'selected' : ''}>Operator</option>
            <option ${
							u.role === 'Administrator' ? 'selected' : ''
						}>Administrator</option>
          </select>
        </td>`
			tbody.append(tr)
		})

		tbody.addEventListener('change', async e => {
			if (!e.target.classList.contains('role-select')) return
			const id = e.target.dataset.id
			const role = e.target.value
			await updateUser(id, { role })
			alert(`Роль пользователя #${id} изменена на "${role}"`)
		})
	}

	// Страница управления заказами — для Operator и Administrator
	else if (path.endsWith('admin-orders.html')) {
		if (user.role !== 'Administrator' && user.role !== 'Operator') {
			return void (window.location.href = 'login.html')
		}

		const orders = await fetchOrders()
		const tbody = document.getElementById('ordersTableBody')
		tbody.innerHTML = ''
		orders.forEach(o => {
			const tr = document.createElement('tr')
			tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.addressFrom}</td>
        <td>${o.addressTo}</td>
        <td>${o.clientId}</td>
        <td>${o.courierId || '-'}</td>
        <td>${o.tariff === 'express' ? 'Срочный' : 'Стандарт'}</td>
        <td>${o.price}</td>
        <td>
          <select data-id="${o.id}" class="form-select status-select">
            <option ${o.status === 'Новый' ? 'selected' : ''}>Новый</option>
            <option ${
							o.status === 'В работе' ? 'selected' : ''
						}>В работе</option>
            <option ${
							o.status === 'Доставлено' ? 'selected' : ''
						}>Доставлено</option>
          </select>
        </td>
        <td>${o.paid ? 'Да' : 'Нет'}</td>`
			tbody.append(tr)
		})

		tbody.addEventListener('change', async e => {
			if (!e.target.classList.contains('status-select')) return
			const id = e.target.dataset.id
			const status = e.target.value
			await updateOrder(id, { status })
			alert(`Статус заказа #${id} обновлён на "${status}"`)
		})
	}

	// Любая другая админская страница — редирект на главную
	else {
		window.location.href = 'index.html'
	}
})
