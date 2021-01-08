document.addEventListener("DOMContentLoaded", (e) => {
    Mood.all();
});

document.addEventListener("submit", (e) => {
    let target = e.target;
    
    if(target.matches("#recipePreferencesForm")) {
        e.preventDefault();
        Recipe.filter();
    }
})
