import axios from "axios";
import { baseUrl } from "../common/constants";

export function fetchProjects() {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects`;
    return axios.get(url)
      .then((response) => {
        dispatch({type: "FETCH_PROJECTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_PROJECTS_REJECTED", payload: err})
      })
  }
}

export function fetchProjectById(id) {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects/${id}`;
    return axios.get(url)
      .then((response) => {
        dispatch({type: "FETCH_PROJECT_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_PROJECT_REJECTED", payload: err})
      })
  }
}

export function setProject(project) {
  return (dispatch) => {
    Promise.resolve()
      .then(() => {
        dispatch({type: "SET_PROJECT", payload: project})
      });
  }
}