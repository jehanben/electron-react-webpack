import React from "react"

// @material-ui/core components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//Docker lib
var Docker = require('dockerode');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

export class DockerExec extends React.Component {

  state = {
    containerId : this.props.containerId,
    containerInfo: false
  }

  componentDidMount() {

    const { containerId, containerInfo } = this.state;
    // create a container entity. does not query API
    var container = docker.getContainer('ab269e1feeec9017fe818f976ad75ebf58ced8a7f64c61105b6ae889b1b8c7b7');

    // query API for container info
    container.inspect(function (err, data) {
      if(err)
        return err

      this.setState({
        containerInfo: data
      })
    }.bind(this));
  }


  render() {

    const { handleStyle } = this.props;
    const { containerId, containerInfo } = this.state;

    return(
      <div>
        <Table className={handleStyle.table}>
          <TableHead>
            <TableRow>
              <TableCell>Header</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Cell data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {JSON.stringify(containerInfo)}
      </div>
    )
  }
}

export default DockerExec
