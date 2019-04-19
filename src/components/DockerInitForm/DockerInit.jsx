import React, { Component } from 'react';

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
import Muted from "../Typography/Muted.jsx";


const { shell } = require('electron');
const { dialog } = require('electron').remote;

export class DockerInit extends Component {

  state = {
    php_version: '',
    project_path: '',
    formData: {
      phpVersion: '',
      projectPath: '',
    },
    submitted: false,
  }

  handleChange = (event) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
    console.log(formData[event.target.name]);

  };

  handlePrev = () => {
    this.props.prevStep();
  }

  handleDirectoryOpen = () => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if(typeof path !== 'undefined') {
      const { formData } = this.state;
      formData['projectPath'] = path.toString();
      this.setState({ formData });
    }
  }

  render() {

    const { handleStyle, handleVersions } = this.props;
    const { formData } = this.state;

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
                    <FormHelperText>Select the project folder: </FormHelperText>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <input
                      accept="*"
                      className={handleStyle.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                    />
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
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }
}

export default DockerInit;
