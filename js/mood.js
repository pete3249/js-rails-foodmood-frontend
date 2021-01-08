class Mood {
    constructor(attributes) {
        let whitelist = ["id", "name"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    // add catch later with FlashMessage
    static all() {
        return fetch("http://localhost:3000/moods", {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
        })
            .then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    return res.text().then(error => Promise.reject(error))
                }
            })
            .then(moodObjects => {
                this.moods = moodObjects.map(moodAttributes => new Mood(moodAttributes))
                let moods = this.moods.map(mood => mood.render())
                return this.moods
            })
    }

    render() {
        this.cont = document.querySelector("#moodSelection")
        let br = document.createElement("br")

        this.checkbox ||= document.createElement("INPUT");
        this.checkbox.setAttribute("type", "checkbox")
        this.checkbox.value = this.id
        this.checkbox.id = this.name
        this.checkbox.name = "mood"

        this.label ||= document.createElement("LABEL");
        this.label.setAttribute("for",`${this.name}`)
        this.label.innerHTML = this.name
        this.label.classList.add(..."text-lg font-light".split(" "))

        return this.cont.append(br, this.checkbox, this.label)
    }
}