/**
 * Created by micha on 23/10/16.
 */
import React from "react"
import { connect } from "react-redux"

@connect((store) => {
  return {
    projects: store.projects.projects,
  };
})
export default class App extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>
  }
}
