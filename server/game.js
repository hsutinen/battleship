import { v4 as uuid } from "uuid";
import Grid from "./grid.js";

class Game {
    #id
    #players
    #grids
    constructor() {
        this.#id = uuid();
        this.#players = new Map();
        this.#grids = new Map();
    }

    id() {
        return this.#id
    }

    has_player(playerName) {
        if ([...this.#players.values()].find( (value) => value.name === playerName))
            return true;
        else
            return false;
    }

    number_of_players() {
        return this.#players.size;
    }

    has_turn(playerId) {
        if (this.number_of_players() !== 2)
            return false;
        if (!this.#players.has(playerId))
            return false;
        let player_number_of_moves = 0;
        let other_number_of_moves = 0;
        for (let item of this.#grids.entries()) {
            console.log("in has_turn()");
            console.log(item[0]);
            console.log(item[1]);
            if (item[0] !== playerId)
                player_number_of_moves = item[1].number_of_moves();
            else
                other_number_of_moves = item[1].number_of_moves();
        }
        if (player_number_of_moves < other_number_of_moves) {
            return true;
        } else if (player_number_of_moves === other_number_of_moves) {
            if (this.#players.get(playerId).number === 0)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    make_move(playerId, x, y) {
        if (this.number_of_players() != 2)
            return;
        if (!this.has_turn(playerId))
            return;
        for (let item of this.#grids.entries()) {
            console.log("in make_move()");
            console.log(item[0]);
            console.log(item[1]);
            if (item[0] != playerId)
                item[1].shoot(x, y);
        }
    }

    join(playerName) {
        if (this.number_of_players() < 2) {
            if (this.has_player(playerName)) {
                return {
                    ok: false,
                    reason: "Player already joined"
                }
            }
            let playerId = uuid();
            this.#players.set(playerId, {
                number: this.number_of_players(),
                name: playerName
            });

            this.#grids.set(playerId,new Grid());
            return {
                ok: true,
                id: playerId
            }
        } else {
            return {
                ok: false,
                reason: "Game full"
            }
        }
    }
}

export default Game;