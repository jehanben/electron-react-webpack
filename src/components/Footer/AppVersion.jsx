import React, { Component } from 'react'
var packaging = require('./../../../package.json');

export class AppVersion extends Component {
  render() {
    return (
      <span>
        &nbsp; v{packaging.version}
      </span>
    )
  }
}

export default AppVersion
