class Mood {
    constructor(attributes) {
        let whitelist = ["id", "name"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static container() {
        return this.c ||= document.querySelector("#moodSelection")
    }

    static all() {
        return fetch("http://localhost:3000/moods")
            .then(res => res.json())
            .then(moodObjects => {
                this.moods = moodObjects.map(moodAttributes => new Mood(moodAttributes))
                let moods = this.moods.map(mood => mood.render());
                return this.moods;
            })
    }

    render() {
        let b = document.createElement("br");

        this.checkbox ||= document.createElement("input");
        this.checkbox.setAttribute("type", "checkbox");
        this.checkbox.value = this.id;
        this.checkbox.id = this.name;
        this.checkbox.name = "mood";

        this.label ||= document.createElement("label");
        this.label.setAttribute("for",`${this.name}`);
        this.label.textContent = this.name;
        this.label.classList.add(..."text-lg font-light".split(" "));

        return Mood.container().append(b, this.checkbox, this.label);
    }
}