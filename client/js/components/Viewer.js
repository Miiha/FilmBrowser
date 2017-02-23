/** * Created by micha on 23/10/16.
 */
import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import keydown from 'react-keydown'

import Controls from "./Controls"
import Shots from "./Shots"
import Chapters from "./Chapters"
import Details from "./Details"
import LoadingIndicator from "./LoadingIndicator"

import { createWidthScale } from "./d3SharedScales"
import { indexToMs } from "../common/constants"

import _ from "lodash"

import { fetchAll } from "../actions/viewerInitActions"

import "../../styles/bootstrap-slider.css"
import "../../styles/viewer"

window.ReactDOM = ReactDOM;

const Keyboard = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
};

@connect((store) => {
  return {
    project: store.project.project,
    projectFetched: store.project.fetched,
    shotsFetched: store.shots.fetched,
    allFetched: store.viewerInit.fetched,
    keyframes: store.images.keyframeMontage,
    keyframesFetched: store.images.fetched,
    shots: store.shots.shots,

    subtitles: store.subtitles.subtitles,
    u: store.subtitles.updated,
    characters: store.subtitles.characters,
    selectedCharacters: store.subtitles.selectedCharacters,
    selectedSubtitles: store.subtitles.selectedSubtitles,

    chapters: store.chapters.chapters,
  };
})
@keydown
export default class Viewer extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      zoomLevel: 100,
      delayedZoomLevel: 100,
      filteredShots: [],
      filteredSubtitles: [],
      hidesFiltered: false,
      showsDetails: false,
      selectedShotIndex: null,
      subtitlesPerShot: [],
      shotsOffset: 0
    };
  };

  flattenSubtitleSelection(d) {
    const { subtitles } = this.props;

    const filteredSubtitles = _.chain(d)
      .map(d => d.value)
      .flatten()
      .uniqBy(d => d._id)
      .map(d => d._id)
      .value();

    return subtitles.filter(d => filteredSubtitles.includes(d._id));
  }

  componentWillReceiveProps(props) {
    if (props.shots !== this.state.filteredShots) {
      this.setState({filteredShots: props.shots});
    }

    if (props.subtitles !== this.state.filteredSubtitles) {
      this.setState({filteredSubtitles: props.subtitles});
    }

    if (props.allFetched) {
      const sps = subtitlesPerShot(this.props.shots, this.props.subtitles);
      window.shots = sps;
      this.setState({subtitlesPerShot: sps}, () => {
        if ("selectedCharacters" in props && props.selectedCharacters) {
          this.handleCharacterSelection(props.selectedCharacters);
        }

        if ("selectedSubtitles" in props && props.selectedSubtitles) {
          this.handleSubtitleSelection(props.selectedSubtitles);
        }
      });
    }

    if (props.keydown.event) {
      this.handleKeyboardPress(props.keydown.event);
    }
  }

  componentWillMount() {
    const params = this.props.params;
    const diff = params.id !== this.props.project.identifier;

    if (diff || !this.props.allFetched) {
      this.props.dispatch(fetchAll(params.id));
    }
  }

  // controls

  handleZoomLevelChange(d) {
    this.updateZoomLevel({zoomLevel: d}, this.state.zoomLevel)
  }

  handleZoomChangeStop(d) {
    this.updateZoomLevel({zoomLevel: d, delayedZoomLevel: d}, this.state.zoomLevel)
  }

  updateZoomLevel(state, oldZoomLevel) {
    const [ shotWidth ] = this.props.project.keyframeMontageSize;
    const scaledWidth = createWidthScale(shotWidth)(oldZoomLevel / 100);
    const center = this.shotsView.offsetWidth / 2;
    const centerOffset =  this.shotsView.scrollLeft + center;
    const visibleStartIndex = (centerOffset / scaledWidth) | 0;

    this.setState(state, () => {
      const scaledWidth = createWidthScale(shotWidth)(state.zoomLevel / 100);
      this.shotsView.scrollLeft = visibleStartIndex * scaledWidth - center + scaledWidth/2;
    });
  }

  get isFiltering() {
    return !_.isEmpty(this.characterSelection) || !_.isEmpty(this.subtitleSelection);
  }

  handleShotsScrollChange(dom) {
    this.setState({shotsOffset: dom.scrollLeft, delayedZoomLevel: this.state.zoomLevel})
  }

  handleSubtitleLinkSelection(d) {
    const subtitlesPerShots = this.state.subtitlesPerShot;

    for (let i = 0; i < subtitlesPerShots.length; i++) {
      const subtitles = subtitlesPerShots[i];
      for (let j = 0; j < subtitles.length; j++) {
        const subtitle = subtitles[j];
        if (d.value._id == subtitle._id) {
          this.setState({selectedShotIndex: i, showsDetails: true});
          this.centerShotIndex(i);
          return;
        }
      }
    }
  }

  centerShotIndex(index) {
    const [ shotWidth ] = this.props.project.keyframeMontageSize;
    const center = this.shotsView.offsetWidth / 2;
    const scaledWidth = createWidthScale(shotWidth)(this.state.zoomLevel / 100);
    this.shotsView.scrollLeft = index * scaledWidth - center + scaledWidth/2;
  }

  handleHideFilterToggle(value) {
    this.setState({hidesFiltered: value})
  }

  handleSubtitleSelection(d) {
    this.subtitleSelection = d;

    this.filterBySubtitles(d)
  }

  handleCharacterSelection(d) {
    this.characterSelection = d;
    this.filterBySubtitles(d)
  }

  filterBySubtitles(d) {
    const subtitles = this.intersectSelections(this.characterSelection, this.subtitleSelection);
    const shots = filterShotsBySubtitles(this.props.shots, subtitles);

    const subtitlesPer = this.subtitlesPerShot(subtitles);
    this.setState({
      subtitlesPerShot: subtitlesPer,
      filteredShots: shots.length ? shots : this.props.shots,
      filteredSubtitles: subtitles,
    });
  }

  subtitlesPerShot(subtitles) {
    const subtitleIds = subtitles.map((d) => {
      return d._id;
    });

    // console.log(this.state.subtitlesPerShot);
    return this.state.subtitlesPerShot.map((groupedSubtitles) => {
      groupedSubtitles.forEach((d) => {
        d.filtered = subtitleIds.includes(d._id);
      });

      return groupedSubtitles;
    })
  }

  intersectSelections(characterSelection, subtitleSelection) {
    const characterSubtitles = this.flattenSubtitleSelection(characterSelection);
    const subtitleSubtitles = this.flattenSubtitleSelection(subtitleSelection);

    if (_.isEmpty(characterSubtitles) && !_.isEmpty(subtitleSubtitles)) {
      return subtitleSubtitles;
    } else if (!_.isEmpty(characterSubtitles) && _.isEmpty(subtitleSubtitles)) {
      return characterSubtitles;
    } else {
      const inter = _.intersection(characterSubtitles, subtitleSubtitles);
      const merged = _.union(characterSubtitles, subtitleSubtitles);
      // console.log(inter);
      // console.log(merged);
      return inter;
    }
  }

  // shots

  handleShotMouseOver(d) {
    this.setState({showsDetails: true, selectedShotIndex: d.id})
  }

  handleShotMouseOut(d) {
    this.setState({showsDetails: false})
  }

  onRemoveNode(d, i) {
    const newShots = [...this.state.filteredShots];
    newShots.splice(i, 1);

    this.setState({filteredShots: newShots})
  }

  handleShotMount(d) {
    this.shotsView = d;
  }
  // chapters

  handleChapterClick(chapter) {
    const { shots } = this.props;
    const [ shotWidth ] = this.props.project.keyframeMontageSize;

    const filteredShots = shotsForChapter(shots, chapter);
    const width = this.shotsView.offsetWidth / filteredShots.length;
    const zoom = Math.min(width / shotWidth * 100, 100);

    this.setState({zoomLevel: zoom}, () => {
      const scaledWidth = createWidthScale(shotWidth)(this.state.zoomLevel / 100);

      const index = _.findIndex(shots, (d) => {
        const shotStartMs = indexToMs(d.startIndex);
        return shotStartMs >= chapter.t1;
      });

      this.shotsView.scrollLeft = index * scaledWidth;
    });
  }

  // other

  handleKeyboardPress(e) {
    if (e.which == Keyboard.LEFT_ARROW) {
      const index = this.state.selectedShotIndex - 1;
      this.setState({selectedShotIndex: index})
    } else if (e.which == Keyboard.RIGHT_ARROW) {
      const index = this.state.selectedShotIndex + 1;
      this.setState({selectedShotIndex: index})
    }
  }

  handleStepLeft(e) {
    const [ shotWidth ] = this.props.project.keyframeMontageSize;
    const scaledWidth = createWidthScale(shotWidth)(this.state.zoomLevel / 100);
    const zoom = this.state.zoomLevel / 100;
    console.log(this.shotsView, scaledWidth);
    this.shotsView.scrollLeft -= scaledWidth;
  }

  handleStepRight(e) {
    const [ shotWidth ] = this.props.project.keyframeMontageSize;
    const scaledWidth = createWidthScale(shotWidth)(this.state.zoomLevel / 100);
    const zoom = this.state.zoomLevel / 100;
    this.shotsView.scrollLeft += scaledWidth;
  }

  render() {
    const { project, shots, chapters, params } = this.props;
    const id = project.identifier;
    const show = this.props.allFetched && (params.id == id);

    return <div className="viewer">
      <div className="top" onKeyPress={this.handleKeyboardPress}>
        { id && <h1>{project.name}</h1>}

        { show &&
        <Controls project={project}
                  characters={this.props.characters}
                  zoomLevel={this.state.zoomLevel}
                  hidesFiltered={this.state.hidesFiltered}
                  onZoomLevelChange={this.handleZoomLevelChange.bind(this)}
                  onZoomLevelChangeStop={this.handleZoomChangeStop.bind(this)}
                  onHideFilterToggle={this.handleHideFilterToggle.bind(this)}
                  onLinkSelection={this.handleSubtitleLinkSelection.bind(this)}
        /> }
      </div>
      { show &&
      <Shots shots={this.state.filteredShots}
             allShots={shots}
             subtitlesPerShot={this.state.subtitlesPerShot}
             project={project}
             zoomLevel={this.state.zoomLevel}
             onScroll={this.handleShotsScrollChange.bind(this)}
             hidesFiltered={this.state.hidesFiltered}
             isFiltering={this.isFiltering}
             onMouseOver={this.handleShotMouseOver.bind(this)}
             onMouseOut={this.handleShotMouseOut.bind(this)}
             removeNode={this.onRemoveNode.bind(this)}
             onMountDOM={this.handleShotMount.bind(this)}
             onStepLeft={this.handleStepLeft.bind(this)}
             onStepRight={this.handleStepRight.bind(this)}
      />
      }
      { this.state.selectedShotIndex &&
      <Details
        showModal={this.state.showsDetails}
        project={this.props.project}
        shotIndex={this.state.selectedShotIndex}
        shots={shots}
        subtitles={this.state.subtitlesPerShot[this.state.selectedShotIndex]}
        onCloseModal={this.handleShotMouseOut.bind(this)}
      />
      }
      { show &&
      <Chapters chapters={chapters}
                shots={shots}
                offset={this.state.shotsOffset}
                zoomLevel={this.state.delayedZoomLevel}
                hidesFiltered={this.state.hidesFiltered}
                onSelection={this.handleChapterClick.bind(this)}
      />
      }
      { !show && <LoadingIndicator/>}
    </div>
  }
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function subtitlesBetween(subtitles, msStart, msEnd) {
  return _.filter(subtitles, (d) => {
    return (between(d.t1, msStart, msEnd) || between(d.t2, msStart, msEnd))
      || (between(msStart, d.t1, d.t2) || between(msEnd, d.t1, d.t2));
  })
}

