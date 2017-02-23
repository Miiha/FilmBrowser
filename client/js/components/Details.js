/**
 * Created by micha on 29/12/16.
 */

import React from "react"
import ReactModal from "react-modal"
import { connect } from "react-redux"
import TimeStamp from 'timestamps';

import Subtitle from "../components/Subtitle"
import TimeIndicator from "../components/TimeIndicator"

import { keyframeUrl, averageShotLength } from "../common/constants"
import { selectCharacter, selectSubtitles } from "../actions/subtitleActions"
import { indexToMs } from "../common/constants"

import "../../styles/details"

const Stats = props => {
  const { index, shots } = props;
  const shot = shots[index];
  const avgShotLength = averageShotLength(shots);
  const debug = process.env.NODE_ENV !== "production";

  const start = TimeStamp.stamp(indexToMs(shot.startIndex));
  const [start0, start1] = start.split(".");

  const end = TimeStamp.stamp(indexToMs(shot.endIndex));
  const [end0, end1] = end.split(".");

  return (
    <div className="stats">
      <div>
        <p>
          <span className="big">{shot.id}</span>
          <span className="mid"> /</span>
          <span className="small"> {shots.length - 1}</span>
        </p>
      </div>
      <div>
        <p className="seconds"><span className="big">{shot.duration / 1000}</span> s</p>
        <p>&Oslash;	{avgShotLength}</p>
      </div>
      <div className="time">
        <p>{start0}<span className="xsmall">.{start1}</span></p>
        <p className="dash">-</p>
        <p>{end0}<span className="xsmall">.{end1}</span></p>
      </div>
      { debug &&
      <div>
        <p className="xsmall">startIndex: {shot.startIndex}</p>
      </div>
      }
    </div>
  )
};

@connect((store) => {
  return {
    shots: store.shots.shots,
  }
})
export default class Details extends React.Component {
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleCharacterSelection(d) {
    this.props.dispatch(selectCharacter(d, false))
  }

  handleSubtitleSelection(d) {
    this.props.dispatch(selectSubtitles(d, false))
  }

  render () {
    const padding = 90; // adjust this to your needs
    let height = (300 + padding);
    let heightPx = height + 'px';
    let heightOffset = height / 2;
    let offsetPx = heightOffset + 'px';

    const style = {
      overlay : {
        backgroundColor   : 'rgba(50, 50, 50, 0.50)'
      },
      content: {
        border: '0',
        borderRadius: '0px',
        bottom: 'auto',
        height: heightPx,
        left: '50%',
        padding: '0',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-' + offsetPx + ')',
        width: '50%',
        maxWidth: '60rem'
      }
    };

    const {shots, shotIndex, project, subtitles} = this.props;
    const shot = shots[shotIndex];

    const fullDuration = shots.map(d => d.duration).reduce((a, b) => { return a + b });
    const d1 = indexToMs(shot.startIndex);
    const d2 = indexToMs(shot.endIndex);

    const subtitleViews = subtitles.map((d) => {
      return <Subtitle onCharacterSelection={this.handleCharacterSelection.bind(this)}
                       onSubtitleSelection={this.handleSubtitleSelection.bind(this)}
                       subtitle={d} key={d._id}
                       shot={shot}
      />
    });

    return (
      <ReactModal
        isOpen={this.props.showModal}
        contentLabel="Label"
        onRequestClose={this.props.onCloseModal}
        style={style}
      >
        <div className="details">
          <img src={keyframeUrl(shot, project)} alt="keyframe" />
          <Stats index={shotIndex} shots={shots} />
          <TimeIndicator d={fullDuration} d1={d1} d2={d2}/>
          <div className="content">
            <div className="subtitles list-group">
              {subtitleViews}
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}
