// js/courier.js
import { fetchOrders, updateOrder } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', () => {
	renderNavLinks()
	renderUserMenu()

	const user = JSON.parse(localStorage.getItem('currentUser'))
	if (!user || user.role !== 'Courier') {
		window.location.href = 'login.html'
		return
	}

	const availableBody = document.getElementById('availableOrdersBody')
	const deliveriesBody = document.getElementById('myDeliveriesBody')

	async function loadLists() {
		let orders
		try {
			orders = await fetchOrders()
		} catch (err) {
			console.error('Ошибка загрузки заказов:', err)
			availableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Ошибка загрузки заказов</td></tr>`
			deliveriesBody.innerHTML = `<tr><td colspan="5" class="text-danger">Ошибка загрузки доставок</td></tr>`
			return
		}

		// Доступные: новые и без курьера
		const available = orders.filter(o => o.status === 'Новый' && !o.courierId)
		if (available.length) {
			availableBody.innerHTML = available
				.map(
					o => `
        <tr>
          <td>${o.id}</td>
          <td>${o.addressFrom}</td>
          <td>${o.addressTo}</td>
          <td>${o.tariff === 'express' ? 'Срочный' : 'Стандарт'}</td>
          <td>${o.price}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="acceptOrder('${
							o.id
						}')">
              Принять
            </button>
          </td>
        </tr>
      `
				)
				.join('')
		} else {
			availableBody.innerHTML = `<tr><td colspan="6" class="text-center">Нет новых доступных заказов</td></tr>`
		}

		// Мои доставки: назначенные мне и ещё не доставлены
		const deliveries = orders.filter(
			o => o.courierId === user.id && o.status !== 'Доставлено'
		)
		if (deliveries.length) {
			deliveriesBody.innerHTML = deliveries
				.map(
					o => `
        <tr>
          <td>${o.id}</td>
          <td>${o.addressFrom}</td>
          <td>${o.addressTo}</td>
          <td>${o.status}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="completeOrder('${o.id}')">
              Доставлено
            </button>
          </td>
        </tr>
      `
				)
				.join('')
		} else {
			deliveriesBody.innerHTML = `<tr><td colspan="5" class="text-center">Нет активных доставок</td></tr>`
		}
	}

	// Принимаем заказ
	window.acceptOrder = async function (id) {
		if (!confirm(`Принять заказ #${id}?`)) return
		try {
			await updateOrder(id, { courierId: user.id, status: 'В процессе' })
			await loadLists()
		} catch (err) {
			alert('Не удалось принять заказ: ' + err.message)
			console.error(err)
		}
	}

	// Завершаем доставку
	window.completeOrder = async function (id) {
		if (!confirm(`Отметить заказ #${id} как доставленный?`)) return
		try {
			await updateOrder(id, { status: 'Доставлено' })
			await loadLists()
		} catch (err) {
			alert('Не удалось завершить доставку: ' + err.message)
			console.error(err)
		}
	}

	loadLists()
})
