/**
 * Created by micha on 12/12/16.
 */
import { fetchProjectById } from "../actions/projectActions"
import { fetchShotsForProject } from "../actions/shotsActions"
import { fetchKeyframeThumbnails } from "../actions/imageActions"
import { fetchChaptersForProject } from "../actions/chapterActions"
import { fetchSubtitlesForProject } from "../actions/subtitleActions"


export function fetchAll(projectId) {
  return (dispatch, getState) => {
    dispatch({type: "FETCH_VIEWER_INIT_RESET", payload: null});
    dispatch({type: "FETCH_VIEWER_INIT", payload: null});

    return dispatch(fetchProjectById(projectId)).then(() => {
      const project = getState().project.project;

      return Promise.all([
        dispatch(fetchChaptersForProject(project)),
        dispatch(fetchSubtitlesForProject(project)),
        dispatch(fetchShotsForProject(project)),
      ])
      .then(() => {
        const shots = getState().shots.shots;
        return dispatch(fetchKeyframeThumbnails(project, shots))
      })
      .then(() => {
        dispatch({type: "FETCH_VIEWER_INIT_FULFILLED", payload: null})
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: "FETCH_VIEWER_INIT_REJECTED", payload: err})
      })
    })
  }
}
