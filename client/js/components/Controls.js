/**
 * Created by micha on 11/01/17.
 */
import React from "react"
import SubtitlesSearch from "./SubtitlesSearch"
import CharactersSearch from "./CharactersSearch"
import OtherControls from "./OtherControls"

import "../../styles/controls.sass"

export default class Controls extends React.Component {
  render() {
    return (
      <div className="controls">
        <SubtitlesSearch
          project={this.props.project}
          onLinkSelection={this.props.onLinkSelection}
        />

        <CharactersSearch
          project={this.props.project}
          characters={this.props.characters}
        />

        <OtherControls
          zoomLevel={this.props.zoomLevel}
          onZoomLevelChange={this.props.onZoomLevelChange}
          onZoomLevelChangeStop={this.props.onZoomLevelChangeStop}
          hidesFiltered={this.props.hidesFiltered}
          onHideFilterToggle={this.props.onHideFilterToggle}
        />

      </div>
    )
  }
}

Controls.propTypes = {
  onSubtitleQuery: React.PropTypes.func,
  onCharacterSelection: React.PropTypes.func,
  onZoomLevelChange: React.PropTypes.func,
  onZoomLevelChangeStop: React.PropTypes.func,
  onHideFilterToggle: React.PropTypes.func,
};
