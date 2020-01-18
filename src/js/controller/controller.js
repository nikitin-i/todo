import $ from 'jquery';

import Mediator from './mediator.js';

class Controller {
    constructor(Model, View) {
        this.model = new Model();
        this.view = new View();
        this.mediator = new Mediator();
        
        this.lists = null;
        this.todos = null;
        this.activeList = null;
        
        this.CONSTANTS = {
            SELECTORS: {
                MODAL: '#modal',
                MODAL_TITLE: '.modal-title',
                MODAL_DESCRIPTION: '.modal-description',
                MODAL_INPUT: '.modal-input',
                MODAL_FOOTER: '.modal-footer',
                SPINNER: '#spinner',
                
                USER_NAME: '.user__name',
                
                ADD_LIST_TOGGLE: '.add-list__toggle',
                ADD_LIST_FORM: '.add-list__form',
    
                TODO: '.todo',
                TODO_CONTROLS: '.todo__controls',
                ADD_TODO_TOGGLE: '.add-todo__toggle',
                ADD_TODO_FORM: '.add-todo__form',
                ADD_TODO_TITLE: '.add-todo__title',
                ADD_TODO_LIST: '.add-todo__select',
                ADD_TODO_DEADLINE: '.add-todo__deadline',
                
                ACTIVE_LIST: '.info__list',
                CURRENT_DATE: '.info__date',
                
                LISTS_LIST: '.lists__list',
                LISTS_ITEM: '.lists__item',
                LISTS_ITEM_ACTIVE: '.lists__item--active'
            },
            CLASSES: {
                SPINNER_HIDE: 'spinner--hide',
                ADD_LIST_TOGGLE_ACTIVE: 'add-list__toggle--active',
                ADD_LIST_FORM_SHOW: 'add-list__form--show',
                
                ADD_TODO_TOGGLE_ACTIVE: 'add-todo__toggle--active',
                ADD_TODO_FORM_SHOW: 'add-todo__form--show',
                
                LISTS_ITEM_ACTIVE: 'lists__item--active',
                TODO_CONTROLS_VISIBLE: 'todo__controls--visible'
            },
            ERRORS: {
                MIN_CHARS: 'Fill out more than 2 symbols',
                FINISHED_DATE: 'This date for todo is already in the past'
            },
            MESSAGES: {
                MODAL_WARNING: 'Warning!',
                MODAL_CONFIRM: 'Are you sure about this action?',
                
                MODAL_WELCOME: 'Welcome!',
                MODAL_REQUEST: 'First time deal with our app? Please, provide your full name into the field below'
            }
        };
    }

    init() {
        this.expandAccessToMediator();
        this.bindEvents();
    
        this.expandViewPrototype();

        this.model.init();
        this.view.init();
    }

    expandAccessToMediator() {
        this.view.mediator = this.mediator;
        this.model.mediator = this.mediator;
    }
    
    bindEvents() {
        this.mediator.subscribe('databaseOpened', this.getDataFromDB.bind(this));
        this.mediator.subscribe('userName', this.processUserName.bind(this));
        this.mediator.subscribe('allData', this.getAllHandler.bind(this));
        this.mediator.subscribe('allLists', this.getListsHandler.bind(this));
        this.mediator.subscribe('allTodos', this.getTodosHandler.bind(this));
        this.mediator.subscribe('databaseSuccess', this.processDbResponse.bind(this));
        this.mediator.subscribe('databaseError', this.processDbResponse.bind(this));
    }
    
    expandViewPrototype() {
        this.view.addListClickHandler = this.addListClickHandler.bind(this);
        this.view.addListSubmitHandler = this.addListSubmitHandler.bind(this);
        this.view.addTodoClickHandler = this.addTodoClickHandler.bind(this);
        this.view.addTodoSubmitHandler = this.addTodoSubmitHandler.bind(this);
        this.view.chooseActiveList = this.chooseActiveList.bind(this);
        this.view.chooseTodo = this.chooseTodo.bind(this);
        this.view.controlsClickHandler = this.controlsClickHandler.bind(this);
    }
    
