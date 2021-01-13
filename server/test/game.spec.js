import assert from "assert";
import Game from "../game.js";


describe("Game", () => {
    it("Game should get id", () => {
        let game = new Game();
        assert(game.id(), "Game does not give id()");
    });
});