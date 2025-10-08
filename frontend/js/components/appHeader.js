export function renderAppHeader() {
    const header = ` 
    <div class="container">
        <nav class="nav">
            <a class="logo" href="index.html">
                <img class="logo-img" src="images/logo.svg">
            </a>
            <ul class="menu" >
                <li class="menu__list">
                    <a class="menu__link" id="processing__link" href="processing.html">
                        Обкашлять переписку
                    </a>
                </li>
                <li class="menu__list">
                    <a class="menu__link" id="storage__link" href="storage.html">
                        Хранилище переписок
                    </a>
                </li>
            </ul>
            <a class="home" href="#">
                <img class="home-img" src="images/home.svg">
            </a>
        </nav>
    </div>`

    const appHeader = document.querySelector('.header')
    if (appHeader) {
        appHeader.innerHTML = header
    }

}

