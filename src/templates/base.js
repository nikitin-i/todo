const baseTemplate = `
<div class="wrapper">
    <header class="header">
        <h2 class="header__title">ToDo Application</h2>
    </header>
    <aside class="sidebar">
        <section class="sidebar__user user">
            <div class="user__logo"></div>
            <div class="user__name"></div>
        </section>
        <section class="sidebar__search search"></section>
        <section class="sidebar__lists lists">
            <div class="lists__list"></div>
            <div class="add-list">
                <form action="" method="" class="add-list__form">
                    <input type="text" class="add-list__input form-control" placeholder="Enter a new list..." required />
                    <input type="submit" class="add-list__submit" value="Go" />
                    <span class="add-list__error"></span>
                </form>
                
                <div class="add-list__toggle">
                    <span class="add-list__icon"></span>
                    <span class="add-list__text">New List</span>
                </div>
            </div>
        </section>
    </aside>
    <main class="main">
        <section class="main__info info">
            <div class="info__list"></div>
            <div class="info__date"></div>
        </section>
        <article class="main__todos todos">
            <section class="todos__list"></section>
            <section class="add-todo"></section>
        </article>
    </main>
</div>`;

export default baseTemplate;