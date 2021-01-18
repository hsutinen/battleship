import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Grid from './Grid';
import Ship from './Ship';


let server = axios.create({
    baseURL: "http://localhost:4000",
});

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            game_started: false,
            game_state: null,
            player_name: "",
            player_name_valid: true,
            player_id: "",
            game_id: "",
            position_ship: {
                ship_type: "",
                orientation: "",
                x: "",
                y: ""
            }
        }
    }
    
    render() {
        let formInputStyle = this.state.player_name_valid ?
            {
                color: "black"
            } :
            {
                color: "red"
            };
        let grids = null;
        let my_grid = null;
        if (this.state.game_state) {
            grids = new Map(this.state.game_state["grids"]);
            my_grid = grids.get(this.state.player_id).grid;
        }
        return (
            <div>
                <ul>
                    <li>player_name: {this.state.player_name}</li>
                    <li>game_id: {this.state.game_id}</li>
                    <li>player_id: {this.state.player_id}</li>
                    <li>position_ship: {JSON.stringify(this.state.position_ship)}</li>
                    {this.state.game_started ? (
                        <div>
                           <p>Game state:<br/>
                               {JSON.stringify(this.state.game_state)}
                           </p>
                           {my_grid !== null &&
                                <Grid grid={my_grid}/>
                           }
                           <Button onClick={this.getGameState.bind(this)}>Get Game State</Button>
                            <form>
                                <input type="text"
                                    placeholder="Ship type"
                                    style={formInputStyle}
                                    onChange={this.shipTypeChanged.bind(this)}
                                />
                                <input type="text"
                                    placeholder="Orientation"
                                    style={formInputStyle}
                                    onChange={this.orientationChanged.bind(this)}
                                />
                                <input type="text"
                                    placeholder="X"
                                    style={formInputStyle}
                                    onChange={this.xChanged.bind(this)}
                                />
                                <input type="text"
                                    placeholder="Y"
                                    style={formInputStyle}
                                    onChange={this.yChanged.bind(this)}
                                />
                                <Button onClick={this.addShip.bind(this)}>Add Ship</Button>
                            </form>
                            <Ship shipType="Carrier" orientation="HORIZONTAL"/>
                            <Ship shipType="Carrier" orientation="VERTICAL"/>
                        </div>
                    )
                     : (
                    <form>
                        <input type="text"
                            placeholder="Player name"
                            style={formInputStyle}
                            onChange={this.playerNameChanged.bind(this)}
                        />
                        <Button onClick={this.joinGame.bind(this)}>Join Game</Button>
                    </form>
                    )}
                </ul>
            </div>
        );
    }

    playerNameChanged(event) {
        let validationRegex = /^[a-z,A-Z][a-z,A-Z,0-9]*$/;
        const newPlayerName = event.target.value;
        if (newPlayerName.match(validationRegex)) {
            this.setState({ 
                player_name_valid: true,
                player_name: newPlayerName
            });
        } else {
            this.setState({ 
                player_name_valid: false,
            });
        }
    }

    shipTypeChanged(event) {
        this.setState( {
            position_ship: {
                ship_type: event.target.value,
                orientation: this.state.position_ship.orientation,
                x: this.state.position_ship.x,
                y: this.state.position_ship.y
            }
        });
    }

    orientationChanged(event) {
        this.setState( {
            position_ship: {
                ship_type: this.state.position_ship.ship_type,
                orientation: event.target.value,
                x: this.state.position_ship.x,
                y: this.state.position_ship.y
            }
        });
    }

    xChanged(event) {
        this.setState( {
            position_ship: {
                ship_type: this.state.position_ship.ship_type,
                orientation: this.state.position_ship.orientation,
                x: event.target.value,
                y: this.state.position_ship.y
            }
        });
    }

    yChanged(event) {
        this.setState( {
            position_ship: {
                ship_type: this.state.position_ship.ship_type,
                orientation: this.state.position_ship.orientation,
                x: this.state.position_ship.x,
                y: event.target.value
            }
        });
    }

    async addShip() {
        try {
            let t = this.state.position_ship.ship_type;
            let o = this.state.position_ship.orientation;
            let x = this.state.position_ship.x;
            let y = this.state.position_ship.y;
            let g_id = this.state.game_id;
            let p_id = this.state.player_id;
            let res = await server.get(`position-ship/${g_id}/${p_id}/${t}/${o}/${x}/${y}`);
            console.log(res.data);
            if (res.data.error) {
                alert(res.data.error);
            } else {
                this.getGameState();
            }
        } catch(error) {
            console.log(error);
        }

    }

    async joinGame() {
        try {
            if (this.state.player_name === "" || !this.state.player_name_valid)
                return;
            let res = await server.get(`/join-game/${this.state.player_name}`);
            console.log(res);
            if (res.data.error) {
                alert(res.data.error);
            } else {
                this.setState({
                    game_started: true,
                    player_id: res.data.player_id,
                    game_id: res.data.game_id
                });
            }
        } catch(error) {
            console.log(error);
        }
    }

    async getGameState() {
        try {
            let res =  await server.get(`/get-game/${this.state.game_id}`);
            this.setState({game_state: res.data});
        } catch(error) {
            console.error(error);
        }
    }
}

export default Game