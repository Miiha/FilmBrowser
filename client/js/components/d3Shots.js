/**
 * Created by micha on 13/12/16.
 */
import * as d3 from "d3";
import d3Tip from "d3-tip";
import TimeStamp from 'timestamps';
import shotScales from "./d3SharedScales"
import { thumbnailUrl, untaggedColor, disabledColor } from "../common/constants"

const d3Shots = {};
const shotsSvgHeight = 600;
const shotMaxLength = 100;
var maxColorHeight = 40;

const lengthToSec = (d) => {
  return d / 25.0
};

const subtitleTip = d3Tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    const t1 = TimeStamp.stamp(d.t1);
    const t2 = TimeStamp.stamp(d.t2);

    return `<p class="subtitle"><span class="character" style="background-color: ${d.color}">${d.character || "UNKNOWN"}</span> ${d.originalText}</p>
    <p class="timeCodes">${t1} - ${t2}</p>`;
  });

const shotLengthTip = d3Tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return `<p>${lengthToSec(d.length)}s</p>`;
  });

d3Shots.create = (el, data, state) => {
  window.d3 = d3;

  const svg = d3.select(el).select(".d3")
    .attr('class', 'd3')
    .attr('width', "100%")
    .attr('height', shotsSvgHeight);

  // filters

  const defs = svg.append("defs");
  defs
    .append("filter")
    .attr("id", "blur")
    .append("feGaussianBlur")
    .attr("stdDeviation", 5);

  defs.append("filter")
    .attr('id','desaturate')
    .append('feColorMatrix')
    .attr('type','matrix')
    .attr('values',"0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0");

  d3Shots.update(el, data, state);
};

d3Shots.update = (el, data, state) => {
  d3Shots._drawShots(el, data, state);
};

d3Shots.destroy = function(el) {
};

