import assert from "assert";
import Grid from "../grid.js"

/*
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
*/

describe("Grid", () => {
    it("Position Carrier horizontally should work", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Carrier", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert.strictEqual(grid.grid[0].slice(0,5).join(""), "OOOOO",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 5,
            "Failed to update grid correctly");
    });
    it("Position Carrier horizontally should work", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Carrier", "VERTICAL", 9, 0),
            "could not position carrier on empty grid.");
        assert.strictEqual(grid.grid[0][9], 'O',
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[1][9], 'O',
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[2][9], 'O',
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[3][9], 'O',
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[4][9], 'O',
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 5,
            "Failed to update grid correctly");
    });
    it("Should not be able to position two Carriers", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Carrier", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert(!grid.try_position_ship("Carrier", "HORIZONTAL", 0, 1),
            "Could not position carrier on empty grid.");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 5,
            "Failed to update grid correctly");
    });
    it("Should not be able to position three Battleships", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 0),
            "Could not position Battleship on empty grid.");
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 1, 1),
            "Could not position Battleship on empty grid.");
        assert(!grid.try_position_ship("Battleship", "HORIZONTAL", 2, 2),
            "Too many Battleships on grid.");
        assert.strictEqual(grid.grid[0].slice(0,5).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[1].slice(1,6).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 8,
            "Failed to update grid correctly");
    });
    it("Should be able to position two Battleships", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 1),
            "Could not position carrier on empty grid.");
        assert.strictEqual(grid.grid[0].slice(0,5).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[1].slice(0,5).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 8,
            "Failed to update grid correctly");
    });
    it("Should be able to position two Battleships", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 1),
            "Could not position carrier on empty grid.");
        assert.strictEqual(grid.grid[0].slice(0,5).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.grid[1].slice(0,5).join(""), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 8,
            "Failed to update grid correctly");
    });
    it("Should not be able to position ships on top of each other", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Carrier", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert(!grid.try_position_ship("Battleship", "VERTICAL", 4, 0),
            "Battleship on top of Carrier!.");
        assert.strictEqual(grid.grid[0].slice(0,5).join(""), "OOOOO",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 5,
            "Failed to update grid correctly");
    });
    it("Should not be able to position ships outside grid", () => {
        let grid = new Grid();
        assert(!grid.try_position_ship("Carrier", "HORIZONTAL", 6, 0),
            "Carrier outside grid.");
        assert(!grid.try_position_ship("Carrier", "VERTICAL", 0, 6),
            "Carrier outside grid.");
        assert(grid.try_position_ship("Carrier", "HORIZONTAL", 5, 0),
            "Could not position carrier at end of grid.");
        assert(grid.try_position_ship("Battleship", "VERTICAL", 0, 6),
            "Could not position Battleship at end of grid.");
        assert.strictEqual(grid.grid[0].slice(5,10).join(""), "OOOOO",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 9,
            "Failed to update grid correctly");
    });
});