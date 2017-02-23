/**
 * Created by micha on 28/01/17.
 */
import React from "react"

const TimeIndicator = props => {
  const { d, d1, d2, showsWidth } = props;
  const x = Math.max(0, d1/d * 100);

  let width = 10;
  if (showsWidth) {
    width = ((d2 - d1)/d)*100;

    if (x + width > 100) {
      width = 100 - x;
    }

    width = width + "%"
  }

  return (
    <div className="indicator">
      <div className="value" style={{left: x + "%", width: width}}></div>
    </div>
  )
};

export default TimeIndicator