d3Shots._drawShots = (el, data, state) => {
  const { widthScale, xScale, shotLengthScale } = shotScales(el, data, state);
  const { height, url, shotWidth, zoomLevel, isFiltering, project } = state;
  const { onClick, onMouseOver, onMouseOut } = state;
  const shotData = data.shots;
  const subtitlesPerShot = data.subtitlesPerShot;
  const hasColors = shotData.length && shotData[0].keyframe.colors != null;
  maxColorHeight = hasColors ? maxColorHeight : 0;

  const scaledWidth = widthScale(zoomLevel);

  const textScale = d3.scaleLinear()
    .domain([0, 1])
    .range([8, 16])
    .interpolate(d3.interpolateRound);

  const fontSize = textScale(zoomLevel);

  // transitions

  const t = d3.transition()
    .duration(500)
    .ease(d3.easeLinear);

  // update svg width

  const svg = d3.select(el).select('.d3');

  svg
    .attr("width", shotData.length * scaledWidth)
    .attr("height", shotsSvgHeight);

  subtitleTip
    .offset([-10, 0]);

  svg.call(subtitleTip);
  svg.call(shotLengthTip);

  /////////////////////////////////////////////////////////
  // DATA JOIN

  const shotsSelection = svg.selectAll("g.shot").data(shotData, (d) => { return d._id });

  /////////////////////////////////////////////////////////
  // EXIT

  shotsSelection.exit()
    .attr("transform",  (d, i) => {
      return `translate(${xScale(i)},${0})`
    })
    .transition(t)
    .style("opacity", 0)
    .attr("transform",  (d, i) => {
      return `translate(${xScale(i)},${200})`
    })
    .remove();

  /////////////////////////////////////////////////////////
  // ENTER

  const shot = shotsSelection.enter().append("g")
    .attr("class", "shot")
    .attr("transform", (d, i) => {
      return `translate(${xScale(i)},${0})`
    });

    // enter and update
    shot.merge(shot)
      .on("click", (d, i) => {
        // onClick(d, i)
        onMouseOver(d);
      });

  const image = shot.append("image")
    .style("overflow", "hidden")
    .attr("y", 100)
    .attr("class", "keyframe")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("width", scaledWidth)
    .attr("height", height)
    .attr("xlink:href", (d) => {
      return thumbnailUrl(d, project);
    });

  const text = shot.append("text")
    .attr("class", "number")
    .attr("y", 115)
    .attr("x", 3)
    .attr("font-size", fontSize)
    .text((d) => { return d.id });

  const shotLength = shot.append("rect")
    .attr("class", "shotLength")
    .attr("width", scaledWidth)
    .attr("y", (d) => shotMaxLength - shotLengthScale(lengthToSec(d.length)))
    .attr("height", (d) => shotLengthScale(lengthToSec(d.length)))
    .attr("fill", (d) => { return shotLengthColor(d); })
    .on('mouseover', shotLengthTip.show)
    .on('mouseout', shotLengthTip.hide);


  // colors

  if (hasColors) {
    const colors = shot.append("g")
      .attr("class", "colors")
      .attr("transform", `translate(${0},${shotMaxLength + height})`);

    colors.selectAll("rect")
      .data((d) => {
        return d.keyframe.colors.map((color) => {
          return {color: color, shot: d}
        })
      })
      .enter().append("rect")
      .attr("class", "color")
      .attr("x", 0)
      .attr("y", (d) => {
        return d.color.dp * maxColorHeight
      })
      .attr("width", scaledWidth)
      .attr("height", (d) => {
        return maxColorHeight * d.color.frequency;
      })
      .attr("fill", (d) => {
        return convertColor(d.color, d.shot, isFiltering);
      });
  }

  // subtitles

  const subtitleHeight = Math.min(Math.max(scaledWidth / 5, 3), 15);
  const subtitleYOffset = (d, i) => { return 2 + subtitleHeight * i + (i * 1); };

  const subtitles = shot.append("g")
    .attr("subtitles", "subtitles")
    .attr("transform", `translate(${0},${shotMaxLength + height + maxColorHeight})`);

  const subtitleColor = (d) => {
    return isFiltering ? (d.filtered ? d3.rgb(d.color) : d3.rgb(disabledColor)) : d3.rgb(d.color);
  };

  subtitles.selectAll("rect")
    .data((d) => {
      return subtitlesPerShot[d.id]
    })
    .enter().append("rect")
      .attr("class", "subtitle")
      .attr("x", 0)
      .attr("y", subtitleYOffset)
      .attr("width", scaledWidth - 1)
      .attr("height", subtitleHeight)
      .attr("fill", subtitleColor)
      .on('mouseover', subtitleTip.show)
      .on('mouseout', subtitleTip.hide);

  /////////////////////////////////////////////////////////
  // UPDATE

  shotsSelection
    .attr("transform", (d, i) => {
      return `translate(${xScale(i)},${0})`
    });

  // keyframe

  shotsSelection.select("image.keyframe")
    .attr("filter", (d) => {
      if (isFiltering) {
        return d.filtered ? null : "url(#desaturate)";
      } else {
        return null;
      }
    })
    .attr("width", scaledWidth);

  // text

  shotsSelection.select("text.number")
    .attr("font-size", fontSize)
    .classed("hidden", scaledWidth < shotWidth * 0.06);

  // length

  shotsSelection.select(".shotLength")
    .attr("width", scaledWidth)
    .attr("y", (d) => shotMaxLength - shotLengthScale(lengthToSec(d.length)))
    .attr("height", (d) => shotLengthScale(lengthToSec(d.length)))
    .attr("fill", (d) => { return shotLengthColor(d); });

  // colors
  if (hasColors) {
    shotsSelection.select(".colors")
      .classed("update", true);

    shotsSelection.selectAll("rect.color")
      .data((d) => {
        return d.keyframe.colors.map((color) => {
          return {color: color, shot: d}
        })
      })
      .attr("width", scaledWidth)
      .attr("fill", (d, i) => {
        return convertColor(d.color, d.shot, isFiltering);
      });
  }

  // subtitles

  shotsSelection.selectAll("rect.subtitle")
    .data((d) => {
      return subtitlesPerShot[d.id]
    })
    .attr("x", 0)
    .attr("y", subtitleYOffset)
    .attr("width", scaledWidth - 1)
    .attr("height", subtitleHeight)
    .transition()
      .delay((d,i) => 5 * (i + 1))
      .duration(150)
      .attr("fill", subtitleColor)
};

const shotLengthColor = (shot, isFiltering) => {
  return shot.filtered ? d3.rgb(255, 255, 255) : d3.rgb(0, 0, 0)
};

const convertColor = (color, shot, isFiltering) => {
  const values = color.values;
  if (isFiltering) {
    if (shot.filtered) {
      return d3.rgb(values[0], values[1], values[2]);
    } else {
      return rgb2grey(values[0], values[1], values[2]);
    }
  } else {
    return d3.rgb(values[0], values[1], values[2]);
  }
};

const rgb2grey = (red, green, blue) => {
  const intensity = 0.2989*red + 0.5870*green + 0.1140*blue;
  return d3.rgb(intensity, intensity, intensity);
};

export default d3Shots;
