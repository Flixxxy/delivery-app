// js/navigation.js
export function renderNavLinks() {
	const links = document.getElementById('navLinks')
	const user = JSON.parse(localStorage.getItem('currentUser'))
	let html = `<li class="nav-item"><a class="nav-link" href="index.html">Главная</a></li>`

	if (user) {
		html += `
      <li class="nav-item"><a class="nav-link" href="order-form.html">Новый заказ</a></li>
      <li class="nav-item"><a class="nav-link" href="my-orders.html">Мои заказы</a></li>`

		if (user.role === 'Courier') {
			html += `<li class="nav-item"><a class="nav-link" href="courier.html">Курьер</a></li>`
		}
		if (user.role === 'Operator' || user.role === 'Administrator') {
			html += `<li class="nav-item"><a class="nav-link" href="admin-orders.html">Упр. заказами</a></li>`
		}
		if (user.role === 'Administrator') {
			html += `<li class="nav-item"><a class="nav-link" href="admin-users.html">Пользователи</a></li>`
		}
	}

	links.innerHTML = html
}

export function renderUserMenu() {
	const menu = document.getElementById('navUserMenu')
	const user = JSON.parse(localStorage.getItem('currentUser'))

	if (user) {
		menu.innerHTML = `
      <li class="nav-item"><span class="navbar-text me-3">Привет, ${user.name}</span></li>
      <li class="nav-item"><a class="nav-link" href="#" id="logoutBtn">Выйти</a></li>`
		document.getElementById('logoutBtn').addEventListener('click', () => {
			localStorage.removeItem('currentUser')
			window.location.href = 'index.html'
		})
	} else {
		menu.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="login.html">Войти</a></li>
      <li class="nav-item"><a class="nav-link" href="register.html">Регистрация</a></li>`
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const nav = document.getElementById('mainNavbar')
	nav.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="index.html">DeliveryApp</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navContent">
        <ul class="navbar-nav me-auto" id="navLinks"></ul>
        <ul class="navbar-nav" id="navUserMenu"></ul>
      </div>
    </div>`

	renderNavLinks()
	renderUserMenu()
})
