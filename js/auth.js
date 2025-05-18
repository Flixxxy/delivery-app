// js/auth.js
import { createUser, loginUser } from './api.js'
import { renderNavLinks, renderUserMenu } from './navigation.js'

document.addEventListener('DOMContentLoaded', () => {
	renderNavLinks()
	renderUserMenu()

	const regForm = document.getElementById('registerForm')
	const loginForm = document.getElementById('loginForm')

	if (regForm) {
		regForm.addEventListener('submit', async e => {
			e.preventDefault()
			const name = regForm.querySelector('input[name="name"]').value.trim()
			const email = regForm.querySelector('input[name="email"]').value.trim()
			const pass = regForm.querySelector('input[name="password"]').value
			const role = regForm.querySelector('select[name="role"]').value
			try {
				const user = await createUser({ name, email, password: pass, role })
				localStorage.setItem('currentUser', JSON.stringify(user))
				window.location.href = 'index.html'
			} catch (err) {
				alert('Ошибка регистрации: ' + err.message)
			}
		})
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async e => {
			e.preventDefault()
			const email = loginForm.querySelector('input[type=email]').value.trim()
			const pass = loginForm.querySelector('input[type=password]').value
			try {
				const user = await loginUser(email, pass)
				if (!user) {
					alert('Неверный логин или пароль')
					return
				}
				localStorage.setItem('currentUser', JSON.stringify(user))
				window.location.href = 'index.html'
			} catch (err) {
				alert('Ошибка входа: ' + err.message)
			}
		})
	}
})
