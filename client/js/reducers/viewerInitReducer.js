const idle = {
  fetching: false,
  fetched: false,
  error: null,
};
export default function reducer(state=idle, action) {

    switch (action.type) {
      case "FETCH_VIEWER_INIT_RESET": {
        return idle
      }
      case "FETCH_VIEWER_INIT": {
        return {...state, fetching: true}
      }
      case "FETCH_VIEWER_INIT_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_VIEWER_INIT_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true
        }
      }
    }

    return state
}
