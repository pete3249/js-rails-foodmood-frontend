document.addEventListener("DOMContentLoaded", (e) => {
    Mood.all()
});

document.addEventListener("submit", (e) => {
    let target = e.target

    if(target.matches("#prefForm")) {
        e.preventDefault()
        if(target.querySelector("button").innerText === "Make it good") {
            Recipe.filter()
            Recipe.toggleButton()
        } else {
            Recipe.reset()
            Recipe.toggleRecipeTitle()
        } 
    } else if(target.matches("#searchForm")) {
        e.preventDefault()
        let input = `${target.querySelector("input").value}`
        Recipe.search(input)
        Recipe.reset_search_value()
    } 
})

document.addEventListener("click", (e) => {
    let target = e.target;
    if(target.matches("#newComment")) {
        let recipe = Recipe.findById(target.parentElement.id)
        recipe.addNewComment()
        target.remove()
    } else if(target.matches("#comment")) {
        e.preventDefault()
        let formData = {
            name: target.parentElement.querySelector("input").value,
            review: target.parentElement.querySelector("textarea").value,
            recipe_id: target.dataset.recipeId
        }
        Comment.create({comment: formData})    
    } else if(target.matches("#cancel")) {
        let recipe = Recipe.findById(target.dataset.recipeId)
        recipe.commentContainer.remove()
        target.remove()
        recipe.element.append(recipe.renderCommentButton())
    }
})
