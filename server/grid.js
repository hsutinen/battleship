const rows = 10;
const cols = 10;
const fleet_data = new Map([
    ["Carrier", {
        "size": 5,
        "count": 1
    }],
    ["Battleship", {
        "size": 4,
        "count": 2
    }],
    ["Cruiser", {
        "size": 3,
        "count": 3
    }],
    ["Patrol boat", {
        "size": 2,
        "count": 4
    }]
]);

class Grid {
    #state
    #active_fleet
    #grid

    constructor() {
        this.clear()
    }

    clear() {
        this.#state = "INITIAL_STATE";
        this.#active_fleet = {
            "Carrier": {
                "positions" : [],
            },
            "Battleship": {
                "positions" : [],
            },
            "Cruiser": {
                "positions" : [],
            },
            "Patrol boat": {
                "positions" : [],
            }
        };
        this.#grid = [];
        for (let i = 0; i < rows; i++) {
            this.#grid[i] = []
            for (let j = 0; j < cols; j++) {
                this.#grid[i].push(" ");
            }
        }
    }

    grid() {
        return this.#grid;
    }

    // returns grid with intact cells hidden
    grid_intact_hidden() {
        let grid_hidden = this.#grid;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid_hidden = grid_hidden[i][j] === 'O' ? ' ' : grid_hidden[i][j];
            }
        }
        return grid_hidden;
    }

    rows() {
        return rows;
    }

    cols() {
        return cols;
    }
    
    at(x, y) {
        return this.#grid[y][x];
    }

    slice(start_x, start_y, count, orientation) {
        let res = "";
        switch (orientation) {
            case "HORIZONTAL":
                res = this.#grid[start_y].slice(start_x, start_x + count).join("");
                break;
            case "VERTICAL":
                for(let i = 0; i < count; i++) {
                    res += this.#grid[start_y + i][start_x];
                }
                break;
        }
        return res;
    }

    number_of(shipType) {
        if(this.#active_fleet[shipType])
            return this.#active_fleet[shipType].positions.length;
        else
            return 0;
    }

    positions_of(shipType) {
        if(this.#active_fleet[shipType])
            return this.#active_fleet[shipType].positions;
        else
            return [];
        
    }

    fleet_max_intact_cell_count() {
        return [...fleet_data.values()].reduce(
            (sum, value) => sum + (value.size * value.count)
        , 0)
    }

    grid_count_characters(char) {
        return this.#grid.reduce((sum_x, x) =>
            sum_x + x.reduce((sum_y, y) =>
                sum_y + (y === char ? 1 : 0)
            , 0), 0);

    }

    fleet_damaged_cell_count() {
        return this.grid_count_characters('X');
    }

    fleet_intact_cell_count() {
        return this.grid_count_characters('O');
    }

    empty_cell_count() {
        return this.grid_count_characters(' ');
    }

    miss_count() {
        return this.grid_count_characters('.');
    }

    number_of_moves() {
        return this.fleet_damaged_cell_count() + this.miss_count();
    }

    shoot(col, row) { // keep parameter order: x, y consistent
        if ((row < 0) || (row >= rows)) return;
        if ((col < 0) || (col >= cols)) return;
        switch (this.#grid[row][col]) {
            case ' ':
                this.#grid[row][col] = '.';
                break;
            case 'O':
                this.#grid[row][col] = 'X';
                break;
        }
    }

    grid_full() {
        return this.fleet_intact_cell_count() == this.fleet_max_intact_cell_count()
    }

    try_position_ship(shipType, orientation, x, y) {
        let max_x = 0;
        let max_y = 0;
        if (!fleet_data.has(shipType)) {
            return false;
        }
        let ship_max_count = fleet_data.get(shipType).count;
        let ship_size = fleet_data.get(shipType).size;
        if (this.number_of(shipType) == ship_max_count) {
            return false;
        }
        switch (orientation) {
            case "HORIZONTAL":
                max_x = rows - ship_size;
                max_y = cols - 1;
                break;
            case "VERTICAL":
                max_x = rows - 1;
                max_y = cols - ship_size;
                break;
            default:
                return false;
                break;
        }
        if ((x < 0) || (x > max_x)) {
            return false;
        }
        if ((y < 0) || (y > max_y)) {
            return false;
        }
        switch (orientation) {
            case "HORIZONTAL":
                for (let i = x; i < x + ship_size; i++ ) {
                    if (this.#grid[y][i] != ' ') {
                        return false;
                    }
                }
                break;
            case "VERTICAL":
                for (let j = y; j < y + ship_size; j++ ) {
                    if (this.#grid[j][x] != ' ') {
                        return false;
                    }
                }
                break;
        }
        switch (orientation) {
            case "HORIZONTAL":
                for (let i = x; i < x + ship_size; i++ ) {
                    this.#grid[y][i] = 'O'
                }
                break;
            case "VERTICAL":
                for (let j = y; j < y + ship_size; j++ ) {
                    this.#grid[j][x] = 'O'
                }
                break;
        }
        this.#active_fleet[shipType].positions.push({x, y, orientation});
        return true;
    }
}


export default Grid