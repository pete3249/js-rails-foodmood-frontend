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
    }
})

document.addEventListener("click", (e) => {
    let target = e.target;

    if(target.matches("#newComment")) {
        let recipe = Recipe.findById(target.parentElement.id)
        recipe.add_comment();
    }
})
