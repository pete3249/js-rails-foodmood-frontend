class Comment {
    constructor(attributes) {
        let whitelist= ["id", "first_name", "content"]
        whitelist.forEach(attr => this[attr] = attributes[attr])
    }

}