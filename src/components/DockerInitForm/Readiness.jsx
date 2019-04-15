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
    const { step } = this.state;
    const { version, projectpath, customCheckList } = this.state;
    // const values = { version, projectpath, customCheckList };

    const {classes} = this.props.handleStyle;

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
                <CardBody>
                  <GridContainer>
                    <CheckList handleStyle={this.props.handleStyle} />
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button color="primary" onClick={this.back}>Go Back</Button>
                  <Button color="primary" onClick={this.continue}>Continue</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        );
      case 3:

      break;
    }
  }
}

export default Readiness
