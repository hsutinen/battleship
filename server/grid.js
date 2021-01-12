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
    constructor() {
        this.state = "INITIAL_STATE";
        this.active_fleet = {
            "Carrier": {
                "count": 0
            },
            "Battleship": {
                "count": 0
            },
            "Cruiser": {
                "count": 0
            },
            "Patrol boat": {
                "count": 0
            }
        };
        this.grid = [];
        for (let i = 0; i < rows; i++) {
            this.grid[i] = []
            for (let j = 0; j < cols; j++) {
                this.grid[i].push(" ");
            }
        }
    }

    fleet_max_intact_cell_count() {
        return [...fleet_data.values()].reduce(
            (sum, value) => sum + (value.size * value.count)
        , 0)
    }

    grid_count_characters(char) {
        return this.grid.reduce((sum_x, x) =>
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


    try_position_ship(shipType, orientation, x, y) {
        let max_x = rows;
        let max_y = cols;
        if (!fleet_data.has(shipType))
            return false;
        let ship_max_count = fleet_data.get(shipType).count;
        let ship_size = fleet_data.get(shipType).size;
        if (this.active_fleet[shipType].count == ship_max_count)
            return false;
        switch (orientation) {
            case "HORIZONTAL":
                max_x = max_x - ship_size;
                max_y = cols - 1;
                break;
            case "VERTICAL":
                max_x = rows - 1;
                max_y = max_x - ship_size;
                break;
            default:
                return false;
                break;
        }
        if ((x < 0) || (x > max_x)) return false;
        if ((y < 0) || (y > max_y)) return false;
        switch (orientation) {
            case "HORIZONTAL":
                for (i = x; i < x + ship_size; i++ ) {
                    if (this.grid[y][i] != ' ') return false;
                }
                break;
            case "VERTICAL":
                for (j = y; j < y + ship_size; j++ ) {
                    if (this.grid[j][x] != ' ') return false;
                }
                break;
        }
        switch (orientation) {
            case "HORIZONTAL":
                for (i = x; i < x + ship_size; i++ ) {
                    this.grid[y][i] = 'O'
                }
                break;
            case "VERTICAL":
                for (j = y; j < y + ship_size; j++ ) {
                    this.grid[j][x] = 'O'
                }
                break;
        }
        return true;
    }
}


export default Grid