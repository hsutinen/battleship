class Db {
    constructor() {
        this.users = new Set();
        this.games = new Map();
    }

    addUser(userName) {
        if (!this.users.has(userName))
            this.users.add(userName);
    }

    addGame(players, game) {
        this.games.set(players, game);
    }

    findGame(players) {
        if (this.games.has(players))
            return this.games[players];
        else
            return null;
    }
    
}