/**
 * Created by micha on 18/12/16.
 */

import * as d3 from "d3";

const shotScales = (el, data, state) => {
  const { shots, allShots } = data;

  const widthScale = createWidthScale(state.shotWidth);
  const xScale = createXScale(state.shotWidth, state.zoomLevel, shots.length);

  const shotLengths = shots.map((d) => { return +d.length / 25.0 });
  const shotLengthScale = createShotLengthScale(shotLengths);

  return {widthScale, xScale, shotLengthScale};
};

export const createWidthScale = (shotWidth) => {
  return d3.scaleLinear()
    .domain([0, 1])
    .range([2, shotWidth])
    .interpolate(d3.interpolateRound);
};

const createXScale = (shotWidth, zoomLevel, count) => {
  const scaledWidth = createWidthScale(shotWidth)(zoomLevel);
  const rangeMax = scaledWidth * count;

  return d3.scaleLinear()
    .domain([0, count])
    .range([0, rangeMax])
    .interpolate(d3.interpolateRound);
};

const createShotLengthScale = (lengths, rangeMax=100) => {
  const domainMax = Math.max(...lengths);

  return d3.scaleLinear()
    .domain([0, domainMax])
    .range([0, rangeMax])
    .interpolate(d3.interpolateRound);
};

export default shotScales;