    getDataFromDB() {
        this.showSpinner();
    
        this.model.getUserNameDB();
        this.model.getAllDB();
    }
    
    getAllHandler([lists, todos]) {
        this.lists = lists;
        this.todos = todos;
        this.activeList = lists[0] && lists[0].id;
        
        this.hideSpinner();
        this.fillOutHeaderDate();
        this.defineTodosAmountForEachList();
        
        this.view.renderLists({lists: this.lists});
        
        if (this.activeList) {
            $(this.CONSTANTS.SELECTORS.LISTS_ITEM)
                .first()
                .addClass(this.CONSTANTS.CLASSES.LISTS_ITEM_ACTIVE);

            this.fillOutHeaderList();
        }
    }
    
    getTodosHandler(todos) {
        this.todos = todos;
        
        this.updateListsData();
    }
    
    getListsHandler(lists) {
        this.lists = lists;
    
        if (!this.activeList) {
            this.activeList = lists[0].id;
        }
    
        this.updateListsData();
    }
    
    updateListsData() {
        this.hideSpinner();
        this.defineTodosAmountForEachList();
    
        this.view.renderLists({lists: this.lists});
    
        $(this.CONSTANTS.SELECTORS.LISTS_LIST)
            .find(`#${this.activeList}`)
            .addClass(this.CONSTANTS.CLASSES.LISTS_ITEM_ACTIVE);
    
        this.fillOutHeaderList();
    }
    
    defineTodosAmountForEachList() {
        this.lists.forEach(item => {
            item.amount = this.todos.filter(todo => todo.list === item.list).length;
        });
    }
    
    fillOutHeaderDate() {
        const dateContainer = $(this.CONSTANTS.SELECTORS.CURRENT_DATE);
        
        const date = String(new Date()).split(' ').slice(0, 4);
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        const currentDay = days.find(day => day.startsWith(date[0]));
        const currentMonth = months.find(month => month.startsWith(date[1]));
        
        dateContainer.html(`${currentDay}, ${date[2]} ${currentMonth} ${date[3]}`);
    }
    
    fillOutHeaderList() {
        const listContainer = $(this.CONSTANTS.SELECTORS.ACTIVE_LIST);
        
        if (this.activeList && this.lists) {
            const activeList = this.lists.find(list => list.id === +this.activeList).list;
            const todosForList = this.todos.filter(todo => todo.list === activeList);
            
            listContainer.html(activeList);
            
            this.view.renderTodos({todos: todosForList});
        }
    }
    
    processUserName(user) {
        if (!user.length) {
            const modal = $(this.CONSTANTS.SELECTORS.MODAL);
            const modalContent = {
                title: this.CONSTANTS.MESSAGES.MODAL_WELCOME,
                message: this.CONSTANTS.MESSAGES.MODAL_REQUEST,
                input: true
            };
            
            this.showModal(modalContent);
    
            modal.on('hidden.bs.modal', () => {
                const name = modal.find(this.CONSTANTS.SELECTORS.MODAL_INPUT).val() || 'Admin';
    
                this.model.setUserNameDB({fullname: name});
        
                modal.off('hidden.bs.modal');
            });
        } else {
            $(this.CONSTANTS.SELECTORS.USER_NAME).text(user[0].fullname);
        }
    }
    
    processDbResponse(response) {
        const {title, message, action, type} = response;
        
        this.hideSpinner();
        
        if (title && message) {
            const modalContent = {
                title,
                message
            };
            
            this.showModal(modalContent);
        }
        
        if (action === 'create') {
            this.clearAndHideForm(type);
        }
    }
    
