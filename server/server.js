import express from "express";
import bodyParser from "body-parser";
import assert from "assert"
import Db from "./db.js";
import Game from "./game.js";

const app = express();
const db = new Db();

// create an empty game
let next_game = new Game()

// For checking input
const uuidRegex = /^([0-9,a-f]){8}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){12}$/;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// For testing purposes
app.get("/reset-next-game", (req, res) => {
  next_game = new Game();
  res.send("Next game was reset.");
});

// For testing purposes
app.get("/pretty-print/:game_id", (req, res) => {
  let game_id = req.params.game_id
  if (!game_id.match(uuidRegex)){
    res.send("Invalid game id");
    return;
  }
  if (game_id === next_game.id()) {
    res.send(next_game.prettyPrint());
    return;
  }
  if (db.has_game(game_id)) {
    res.send(db.get_game(game_id).prettyPrint());
  } else {
    res.send("Game not found in database");
  }
});

app.get("/get-game/:game_id", (req, res) => {
  let game_id = req.params.game_id
  if (!game_id.match(uuidRegex)){
    res.json({
      error: "Invalid game id"
    });
    return;
  }
  if (game_id === next_game.id()) {
    res.json(next_game.toObject());
    return;
  }
  if (db.has_game(game_id)) {
    res.json(db.get_game(game_id).toObject());
  } else {
    res.json({
      error: "Game not found in database"
    });
  }
});


app.get("/status/:game_id", (req, res) => {
  let game_id = req.params.game_id
  if (!game_id.match(uuidRegex)){
    res.json({
      error: "Invalid game id"
    });
    return;
  }
  if (game_id === next_game.id()) {
    res.json(next_game.status());
    return;
  }
  if (db.has_game(game_id)) {
    res.json(db.get_game(game_id).status());
  } else {
    res.json({
      error: "Game not found in database"
    });
  }
});

app.get("/position-ship/:game_id/:player_id/:ship_type/:orientation/:x/:y", (req, res) => {
  let game_id = req.params.game_id;
  let player_id = req.params.player_id;
  let ship_type = req.params.ship_type;
  let orientation = req.params.orientation;
  let x = parseInt(req.params.x);
  let y = parseInt(req.params.y);

  if (!game_id.match(uuidRegex)) {
    res.json({
      error: "Invalid game id"
    });
    return;
  }
  if (!player_id.match(uuidRegex)) {
    res.json({
      error: "Invalid player id"
    });
    return;
  }
  if (!(orientation === "HORIZONTAL" || orientation === "VERTICAL")) {
    res.json({
      error: "Invalid orientation"
    });
    return;
  }
  if (!db.has_game(game_id)) {
    res.json({
      error: "Game not found in database"
    });
    return;
  }
  let game = db.get_game(game_id);
  if (game.status().status === "GAME_RUNNING") {
    res.json({
      error: "Game already running"
    });
    return;
  }
  game.try_position_ship(player_id, ship_type, orientation, x, y);
  db.update_game(game_id);
  res.json(game.state());
});

app.get("/join-game/:player", (req, res) => {
  let playerName = req.params.player;
  if (!playerName.match(/^[a-z,A-Z]\w*$/)) {
    res.json({
      error: "Invalid player name"
    })
    return;
  }
  switch (next_game.number_of_players()) {
    case 0:
      let {ok: ok1, id: player_id1} = next_game.join(playerName);
      assert(ok1); //Should never fail
      res.json({
        game_id: next_game.id(),
        player_id: player_id1
      });
      break;
    case 1: 
      let result = next_game.join(playerName);
      if (!result.ok) {
        res.json({
          error: result.reason
        });
        return;
      }
      let {ok: ok2, id: player_id2} = result;
      db.add_game(next_game.id(), next_game);
      let game_id = next_game.id();
      next_game = new Game();
      res.json({
        game_id: game_id,
        player_id: player_id2
      });
      break;
    default:
      assert(false); //Should never get here!!!!
  }
});

export default app;