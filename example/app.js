import PriorityNav from '../src/priority-nav';
import React, {Component} from 'react';
import {render} from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import './scss/styles.scss';

class App extends Component {
    constructor() {
        super();
        this.handleMouseDown = this.onMouseDown.bind(this);
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleMouseUp = this.onMouseUp.bind(this);

        this.state = {maxWidth: 9999};
    }

    onMouseDown(e) {
        document.addEventListener('mousemove', this.onMouseMove.bind(this, e));
        //this.state.mouseDown = true;
    }

    onMouseUp(e) {
        document.removeEventListener('mousemove');
        this.state.mouseDown = false;
    }

    onMouseMove(e) {
        const maxWidth = e.target;
        this.setState({maxWidth: maxWidth});
    }

    componentDidMount() {
        //document.addEventListener('mousemove', this.handleMouseMove);
    }


    render() {
        const {maxWidth} = this.state;
        const props = {
            tag: "div",
            className: "wrapper resize-drag nav-wrapper",
            navRef: 'list'
        };
        return (
            <div className="wrapper--big">
                <nav className="nav" style={{maxWidth: maxWidth}}>
                    <PriorityNav {...props}>
                        <ul ref="list" className="nav-ul">
                            <li><a href="#">menu item 1</a></li>
                            <li><a href="#">menu item 2</a></li>
                            <li><a href="#">menu item 3</a></li>
                            <li><a href="#">menu item 4</a></li>
                            <li><a href="#">menu item 5</a></li>
                            <li><a href="#">menu item 6</a></li>
                            <li><a href="#">menu item 7</a></li>
                            <li><a href="#">menu item 8</a></li>
                            <li><a href="#">menu item 9</a></li>
                            <li><a href="#">menu item 10</a></li>
                            <li><a href="#">menu item 11</a></li>
                            <li><a href="#">menu item 12</a></li>
                        </ul>
                    </PriorityNav>
                    <div ref="knob" className="knob" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="16" height="31" viewBox="0 0 16 31">
                            <g id="knobsvg">
                                <path id="rect-1" className="cls-3" d="M0 0h16v31H0z"></path>
                                <path id="rect-2" className="cls-4" d="M6 9h1v13H6z"></path>
                                <path id="rect-3" className="cls-4" d="M9 9h1v13H9z"></path>
                            </g>
                        </svg>
                    </div>
                </nav>
            </div>
        )
    }
}

render(
    <App/>,
    //document.getElementById('body-content')
    document.body
);