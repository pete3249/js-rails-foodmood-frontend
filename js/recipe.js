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
                return res.text.then(errors => Promise.reject(errors))
            }
        })
        .then(recipeObjects=> {
            this.recipes = recipeObjects.map(recipeAttributes => new Recipe(recipeAttributes))
            let recipes = this.recipes.map(recipe => recipe.render());
            return this.recipes
        })
        .catch(error => {
            new FlashMessage({type: 'error', message: error});
        })
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add(..."relative border-2".split(" "))
        this.element.id = this.id
        // titleBox
        this.titleBox = document.createElement('div');
        this.titleBox.className = "flex";
    
        this.mainInfo = document.createElement('div');
        this.mainInfo.className = "flex-auto";

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
        this.recipeImage.className = "flex-auto";
        this.image = document.createElement('img');
        this.image.classList.add(..."inline-block inline-center h-32 w-32 pt-4".split(" "));
        this.image.src = this.image_url;
        this.image.alt = this.name;
        this.recipeImage.appendChild(this.image);
        
        this.titleBox.append(this.mainInfo, this.recipeImage);

        // recipeDetails div (2/2)
        this.recipeDetails = document.createElement('div');
        this.recipeDetails.classList.add(..."flex justify-evenly".split(" "));

        this.instructionsContainer = document.createElement('div');
        this.instructionsContainer.classList.add(..."w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-r-none".split(" "));
        this.recipeDetails.appendChild(this.instructionsContainer);

        this.instructionLabel = document.createElement('span');
        this.instructionLabel.classList.add(..."font-semibold pt-4 px-4 text-xl".split(" "))
        this.instructionLabel.innerHTML = "Instructions"

        this.instructionList = document.createElement('ul');
        this.instructionList.classList.add(..."list-disc list-inside p-4".split(" "));
        this.instructionsContainer.append(this.instructionLabel, this.instructionList);

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
      
        this.ingredientList = document.createElement('ul');
        this.ingredientList.classList.add(..."list-disc list-inside p-4".split(" "));
        this.ingredientContainer.append(this.ingredientLabel, this.ingredientList)
        
        for (const ing of this.recipe_ingredients) {
            const li = document.createElement('li')
            li.innerHTML = `${ing.amount} ${ing.name} ${ing.notes}`
            this.ingredientList.appendChild(li)
        }

        // if(this.comments.length > 0) {
        //     this.currentComments = document.createElement("div");
        //     this.currentComments.id = "currentCommentsSection"

        //     this.currentCommentsContainer = document.createElement("div");
        //     this.currentCommentsContainer.id = "comments";
        //     this.currentCommentsContainer.className = "flex-auto"
        //     this.currentComments.appendChild(this.currentCommentsContainer);

        //     this.title = document.createElement('p');
        //     this.title.classList.add(..."font-semibold text-xl p-2 px-8".split(" "));
        //     this.title.innerHTML = "What the others are saying...";
            
        //    this.comments.forEach(comment => {
        //        this.commentDiv = document.createElement("div")
        //        this.commentDiv.dataset.commentId = comment.id
        //        this.commentDiv.id = "comments"

        //        this.commentBody = document.createElement("span")
        //        this.commentBody.className = "italic"
        //        this.commentBody.innerHTML = `${comment.name} said: ${comment.review} on ${comment.date}`
        //        this.commentDiv.appendChild(this.commentBody);
        //        let mainContainer = document.querySelector("#comments");
        //        mainContainer.appendChild(this.commentDiv);
        //    })

        //    this.currentCommentsContainer.append(this.title, this.commentDiv);
        //    return this.currentComments;
        // }
        
        this.button = document.createElement("button")
        this.button.innerHTML = "Leave comment"
        this.button.classList.add(..."absolute bottom-0 right-0 m-2 bg-blue-300 hover:bg-blue-400 text-black font-bold py-2 px-4 rounded".split(" "))
        this.button.id = "newComment"

        this.element.append(this.titleBox, this.recipeDetails, this.button)
        Recipe.container().append(this.element)
    }


/* <div id="currentCommentsSection">
    <div id="comments"class="flex-auto">
        <p class="font-semibold text-xl p-2 px-8">What the others are saying...</p>
        <div class="text-lg p-2 px-8">
            <span class="italic">Katelyn said: </span>
            <span>I loved this recipe!</span>
        </div>
    </div>
</div> */












    static toggleButton() {
        let button = document.querySelector("#recipePref")
        button.innerText === "Make it good!"? document.querySelector("#recipePref").innerText = "Reset" : document.querySelector("#recipePref").innerText = "Make it good!"
    }

    static reset() {
        this.container.innerHTML = "";
        document.getElementById("days").value = "1";
        document.getElementsByName("mood").forEach(element => {
            element.checked = false;
        })
        Recipe.toggleButton();
    }

    static findById(id) {
        return this.recipes.find(recipe => recipe.id == id)
    }

    add_new_comment() {
        this.commentContainer = document.createElement("div");
        this.commentContainer.className = "flex";
    
        this.newCommentSection = document.createElement("div");
        this.newCommentSection.id = "newCommentSection";
        this.newCommentSection.className = "flex-auto";
    
        this.title = document.createElement('p');
        this.title.classList.add(..."font-semibold text-xl p-2 px-8".split(" "));
        this.title.innerHTML = "Leave a comment";
    
        this.form = document.createElement("form");
        this.form.className = "mx-8";
        this.form.id = "newCommentForm";
        this.form.dataset.recipeId = this.id
    
        let label = document.createElement("label");
        label.setAttribute("for", "name");
        label.classList.add(..."mb-2 text-lg".split(" "));
        label.innerHTML = "First name: ";
    
        let name = document.createElement("input");
        name.setAttribute("type", "text");
        name.classList.add(..."mb-2 border-gray-500 border rounded-md bloco".split(" "));
        name.id = "name";
    
        let textbox = document.createElement("textarea");
        textbox.classList.add(..."mb-2 border-2 border-gray-500 resize-y border w-11/12 lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none block".split(" "));
        textbox.rows = "2";
        textbox.cols = "30";
        textbox.placeholder = "Tell us your thoughts...";
    
        let button = document.createElement("BUTTON");
        button.innerHTML = "Submit";
        button.classList.add(..."object-none object-right-bottom bg-blue-300 hover:bg-blue-400 text-black font-bold py-2 px-4 rounded".split(" "));
        button.id = "comment";
    
        this.form.append(label, name, textbox, button);
        this.newCommentSection.append(this.title, this.form);
        this.commentContainer.appendChild(this.newCommentSection);
        this.element.appendChild(this.commentContainer);
    }
}