class Recipe {
    constructor(attributes) {
        let whitelist = ["id", "name", "author", "description", "instructions", "image_url", "recipe_ingredients", "comments"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static container() {
        return this.c ||= document.querySelector("#recipeCardsContainer")
    }

    static filter() {
        let days = document.getElementById("days").value
        let moods = []
        document.getElementsByName("mood").forEach(node => {
            if(node.checked) {
                moods.push(node["value"])
            }
        })
        if(moods === undefined || moods.length == 0) {
            moods = null
        }
        Recipe.load(days, moods)
    }

    static load(days, moods) {
        return fetch(`http://localhost:3000/recipes?days=${days}&moods=${moods}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.text().then(errors => Promise.reject(errors))
            }
        })
        .then(recipeObjects=> {
            this.recipes = recipeObjects.map(recipeAttributes => new Recipe(recipeAttributes))
            let recipes = this.recipes.map(recipe => recipe.render())
            Recipe.toggleRecipeTitle()
            return this.recipes
        })
        .catch(error => {
            new FlashMessage({type: 'error', message: error})
            Recipe.reset()
        })
    }

    static toggleRecipeTitle() {
        document.querySelector("#yourRecipes").classList.toggle("invisible")
    }

    static reset() {
        this.container().textContent = ""
        document.getElementById("days").value = "1"
        document.getElementsByName("mood").forEach(element => {
            element.checked = false
        })
        Recipe.toggleButton()
    }

    static toggleButton() {
        let button = document.querySelector("#recipePref")
        button.innerText === "Make it good"? document.querySelector("#recipePref").textContent = "Reset" : document.querySelector("#recipePref").textContent = "Make it good"
    }

    static search(input) {
        return fetch(`http://localhost:3000/recipes?search=${input}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.text().then(errors => Promise.reject(errors))
            }
        })
        .then(recipeObjects=> {
            this.recipes = recipeObjects.map(recipeAttributes => new Recipe(recipeAttributes))
            Recipe.toggleRecipeTitle()
            Recipe.toggleButton()
            let recipes = this.recipes.map(recipe => recipe.render())
            return this.recipes
        })
        .catch(error => {
            new FlashMessage({type: 'error', message: error})
        })
    }

    static clear_search_value() {
        document.querySelector("#searchForm").querySelector("#input").value = " "
    }

    static findById(id) {
        return this.recipes.find(recipe => recipe.id == id)
    }

    render() {
        this.element = document.createElement('div')
        this.element.classList.add(..."relative border-4 border-gray-300".split(" "))
        this.element.id = this.id
    
        this.renderMainInfo()
        this.renderImage()
        this.renderInstructions()
        this.renderIngredients()
        this.renderComments()
        this.renderCommentButton()
    
        this.element.append(this.titleBox, this.recipeDetails, this.currentComments, this.button)
        Recipe.container().append(this.element)
        return this.element
    }

    renderMainInfo() {
        this.titleBox = document.createElement('div')
        this.titleBox.className = "flex"

        this.mainInfo = document.createElement('div')
        this.mainInfo.className = "flex-1"

        this.recipeName = document.createElement('p')
        this.recipeName.classList.add(..."font-bold text-xl pt-4 mx-8".split(" "))
        this.recipeName.textContent = this.name

        this.recipeAuthor = document.createElement('p')
        this.recipeAuthor.classList.add(..."italic text-lg pt-1 mx-8 text-sm".split(" "))
        this.recipeAuthor.textContent = `By: ${this.author}`

        this.recipeDescription = document.createElement('p')
        this.recipeDescription.classList.add(..."text-lg pb-2 pt-1 mx-8 text-sm".split(" "))
        this.recipeDescription.textContent = this.description

        this.mainInfo.append(this.recipeName, this.recipeAuthor, this.recipeDescription);
        this.titleBox.appendChild(this.mainInfo)
    }

    renderImage() {
        this.recipeImage = document.createElement('div')
        this.recipeImage.className = "flex h-40"
        this.image = document.createElement('img')
        this.image.className = "h-full"
        this.image.src = this.image_url
        this.image.alt = this.name
        this.recipeImage.appendChild(this.image)
        this.titleBox.appendChild(this.recipeImage)
    }

    renderInstructions() {
        this.recipeDetails = document.createElement('div')
        this.recipeDetails.classList.add(..."flex justify-evenly".split(" "))

        this.instructionsContainer = document.createElement('div')
        this.instructionsContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "))
        this.recipeDetails.appendChild(this.instructionsContainer)

        this.instructionLabel = document.createElement('span')
        this.instructionLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        this.instructionLabel.textContent = "Instructions"

        this.instructionList = document.createElement('ul')
        this.instructionList.classList.add(..."list-disc list-inside p-4".split(" "))
        this.instructionsContainer.append(this.instructionLabel, this.instructionList)

        for (const element of this.instructions) {
            const li = document.createElement('li')
            li.textContent = `${element}`
            this.instructionList.appendChild(li)
        }
    }

