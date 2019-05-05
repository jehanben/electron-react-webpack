import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Paper from '@material-ui/core/Paper';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Folder from '@material-ui/icons/Folder';
import CompareArrows from '@material-ui/icons/CompareArrows';
import Muted from "../Typography/Muted.jsx";

const { dialog } = require('electron').remote;

export class DockerInit extends Component {

  state = {
    formData: {
      phpVersion: '',
      projectPath: '',
      isEmpty: false,
      pathEmpty: false
    },
    toDashboard: false,
    submitted: false,
  }

  handleChange = (event) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    if(event.target.value == '') {
      formData['isEmpty'] = true;
    } else {
      formData['isEmpty'] = false;
    }
    this.setState({ formData });
  };

  handlePrev = () => {
    this.props.prevStep();
  }

  handleDirectoryOpen = () => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    const { formData } = this.state;

    if(typeof path !== 'undefined') {
      formData['projectPath'] = path.toString();
      formData['pathEmpty'] = false;
      this.setState({ formData });
    } else {
      formData['pathEmpty'] = true;
      this.setState({ formData });
    }
  }

  handleOnSubmit = (ev) => {
    ev.preventDefault();
    const { formData } = this.state;

    if(formData['projectPath'] == '' && formData['phpVersion'] == '') {
      formData['pathEmpty'] = true;
      formData['isEmpty'] = true;
    }
    else if(formData['projectPath'] == '') {
      formData['pathEmpty'] = true;
    } else if(formData['phpVersion'] == '') {
      formData['isEmpty'] = true;
    } else {
      this.setState({
        toDashboard: true
      })
      // this.props.dockerInitOnSubmit(this.state);
    }
    this.setState({ formData });
  }

  render() {

    const { handleStyle, handleVersions } = this.props;
    const { formData } = this.state;

    if (this.state.toDashboard === true) {
      return <Redirect to={{
        pathname: '/admin/docker-compose',
        state: {
          phpVersion: formData.phpVersion,
          projectPath: formData.projectPath,
        }
      }} />
    }

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={handleStyle.cardTitleWhite}>Docker build run</h4>
              <p className={handleStyle.cardCategoryWhite}>Start the docker base code checker for project.</p>
            </CardHeader>
            <CardBody>
              <Paper className={this.props.handleStyle.root} elevation={1}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl className={handleStyle.formControl}>
                      <TextField
                        required
                        error={formData.isEmpty === true}
                        name="phpVersion"
                        id="phpVersion"
                        select
                        label="PHP Version"
                        value={formData.phpVersion}
                        onChange={this.handleChange}
                        SelectProps={{
                          native: true,
                          MenuProps: {
                            className: handleStyle.menu,
                          },
                        }}
                        helperText="Select the PHP version you want to compare your project with."
                        margin="normal"
                      >
                        <option key='blank' value=''></option>
                        {handleVersions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <br/>
                <br/>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={handleStyle.formControl}>
                      <FormHelperText error={formData.pathEmpty === true}>Select the project folder: </FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" component="span" className={handleStyle.button} onClick={this.handleDirectoryOpen} >
                        <Folder />
                        Search
                      </Button>
                    </label>
                    <br/>
                    <Muted>
                      {(formData.projectPath !== '') ? "Path: " + formData.projectPath : ''}
                    </Muted>
                  </GridItem>
                </GridContainer>
              </Paper>
            </CardBody>
            <CardFooter>
              <Button color="primary"  onClick={this.handlePrev}>Go Back</Button>
              <Button color="primary" onClick={e => this.handleOnSubmit(e)} >
                <CompareArrows />  Run Compare
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }
}

export default DockerInit;
