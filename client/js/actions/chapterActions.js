import axios from "axios";
import { baseUrl } from "../common/constants";


export function fetchChaptersForProject(project) {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects/${project.identifier}/chapters`;

    return axios.get(url)
      .then((response) => {
        dispatch({type: "FETCH_CHAPTERS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_CHAPTERS_REJECTED", payload: err})
      })
  }
}
