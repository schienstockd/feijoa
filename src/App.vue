<script setup lang="ts">
import { ref } from 'vue'
import SketchCanvas from './lib/SketchCanvas.vue'
import { sketches, sketchList } from './sketches'

const logo = sketches.logo
// Everything else in a 3-column grid, in pipeline order.
const grid = sketchList.filter(s => s.id !== 'logo')

const logoRef = ref<InstanceType<typeof SketchCanvas> | null>(null)
const gridRefs = ref<Array<InstanceType<typeof SketchCanvas> | null>>([])

function replayLogo() {
  logoRef.value?.reset()
  logoRef.value?.play()
}
function replayAll() {
  logoRef.value?.reset(); logoRef.value?.play()
  for (const c of gridRefs.value) { c?.reset(); c?.play() }
}
</script>

<template>
  <main>
    <header>
      <div>
        <h1>feijoa</h1>
        <p>hand-drawn sketches for <a href="https://github.com/schienstockd/cecelia">cecelia</a> — aussie tool, aussie fruit.</p>
      </div>
      <button class="replay-all" @click="replayAll">↻ replay all</button>
    </header>

    <section class="logo-stage">
      <SketchCanvas ref="logoRef" :definition="logo" />
      <button class="stage-replay" @click="replayLogo" aria-label="replay logo">↻</button>
    </section>

    <div class="grid">
      <article v-for="(s, i) in grid" :key="s.id" class="tile">
        <SketchCanvas
          :ref="el => (gridRefs[i] = el as InstanceType<typeof SketchCanvas>)"
          :definition="s"
        />
        <div class="tile-title">{{ s.title }}</div>
      </article>
    </div>

    <footer>
      <a href="https://github.com/schienstockd/feijoa">source</a>
      · sketches are JSON under <code>src/sketches/</code>
    </footer>
  </main>
</template>

<style scoped>
main { max-width: 1400px; margin: 0 auto; padding: 2rem 1.5rem; }

header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem;
}
h1 { font-size: 1.6rem; font-weight: 700; }
header p { margin-top: 0.15rem; }
header p a { color: var(--f-accent); text-decoration: none; border-bottom: 1px solid transparent; }
header p a:hover { border-bottom-color: var(--f-accent); }

.replay-all {
  background: transparent;
  border: 1px solid var(--f-border);
  color: var(--f-text-dim);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
}
.replay-all:hover { color: var(--f-text); }

.logo-stage {
  position: relative;
  background: var(--f-surface);
  border: 1px solid var(--f-border);
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.25rem;
}
.stage-replay {
  position: absolute; top: 0.6rem; right: 0.6rem;
  background: transparent;
  border: 1px solid var(--f-border);
  color: var(--f-text-dim);
  width: 28px; height: 28px;
  border-radius: 50%;
  font-size: 0.85rem;
  cursor: pointer;
}
.stage-replay:hover { color: var(--f-text); }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.tile {
  background: var(--f-surface);
  border: 1px solid var(--f-border);
  border-radius: 12px;
  padding: 0.75rem 0.85rem 0.6rem;
  display: flex; flex-direction: column;
  gap: 0.4rem;
}
.tile-title {
  color: var(--f-text-dim);
  font-size: 0.8rem;
  text-align: center;
  padding-top: 0.2rem;
  border-top: 1px solid var(--f-border);
}

footer { margin-top: 1.5rem; color: var(--f-text-dim); font-size: 0.85rem; }
footer a { color: var(--f-text-dim); border-bottom: 1px dotted var(--f-text-dim); text-decoration: none; }
footer a:hover { color: var(--f-text); }
code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: #f2efe6;
  padding: 0 0.25rem;
  border-radius: 3px;
}
</style>
