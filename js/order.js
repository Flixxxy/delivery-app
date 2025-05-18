// js/order.js
import { createOrder } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', () => {
	renderNavLinks()
	renderUserMenu()

	const user = JSON.parse(localStorage.getItem('currentUser'))
	if (!user || user.role !== 'Client') {
		window.location.href = 'login.html'
		return
	}

	const manualDistance = document.getElementById('manualDistance')
	const weightInput = document.getElementById('weight')
	const tariffSelect = document.getElementById('tariff')
	const priceLabel = document.getElementById('priceLabel')
	const form = document.getElementById('orderForm')

	function computePrice(distanceKm, weight, tariff) {
		let base = distanceKm * 50 + weight * 20
		if (tariff === 'express') base *= 1.5
		return Math.round(base)
	}

	function updatePrice() {
		const dist = parseFloat(manualDistance.value) || 0
		const w = parseFloat(weightInput.value) || 0
		const t = tariffSelect.value
		priceLabel.textContent = dist > 0 ? computePrice(dist, w, t) : '—'
	}

	manualDistance.addEventListener('input', updatePrice)
	weightInput.addEventListener('input', updatePrice)
	tariffSelect.addEventListener('change', updatePrice)

	form.addEventListener('submit', async e => {
		e.preventDefault()

		const from = document.getElementById('addrFrom').value.trim()
		const to = document.getElementById('addrTo').value.trim()
		const dist = parseFloat(manualDistance.value)
		const price = parseFloat(priceLabel.textContent)

		if (!from || !to) {
			alert('Укажите оба адреса.')
			return
		}
		if (isNaN(dist) || dist <= 0) {
			alert('Введите корректное расстояние вручную.')
			return
		}
		if (isNaN(price)) {
			alert('Стоимость не рассчитана.')
			return
		}

		const data = {
			addressFrom: from,
			addressTo: to,
			distance: dist,
			duration: null,
			weight: parseFloat(weightInput.value),
			dimensions: document.getElementById('dimensions').value.trim(),
			tariff: tariffSelect.value,
			price: price,
			status: 'Новый',
			clientId: user.id,
			courierId: null,
			paymentMethod: null,
			paid: false,
		}

		try {
			const order = await createOrder(data)
			window.location.href = `payment.html?orderId=${order.id}`
		} catch (err) {
			alert('Ошибка создания заказа: ' + err.message)
		}
	})
})
