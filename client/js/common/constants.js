/**
 * Created by micha on 29/12/16.
 */

function padZero(s, n) {
  s = s.toString(); // in case someone passes a number
  return s.length >= n ? s : padZero('0' + s, n);
}

export const filename = (id) => {
  const filledId = padZero(id + 1, 10);
  return `${filledId}.jpg`
};

const debug = process.env.NODE_ENV !== "production";
const host = process.env.API_HOST;
const port = process.env.API_PORT;

const assetsBaseUrl = process.env.STORE_URL;

export const baseUrl =  debug ? `http://${host}:${port}` : '';

export const thumbnailUrl = (shot, project) => {
 return `${assetsBaseUrl}/${project.identifier}/keyframe_thumbnails/${filename(shot.keyframe.index)}`;
};

export const keyframeUrl = (shot, project) => {
  return `${assetsBaseUrl}/${project.identifier}/keyframes/${filename(shot.keyframe.index)}`;
};

export const averageShotLength = (shots) => {
  const length = shots.map((d) => +d.length / 25).reduce((a, b) => a + b) / shots.length;
  return formatDecimal(length);
};

export const formatDecimal = (num) => {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
};

export const indexToMs = (index) => {
  return index / 25 * 1000;
};

const colorPrimary0 = "#D34747";	// Main Primary color */
const colorPrimary1 = "#FFA3A3";
const colorPrimary2 = "#F57373";
const colorPrimary3 = "#B52626";
const colorPrimary4 = "#8F0C0C";

const colorSecondary10 = "#D38647";	// Main Secondary color (1) */
const colorSecondary11 = "#FFCDA3";
const colorSecondary12 = "#F5AE73";
const colorSecondary13 = "#B56726";
const colorSecondary14 = "#8F480C";

const colorSecondary20 = "#2B7F7F";	// Main Secondary color (2) */
const colorSecondary21 = "#76B8B8";
const colorSecondary22 = "#459393";
const colorSecondary23 = "#176C6C";
const colorSecondary24 = "#075656";

const colorComplement0 = "#39A939";	// Main Complement color */
const colorComplement1 = "#8CDC8C";
const colorComplement2 = "#5CC45C";
const colorComplement3 = "#1F911F";
const colorComplement4 = "#0A730A";

export const untaggedColor = "#555";
export const disabledColor = "#333";

export const colors = [
  colorPrimary0,
  colorSecondary10,
  colorSecondary20,
  colorComplement0,

  colorPrimary1,
  colorSecondary11,
  colorSecondary21,
  colorComplement1,

  colorPrimary2,
  colorSecondary12,
  colorSecondary22,
  colorComplement2,

  colorPrimary3,
  colorSecondary13,
  colorSecondary23,
  colorComplement3,

  colorPrimary4,
  colorSecondary14,
  colorSecondary24,
  colorComplement4
];
