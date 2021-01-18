import { Component } from 'react';
import './Ship.css';

const shipTypes = new Map([
    [ "Carrier",    ['O', 'O', 'O', 'O', 'O']],
    [ "Battleship", ['O', 'O', 'O', 'O']],
    [ "Cruiser",    ['O', 'O', 'O']],
    [ "PatrolBoat", ['O', 'O']]
]);

class Ship extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!shipTypes.has(this.props.shipType))
        return (
            <p>Unknown ship type.</p>
        );
        let ship = shipTypes.get(this.props.shipType);
        let containerClassName = "";
        if (this.props.orientation === "HORIZONTAL")
            containerClassName = "ship-container-row";
        else if (this.props.orientation === "VERTICAL")
            containerClassName = "ship-container-column";
        else
            return (
                <p>Unknown orientation.</p>
            );

        let shipItems = ship.map( (item) =>
                <code className="ship-item">{item}</code>
        );

        return (
            <div className={containerClassName}>
                {shipItems}
            </div>
        );

    }
}

export default Ship;