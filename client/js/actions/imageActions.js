/**
 * Created by micha on 12/12/16.
 */

import { thumbnailUrl } from "../common/constants"

function trackLoading(image, src) {
  if (src) {
    image.src = src;
  }
  const promise = new Promise((resolve, reject) => {
    if (image.complete) {
      resolve(image);
    } else {
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', () => reject(image));
    }
  });
  promise.image = image;
  return promise;
}

function loadAll(images) {
  return Promise.all(images.map((image) => {
    return load(image)
  }));
}

function load(src) {
  if (!load[src]) {
    load[src] = trackLoading(new Image(), src);
  }

  return load[src];
}

export function fetchKeyframeThumbnails(project, shots) {
  return (dispatch) => {
    const urls = shots.map((d) => thumbnailUrl(d, project) );

    return loadAll(urls).then(() => {
      dispatch({type: "FETCH_KEYFRAME_THUMBNAILS_FULFILLED", payload: null});
    });
  }
}
