import type { SketchDefinition } from '../lib/types'
import { logo } from './logo'
import { hmm } from './hmm'
import { gating } from './gating'
import { tracking } from './tracking'
import { clusters } from './clusters'
import { branching } from './branching'
import { stats } from './stats'
import { hierarchy } from './hierarchy'
import { segmentation } from './segmentation'

export const sketches: Record<string, SketchDefinition> = {
  logo,
  segmentation,
  tracking,
  hmm,
  gating,
  hierarchy,
  clusters,
  branching,
  stats,
}

// Ordered roughly by pipeline stage — segmentation is the entry point; the rest read from it.
export const sketchList: SketchDefinition[] = [
  logo, segmentation, tracking, hmm, gating, hierarchy, clusters, branching, stats,
]

export { logo, hmm, gating, tracking, clusters, branching, stats, hierarchy, segmentation }
