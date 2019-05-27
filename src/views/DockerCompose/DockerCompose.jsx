import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import DockerExec from "../../components/DockerCompose/DockerExec.jsx";
import DockerExecResult from "../../components/DockerCompose/DockerExecResult.jsx";


const fs = require("fs");
const dockerBuildLog = require('path').resolve('log/docker/docker-build.log');
const dockerRunLog = require('path').resolve('log/docker/docker-run.log');

var Docker = require('dockerode');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  textAreaStyle: {
    width: "100%",
    resize: "none"
  },
  nextBtn: {
    margin: theme.spacing.unit,
  },
  table: {
    minWidth: "auto",
  }
});

function getSteps() {
  return ['Docker image and container build', 'Verify setup to execute code checker', 'Generate Results'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Initiating Docker image build and starting the container.';
    case 1:
      return 'Verify container and project setup';
    case 2:
      return 'Output of the code compatibility results.';
    default:
      return 'Unknown stepIndex';
  }
}

class DockerCompose extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      // phpVersion: props.location.state.phpVersion,
      // projectName: props.location.state.projectName,
      // projectPath: props.location.state.projectPath,
      value: '',
      activeStep: 0,
      stopReRun: false,
      nextButton: false,
      containerId: 'ab269e1feeec',
      containerOutput: ''
    }
  }

  componentDidMount() {
    const { activeStep, stopReRun } = this.state;

    if(activeStep === 0 && stopReRun === false) {

      if (fs.existsSync(dockerBuildLog)) {
        var writeStream = fs.createWriteStream(dockerBuildLog, { flags : 'w' });
      }

      docker.buildImage('./Dockerfile.tar.xz', {
        t: 'nginxphpdocker/app',
        rm: true,
        buildargs: {
          "buildtime_version":"7.2"
        },
      }, function(err, stream) {
        if (err) return;

        stream.on('error', function(err) {
          this.appendOutput('stderr: <'+err+'>' );
        }.bind(this));

        stream.pipe(writeStream);

        stream.on('data', function (data) {
          this.appendOutput(data);
        }.bind(this));

        stream.on('end', function() {
          // this.done();
          this.enableNext();
        }.bind(this));
      }.bind(this));
    }
  }

  done = () => {
    if (fs.existsSync(dockerRunLog)) {
      var writeStream = fs.createWriteStream(dockerRunLog, { flags : 'w', encoding: 'utf8' });
    }

    docker.createContainer({
      Image: 'nginxphpdocker/app',
      ExposedPorts: {
        "80/tcp": {}
      },
      HostConfig: {
        Privileged: false,
        Binds: [
          "/home/jehan/work/MSC/Project/sampleapp/application:/var/www/html/public"
        ],
        PortBindings: {
          "80/tcp": [
            { "HostPort": "9000" }
          ]
        },
      }
    }, function(err, container) {
      container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        tty: true
      }, function(err, stream) {
        if (err) return;

        stream.pipe(writeStream);

        stream.on('data', function (data) {
          this.appendOutput(data);
        }.bind(this));

        container.start(function(err, data) {
          if (err) {
            this.appendOutput(err);
            return
          }
          this.appendOutput(data);

          setTimeout(() => {
            stream.unpipe(writeStream);

            this.setDockerStatus(container.id);
            this.enableNext();
          }, 5000)
        }.bind(this));



        stream.on('end', function () {
          this.setDockerStatus('Docker build process exited...');
        }.bind(this))
      }.bind(this));
    }.bind(this));
  }

  enableNext = () => {
    this.setState({
      nextButton: true,
      stopReRun: true
    });
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
      nextButton: false,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      nextButton: true,
    }));

    if(this.state.activeStep === 1) {
      this.handleDockerFileLog()
    }
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleDockerFileLog = () => {
    this.setState({
      stopReRun: true
    })
  }

  appendOutput = (msg) => {
    this.setState({
      containerOutput: (this.state.containerOutput += msg)
    })
  }

  setDockerStatus = (id) => {
    this.setState({
      containerId: id,
    })
  }

  dockerSuccessInfo = () => {
    const { classes } = this.props;
    const { containerId } = this.state;

    if(containerId !== false) {
      return (
          <Paper className={classes.root} elevation={3}>
            <Typography variant="h6" component="h6">Docker Container starter.</Typography>
            <Typography component="p">
              &nbsp; - Docker Image Tag Name: nginxphpdocker/app <br/>
              &nbsp; - Docker Container ID: {containerId}
            </Typography>
          </Paper>
      )
    }
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, nextButton, containerId, containerOutput } = this.state;

    switch (activeStep) {
      default:
      case 0:
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Docker Compose Build</h4>
                  <p className={classes.cardCategoryWhite}>
                    Starting up the docker image build and container for PHP code checker.
                  </p>
                </CardHeader>
                <CardBody>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>

                  {this.dockerSuccessInfo()}
                  <br />
                  <textarea className={classes.textAreaStyle} value={containerOutput} rows="20" id="command-output" disabled></textarea>
                </CardBody>
                <CardFooter>
                  <div>
                    {this.state.activeStep === steps.length ? (
                      <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={this.handleReset}>Reset</Button>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.backButton}
                          >
                            Back
                          </Button>
                          <Button
                            disabled={nextButton === false}
                            variant="contained"
                                  color="primary"
                                  onClick={this.handleNext}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        )
      case 1:
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Docker Compose Build</h4>
                  <p className={classes.cardCategoryWhite}>
                    Starting up the docker image build and container for PHP code checker.
                  </p>
                </CardHeader>
                <CardBody>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <DockerExec
                    handleStyle={classes}
                    containerId={containerId}
                    enableNext = {this.enableNext}
                  />
                </CardBody>
                <CardFooter>
                  <div>
                    {this.state.activeStep === steps.length ? (
                      <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={this.handleReset}>Reset</Button>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.backButton}
                          >
                            Back
                          </Button>
                          <Button
                            disabled={nextButton === false}
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        )
      case 2:
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Docker Compose Build</h4>
                  <p className={classes.cardCategoryWhite}>
                    Starting up the docker image build and container for PHP code checker.
                  </p>
                </CardHeader>
                <CardBody>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <DockerExecResult />
                </CardBody>
                <CardFooter>
                  <div>
                    {this.state.activeStep === steps.length ? (
                      <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={this.handleReset}>Reset</Button>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.backButton}
                          >
                            Back
                          </Button>
                          <Button variant="contained"
                                  color="primary"
                                  onClick={this.handleNext}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        )
    }
  }
}

export default withStyles(styles)(DockerCompose);
