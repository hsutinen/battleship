import assert from "assert";
import Game from "../game.js";

const uuidRegex = /^([0-9,a-f]){8}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){12}$/;

describe("Game", () => {
    it("Game should get id", () => {
        let game = new Game();
        assert.match(game.id(), uuidRegex, "Game does not get id.");
    });

    it("New players should get id", () => {
        let game = new Game();
        let player1 = "me";
        let player2 = "you";
        let result1 = game.join(player1);
        assert(result1.ok, "Could not join empty game");
        assert.match(result1.id, uuidRegex, "Player does not get id.");
        let result2 = game.join(player2);
        assert(result2.ok, "Could not join empty game");
        assert.match(result2.id, uuidRegex, "Player does not get id.");
    });

    it("should only allow 2 players per game", () => {
        let game = new Game();
        let player1 = "me";
        let player2 = "you";
        let player3 = "him"
        let result1 = game.join(player1);
        assert.strictEqual(game.number_of_players(), 1, "Incorrect player count.")
        let result2 = game.join(player2);
        assert.strictEqual(game.number_of_players(), 2, "Incorrect player count.")
        let result3 = game.join(player3);
        assert.deepStrictEqual(result3, {
           ok: false,
            reason: "Game full"
        }, "Incorrect result");
    });

    it("should only allow player join once", () => {
        let game = new Game();
        let player1 = "me";
        let result1 = game.join(player1);
        let result2 = game.join(player1);
        assert.deepStrictEqual(result2, {
            ok: false,
            reason: "Player already joined"
        }, "Incorrect result");
    });

    it("should decide move order correctly", () => {
        let game = new Game();
        let player1 = "me";
        let player2 = "other";
        let {ok: ok1, id: id1} = game.join(player1);
        let {ok: ok2, id: id2} = game.join(player2);
        assert(game.has_turn(id1), "Player 1 should have turn.");
        assert(!game.has_turn(id2), "Player 2 should not have turn.");
        game.make_move(id1, 0, 0);
        assert(game.has_turn(id2), "Player 2 should have turn.");
        assert(!game.has_turn(id1), "Player 1 should not have turn.");
        game.make_move(id2, 1, 1);
        assert(game.has_turn(id1), "Player 1 should have turn.");
        assert(!game.has_turn(id2), "Player 2 should not have turn.");
    });

});