import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({});

function DockerCompose(props) {
  console.log(props.location.state.phpVersion);
  return (

   <div>This is a new page</div>
  )
}

export default withStyles(styles)(DockerCompose);
