class Recipe {
    constructor(attributes) {
        let whitelist = ["id", "name", "author", "description", "instructions", "image_url", "recipe_ingredients"]
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
        return fetch(`http://localhost:3000/recipes?days=${days}&moods=${mood}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.text.then(errors => Promise.reject(errors))
            }
        })
        .then(recipeObjects=> {
            this.recipes = recipeObjects.map(recipeAttributes => new Recipe(recipeAttributes))
            let recipes = this.recipes.map(recipe => recipe.render())
            return this.recipes
        })
    }

    render() {
        let container = document.querySelector("#recipeCardsContainer");

        this.element = document.createElement('div');
        this.element.classList.add("border-2")
        this.element.id = this.id;

        this.allRecipeInfo = document.createElement('div');
        this.allRecipeInfo.classList.add("flex");

        this.mainInfo = document.createElement('div');
        this.mainInfo.classList.add("flex-auto")
        
        this.recipeName = document.createElement('p');
        this.recipeName.classList.add(..."font-bold text-xl pt-4 mx-8".split(" "));
        this.recipeName.innerHTML = this.name;

        this.recipeAuthor = document.createElement('p');
        this.recipeAuthor.classList.add(..."italic text-lg pt-1 mx-8 text-sm".split(" "));
        this.recipeAuthor.innerHTML = this.author;

        this.recipeDescription = document.createElement('p');
        this.recipeDescription.classList.add(..."text-lg pb-2 pt-1 mx-8 text-sm".split(" "));
        this.recipeDescription.innerHTML = this.description;

        this.mainInfo.append(this.recipeName, this.recipeAuthor, this.recipeDescription);

        this.recipeImage = document.createElement('div');
        this.recipeImage.classList.add("flex-auto")

        this.image = document.createElement('img');
        this.image.classList.add(..."inline-block inline-center h-32 w-32 pt-4".split(" "))
        this.image.src = this.image_url
        this.image.alt = this.name

        this.recipeImage.appendChild(this.image)
        this.allRecipeInfo.append(this.mainInfo, this.recipeImage)
        this.element.append(this.allRecipeInfo)
        container.append(this.element)
    }
}