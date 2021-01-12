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

    damaged_cell_count() {
        return this.grid_count_characters('X');
    }

    intact_cell_count() {
        return this.grid_count_characters('O');
    }
    
    miss_count() {
        return this.grid_count_characters('.');
    }
}

export default Grid