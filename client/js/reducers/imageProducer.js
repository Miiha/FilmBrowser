const idle = {
  keyframeMontage: null,
  fetching: false,
  fetched: false,
  error: null,
};
export default function reducer(state=idle, action) {

    switch (action.type) {
      case "FETCH_KEYFRAME_THUMBNAILS": {
        return {...state, fetching: true}
      }
      case "FETCH_KEYFRAME_THUMBNAILS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_KEYFRAME_THUMBNAILS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          shots: action.payload,
        }
      }
    }

    return state
}
