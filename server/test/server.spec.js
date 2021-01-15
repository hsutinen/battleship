import supertest from "supertest";
import { v4 as uuid } from "uuid";
import assert from "assert";
import app from "../server.js";

const uuidRegex = /^([0-9,a-f]){8}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){4}-([0-9,a-f]){12}$/;

describe('GET /join-game/:player', () => {
  it('responds with game_id and player_id', () => {
    return supertest(app)
      .get('/join-game/player1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
          assert.match(response.body.game_id, uuidRegex, "Did not return game_id");
          assert.match(response.body.player_id, uuidRegex, "Did not return player_id");
      });
  });

  it('Player should not be able to join same game twice', () => {
    let game_id = 0;
    return supertest(app)
      .get('/reset-next-game')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(response => {
        return supertest(app).get('/join-game/player1')
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        return supertest(app).get('/join-game/player1')
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        assert.deepStrictEqual(response.body, {
          error: "Player already joined"
        });
      });
  });
});

describe('GET /status/:game_id', () => {

  it('Does not accept invalid game id', () => {
    let game_id = 0;
    return supertest(app)
      .get('/status/invalid-id')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        assert.deepStrictEqual(response.body, {
          error: "Invalid game id"
        });
      });
  });

  it('Does not accept game not in database', () => {
    let game_id = 0;
    return supertest(app)
      .get(`/status/${uuid()}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        assert.deepStrictEqual(response.body, {
          error: "Game not found in database"
        });
      });
  });
  
  it('responds with correct status for game with one player', () => {
    let game_id = 0;
    return supertest(app)
      .get('/reset-next-game')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(response => {
        return supertest(app).get('/join-game/player1')
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        game_id = response.body.game_id;
        return supertest(app).get(`/status/${game_id}`)
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        assert.deepStrictEqual(response.body, {
          status: "WAITING_FOR_PLAYER"
        });
      });
  });

  it('responds with correct status for game with two players', () => {
    let game_id = 0;
    return supertest(app)
      .get('/reset-next-game')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(response => {
        return supertest(app).get('/join-game/player1')
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        return supertest(app).get('/join-game/player2')
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        game_id = response.body.game_id;
        return supertest(app).get(`/status/${game_id}`)
          .expect('Content-Type', /json/)
          .expect(200)
      })
      .then(response => {
        assert.deepStrictEqual(response.body, {
          status: "GAME_INITIALIZING"
        });
      });
  });
});

// This is a huge test case. Must populate grid for both players
describe('GET /has-turn/:game_id/:player_id', () => {
  it('Should decide move order correctly', async () => {
    await supertest(app).get('/reset-next-game');
    let res1 = await supertest(app).get('/join-game/player1');
    let game_id = res1.body.game_id;
    let player1_id = res1.body.player_id;
    let res2 = await supertest(app).get('/join-game/player2');
    let player2_id = res2.body.player_id;
    
    let has_turn1 = await supertest(app).get(`/has-turn/${game_id}/${player1_id}`);
    assert.deepStrictEqual(has_turn1.body,
      { error: "Game not running" },
       "Should not be able to have a turn when game is not running");
    
    let make_turn1 = await supertest(app).get(`/make-turn/${game_id}/${player1_id}/0/0`);
    assert.deepStrictEqual(make_turn1.body,
      { error: "Game not running" },
       "Should not be able to make a turn when game is not running");

    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Carrier/HORIZONTAL/0/0`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Battleship/HORIZONTAL/0/1`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Battleship/HORIZONTAL/0/2`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Cruiser/HORIZONTAL/0/3`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Cruiser/HORIZONTAL/0/4`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/Cruiser/HORIZONTAL/0/5`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/PatrolBoat/HORIZONTAL/0/6`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/PatrolBoat/HORIZONTAL/0/7`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/PatrolBoat/HORIZONTAL/0/8`);
    await supertest(app).get(`/position-ship/${game_id}/${player1_id}/PatrolBoat/HORIZONTAL/0/9`);

    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Carrier/HORIZONTAL/0/0`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Battleship/HORIZONTAL/0/1`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Battleship/HORIZONTAL/0/2`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Cruiser/HORIZONTAL/0/3`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Cruiser/HORIZONTAL/0/4`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/Cruiser/HORIZONTAL/0/5`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/PatrolBoat/HORIZONTAL/0/6`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/PatrolBoat/HORIZONTAL/0/7`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/PatrolBoat/HORIZONTAL/0/8`);
    await supertest(app).get(`/position-ship/${game_id}/${player2_id}/PatrolBoat/HORIZONTAL/0/9`);

    let res3 = await supertest(app).get(`/status/${game_id}`);
    assert.strictEqual(res3.body.status, "GAME_RUNNING", "Game not initialized properly");

    let has_turn2 = await supertest(app).get(`/has-turn/${game_id}/${player1_id}`);
    assert.deepStrictEqual(has_turn2.body,
      { has_turn: true },
       "Player 1 should have the first turn");

    let has_turn3 = await supertest(app).get(`/has-turn/${game_id}/${player2_id}`);
    assert.deepStrictEqual(has_turn3.body,
      { has_turn: false },
       "Player 2 should not have the first turn");

    let make_turn2 = await supertest(app).get(`/make-turn/${game_id}/${player2_id}/0/0`);
    assert(make_turn2.body.error, "Player 2 should not be able to make the first move");

    let make_turn3 = await supertest(app).get(`/make-turn/${game_id}/${player1_id}/0/0`);
    assert(make_turn3.body.ok, "Player 1 should be able to make the first move");

    let make_turn4 = await supertest(app).get(`/make-turn/${game_id}/${player1_id}/1/1`);
    assert(make_turn4.body.error, "Player 1 should not be able to make two consecutive moves");

    let make_turn5 = await supertest(app).get(`/make-turn/${game_id}/${player2_id}/0/0`);
    assert(make_turn5.body.ok, "Player 2 should be able to make the second move");
    
    let res =  await supertest(app).get(`/pretty-print/${game_id}`);
    console.log(res.text);

  });
});
// app.get("/make-turn/:game_id/:player_id/:x/:y", (req, res) => {
// app.get("/has-turn/:game_id/:player_id", (req, res) => {
// app.get("/position-ship/:game_id/:player_id/:ship_type/:orientation/:x/:y", (req, res) => {
