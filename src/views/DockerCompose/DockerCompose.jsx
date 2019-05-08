import React from "react";
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

const styles = theme => ({
  root: {
    width: '90%',
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
  }
});

function getSteps() {
  return ['Docker image and container build', 'Create an ad group', 'Create an ad'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Initiating Docker image build and starting the container.';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
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
      activeStep: 0
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    var Docker = require('dockerode');

    var docker = new Docker({
      socketPath: '/var/run/docker.sock'
    });


    docker.buildImage('./Dockerfile.tar.xz', {
      t: 'nginxphpdocker/app',
      rm: true,
      buildargs: {
        "buildtime_version":"7.2"
      },
    }, function(err, stream) {
      if (err) return;

      stream.on('error', function(err) {
        appendOutput('stderr: <'+err+'>' );
      });

      stream.on('data', function (data) {
        appendOutput(data);
      });

      stream.on('end', function() {
        done();
      });
    }.bind(this));

    function done() {
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

          // stream.pipe(process.stdout);

          stream.on('data', function (data) {
            appendOutput(data);
          });

          container.start(function(err, data) {
            if (err) {
              appendOutput(err);
              return
            }
            appendOutput(data);

            setDockerStatus('Docker build process completed');
          });

          stream.on('end', function () {
              setDockerStatus('Docker build process exited...');
          })
        });
      });
    }

    function appendOutput(msg) {
      document.getElementById("command-output").value += (msg);
    }

    function setDockerStatus(msg) {
      document.getElementById("status").innerHTML = msg;
    }

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
              <div id="status"></div>
              <textarea className={classes.textAreaStyle} rows="20" id="command-output" disabled></textarea>
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

export default withStyles(styles)(DockerCompose);
