/**
 * Created by micha on 18/12/16.
 */
import React from "react"
import Select from 'react-select';
import { connect } from "react-redux"
import _ from "lodash"

import { colors } from "../common/constants"

import { selectCharacter } from "../actions/subtitleActions"
import 'react-select/dist/react-select.css';
import "../../styles/search"

const CharacterOption = props => {
  return (
    <div className="text"><span className="indicator" style={{backgroundColor: props.color}}/>{props.label}</div>
  )
};

@connect((store) => {
  return {
    selected: store.subtitles.selectedCharacters,
    u: store.subtitles.updated,
    options: store.subtitles.characterSearchOptions
  }
})
export default class CharactersSearch extends React.Component {

  handleInputChange(input) {
    this.input = input;
    this.setState({isLoading: true});
  }

  onSelection(d) {
    this.props.dispatch(selectCharacter(d, true));
  }

  renderOption(option) {
    return (
      <CharacterOption label={option.label} color={option.color}/>
    );
  }

  renderValue(option, i) {
    return <strong style={{ color: option.color }}>{option.label}</strong>;
  }

  render() {
    return <div className="characterSearch">
      <Select
        name="character-filter"
        placeholder="Filter characters..."
        multi={true}
        value={this.props.selected}
        valueRenderer={this.renderValue}
        options={this.props.options}
        optionRenderer={this.renderOption.bind(this)}
        onInputChange={this.handleInputChange.bind(this)}
        onChange={this.onSelection.bind(this)}
      />
    </div>
  }
}

CharactersSearch.propTypes = {
  project: React.PropTypes.object,
  characters: React.PropTypes.array,
  options: React.PropTypes.array,
  selected: React.PropTypes.array,
};
