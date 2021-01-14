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
    ["PatrolBoat", {
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
        assert.strictEqual(grid.slice(0, 0, 5, "HORIZONTAL"), "OOOOO",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 5,
            "Failed to update grid correctly");
    });

    it("Position Carrier vertically should work", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Carrier", "VERTICAL", 9, 0),
            "could not position carrier on empty grid.");
        assert.strictEqual(grid.slice(9, 0, 5, "VERTICAL"), "OOOOO",
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
        assert.strictEqual(grid.slice(0, 0, 5, "HORIZONTAL"), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.slice(1, 1, 5, "HORIZONTAL"), "OOOO ",
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
        assert.strictEqual(grid.slice(0, 0, 5, "HORIZONTAL"), "OOOO ",
            "Failed to update grid correctly");
        assert.strictEqual(grid.slice(0, 1, 5, "HORIZONTAL"), "OOOO ",
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
        assert.strictEqual(grid.slice(0, 0, 6, "HORIZONTAL"), "OOOOO ",
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
        assert.strictEqual(grid.slice(5, 0, 5, "HORIZONTAL"), "OOOOO",
            "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 9,
            "Failed to update grid correctly");
    });

    it("grid.shoot() Should update grid correctly.", () => {
        let grid = new Grid();
        assert(grid.try_position_ship("Battleship", "HORIZONTAL", 0, 0),
            "Could not position carrier on empty grid.");
        assert(grid.try_position_ship("Carrier", "HORIZONTAL", 1, 1),
            "Could not position carrier on empty grid.");
        grid.shoot(5, 1);
        assert.strictEqual(grid.at(5, 1), "X", "Did not mark hit with X");
        assert.strictEqual(grid.fleet_damaged_cell_count(), 1,  "Failed to update grid correctly");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 9,
            "Failed to update grid correctly");
        assert.strictEqual(grid.number_of_moves(), 1, "number_of_moves() count wrong.");
        grid.shoot(9, 9);
        assert.strictEqual(grid.at(9, 9), ".", "Failed to update grid correctly");
        assert.strictEqual(grid.number_of_moves(), 2, "number_of_moves() count wrong.");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 9 - 1,
            "Failed to update grid correctly");
        grid.shoot(8, 8);
        assert.strictEqual(grid.at(8, 8), ".", "Failed to update grid correctly");
        assert.strictEqual(grid.number_of_moves(), 3, "number_of_moves() count wrong.");
        assert.strictEqual(grid.empty_cell_count(), grid.rows() * grid.cols() - 9 - 2,
            "Failed to update grid correctly");
    });
    it("Get ship position shoud work", () => {
        let grid = new Grid();
        grid.try_position_ship("Battleship", "HORIZONTAL", 2, 4);
        assert.deepStrictEqual(grid.positions_of("Battleship"), [
            {x: 2, y: 4, orientation: "HORIZONTAL" }
        ]
        , "Did not update positions correctly 1");
        grid.try_position_ship("Battleship", "VERTICAL", 0, 1);
        assert.deepStrictEqual(grid.positions_of("Battleship"), [
            {x: 2, y: 4, orientation: "HORIZONTAL" },
            {x: 0, y: 1, orientation: "VERTICAL" }
        ]
        , "Did not update positions correctly 2");
    });
});