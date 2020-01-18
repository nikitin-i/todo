const addTodo = `
<form action="" method="" class="add-todo__form">
    <div class="add-todo__row">
        <div class="add-todo__title-wrapper">
            <input class="add-todo__title form-control" type="text" placeholder="Describe your todo" required />
            <span class="add-todo__error"></span>
        </div>

        <select class="add-todo__select form-control" required>
            <option disabled selected value="">Choose your list</option>
            {{#lists}}
                <option value="{{list}}">{{list}}</option>
            {{/lists}}
        </select>

        <div class="add-todo__deadline-wrapper">
            <input class="add-todo__deadline form-control" type="date" required />
            <span class="add-todo__error"></span>
        </div>
        
        <input type="submit" class="add-todo__submit" value="Submit" />
    </div>
</form>

<div class="add-todo__toggle">
    <div class="add-todo__radio">
        <label class="add-todo__icon"></label>
    </div>
    <div class="add-todo__description">
        <p class="add-todo__text">Add a todo</p>
    </div>
</div>`;

export default addTodo;