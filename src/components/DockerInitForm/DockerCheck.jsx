import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import is from 'electron-is';
import  {execSync} from 'child_process';

export class DockerCheck extends Component {

  state = {
    os      : ''
  }

  componentDidMount() {
    this.detectOs();
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

  render() {
    let { os } = this.state;
    var dockerExec = [];

    let cmd = (is.windows()) ? 'docker-bash' : 'docker-shell';
    let commands = require('../../scripts/'+cmd);

    Object.keys(commands).map(function(key, val) {
      console.log([key] + commands[key] + val);
      try {
        var dockExe = execSync(commands[key]);
      } catch (e) {
        dockExe = null;
        console.log(e);
      }
      if(dockExe == null) {
        console.log('empty');
      }
      else {
        console.log(dockExe.toString());
      }

    });

    return (
      <div>
        <Paper className={this.props.handleStyle.root} elevation={1}>
          <Typography variant="h5" component="h5">
            {os}
          </Typography>
          <Typography component="p">{dockerExec}</Typography>
        </Paper>
      </div>
    )
  }
}

export default DockerCheck
