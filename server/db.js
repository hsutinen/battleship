import fs from "fs";
import Game from "./game.js";

const saved_games_path = './saved-games'

const saved_game_regex = /^([0-9,a-f]){8}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){12}\.json$/;

class Db {
    #games
    constructor() {
        this.#games = new Map();
        ////////////////////
        // Load saved games

        let dir = fs.readdirSync(saved_games_path);
        for (let filename of dir) {
            if (filename.match(saved_game_regex)) {
                console.log(`Loading saved game: ${filename}`);
                const data = fs.readFileSync(`${saved_games_path}/${filename}`);
                const gameObj = JSON.parse(data);
                let game = new Game();
                game.fromObject(gameObj);
                this.#games.set(game.id(), game);
            }
        }
    }

    add_game(id, game) {
        this.#games.set(id, game);
        let data = JSON.stringify(game.toObject())
        fs.writeFile(`./saved-games/${game.id()}.json`, data, (err) => {
            if (err) throw err;
            console.log(`The file ${game.id()}.json has been saved!`);
        });
    }

    update_game(id) {
        if (this.#games.has(id)) {
            let game = this.#games.get(id);
            let data = JSON.stringify(game.toObject())
            fs.writeFile(`./saved-games/${game.id()}.json`, data, (err) => {
                if (err) throw err;
                console.log(`The file ${game.id()}.json has been saved!`);
            });
        }
    }

    get_game(id) {
        return this.#games.get(id);
    }

    has_game(id) {
        return this.#games.has(id);
    }
}

export default Db;