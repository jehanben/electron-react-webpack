import React, {Component} from 'react';
import {ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Settings from '@material-ui/icons/Settings';


export class DockerCheck extends Component {

  render() {

    var installDocker = () => {
      if(process.platform === "darwin") {
        if(this.props.handlCommand == 'which') {

        }
      } else if(process.platform === "linux") {
        if(this.props.handlCommand == 'which') {
          if(this.props.handlMsg == null) {

          }
        }
      } else if(process.platform === "win32") {
        if(this.props.handlCommand == 'which') {

        }
      } else {
        return "OS not recognized."
      }
    }

    return (
        <ListItem>
        <ListItemIcon>
        <Settings />
        </ListItemIcon>
          <ListItemText primary={this.props.handlMsg}  />
        </ListItem>
    )
  }
}

export default DockerCheck
