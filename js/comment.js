class Comment {
    constructor(attributes) {
        let whitelist= ["id", "name", "review", "recipe_id", "created_at"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

    static create(formData) {
        return fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            } else {
                return res.text().then(error => Promise.reject(error));
            }
        })
        .then(commentObject => {
            let comment = new Comment(commentObject)
            let recipe = Recipe.findById(comment.recipe_id)
            recipe.comments.push(comment)
            recipe.cContainer.appendChild(comment.add_comment())
        })
        .catch(error => {
            new FlashMessage({type: 'error', message: error})
        })
    }

    add_comment() {
        this.commentDiv = document.createElement("div")
        this.commentDiv.id = this.id
        this.commentDiv.dataset.recipe_id = this.recipe_id

        this.commentBody = document.createElement("p")
        this.commentBody.classList.add(..."p-2 px-8 italic".split(" "))
        this.commentBody.textContent = `${this.name} said: ${this.review} (${this.created_at})`

        this.commentDiv.append(this.commentBody)
        return this.commentDiv
    }

}