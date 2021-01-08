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
                moodInput.push(node["id"])
            }
        })
        if (moodInput === undefined || moodInput.length == 0) {
            moodInput = null
        }
        Recipe.create(dayInput, moodInput)
    }

    static create(days, mood) {
        
    }
}