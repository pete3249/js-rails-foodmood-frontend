class Recipe {
    constructor(attributes) {
        let whitelist = ["id", "name", "author", "description", "instructions"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static filter() {
        let dayInput = document.getElementById("days").value
        let moodInput = []
        document.getElementsByName("mood").forEach(node => {
            if(node.checked) {
                moodInput.push(node["value"])
            }
        })
        if (moodInput === undefined || moodInput.length == 0) {
            moodInput = null
        }
        Recipe.load(dayInput, moodInput)
    }

    static load(days, mood) {
        return fetch(`http://localhost:3000/recipes?days=${days}&mood=${mood}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })  
    }
}