    addListClickHandler({target}) {
        const parent = $(target).closest(this.CONSTANTS.SELECTORS.ADD_LIST_TOGGLE);
        const addListForm = $(this.CONSTANTS.SELECTORS.ADD_LIST_FORM);
        
        parent.toggleClass(this.CONSTANTS.CLASSES.ADD_LIST_TOGGLE_ACTIVE);
        addListForm.toggleClass(this.CONSTANTS.CLASSES.ADD_LIST_FORM_SHOW);
    }
    
    addListSubmitHandler(e) {
        const value = $(e.target).prev()[0].value;
        const errorContainer = $(e.target).next();
        
        if (value) {
            e.preventDefault();
    
            const validatedList = this.validateData(value, errorContainer, ['minChars']);
    
            if (validatedList) {
                const list = {
                    list: value
                };
    
                this.showSpinner();
                this.model.createListDB(list);
            }
        }
    }
    
    addTodoClickHandler({target}) {
        const parent = $(target).closest(this.CONSTANTS.SELECTORS.ADD_TODO_TOGGLE);
        const newTodoForm = $(this.CONSTANTS.SELECTORS.ADD_TODO_FORM);
        
        parent.toggleClass(this.CONSTANTS.CLASSES.ADD_TODO_TOGGLE_ACTIVE);
        newTodoForm.toggleClass(this.CONSTANTS.CLASSES.ADD_TODO_FORM_SHOW);
    }
    
    addTodoSubmitHandler(e) {
        const form = $(e.target).closest(this.CONSTANTS.SELECTORS.ADD_TODO_FORM);
        
        const titleElement = form.find(this.CONSTANTS.SELECTORS.ADD_TODO_TITLE);
        const title = titleElement[0].value;
        const titleErrorContainer = titleElement.next();

        const list = form.find(this.CONSTANTS.SELECTORS.ADD_TODO_LIST)[0].value;

        const deadlineElement = form.find(this.CONSTANTS.SELECTORS.ADD_TODO_DEADLINE);
        const deadline = deadlineElement[0].value;
        const deadlineErrorContainer = deadlineElement.next();

        if (title && list && deadline) {
            e.preventDefault();
    
            const validatedTitle = this.validateData(title, titleErrorContainer, ['minChars']);
            const validatedDeadline = this.validateData(deadline, deadlineErrorContainer, ['finishedDate']);
    
            if (validatedTitle && list && validatedDeadline) {
                const todo = {
                    performed: false,
                    title,
                    list,
                    deadline
                };
    
                this.showSpinner();
                this.model.createTodoDB(todo);
            }
        }
    }
    
    controlsClickHandler({target}) {
        const modal = $(this.CONSTANTS.SELECTORS.MODAL);
        const todoId = $(target).closest(this.CONSTANTS.SELECTORS.TODO).attr('id');
        const todo = this.todos.find(todo => todo.id === +todoId);
        
        const modalContent = {
            title: this.CONSTANTS.MESSAGES.MODAL_WARNING,
            message: this.CONSTANTS.MESSAGES.MODAL_CONFIRM,
            cancelButton: true
        };
        
        switch (target.id) {
            case 'done':
                this.showModal(modalContent);
    
                modal.on('click.Modal', ({target: {className}}) => {
                    if (className.includes('success')) {
                        todo.performed = true;
            
                        this.showSpinner();
                        this.model.updateTodoDB(todo);
                    }
        
                    modal.off('.Modal');
                });
                
                break;
                
            case 'revert':
                this.showModal(modalContent);
    
                modal.on('click.Modal', ({target: {className}}) => {
                    if (className.includes('success')) {
                        todo.performed = false;
    
                        this.showSpinner();
                        this.model.updateTodoDB(todo);
                    }
                    
                    modal.off('.Modal');
                });

                break;
                
            case 'remove':
                this.showModal(modalContent);
    
                modal.on('click.Modal', ({target: {className}}) => {
                    if (className.includes('success')) {
                        this.showSpinner();
                        this.model.deleteTodoDB(+todoId);
                    }
        
                    modal.off('.Modal');
                });
        }
    
        
    }
    
