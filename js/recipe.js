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

    static reset_search_value() {
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

        let mainInfo = document.createElement('div')
        mainInfo.className = "flex-1"

        let recipeName = document.createElement('p')
        recipeName.classList.add(..."font-bold text-xl pt-4 mx-8".split(" "))
        recipeName.textContent = this.name

        let recipeAuthor = document.createElement('p')
        recipeAuthor.classList.add(..."italic text-lg pt-1 mx-8 text-sm".split(" "))
        recipeAuthor.textContent = `By: ${this.author}`

        let recipeDescription = document.createElement('p')
        recipeDescription.classList.add(..."text-lg pb-2 pt-1 mx-8 text-sm".split(" "))
        recipeDescription.textContent = this.description

        mainInfo.append(recipeName, recipeAuthor, recipeDescription);
        this.titleBox.appendChild(mainInfo)
    }

    renderImage() {
        let recipeImage = document.createElement('div')
        recipeImage.className = "flex h-40"
        let image = document.createElement('img')
        image.className = "h-full"
        image.src = this.image_url
        image.alt = this.name
        recipeImage.appendChild(image)
        this.titleBox.appendChild(recipeImage)
    }

    renderInstructions() {
        this.recipeDetails = document.createElement('div')
        this.recipeDetails.classList.add(..."flex justify-evenly".split(" "))

        let instructionsContainer = document.createElement('div')
        instructionsContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "))
        this.recipeDetails.appendChild(instructionsContainer)

        let instructionLabel = document.createElement('span')
        instructionLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        instructionLabel.textContent = "Instructions"

        let instructionList = document.createElement('ul')
        instructionList.classList.add(..."list-disc list-inside p-4".split(" "))
        instructionsContainer.append(instructionLabel, instructionList)

        for (const element of this.instructions) {
            const li = document.createElement('li')
            li.textContent = `${element}`
            instructionList.appendChild(li)
        }
    }

    renderIngredients() {
        let ingredientContainer = document.createElement('div')
        ingredientContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "))
        this.recipeDetails.appendChild(ingredientContainer)

        let ingredientLabel = document.createElement('span')
        ingredientLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        ingredientLabel.textContent = "Ingredients"
      
        let ingredientList = document.createElement('ul')
        ingredientList.classList.add(..."list-disc list-inside p-4".split(" "))
        ingredientContainer.append(ingredientLabel, ingredientList)
        
        for (const ing of this.recipe_ingredients) {
            const li = document.createElement('li')
            li.textContent = `${ing.amount} ${ing.name} ${ing.notes}`
            ingredientList.appendChild(li)
        }
    }

    renderComments() {
        this.currentComments = document.createElement("div")
        this.currentComments.id = "currentCommentsSection"
    
        let cContainer = document.createElement("div")
        cContainer.id = "comments"
        cContainer.dataset.recipeId = this.id
        cContainer.classList.add(..."flex-auto pb-4".split(" "))
        this.currentComments.appendChild(cContainer)

        let cHeader = document.createElement('p')
        cHeader.classList.add(..."font-semibold text-xl p-2 px-8".split(" "))
        cHeader.textContent = "What the others are saying..."
        cContainer.appendChild(cHeader)

        if(this.comments === null) {
            this.comments = []
            cContainer.append(this.comments)
            return this.comments
        } else {
            this.comments = this.comments.map(comment => new Comment(comment))
            let comments = this.comments.map(comment => comment.add_comment())
            cContainer.append(...comments)
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



