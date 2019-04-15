import React, { Component } from 'react'
import DockerCheck from './DockerCheck.jsx'

export class CheckList extends Component {

  render() {

    return (
      <div>
        <DockerCheck handleStyle={this.props.handleStyle}/>
      </div>
    )
  }
}

export default CheckList
