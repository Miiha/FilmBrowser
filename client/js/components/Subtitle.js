import React from "react"
import TimeStamp from 'timestamps';
import TimeIndicator from "../components/TimeIndicator"
import { indexToMs } from "../common/constants"

export default class Subtitle extends React.Component {
  handleCharacterSelection(e) {
    this.props.onCharacterSelection(this.props.subtitle)
  }

  handleSubtitleSelection(e) {
    this.props.onSubtitleSelection(this.props.subtitle)
  }

  render() {
    const { subtitle, shot } = this.props;

    const start = TimeStamp.stamp(subtitle.t1);
    const [start0, start1] = start.split(".");

    const end = TimeStamp.stamp(subtitle.t2);
    const [end0, end1] = end.split(".");

    const name = subtitle.character || "UNTAGGED";
    const text = subtitle.originalText;

    const classes = `subtitle ${subtitle.filtered ? "filtered" : ""}`;
    const { duration, startIndex } = shot;
    const startMs = indexToMs(startIndex);

    const d1 = subtitle.t1 - startMs;
    const d2 = subtitle.t2 - startMs;

    return (
      <a href="#" className="list-group-item">
        <div className={classes}>
          <TimeIndicator d={duration} d1={d1} d2={d2} showsWidth={true}/>
          <p>{start0}<span className="xsmall">.{start1}</span> - {end0}<span className="xsmall">.{end1}</span></p>
          <a>
            <span className="character" onClick={this.handleCharacterSelection.bind(this)} style={{backgroundColor: subtitle.color}}>{name}</span>
          </a>
          <a className="text" onClick={this.handleSubtitleSelection.bind(this)}>
            {text}
          </a>
        </div>
      </a>
    )
  }
}
