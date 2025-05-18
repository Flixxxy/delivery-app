// js/payment.js
import { fetchOrder, updateOrder } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', async () => {
	renderNavLinks()
	renderUserMenu()

	const user = JSON.parse(localStorage.getItem('currentUser'))
	if (!user || user.role !== 'Client') {
		window.location.href = 'login.html'
		return
	}

	const params = new URLSearchParams(window.location.search)
	const orderId = params.get('orderId')
	if (!orderId) {
		alert('Не указан номер заказа')
		window.location.href = 'index.html'
		return
	}

	let order
	try {
		order = await fetchOrder(orderId)
	} catch (err) {
		alert('Ошибка загрузки заказа: ' + err.message)
		window.location.href = 'my-orders.html'
		return
	}

	document.getElementById('orderIdLabel').textContent = order.id
	document.getElementById('orderPrice').textContent = order.price
	document.getElementById('orderTariff').textContent =
		order.tariff === 'express' ? 'Срочный' : 'Стандарт'

	const form = document.getElementById('paymentForm')
	form.addEventListener('submit', async e => {
		e.preventDefault()
		const method = form.payMethod.value // 'online' или 'cash'

		const patchData = { paymentMethod: method }
		if (method === 'online') {
			patchData.paid = true
		}
		try {
			await updateOrder(order.id, patchData)
			window.location.href = 'my-orders.html'
		} catch (err) {
			alert('Ошибка при сохранении оплаты: ' + err.message)
		}
	})
})
