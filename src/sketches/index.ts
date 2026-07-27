import type { SketchDefinition } from '../lib/types'
import { logo } from './logo'
import { segmentation } from './segmentation'
import { tracking } from './tracking'
import { hmm } from './hmm'
import { gating } from './gating'
import { hierarchy } from './hierarchy'
import { clusters } from './clusters'
import { branching } from './branching'
import { stats } from './stats'
import { analysisBoard } from './analysis_board'
import { notebooks } from './notebooks'
import { napariTracks } from './napari_tracks'
import { regionClustering } from './region_clustering'

export const sketches: Record<string, SketchDefinition> = {
  logo,
  segmentation,
  tracking,
  hmm,
  gating,
  hierarchy,
  clusters,
  region_clustering: regionClustering,
  branching,
  stats,
  analysis_board: analysisBoard,
  notebooks,
  napari_tracks: napariTracks,
}

// Ordered roughly by pipeline stage — segmentation is the entry point; the rest read from it.
// Region clustering is grouped with clusters; analysis board / notebooks / napari-tracks are
// report/inspection surfaces, so they come last.
export const sketchList: SketchDefinition[] = [
  logo, segmentation, tracking, hmm, gating, hierarchy, clusters, regionClustering,
  branching, stats, analysisBoard, notebooks, napariTracks,
]

export { logo, hmm, gating, tracking, clusters, branching, stats, hierarchy, segmentation,
         analysisBoard, notebooks, napariTracks, regionClustering }
