import React, {Component} from 'react';
import {ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Settings from '@material-ui/icons/Settings';


export class DockerCheck extends Component {

  render() {
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
