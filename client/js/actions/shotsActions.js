import axios from "axios";
import { baseUrl } from "../common/constants";


export function fetchShotsForProject(project) {
  return (dispatch) => {
    const url = `${baseUrl}/api/projects/${project.identifier}/shots`;

    return axios.get(url)
      .then((response) => {
        dispatch({type: "FETCH_SHOTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_SHOTS_REJECTED", payload: err})
      })
  }
}

