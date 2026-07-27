import type { SketchDefinition } from '../lib/types'
import { logo } from './logo'
import { hmm } from './hmm'
import { gating } from './gating'
import { tracking } from './tracking'
import { clusters } from './clusters'

export const sketches: Record<string, SketchDefinition> = {
  logo,
  hmm,
  gating,
  tracking,
  clusters,
}

export const sketchList: SketchDefinition[] = [logo, hmm, gating, tracking, clusters]

export { logo, hmm, gating, tracking, clusters }
