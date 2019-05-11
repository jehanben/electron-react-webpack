import React from "react"

// @material-ui/core components
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

//Docker lib
var Docker = require('dockerode');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: 14
  }
}))(TableCell);

export class DockerExec extends React.Component {

  state = {
    containerId : this.props.containerId,
    containerInfo: {
      containerStatus:'',
      containerCreated: '',
      mountsDestination: '',
      mountSource: '',
      hostname: '',
      image: '',
      containerPort: '',
      hostPort: '',
      fileCount: 0
    }
  }

  componentDidMount() {

    const { containerId, containerInfo } = this.state;

    // create a container entity. does not query API
    var container = docker.getContainer('ab269e1feeec9017fe818f976ad75ebf58ced8a7f64c61105b6ae889b1b8c7b7');

    // query API for container info
    container.inspect(function (err, data) {
      if(err)
        return err

      containerInfo['containerStatus'] = data.State.Status
      containerInfo['containerCreated'] = data.Created
      containerInfo['mountsDestination'] = data.Mounts[0].Destination
      containerInfo['mountSource'] = data.Mounts[0].Source
      containerInfo['hostname'] = data.Config.Hostname;
      containerInfo['image'] = data.Config.Image;

      var hostPort = Object.keys(data.Config.ExposedPorts);

      containerInfo['containerPort'] = hostPort[0];
      containerInfo['hostPort'] = data.HostConfig.PortBindings[hostPort[0]][0].HostPort;


      this.setState({ containerInfo });

    }.bind(this));

    this.dockerExecuteCount(container);


  }

  dockerExecuteCount = (container) => {

    var options = {
      Cmd: ['bash', '-c', 'ls -lR /var/www/html/public/ | grep ".php$" | wc -l'],
      AttachStdout: true,
      AttachStderr: true
    };

    container.exec(options, function(err, exec) {
      if (err) return;
      exec.start(function(err, stream) {
        if (err) return;

        container.modem.demuxStream(stream, process.stdout, process.stderr);

        stream.on('data', function (data) {
          var result = data.toString().replace(/[^\x20-\x7E]/g, '');
          if(result !== '') {
            this.handleCount(result);
          }
        }.bind(this));

        stream.on('end', function() {
          console.log('done')
        });
      }.bind(this));
    }.bind(this));
  }

  handleCount = (count) => {
    this.setState({
      fileCount: count
    })
  }

  render() {

    const { handleStyle } = this.props;
    const { containerId, containerInfo, fileCount } = this.state;

    return(
      <div>
        <Paper className={handleStyle.root} elevation={3}>
          <Typography variant="h6" component="h6">Docker Container Information.</Typography>
        </Paper>
        <br/>
        <Table className={handleStyle.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Configurations</CustomTableCell>
              <CustomTableCell>Values</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Container status</TableCell>
              <TableCell>{containerInfo.containerStatus}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Started time</TableCell>
              <TableCell>{containerInfo.containerCreated}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Image Tag Name</TableCell>
              <TableCell>{containerInfo.image}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container ID</TableCell>
              <TableCell>{containerInfo.hostname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container Port</TableCell>
              <TableCell>{containerInfo.containerPort}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Host port</TableCell>
              <TableCell>{containerInfo.hostPort}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container folder</TableCell>
              <TableCell>{containerInfo.mountsDestination}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project path</TableCell>
              <TableCell>{containerInfo.mountSource}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/>
        <Paper className={handleStyle.root} elevation={3}>
          <Typography variant="h6" component="h6">Project Information.</Typography>
        </Paper>
        <br/>
        <Table className={handleStyle.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Setup</CustomTableCell>
              <CustomTableCell>Values</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Test</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project Path</TableCell>
              <TableCell>{containerInfo.mountSource}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PHP Version</TableCell>
              <TableCell>7.2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>File count</TableCell>
              <TableCell>{fileCount} (PHP / PHTML)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default DockerExec
