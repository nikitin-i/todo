const todosTemplate = `
{{#todos}}
    <li class="todos__item todo{{#performed}} todo--performed{{/performed}}" id="{{id}}">
        <div class="todo__radio">
            <input type="checkbox" id="todo-{{id}}" class="todo__checkbox" />
            <label for="todo-{{id}}" class="todo__icon">
                <div class="todo__icon-dot"></div>
            </label>
        </div>
        <div class="todo__description">
            <p class="todo__title">{{title}}</p>
            <span class="todo__list">{{list}}</span>
            <span class="todo__divider">&bull;</span>
            <span class="todo__deadline">{{deadline}}</span>
        </div>
        <div class="todo__controls">
            {{^performed}}
                <div class="todo__done" title="done" id="done"></div>
            {{/performed}}
            {{#performed}}
                <div class="todo__revert" title="revert" id="revert"></div>
            {{/performed}}
            <div class="todo__remove" title="remove" id="remove"></div>
        </div>
    </li>
{{/todos}}`;

export default todosTemplate;