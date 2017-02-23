export default function reducer(state={
    projects: [],
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_PROJECTS": {
        return {...state, fetching: true}
      }
      case "FETCH_PROJECTS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_PROJECTS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          projects: action.payload,
        }
      }
      case "UPDATE_PROJECT": {
        const { id, text } = action.payload;
        const newProjects = [...state.projects];
        const projectToUpdate = newProjects.findIndex(project => project.id === id);
        newProjects[projectToUpdate] = action.payload;

        return {
          ...state,
          projects: newProjects,
        }
      }
      case "DELETE_PROJECT": {
        return {
          ...state,
          projects: state.projects.filter(project => project.id !== action.payload),
        }
      }
    }

    return state
}
