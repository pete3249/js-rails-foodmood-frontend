class Comment {
    constructor(attributes) {
        let whitelist= ["id", "name", "review", "recipe_id", "date"]
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
            debugger
        })
    }

}