function shotsBySubtitle(shots, subtitle) {
  return _.filter(shots, (d) => {
    const shotStart = indexToMs(d.startIndex);
    const shotEnd = shotStart + d.duration;

    return (between(subtitle.t1, shotStart, shotEnd) || between(subtitle.t2, shotStart, shotEnd))
      || (between(shotStart, subtitle.t1, subtitle.t2) || between(shotEnd, subtitle.t1, subtitle.t2));
  })
}

const filterShotsBySubtitles = (shots, subtitles) => {
  const filteredShots = _.chain(subtitles)
      .map((subtitle) => {
        return shotsBySubtitle(shots, subtitle);
      })
      .flatten()
      .uniqBy((d) => { return d.id })
      .sortBy("id")
      .value();

  const filteredIds = filteredShots.map((d) => {
    return d.id;
  });

  shots.forEach((d) => {
    d.filtered = filteredIds.includes(d.id);
  });

  return shots;
};

const subtitlesPerShot = (shots, subtitles) => {
  return shots.map((d, i) => {
    const shotStart = indexToMs(d.startIndex);
    const shotEnd = indexToMs(d.endIndex);
    console.log(i, d, shotStart, shotEnd);

    return subtitlesBetween(subtitles, shotStart, shotEnd)
  });
};

const shotsForChapter = (shots, chapter) => {
  return _.filter(shots, (d) => {
    const start = indexToMs(d.startIndex);
    const end = indexToMs(d.endIndex) + d.duration;
    return start >= chapter.t1 && start < chapter.t2 || end >= chapter.t1 && end < chapter.t2;
  });
};

Viewer.defaultProps = {
};

