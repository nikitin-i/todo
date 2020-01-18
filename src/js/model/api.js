import { openDB } from 'idb';

class DataBaseApi {
    constructor(){
        this.db = null;

        this.dbName = 'todoApp';
        this.dbListsSet = 'lists';
        this.dbTodosSet = 'todos';
        this.dbProfileSet = 'profile';
        this.dbVersion = 1;
        
        this.CONSTANTS = {
            ERRORS: {
                DB_OPEN: 'Database Opening Error',
                DB_GET_USER: 'Database Getting User Error',
                DB_SET_USER: 'Database Setting User Error',
                DB_GET_TODOS: 'Database Getting Todos Error',
                DB_GET_TODO: 'Database Getting One Todo Error',
                DB_CREATE_TODO: 'Database Creating Todo Error',
                DB_UPDATE_TODO: 'Database Updating Todo Error',
                DB_DELETE_TODO: 'Database Deleting Todo Error',
                
                DB_GET_LISTS: 'Database Getting Lists Error',
                DB_CREATE_LIST: 'Database Creating List Error',
                DB_DELETE_LIST: 'Database Deleting List Error',
                
                NO_DB: 'Database hasn\'t been still launched. Try again!'
            },
            STATE: {
                READ: 'readonly',
                WRITE: 'readwrite'
            }
        };
    }

    async dbConnect() {
        try {
            const dbProfileSet = this.dbProfileSet;
            const dbTodosSet = this.dbTodosSet;
            const dbListsSet = this.dbListsSet;
            
            this.db = await openDB(this.dbName, this.dbVersion, {
                upgrade(db) {
                    db.createObjectStore(dbProfileSet, {keyPath: 'id', autoIncrement: true});
                    db.createObjectStore(dbTodosSet, {keyPath: 'id', autoIncrement: true});
                    db.createObjectStore(dbListsSet, {keyPath: 'id', autoIncrement: true});
                }
            });
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_OPEN);
        }
    }
    
    async getUserName() {
        const [tx, store] = this.createTransaction(this.dbProfileSet, this.CONSTANTS.STATE.READ);
        
        try {
            return await store.getAll();
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_GET_USER);
        } finally {
            await tx.done;
        }
    }
    
    async setUserName(user) {
        const [tx, store] = this.createTransaction(this.dbProfileSet, this.CONSTANTS.STATE.WRITE);
        
        try {
            return await store.add(user);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_SET_USER);
        } finally {
            await tx.done;
        }
    }

    async getAllTodos() {
        const [tx, store] = this.createTransaction(this.dbTodosSet, this.CONSTANTS.STATE.READ);
        
        try {
            return await store.getAll();
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_GET_TODOS);
        } finally {
            await tx.done;
        }
    }
    
    async getAllLists() {
        const [tx, store] = this.createTransaction(this.dbListsSet, this.CONSTANTS.STATE.READ);
        
        try {
            return await store.getAll();
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_GET_LISTS);
        } finally {
            await tx.done;
        }
    }

    async getTodo(id) {
        const [tx, store] = this.createTransaction(this.dbTodosSet, this.CONSTANTS.STATE.READ);
        
        try {
            return await store.get(id);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_GET_TODO);
        } finally {
            await tx.done;
        }
    }
    
    async createTodo(todo) {
        const [tx, store] = this.createTransaction(this.dbTodosSet, this.CONSTANTS.STATE.WRITE);
        
        try {
            return await store.add(todo);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_CREATE_TODO);
        } finally {
            await tx.done;
        }
    }
    
    async updateTodo(todo) {
        const [tx, store] = this.createTransaction(this.dbTodosSet, this.CONSTANTS.STATE.WRITE);
        
        try {
            return await store.put(todo);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_UPDATE_TODO);
        } finally {
            await tx.done;
        }
    }

    async deleteTodo(id) {
        const [tx, store] = this.createTransaction(this.dbTodosSet, this.CONSTANTS.STATE.WRITE);
        
        try {
            return await store.delete(id);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_DELETE_TODO);
        } finally {
            await tx.done;
        }
    }
    
    async createList(note) {
        const [tx, store, ...rest] = this.createTransaction(this.dbListsSet, this.CONSTANTS.STATE.WRITE);

        try {
            return await store.add(note);
        } catch(e) {
            throw new Error(this.CONSTANTS.ERRORS.DB_CREATE_LIST);
        } finally {
            await tx.done;
        }
    }
    
    createTransaction(set, mode) {
        if(!this.db) {
            throw new Error(this.CONSTANTS.ERRORS.NO_DB);
        }
    
        const tx = this.db.transaction(set, mode);
        const store = tx.objectStore(set);
        
        return [tx, store];
    }
}

export default DataBaseApi;