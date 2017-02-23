const idle = {
  shots: [],
  fetching: false,
  fetched: false,
  error: null,
};
export default function reducer(state=idle, action) {

    switch (action.type) {
      case "FETCH_SHOTS": {
        return {...state, fetching: true}
      }
      case "FETCH_SHOTS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_SHOTS_FULFILLED": {
        const shots = action.payload;
        shots.forEach ((d) =>{
          d.filtered = false;

          const colors = d.keyframe.colors;
          if (colors) {
            let x = 0;
            colors.forEach((d, i) => {
              if (i == 0) {
                d.dp = 0
              } else {
                d.dp = x
              }

              x += d.frequency
            });
          }
        });

        return {
          ...state,
          fetching: false,
          fetched: true,
          shots: shots,
        }
      }
    }

    return state
}
