// js/my-orders.js
import { fetchOrders } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', async () => {
	renderNavLinks()
	renderUserMenu()

	const user = JSON.parse(localStorage.getItem('currentUser'))
	if (!user || user.role !== 'Client') {
		window.location.href = 'login.html'
		return
	}

	const allOrders = await fetchOrders()
	const myOrders = allOrders.filter(o => o.clientId === user.id)

	const tbody = document.getElementById('ordersTable')
	tbody.innerHTML = ''

	if (myOrders.length === 0) {
		const tr = document.createElement('tr')
		tr.innerHTML = `<td colspan="8" class="text-center">У вас пока нет заказов</td>`
		tbody.append(tr)
	} else {
		myOrders.forEach(o => {
			const tr = document.createElement('tr')
			tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.addressFrom}</td>
        <td>${o.addressTo}</td>
        <td>${o.distance}</td>
        <td>${o.weight}</td>
        <td>${o.tariff === 'express' ? 'Срочный' : 'Стандарт'}</td>
        <td>${o.price}</td>
        <td>${o.status}</td>`
			tbody.append(tr)
		})
	}
})
