import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// custom components
import Readiness from "../../components/DockerInitForm/Readiness.jsx";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    }
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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  dense: {
    marginTop: 19,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const phpVersions = [
  {
    value: '7.2',
    label: 'v7.2.2',
  },
  {
    value: '7.1',
    label: 'v7.1.12',
  },
  {
    value: '7.0',
    label: 'v7.0.33',
  },
  {
    value: '5.6',
    label: 'v5.6.2',
  },
];

function DockerForm(props) {
  const { classes } = props;

  return (
    <div>
      <Readiness handleStyle={classes} handleVersion={phpVersions} />
    </div>
  );
}

export default withStyles(styles)(DockerForm);
