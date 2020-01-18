import $ from 'jquery';
import Mustache from 'mustache';

import baseTemplate from '../../templates/base';
import listsTemplate from '../../templates/lists';
import todosTemplate from '../../templates/todos';
import addTodo from '../../templates/addTodo';

class View {
    constructor() {
        this.CONSTANTS = {
            SELECTORS: {
                CONTAINER: '.container',
                LISTS_CONTAINER: '.lists__list',
                ADD_LIST_TOGGLE: '.add-list__toggle',
                ADD_LIST_SUBMIT: '.add-list__submit',
                
                TODOS_CONTAINER: '.todos__list',
                ADD_TODO_CONTAINER: '.add-todo',
                ADD_TODO_TOGGLE: '.add-todo__toggle',
                ADD_TODO_SUBMIT: '.add-todo__submit',
                TODO_RADIO_BUTTON: '.todo__icon',
                TODO_CONTROLS: '.todo__controls',
                
                LISTS_ITEM: '.lists__item'
            }
        };
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.mediator.subscribe('databaseOpened', this.render.bind(this));
    
        $(document)
            .on('click', this.CONSTANTS.SELECTORS.ADD_LIST_TOGGLE, this.addListClickHandler)
            .on('click', this.CONSTANTS.SELECTORS.ADD_LIST_SUBMIT, this.addListSubmitHandler)
            .on('click', this.CONSTANTS.SELECTORS.ADD_TODO_TOGGLE, this.addTodoClickHandler)
            .on('click', this.CONSTANTS.SELECTORS.ADD_TODO_SUBMIT, this.addTodoSubmitHandler)
            .on('click', this.CONSTANTS.SELECTORS.LISTS_ITEM, this.chooseActiveList)
            .on('click', this.CONSTANTS.SELECTORS.TODO_RADIO_BUTTON, this.chooseTodo)
            .on('click', this.CONSTANTS.SELECTORS.TODO_CONTROLS, this.controlsClickHandler);
    }
    
    render() {
        const container = $(this.CONSTANTS.SELECTORS.CONTAINER);
        const rendered = Mustache.render(baseTemplate);

        container.html(rendered);
    }
    
    renderLists(data) {
        const listsContainer = $(this.CONSTANTS.SELECTORS.LISTS_CONTAINER);
        const rendered = Mustache.render(listsTemplate, data);
    
        listsContainer.html(rendered);
        
        if (data.lists.length) {
            this.renderAddTodo(data);
        }
    }
    
    renderTodos(data) {
        const todosContainer = $(this.CONSTANTS.SELECTORS.TODOS_CONTAINER);
        const rendered = Mustache.render(todosTemplate, data);
        
        todosContainer.html(rendered);
    }
    
    renderAddTodo(data) {
        const addTodoContainer = $(this.CONSTANTS.SELECTORS.ADD_TODO_CONTAINER);
        const rendered = Mustache.render(addTodo, data);
    
        addTodoContainer.html(rendered);
    }
}

export default View;