import { v4 as uuid } from "uuid";

class Game {
    #id
    constructor() {
        this.#id = uuid();
    }

    id() {
        return this.#id
    }
}

export default Game;