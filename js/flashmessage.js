class FlashMessage {
    constructor({message, type}) {
        this.message = message;
        this.type = type;
        this.render();
    }

    container() {
        return this.c ||= document.querySelector("#flash")
    }

    render() {
        this.container().textContent = this.message;
        this.toggleDisplay();
        setTimeout(() => this.toggleDisplay(), 3000)
    }

    toggleDisplay() {
        this.container().classList.toggle("opacity-0")
        this.container().classList.toggle(this.type =='error'? 'bg-red-300' : 'bg-blue-300')
    }
}

