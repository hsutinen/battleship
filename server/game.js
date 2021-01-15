import { v4 as uuid } from "uuid";
import Grid from "./grid.js";
import assert from "assert";
import { type } from "os";

// For checking input
const uuidRegex = /^([0-9,a-f]){8}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){12}$/;

class Game {
    #id
    #players
    #grids
    constructor() {
        this.#id = uuid();
        this.#players = new Map();
        this.#grids = new Map();
    }

    prettyPrint() {
        let result = "";
        for (let item of this.#players.entries()) {
            result += `Player ${item[1].number}: ${item[1].name}` + "\n<br>";
            result += "Grid:\n<br>";
            for (let row of this.#grids.get(item[0]).grid()) {
                result += "   ";
                result += row.join("").replace(/ /g, '_') + "\n<br>";
            }
        }
        return result;
    }

    toObject() {
        let id = this.#id;
        let players = [];
        let grids = [];
        for(let item of this.#players.entries()) {
            players.push(item);
        }
        for(let item of this.#grids.entries()) {
            grids.push([
                item[0],
                item[1].toObject()
            ]);
        }
        return { id, players, grids };
    }

    fromObject(obj) {
        let { id, players, grids } = obj;
        if (!(typeof(id) === "string" && id.match(uuidRegex)))
            throw "Game: invalid serialization format";
        if (!(typeof(players) === "object" && players instanceof Array))
            throw "Game: invalid serialization format";
        if (!(typeof(grids) === "object" && grids instanceof Array))
            throw "invalid serialization format";
        this.#id = id;
        this.#players = new Map(players);
        this.#grids = new Map();
        for (let item of grids) {
            let grid = new Grid();
            grid.fromObject(item[1]);
            this.#grids.set(item[0], grid);
        }
    }

    id() {
        return this.#id
    }

    status() {
        let player1_id = "";
        let player2_id = "";
        if (this.number_of_players() < 2)
            return { status: "WAITING_FOR_PLAYER"};
        assert(this.number_of_players() === 2);  //Other states should not be possible
        for(let item of this.#players.entries()) {
            if (item[1].number === 0) 
                player1_id = item[0];
            else
                player2_id = item[0];
        }
        let grid1 = this.#grids.get(player1_id);
        let grid2 = this.#grids.get(player2_id);

        // Test for game winner
        if (grid1.number_of_moves() > 0 && grid1.fleet_intact_cell_count() === 0) {
            return {
                status: "GAME_OVER",
                winner: this.#players.get(player2_id).name
            }
        } else if (grid2.number_of_moves() > 0 && grid2.fleet_intact_cell_count() === 0) {
            return {
                status: "GAME_OVER",
                winner: this.#players.get(player1_id).name
            }
        }

        let player1_ready = grid1.fleet_max_intact_cell_count() ===
                    (grid1.fleet_damaged_cell_count() + grid1.fleet_intact_cell_count());
        let player2_ready = grid2.fleet_max_intact_cell_count() ===
                    (grid2.fleet_damaged_cell_count() + grid2.fleet_intact_cell_count());
        if (player1_ready && player2_ready) {
            return { status: "GAME_RUNNING" };
        } else {
            return { status: "GAME_INITIALIZING" };
        }
    }

    state(playerId) {
        let state = [];
        if (this.#grids.has(playerId)) {
            for (let row of this.#grids.get(playerId).grid()) {
                state.push(row.join(""));
            }
        }
        return state;
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

    try_position_ship(playerId, shipType, orientation, x, y) {
        if (this.#grids.has(playerId))
            return this.#grids.get(playerId).try_position_ship(shipType, orientation, x, y);
    }

    make_move(playerId, x, y) {
        if (this.number_of_players() != 2)
            return;
        if (!this.has_turn(playerId))
            return;
        for (let item of this.#grids.entries()) {
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