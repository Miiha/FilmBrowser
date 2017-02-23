import axios from "axios";
import { baseUrl } from "../common/constants";


export function fetchSubtitlesForProject(project) {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects/${project.identifier}/subtitles`;

    return axios.get(url)
      .then((response) => {
        dispatch({type: "FETCH_ALL_SUBTITLES_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_ALL_SUBTITLES_REJECTED", payload: err})
      })
  }
}

export function fetchSubtitlesByFilter(project, filter) {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects/${project.identifier}/subtitles`;
    const query = `?search=${filter}`;

    return axios.get(url+query)
      .then((response) => {
        dispatch({type: "FETCH_SUBTITLES_FULFILLED", payload: {data: response.data, query: filter}})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_SUBTITLES_REJECTED", payload: err})
      })
  }
}

export function selectCharacter(d, searchField = true) {
  return (dispatch) => {
    const promise = new Promise((resolve, reject) => {
      dispatch({type: searchField ? "CHARACTER_OPTION_SELECTION" : "CHARACTER_SELECTED", payload: d});
      resolve(d);
    });
    return promise
  }
}

export function selectSubtitles(d, searchField = true) {
  return (dispatch) => {
    const promise = new Promise((resolve, reject) => {
      dispatch({type: searchField ? "SUBTITLE_OPTION_SELECTION" : "SUBTITLE_SELECTED", payload: d});
      resolve(d);
    });
    return promise
  }
}
