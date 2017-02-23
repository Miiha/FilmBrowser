const idle = {
  chapters: [],
  fetching: false,
  fetched: false,
  error: null,
};
export default function reducer(state=idle, action) {

  switch (action.type) {
    case "FETCH_CHAPTERS": {
      return {...state, fetching: true}
    }
    case "FETCH_CHAPTERS_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_CHAPTERS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        chapters: action.payload,
      }
    }
  }

  return state
}
