/**
 * Created by micha on 18/12/16.
 */
import * as d3 from "d3";
import d3Tip from "d3-tip";
import TimeStamp from 'timestamps';
import { indexToMs } from "../common/constants"

import scales from "./d3SharedScales"

const chapterNameTip = d3Tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    const t1 = TimeStamp.stamp(d.t1);
    const t2 = TimeStamp.stamp(d.t2);

    return `<p class="chapter">${d.name}</p>
      <p class="timeCodes">${t1} - ${t2}</p>`;
  });

const d3Chapters = {};

d3Chapters.create = (el, data, state) => {

  d3.select(el).select(".d3Chapters")
    .attr('class', 'd3Chapters')
    .attr('width', "100%")
    .attr('height', state.height);

  d3.select(el).select(".d3ChaptersIndicator")
    .attr('class', 'd3ChaptersIndicator')
    .attr('width', "100%")
    .attr('height', state.height);

  d3Chapters.update(el, data, state);
};

d3Chapters.update = (el, data, state) => {
  d3Chapters._drawChapters(el, data, state);
};

d3Chapters.destroy = function(el) {
};

d3Chapters._drawChapters = (el, data, state) => {
  const { widthScale } = scales(el, data, state);
  const { height, zoomLevel, hidesFiltered } = state;
  const { onClick } = state;
  const { chapters, shots } = data;

  const scaledWidth = widthScale(zoomLevel);
  const chaptersWidth = chapterBounds().width;
  const timeCodeScale = createTimeCodeScale(chapters, chaptersWidth);

  // update svg width

  const svg = d3.select(el).select('.d3Chapters');

  svg
    .attr("width", "100%")
    .attr("height", height);

  svg.call(chapterNameTip);

  /////////////////////////////////////////////////////////
  // DATA JOIN

  const chaptersSelection = svg.selectAll("g.chapter").data(chapters);

  /////////////////////////////////////////////////////////
  // EXIT


  /////////////////////////////////////////////////////////
  // ENTER

  const chapter = chaptersSelection.enter().append("g")
    .attr("class", "chapter")
    .attr("transform", (d, i) => {
      return `translate(${timeCodeScale(d.t1)},${0})`
    });

  // enter and update
  chapter.merge(chapter)
    .on("click", (d, i) => {
      onClick(d, i)
    });

  chapter.append("rect")
    .attr("class", "background")
    .attr("width", (d) => { return timeCodeScale(d.t2 - d.t1) - 1})
    .attr("height", height)
    .on('mouseover', function (d) {
      d3.select(this).style("fill", "#444");
      chapterNameTip.show(d);
    })
    .on("mouseout", function(d) {
      d3.select(this).transition().style("fill", "#333");
      chapterNameTip.hide(d);
    });

  const text = chapter.append("text")
    .attr("class", "number")
    .attr("y", 15)
    .attr("x", 4)
    .text((d) => { return d.id });

  /////////////////////////////////////////////////////////
  // UPDATE

  chaptersSelection
    .attr("transform", (d, i) => {
      return `translate(${timeCodeScale(d.t1)},${0})`
    });

  chaptersSelection.select(".background")
    .attr("width", (d) => { return timeCodeScale(d.t2 - d.t1) - 1});

  /////////////////////////////////////////////////////////
  // INDICATOR

  const svg2 = d3.select(el).select('.d3ChaptersIndicators');
  svg2
    .attr("width", "100%")
    .attr("height", height)
    .classed("hidden", hidesFiltered);

  /////////////////////////////////////////////////////////
  // DATA JOIN

  const sel = svg2.selectAll("g.indicator").data([state.offset]);
  const indicator = sel.enter().append("g");

  const x = timeCodeScale(offsetToXPosition(scaledWidth, shots, state.offset));
  const width = timeCodeScale(windowToMs(scaledWidth, shots, state.offset));

  indicator
    .attr("class", "indicator")
    .attr("transform", `translate(${x},${0})`);

  indicator.append("rect")
    .attr("width", width)
    .attr("height", height);

  /////////////////////////////////////////////////////////
  // UPDATE

  sel
    // .transition()
    .attr("transform", `translate(${x},${0})`);

  sel.select("rect")
    // .transition()
    .attr("width", width);
};

const offsetToXPosition = (scaledShotWidth, shots, leftOffset) => {
  const index = (leftOffset / scaledShotWidth) | 0;
  return shotIndexToMs(shots, index)
};

const windowToMs = (scaledShotWidth, shots, leftOffset) => {
  const chaptersWidth = chapterBounds().width;
  const rightOffset = leftOffset + chaptersWidth;

  const visibleStartIndex = (leftOffset / scaledShotWidth) | 0;
  const visibleEndIndex = (rightOffset / scaledShotWidth) | 0;

  const windowShots = shots.slice(visibleStartIndex, Math.min(visibleEndIndex + 1, shots.length - 1));
  if (windowShots.length) {
    return windowShots.map(d => d.duration).reduce((a, b) => { return a + b });
  } else {
    return 1;
  }
};

const shotIndexToMs = (shots, index) => {
  if (index > shots.length) {
    console.log(`overflow: ${shots.length} ${index}`);
    index = shots.length - 1;
  }

  return indexToMs(shots[index].startIndex);
};

const chapterBounds = () => {
  return d3.select(".chapters").node().getBoundingClientRect();
};

const createTimeCodeScale = (chapters, width) => {
  const maxTime = chapters.map(d => d.t2 - d.t1).reduce((a, b) => { return a + b});

  return d3.scaleLinear()
    .domain([0, maxTime])
    .range([0, width]);
};

export default d3Chapters;
