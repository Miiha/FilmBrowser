/**
 * Created by micha on 18/12/16.
 */

import React from "react"
import Select from 'react-select';
import TimeStamp from 'timestamps';
import { connect } from "react-redux"
import _ from "lodash"

import { selectSubtitles } from "../actions/subtitleActions"
import { fetchSubtitlesByFilter } from "../actions/subtitleActions"
import { isArray } from "../common/helper"
import { indexToMs, thumbnailUrl } from "../common/constants"

import 'react-select/dist/react-select.css';
import "../../styles/search"

const FilterOption = {
  SELECT: "single subtitle",
  MULTIPLE: "multiple subtitles"
};

const SubtitleOption = props => {
  const { subtitle } = props;
  const t1 = TimeStamp.stamp(subtitle.t1);
  const t2 = TimeStamp.stamp(subtitle.t2);

  return (
    <div className="subtitle">
      <div style={{display: "inline-block"}}>
        <img src={props.imageUrl} />
      </div>
      <div className="data" style={{display: "inline-block"}}>
        <p className="timecode">{t1} - {t2}</p>
        <p><span className="character" style={{backgroundColor: subtitle.color}}>{subtitle.character}</span> {subtitle.text}</p>
      </div>
    </div>
  )
};

@connect((store) => {
  return {
    lastQuery: store.subtitles.lastQuery,
    selection: store.subtitles.selectedSubtitles,
    subtitles: store.subtitles.queriedSubtitles,
    shots: store.shots.shots,
    project: store.project.project,
  };
})
export default class SubtitlesSearch extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      filterOption: FilterOption.SELECT,
      options: [],
      value: null
    };

    this.handleInputChangeDelayed = _.debounce(this.handleInputChange, 250);
  };

  componentWillReceiveProps(props) {
    if ('subtitles' in props) {
      if (this.props.subtitles == props.subtitles) {
        return;
      }

      const shots = props.subtitles.map((s) => {
        return _.find(props.shots, (d) => {
          const shotStart = indexToMs(d.startIndex);
          return s.t1 <= shotStart;
        })
      });

      const options = _.zip(props.subtitles, shots)
        .map((tuple) => {
          const subtitle = tuple[0];
          const shot = tuple[1];

          const time = TimeStamp.stamp(subtitle.t1);
          return {value: subtitle, label: time + ": " + subtitle.text, shot: shot}
        });

      this.setState({options: options, isLoading: false})
    }
  }

  handleInputChangeDelayed(input) {
    this.handleInputChange(input)
  }

  handleInputChange(d) {
    if (d.length) {
      this.props.dispatch(fetchSubtitlesByFilter(this.props.project, d));
      this.setState({isLoading: true});
    }
  }

  handleChange(d) {
    if (this.state.filterOption == FilterOption.MULTIPLE) {
      if (d.length > (this.props.selection && this.props.selection.length)) {
        const selection = d[d.length - 1];

        if (selection) {
          selection.value = this.state.options.map((d) => {
            return d.value
          });
          selection.label = `(${selection.value.length}) ${this.props.lastQuery}`;
        }
      }

      this.props.dispatch(selectSubtitles(d));
      this.setState({options: []});
    } else if (this.state.filterOption == FilterOption.SELECT) {
      this.props.dispatch(selectSubtitles(d));
    }
  }

  handleValueClick(d) {
    this.props.onLinkSelection(d)
  }

  handleOptionChange(d) {
    console.log(d);
    this.setState({filterOption: FilterOption.MULTIPLE, options: []})
  }

  handleOptionChange2(d) {
    console.log(d);
    this.setState({filterOption: FilterOption.SELECT, options: []})
  }

  renderValue(option) {
    // multiple values
    if (isArray(option.value)) {
      return option.label
    } else {
      return <span style={{ color: "white" }}>{option.label}</span>;
    }
  }

  renderOption(option) {
    const url = thumbnailUrl(option.shot, this.props.project);
    return (
      <SubtitleOption subtitle={option.value} imageUrl={url}/>
    );
  }

  render() {
    return (
    <div className="subtitleSearch">
      <Select
        name="subtitle-search"
        placeholder="Query subtitles..."
        multi={true}
        isLoading={this.state.isLoading}
        value={this.props.selection}
        options={this.state.options}
        optionRenderer={this.renderOption.bind(this)}
        onInputChange={this.handleInputChangeDelayed.bind(this)}
        onChange={this.handleChange.bind(this)}
        valueRenderer={this.renderValue.bind(this)}
        onValueClick={this.handleValueClick.bind(this)}
      />

      <div className="inputs">
        <div>
          <label>
            <input type="radio" name="select"
                   value={FilterOption.SELECT}
                   checked={this.state.filterOption === FilterOption.SELECT}
                   onChange={this.handleOptionChange2.bind(this)} />
            {FilterOption.SELECT}</label>
        </div>
        <div>
          <label>
            <input type="radio" name="multiple"
                   value={FilterOption.MULTIPLE}
                   checked={this.state.filterOption === FilterOption.MULTIPLE}
                   onChange={this.handleOptionChange.bind(this)} />
            {FilterOption.MULTIPLE}</label>
        </div>
      </div>
    </div>
  )
  }
}

SubtitlesSearch.defaultProps = {
  subtitles: []
};
