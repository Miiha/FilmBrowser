import _ from "lodash"
import update from "react/lib/update"
import TimeStamp from 'timestamps';

import { colors, untaggedColor } from "../common/constants"


const idle = {
  subtitles: [],
  characters: [],
  selectedCharacters: [],
  selectedSubtitles: [],
  characterSearchOptions: [],
  queriedSubtitles: [],
  lastQuery: null,
  fetching: false,
  fetched: false,
  error: null,
  updated: 0,
};

export default function reducer(state=idle, action) {

  switch (action.type) {
    case "FETCH_ALL_SUBTITLES": {
      return {...state, fetching: true}
    }
    case "FETCH_ALL_SUBTITLES_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_ALL_SUBTITLES_FULFILLED": {
      const subtitles = action.payload;
      const characters = _.chain(subtitles)
        .groupBy('character')
        .map((subtitles, key) => {
          if (key == "null") {
            key = "UNTAGGED"
          }
          return {subtitles, name: key}
        })
        .sort((a, b) => {
          return b.subtitles.length - a.subtitles.length;
        })
        .map(({subtitles, name}, i) => {
          let color = colors[i % colors.length];
          if (name === "UNTAGGED") {
            color = untaggedColor
          }
          return {subtitles, name, color}
        })
        .value();

      // link objects
      characters.forEach((d) => {
        d.subtitles.forEach((s) => {
          s.color = d.color;
        });
      });

      const characterSearchOptions =  _.chain(characters)
        .map((d) => {
          const {subtitles, name, color} = d;
          return {label: `(${subtitles.length}) ${name}`, value: subtitles, key: name, color: color}
        })
        .value();

      return {
        ...state,
        fetching: false,
        fetched: true,
        subtitles: action.payload,
        characters: characters,
        characterSearchOptions: characterSearchOptions
      }
    }
    case "CHARACTER_OPTION_SELECTION": {
      return {
        ...state, selectedCharacters: action.payload
      }
    }
    case "CHARACTER_SELECTED": {
      const data = action.payload;
      const chars = [...state.selectedCharacters];
      const name = data.character;

      const character = state.characterSearchOptions.filter((d) => {
        return d.key == name
      })[0];

      if (!character) break;

      if (!_.includes(chars, character)) {
        chars.push(character);
        return {...state, selectedCharacters: chars, updated: state.updated + 1}
      }
      break;
    }
    case "SUBTITLE_OPTION_SELECTION": {
      return {
        ...state, selectedSubtitles: action.payload
      }
    }
    case "SUBTITLE_SELECTED": {
      const subtitles = [...state.selectedSubtitles];
      const d = action.payload;

      const time = TimeStamp.stamp(d.t1);
      const option = {value: d, label: time + ": " + d.text};

      subtitles.push(option);
      return {
        ...state, selectedSubtitles: subtitles
      }
    }
    case "FETCH_SUBTITLES_FULFILLED": {
      const filteredSubtitles = action.payload.data;
      const ids = filteredSubtitles.map(d => d._id);

      const subtitles = state.subtitles.filter(d => ids.includes(d._id));

      return {
        ...state,
        queriedSubtitles: subtitles,
        lastQuery: action.payload.query
      }
    }
  }

  return state
}