    chooseTodo({currentTarget}) {
        $(currentTarget)
            .closest(this.CONSTANTS.SELECTORS.TODO)
            .find(this.CONSTANTS.SELECTORS.TODO_CONTROLS)
            .toggleClass(this.CONSTANTS.CLASSES.TODO_CONTROLS_VISIBLE);
    }
    
    validateData(value, error, checks) {
        let result = true;
        
        error.hide();
        
        if (checks.length) {
            checks.forEach((check) => {
                switch (check) {
                    case 'minChars':
                        if (value && value.length < 3) {
                            error.html(this.CONSTANTS.ERRORS.MIN_CHARS);
                            error.show();
                            
                            result = false;
                        }
                        break;
    
                    case 'finishedDate':
                        const [year, month, day] = value.split('-');
                        const currentDate = new Date();

                        if (year < currentDate.getFullYear() || month - 1 < currentDate.getMonth() || day < currentDate.getDate()) {
                            error.html(this.CONSTANTS.ERRORS.FINISHED_DATE);
                            error.show();
            
                            result = false;
                        }
                        break;
                }
            });
        }
        
        return result;
    }
    
    clearAndHideForm(type) {
        switch (type) {
            case 'list':
                $(this.CONSTANTS.SELECTORS.ADD_LIST_FORM).toggleClass(this.CONSTANTS.CLASSES.ADD_LIST_FORM_SHOW).get(0).reset();
                $(this.CONSTANTS.SELECTORS.ADD_LIST_TOGGLE).toggleClass(this.CONSTANTS.CLASSES.ADD_LIST_TOGGLE_ACTIVE);
                
                break;
            case 'todo':
                $(this.CONSTANTS.SELECTORS.ADD_TODO_FORM).toggleClass(this.CONSTANTS.CLASSES.ADD_TODO_FORM_SHOW).get(0).reset();
                $(this.CONSTANTS.SELECTORS.ADD_TODO_TOGGLE).toggleClass(this.CONSTANTS.CLASSES.ADD_TODO_TOGGLE_ACTIVE);
                
                break;
        }
    }
    
    chooseActiveList({currentTarget}) {
        this.activeList = currentTarget.id;
        
        $(this.CONSTANTS.SELECTORS.LISTS_LIST)
            .find(this.CONSTANTS.SELECTORS.LISTS_ITEM_ACTIVE)
            .removeClass(this.CONSTANTS.CLASSES.LISTS_ITEM_ACTIVE);

        $(currentTarget).addClass(this.CONSTANTS.CLASSES.LISTS_ITEM_ACTIVE);
        
        this.fillOutHeaderList();
    }
    
    showSpinner() {
        $(this.CONSTANTS.SELECTORS.SPINNER).removeClass(this.CONSTANTS.CLASSES.SPINNER_HIDE);
    }
    
    hideSpinner() {
        $(this.CONSTANTS.SELECTORS.SPINNER).addClass(this.CONSTANTS.CLASSES.SPINNER_HIDE);
    }
    
    showModal({title, message, cancelButton, input}) {
        const modal = $(this.CONSTANTS.SELECTORS.MODAL);
    
        modal.find(this.CONSTANTS.SELECTORS.MODAL_TITLE).text(title);
        modal.find(this.CONSTANTS.SELECTORS.MODAL_DESCRIPTION).text(message);
        modal.find(this.CONSTANTS.SELECTORS.MODAL_FOOTER).children().last().show();
        modal.find(this.CONSTANTS.SELECTORS.MODAL_INPUT).show();
        
        !cancelButton && modal.find(this.CONSTANTS.SELECTORS.MODAL_FOOTER).children().last().hide();
        !input && modal.find(this.CONSTANTS.SELECTORS.MODAL_INPUT).hide();
        
        modal.modal({show: true});
    }
}

export default Controller;