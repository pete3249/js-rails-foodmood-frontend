document.addEventListener("DOMContentLoaded", (e) => {
    Mood.all();
});

document.addEventListener("submit", (e) => {
    let target = e.target;
    
    if(target.matches("#recipePreferencesForm")) {
        e.preventDefault();
        if(target.querySelector("button").innerText === "Make it good!") {
            Recipe.filter();
            Recipe.toggleButton();
        } else {
            Recipe.reset();
        }
    }
})