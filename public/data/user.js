class User {

    constructor(name, role) {
        this._name = name;
        this._role = role;
    }
    getName = () => {
        return this._name;
    }
    getRole = () => {
        return this._role;
    }
}

export {User};

