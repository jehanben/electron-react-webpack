import React, { Component } from 'react'
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Unarchive from '@material-ui/icons/Unarchive';
import CheckList from './CheckList.jsx';
import DockerInit from './DockerInit.jsx';
import DockerCompileRun from './DockerCompileRun.jsx';

export class Readiness extends Component {
  state = {
    step: 1,
    version: "",
    projectpath: "",
    checkList: ""
  }

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  }

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  }

  // Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  }

  onDockerInitSubmit = updatedValue => {
    console.log(updatedValue);
    this.nextStep();
  }

  // Continue to readiness check
  continue = e => {
    e.preventDefault();
    this.nextStep();
  }

  back = e => {
    e.preventDefault();
    this.prevStep();
  };

  render() {
    const { step, nextVisible } = this.state;

    switch (step) {
      default:
      case 1:
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={this.props.handleStyle.cardTitleWhite}>Pre-requisites</h4>
                  <p className={this.props.handleStyle.cardCategoryWhite}>Complete readiness check.</p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <List component="nav">
                      <ListItem>
                        <ListItemIcon>
                          <Unarchive />
                        </ListItemIcon>
                        <ListItemText primary="Docker" secondary={
                          <React.Fragment>
                            <Typography component="span" className={this.props.handleStyle.inline} color="textPrimary">
                              Build, Ship, and Run Any App, Anywhere.
                              </Typography>
                            {" — This tool uses docker containers to check code compatiablity…"}
                          </React.Fragment>
                        } />
                      </ListItem>
                    </List>
                  </GridContainer>
                </CardBody>
                <CardFooter style={{ justifyContent: 'center' }}>
                  <Button color="primary" onClick={this.continue}>Start Readiness Check</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        );
      case 2:
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={this.props.handleStyle.cardTitleWhite}>Readiness Check</h4>
                  <p className={this.props.handleStyle.cardCategoryWhite}>Results of the readiness check.</p>
                </CardHeader>
                <CheckList
                  handleStyle={this.props.handleStyle}
                  nextStep = {this.nextStep}
                  prevStep = {this.prevStep}
                />
              </Card>
            </GridItem>
          </GridContainer>
        );
      case 3:
        return (
            <DockerInit
              handleStyle = {this.props.handleStyle}
              handleVersions = {this.props.handleVersion}
              nextStep = {this.nextStep}
              prevStep = {this.prevStep}
              dockerInitOnSubmit = {fields => this.onDockerInitSubmit(fields)}
            />
        )
      case 4:
        return (
          <DockerCompileRun
            handleStyle = {this.props.handleStyle}
            prevStep = {this.prevStep}
          />
        )
    }
  }
}

export default Readiness
