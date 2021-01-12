document.addEventListener("DOMContentLoaded", (e) => {
    Mood.all();
});

document.addEventListener("submit", (e) => {
    let target = e.target;
    if(target.matches("#prefForm")) {
        e.preventDefault();
        if(target.querySelector("button").textContent === "Make it good!") {
            Recipe.filter();
            Recipe.toggleButton();
        } else {
            Recipe.reset();
        } 
    } else if(target.matches("#newCommentForm")) {
        e.preventDefault();
        let formData = {
            name: target.querySelector("input").value,
            review: target.querySelector("textarea").value,
            recipe_id: target.dataset.recipeId
        }
        Comment.create({comment: formData})
    } 
})

document.addEventListener("click", (e) => {
    let target = e.target;

    if(target.matches("#newComment")) {
        let recipe = Recipe.findById(target.parentElement.id)
        recipe.add_new_comment();
    }
})
