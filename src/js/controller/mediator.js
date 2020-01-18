class Mediator {
    constructor() {
        this.events = {};
    }

    subscribe(event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push({ context: this, callback: fn });
        return this;
    }

    publish(event) {
        if (!this.events[event]) {
            return false;
        }

        const args = Array.prototype.slice.call(arguments, 1);

        for (let i = 0; i < this.events[event].length; i++) {
            const subscription = this.events[event][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    }
}

export default Mediator;