class Db {
    #games
    constructor() {
        this.#games = new Map();
    }

    add_game(id, game) {
        this.#games.set(id, game);
    }

    get_game(id) {
        return this.#games.get(id);
    }

    has_game(id) {
        return this.#games.has(id);
    }
}

export default Db;