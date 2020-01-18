import DataBaseApi from './api.js';

class Model {
    constructor() {
        this.api = new DataBaseApi();
        
        this.CONSTANTS = {
            MESSAGES: {
                SUCCESS: {
                    TITLE: 'DataBase Success!',
                    CREATE_LIST: 'This list has been successfully created',
                    CREATE_TODO: 'This todo has been successfully created',
                    DELETE_LIST: 'This list has been just deleted',
                    DELETE_TODO: 'This todo has been just deleted',
                    UPDATE_TODO: 'This todo has been just updated'
                },
                ERROR: {
                    TITLE: 'DataBase Error!'
                },
            },
            ACTIONS: {
                CREATE: 'create',
                DELETE: 'delete',
                UPDATE: 'update'
            }
        };
    }
    
    async init() {
        try {
            await this.api.dbConnect();
    
            this.mediator.publish('databaseOpened', {});
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async getAllDB() {
        try {
            let lists = await this.api.getAllLists();
            let todos = await this.api.getAllTodos();
            
            this.createServerDelay('allData', [lists, todos], 1000);
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async getUserNameDB() {
        try {
            let user = await this.api.getUserName();
            
            this.mediator.publish('userName', user);
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async setUserNameDB(user) {
        try {
            let id = await this.api.setUserName(user);
            
            this.mediator.publish('userNameChanged', id);
            this.getUserNameDB();
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async getAllTodosDB() {
        try {
            let todos = await this.api.getAllTodos();
            
            this.createServerDelay('allTodos', todos, 1000);
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async getAllListsDB() {
        try {
            let lists = await this.api.getAllLists();
            
            this.createServerDelay('allLists', lists, 1000);
        } catch(e) {
            this.errorsHandler(e);
        }
    }

    async createTodoDB(todo) {
        try {
            let response = {
                id: await this.api.createTodo(todo),
                title: this.CONSTANTS.MESSAGES.SUCCESS.TITLE,
                message: this.CONSTANTS.MESSAGES.SUCCESS.CREATE_TODO,
                type: 'todo',
                action: this.CONSTANTS.ACTIONS.CREATE
            };
    
            this.createServerDelay('databaseSuccess', response, 1000);
            this.getAllTodosDB();
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async createListDB(list) {
        try {
            let response = {
                id: await this.api.createList(list),
                title: this.CONSTANTS.MESSAGES.SUCCESS.TITLE,
                message: this.CONSTANTS.MESSAGES.SUCCESS.CREATE_LIST,
                type: 'list',
                action: this.CONSTANTS.ACTIONS.CREATE
            };
            
            this.createServerDelay('databaseSuccess', response, 1000);
            this.getAllListsDB();
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async updateTodoDB(todo) {
        try {
            let response = {
                id: await this.api.updateTodo(todo),
                title: this.CONSTANTS.MESSAGES.SUCCESS.TITLE,
                message: this.CONSTANTS.MESSAGES.SUCCESS.UPDATE_TODO,
                action: this.CONSTANTS.ACTIONS.UPDATE
            };
    
            this.createServerDelay('databaseSuccess', response, 1000);
            this.getAllTodosDB();
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    async deleteTodoDB(id) {
        try {
            let response = {
                id: await this.api.deleteTodo(id),
                title: this.CONSTANTS.MESSAGES.SUCCESS.TITLE,
                message: this.CONSTANTS.MESSAGES.SUCCESS.DELETE_TODO,
                action: this.CONSTANTS.ACTIONS.DELETE
            };
    
            this.createServerDelay('databaseSuccess', response, 1000);
            this.getAllTodosDB();
        } catch(e) {
            this.errorsHandler(e);
        }
    }
    
    errorsHandler(e) {
        let response = {
            title: this.CONSTANTS.MESSAGES.ERROR.TITLE,
            message: e.message,
            action: null
        };
    
        this.mediator.publish('databaseError', response);
    }
    
    // imitation of delay for requests to server
    createServerDelay(event, response, delay) {
        let timer = setTimeout(() => {
            this.mediator.publish(event, response);
        
            timer = null;
        }, delay);
    }
}

export default Model;