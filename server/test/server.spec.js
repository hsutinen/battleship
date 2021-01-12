import supertest from "supertest";
import assert from "assert";
import app from "../server.js";

describe("GET /", function() {
    it("it should have status code 200", function(done) {
      supertest(app)
        .get("/")
        .expect(200)
        .end(function(err, res){
          if (err) done(err);
          done();
        });
    });
  });