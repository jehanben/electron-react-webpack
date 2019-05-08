import React, {Component} from 'react';
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import {List } from "@material-ui/core";

import Button from "../../components/CustomButtons/Button.jsx";
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import is from 'electron-is';
import  {spawnSync} from 'child_process';
import DockerCheck from './DockerCheck.jsx';

export class CheckList extends Component {

  handlePrev = () => {
    this.props.prevStep();
  }

  handleNext = () => {
    this.props.nextStep();
  }

  render() {
    let button;
    var isDocker = false;
    var docCheckList = [];

    let cmd = (is.windows()) ? 'docker-bash' : 'docker-shell';
    let commands = require('../../scripts/'+cmd);


    for (var i = 0; i < Object.keys(commands).length; i++) {
      var commandKey = Object.keys(commands)[i];
      var commandVal = Object.values(commands)[i];

      var parts = commandVal.split(/\s+/g);

      var spawn = spawnSync(parts[0], [parts.slice(1), {
        shell: true
      }]);

      if(commandKey == 'docker-check' && spawn.stdout.toString().trim() !== '') {
        isDocker = true;
        docCheckList.push(spawn.stdout.toString().trim());
      }
      else if(commandKey == 'docker-check' && spawn.stdout.toString().trim() == '') {
        break;
      }
      else {
        docCheckList.push(spawn.stdout.toString().trim());
      }
    }

    docCheckList = docCheckList.map(function(item, index) {

      return (
        <DockerCheck key = {index}
                     handlMsg = {item}
        />
      )
    }.bind(this));

    if(isDocker == false) {
      button = <Button variant="contained" style={{ justifyContent: 'center' }} color="primary" className={this.props.handleStyle.button}>
        <ArrowDownward className={this.props.handleStyle.rightIcon} />
        Install Docker
      </Button>;
    }

    return (
      <div>
      <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Paper className={this.props.handleStyle.root} elevation={1}>
                <Typography variant="h5" component="h5">
                  {(isDocker == true) ? "Docker installation found." : 'Need to install "Docker" to continue...'}
                </Typography>
                <List component="nav">
                    {docCheckList}
                </List>
              </Paper>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <Button color="primary"  onClick={this.handlePrev}>Go Back</Button>
          {(isDocker == false) ? button : <Button color="primary" onClick={this.handleNext}>Continue</Button>}
        </CardFooter>
      </div>
    )
  }
}

export default CheckList
