import React from "react"
import Spinner from "react-spinkit"

import { colors } from '../common/constants'

const LoadingIndicator = props => {
  return (
    <Spinner className="spinner" spinnerName="three-bounce"/>
  )
};

export default LoadingIndicator