    renderIngredients() {
        this.ingredientContainer = document.createElement('div')
        this.ingredientContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "))
        this.recipeDetails.appendChild(this.ingredientContainer)

        this.ingredientLabel = document.createElement('span')
        this.ingredientLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        this.ingredientLabel.textContent = "Ingredients"
      
        this.ingredientList = document.createElement('ul')
        this.ingredientList.classList.add(..."list-disc list-inside p-4".split(" "))
        this.ingredientContainer.append(this.ingredientLabel, this.ingredientList)
        
        for (const ing of this.recipe_ingredients) {
            const li = document.createElement('li')
            li.textContent = `${ing.amount} ${ing.name} ${ing.notes}`
            this.ingredientList.appendChild(li)
        }
    }

    renderComments() {
        this.currentComments = document.createElement("div")
        this.currentComments.id = "currentCommentsSection"
    
        this.cContainer = document.createElement("div")
        this.cContainer.id = "comments"
        this.cContainer.dataset.recipeId = this.id
        this.cContainer.classList.add(..."flex-auto pb-4".split(" "))
        this.currentComments.appendChild(this.cContainer)

        this.cHeader = document.createElement('p')
        this.cHeader.classList.add(..."font-semibold text-xl p-2 px-8".split(" "))
        this.cHeader.textContent = "What the others are saying..."
        this.cContainer.appendChild(this.cHeader)

        if(this.comments === null) {
            this.comments = []
            this.cContainer.append(this.comments)
            return this.comments
        } else {
            this.comments = this.comments.map(comment => new Comment(comment))
            let comments = this.comments.map(comment => comment.add_comment())
            this.cContainer.append(...comments)
        }
    }

    renderCommentButton() {
        this.button = document.createElement("button")
        this.button.textContent = "Leave comment"
        this.button.classList.add(..."absolute bottom-0 right-0 m-2 rounded-lg border bg-blue-300 hover:bg-blue-400 font-bold py-2 px-4 rounded block".split(" "))
        this.button.id = "newComment"
        return this.button
    }

    addNewComment() {
        this.commentContainer = document.createElement("div")
        this.commentContainer.className = "flex"
    
        this.newCommentSection = document.createElement("div")
        this.newCommentSection.id = "newCommentSection"
        this.newCommentSection.className = "flex-auto"
        
        this.addCommentForm()

        this.newCommentSection.append(this.form)
        this.commentContainer.appendChild(this.newCommentSection)
        this.element.appendChild(this.commentContainer)
    }

    addCommentForm() {
        this.form = document.createElement("form")
        this.form.className = "mx-8"
        this.form.id = "newCommentForm"
        this.form.dataset.recipeId = this.id

        this.title = document.createElement('p')
        this.title.classList.add(..."font-semibold text-xl pb-2".split(" "))
        this.title.textContent = "Leave a comment"
    
        let label = document.createElement("label")
        label.setAttribute("for", "name")
        label.classList.add(..."mb-2 text-lg".split(" "))
        label.textContent = "First name: "
    
        let name = document.createElement("input")
        name.setAttribute("type", "text")
        name.classList.add(..."mb-2 border-gray-500 border rounded-lg lg:rounded-l-none bloco".split(" "))
        name.id = "name"
    
        let textbox = document.createElement("textarea")
        textbox.classList.add(..."mb-2 border-2 border-gray-500 resize-y w-9/12 border bg-white p-5 rounded-lg lg:rounded-l-none block".split(" "))
        textbox.rows = "2"
        textbox.cols = "30"
        textbox.placeholder = "Tell us your thoughts..."
    
        let button = document.createElement("button")
        button.textContent = "Submit"
        button.dataset.recipeId = this.id
        button.classList.add(..."object-right-bottom bg-blue-300 hover:bg-green-300 font-bold py-2 px-4 rounded".split(" "))
        button.id = "comment"
    
        let cancelButton = document.createElement("button")
        cancelButton.textContent = "Cancel"
        cancelButton.classList.add(..."float-right bg-blue-300 hover:bg-red-300 font-bold py-2 px-4 rounded".split(" "))
        cancelButton.id = "cancel"
        cancelButton.dataset.recipeId = this.id

        this.form.append(this.title, label, name, textbox, button, cancelButton)
        return this.form
    }
    
}



