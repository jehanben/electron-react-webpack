import '../assets/css/App.css'
import React, { Component } from 'react'
import {execSync} from 'child_process';

class App extends Component {

  constructor() {
    super();
    this.state = { phpVersion: '', characters: '' };
    this.handleExce = this.handleExce.bind(this);
  }

  handleExce(ev) {
    const out = execSync('php -v').toString();
    this.setState({
      phpVersion: out
    });
  }

  render() {
    let { phpVersion, characters } = this.state;

    return (
      <div>
        <h1>Hello, Electron!</h1>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        <button onClick={this.handleExce}>PHP Version </button> {phpVersion} {characters}
      </div>
    )
  }
}

export default App
