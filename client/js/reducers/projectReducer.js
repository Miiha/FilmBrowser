const idle = {
  project: {
    id: null,
    name: null,
    identifier: null,
    keyframeMontageSize: null,
    keyframeSize: null
  },
  fetching: false,
  fetched: false,
  error: null,
};
export default function reducer(state=idle, action) {

    switch (action.type) {
      case "FETCH_PROJECT": {
        return {...state, fetching: true}
      }
      case "SET_PROJECT": {
        return {...state, fetched: true, project: action.payload}
      }
      case "FETCH_PROJECT_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_PROJECT_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          project: action.payload,
        }
      }
    }

    return state
}
