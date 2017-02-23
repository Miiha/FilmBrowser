import { combineReducers } from "redux"
import { routerReducer } from 'react-router-redux'

import project from "./projectReducer"
import projects from "./projectsReducer"
import shots from "./shotsProducer"
import images from "./imageProducer"
import viewerInit from "./viewerInitReducer"
import chapters from "./chapterReducer"
import subtitles from "./subtitlesReducer"

export default combineReducers({
    project: project,
    projects: projects,
    shots: shots,
    chapters: chapters,
    images: images,
    viewerInit: viewerInit,
    subtitles: subtitles,
    routing: routerReducer
})
