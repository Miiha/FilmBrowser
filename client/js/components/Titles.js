import React from "react"
import { browserHistory } from 'react-router';
import { connect } from "react-redux"

import { fetchProjects, setProject } from "../actions/projectActions"

import "../../styles/titles"

class Figure extends React.Component {
  render() {
    const project = this.props.project;

    return (
      <div className="figure" onClick={this.props.handleOnClick}>
        <h3>{project.name}</h3>
      </div>
    )
  }
}

@connect((store) => {
  return {
    projects: store.projects.projects,
    project: store.project.project,
  };
})
export default class Titles extends React.Component {
  componentWillMount() {
    this.fetchProjects()
  }

  fetchProjects() {
    this.props.dispatch(fetchProjects())
  }

  loadProject(project, e) {
    this.props.dispatch(setProject(project));
    this.props.dispatch(() => { browserHistory.push(`/projects/${project.identifier}/`)});
  }

  render() {
    const { projects } = this.props;

    if (!projects.length) {
      return <button onClick={this.fetchProjects.bind(this)}>load projects</button>
    }

    const projectInstances = projects.map(project => <Figure key={project.identifier}
                                                             handleOnClick={(e)=> this.loadProject(project, e)}
                                                             project={project} />);

    return <div className="titles">
      <div className="bg"></div>
      <div className="projects">{projectInstances}</div>
      {this.props.children}
    </div>
  }
}
