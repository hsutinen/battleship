import supertest from "supertest";
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
  
  it('responds with correct status for game', () => {
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

  it('responds with correct status for game', () => {
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