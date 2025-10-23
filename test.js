// Вставь после загрузки DOM
(function(){
  const container = document.getElementById('floating-menus');
  let menu = null;

  // Создать DOM-меню (один экземпляр)
  function createMenu() {
    const el = document.createElement('div');
    el.className = 'storage__item-menu';
    el.setAttribute('role', 'menu');
    el.innerHTML = `
      <button data-action="share">Поделиться</button>
      <button data-action="rename">Переименовать</button>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:6px 0;">
      <button data-action="archive">Архивировать</button>
      <button data-action="delete" style="color: #ff7b7b;">Удалить</button>
    `;
    container.appendChild(el);
    return el;
  }

  function showMenuFor(liElem, triggerRect) {
    if (!menu) menu = createMenu();

    // позиция: справа от li (с учётом прокрутки)
    const rect = liElem.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.right + window.scrollX + 8; // небольшой отступ

    // временно выставляем, чтобы получить размеры меню
    menu.style.display = 'block';
    menu.classList.add('show');
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';

    // защита от выхода за правый край окна — флип влево
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth - 8) {
      // поместить слева от li
      const leftAlt = rect.left + window.scrollX - menuRect.width - 8;
      menu.style.left = Math.max(leftAlt, 8) + 'px';
    }

    // если меню выходит за низ экрана — поднимать вверх
    if (menuRect.bottom > window.innerHeight - 8) {
      const delta = menuRect.bottom - window.innerHeight + 8;
      menu.style.top = (top - delta) + 'px';
    }

    // подписываемся на close handlers
    requestAnimationFrame(() => {
      document.addEventListener('click', outsideClick);
      window.addEventListener('resize', hideMenu);
      window.addEventListener('scroll', hideMenu, {passive:true});
      document.addEventListener('keydown', onKeyDown);
    });
  }

  function hideMenu() {
    if (!menu) return;
    menu.classList.remove('show');
    menu.style.display = 'none';
    document.removeEventListener('click', outsideClick);
    window.removeEventListener('resize', hideMenu);
    window.removeEventListener('scroll', hideMenu);
    document.removeEventListener('keydown', onKeyDown);
  }

  function outsideClick(e) {
    if (e.target.closest('.storage__item-remove-btn')) return; // клик по три точки — не закрываем здесь
    if (!menu) return;
    if (!e.target.closest('.storage__item-menu')) hideMenu();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') hideMenu();
  }

  // делегирование: ловим клики по кнопкам "три точки"
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.storage__item-remove-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const li = btn.closest('.storage__item');
    if (!li) return;

    // если меню уже открыто и связано с тем же li — закрыть
    if (menu && menu.style.display === 'block') {
      // можно проверить привязку через dataset, но для простоты — переключаем
      hideMenu();
      return;
    }

    showMenuFor(li);
  });

  // обработка действий меню (делегирование внутри меню)
  container.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    // найдём связанный li, можно хранить в menu.dataset.currentId
    // здесь просто вызовем обработчик
    if (action === 'delete') {
      // пример — найти текущее li по позиции меню (или сохранить ссылку при showMenuFor)
      console.log('Удалить — реализуй удаление');
    }
    hideMenu();
  });
})();
