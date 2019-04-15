import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import is from 'electron-is'
// import Process from "child_process";
// import {execSync} from 'child_process';

export class DockerCheck extends Component {

  state = {
    os      : '',
    dockVer : '',
    dockRun : ''
  }

  componentDidMount() {
    this.detectOs();
    this.backgroundProcess();
  }

  detectOs = () => {
    if (is.windows()){
      this.setState({
        os: "Windows OS Detected."
      })
    }
    if (is.macOS()) {
      this.setState({
        os: "Apple OS Detected."
      })
    }
    if (is.linux()) {
      this.setState({
        os: "Linux OS Detected."
      })
    }
  }

  backgroundProcess = () => {
    const process = require('child_process');   // The power of Node.JS
    let cmd = (is.windows()) ? 'test.bat' : './test.sh';
    console.log('cmd:', cmd);

    let child = process.spawn(cmd);

    child.on('error', function(err) {
      console.log('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
      console.log(data);
    });

    child.stderr.on('data', function (data) {
      console.log('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
      if (code == 0)
        console.log('child process complete.' );
      else
        console.log('child process complete.' + code);
    })
    this.appendOutput("testing script");
  }

  appendOutput = (msg) => {
    return msg;
  }

  render() {
    let { os } = this.state;

    return (
      <div>
        <Paper className={this.props.handleStyle.root} elevation={1}>
          <Typography variant="h5" component="h5">
            {os}
          </Typography>
          <Typography component="p">
            {this.appendOutput()}
          </Typography>
        </Paper>
      </div>
    )
  }
}

export default DockerCheck
