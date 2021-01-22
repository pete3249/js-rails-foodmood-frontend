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
                let moods = this.moods.map(mood => mood.render())
                return this.moods;
            })
    }

    render() {
        let div = document.createElement("div")

        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.value = this.id;
        checkbox.id = this.name;
        checkbox.name = "mood";

        let label = document.createElement("label");
        label.setAttribute("for",`${this.name}`);
        label.textContent = this.name;
        label.classList.add(..."text-lg font-light".split(" "));
        div.append(checkbox, " ", label)

        return Mood.container().appendChild(div)
    }
}