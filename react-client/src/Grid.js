import { Component } from 'react';
import './Grid.css';

class Grid extends Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        if (!this.props.grid)
            return (
                <div>
                    <h2>No grid to display</h2>
                </div>
            );
        console.log("==========================");
        console.log(this.props.grid);
        console.log("==========================");
        let items = [];
        const grid = this.props.grid;
        for (let i = 0; i < grid.length; i++) {
            for(let j = 0; j < grid[i].length; j++) {
                items.push({ x: j, y: i, value: grid[i][j]});
            }
        }

        let cells = items.map( (item) =>
            <code className="grid-item">{item.value}</code>
        );
        //let text = "ASDf Blaa!"
        return (
            <div className="grid-container">
                {cells}
            </div>
        );
    }
}

export default Grid;