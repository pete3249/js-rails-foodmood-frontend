class Recipe {
    constructor(attributes) {
        let whitelist = ["id", "name", "author", "description", "instructions", "image_url", "recipe_ingredients"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static toggleButton() {
        let button = document.querySelector("#recipePref")
        if(button.innerText === "Make it good!") {
            document.querySelector("#recipePref").innerText = "Reset"
        } else {
            document.querySelector("#recipePref").innerText = "Make it good!"
        }
    }

    static reset() {
        let container = document.querySelector("#recipeCardsContainer");
        container.innerHTML = "";
        document.getElementById("days").value = "1";
        document.getElementsByName("mood").forEach(element => {
            element.checked = false;
        })
        Recipe.toggleButton();
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
            let recipes = this.recipes.map(recipe => recipe.render());
            return this.recipes
        })
    }

    render() {
        let container = document.querySelector("#recipeCardsContainer");

        //card for this recipe
        this.element = document.createElement('div');
        this.element.classList.add("border-2")
        this.element.id = this.id;
        
        // titleBox (1/2)
        this.titleBox = document.createElement('div');
        this.titleBox.classList.add("flex");
    
        this.mainInfo = document.createElement('div');
        this.mainInfo.classList.add("flex-auto")
        this.recipeName = document.createElement('p');
        this.recipeName.classList.add(..."font-bold text-xl pt-4 mx-8".split(" "));
        this.recipeName.innerHTML = this.name;
        this.recipeAuthor = document.createElement('p');
        this.recipeAuthor.classList.add(..."italic text-lg pt-1 mx-8 text-sm".split(" "));
        this.recipeAuthor.innerHTML = `By: ${this.author}`;
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
        
        this.titleBox.append(this.mainInfo, this.recipeImage)

        // recipeDetails div (2/2)
        this.recipeDetails = document.createElement('div');
        this.recipeDetails.classList.add(..."flex justify-evenly".split(" "))

        this.instructionsContainer = document.createElement('div');
        this.instructionsContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "));
        this.recipeDetails.appendChild(this.instructionsContainer);

        this.instructionLabel = document.createElement('span');
        this.instructionLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        this.instructionLabel.innerHTML = "Instructions"
        this.instructionsContainer.appendChild(this.instructionLabel)

        this.instructionList = document.createElement('ul');
        this.instructionList.classList.add(..."list-disc list-inside p-4".split(" "));
        this.instructionsContainer.appendChild(this.instructionList);

        for (const element of this.instructions) {
            const li = document.createElement('li')
            li.innerHTML = `${element}`
            this.instructionList.appendChild(li)
        }

        this.ingredientContainer = document.createElement('div');
        this.ingredientContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "));
        this.recipeDetails.appendChild(this.ingredientContainer);

        this.ingredientLabel = document.createElement('span');
        this.ingredientLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        this.ingredientLabel.innerHTML = "Ingredients"
        this.ingredientContainer.appendChild(this.ingredientLabel);
      
        this.ingredientList = document.createElement('ul');
        this.ingredientList.classList.add(..."list-disc list-inside p-4".split(" "));
        this.ingredientContainer.appendChild(this.ingredientList)
        
        for (const ing of this.recipe_ingredients) {
            const li = document.createElement('li')
            li.innerHTML = `${ing.amount} ${ing.name} ${ing.notes}`
            this.ingredientList.appendChild(li)
        }

        this.element.append(this.titleBox, this.recipeDetails)
        container.append(this.element)
    }
}
