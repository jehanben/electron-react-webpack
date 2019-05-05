import React, { Component } from 'react';

//core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Button from "../../components/CustomButtons/Button.jsx";

export class DockerCompileRun extends Component {

  handlePrev = () => {
    this.props.prevStep();
  }

  render() {
    const { handleStyle } = this.props;

    return(
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={handleStyle.cardTitleWhite}>Docker Compose and Execution</h4>
              <p className={handleStyle.cardCategoryWhite}>Starting up the docker container and PHP code checker.</p>
            </CardHeader>
            <CardFooter>
              <Button color="primary" onClick={this.handlePrev}>Go Back</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }
}

export default DockerCompileRun;
