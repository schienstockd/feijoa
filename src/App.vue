<script setup lang="ts">
import { ref, computed } from 'vue'
import SketchCanvas from './lib/SketchCanvas.vue'
import { sketches, sketchList } from './sketches'

const selectedId = ref(sketchList[0].id)
const selected = computed(() => sketches[selectedId.value])
const canvasRef = ref<InstanceType<typeof SketchCanvas> | null>(null)

function replay() {
  canvasRef.value?.reset()
  canvasRef.value?.play()
}
</script>

<template>
  <main>
    <header>
      <h1>feijoa</h1>
      <p>hand-drawn sketches for <a href="https://github.com/schienstockd/cecelia">cecelia</a> — aussie tool, aussie fruit.</p>
    </header>

    <nav>
      <button
        v-for="s in sketchList"
        :key="s.id"
        :class="{ active: s.id === selectedId }"
        @click="selectedId = s.id"
      >{{ s.title }}</button>
    </nav>

    <section class="stage">
      <div class="canvas-wrap">
        <SketchCanvas ref="canvasRef" :definition="selected" :key="selectedId" />
      </div>
      <div class="toolbar">
        <span class="hint">{{ selected.title }} · {{ selected.durationSec.toFixed(1) }}s</span>
        <button @click="replay">↻ replay</button>
      </div>
    </section>

    <footer>
      <a href="https://github.com/schienstockd/feijoa">source</a>
      · sketches are JSON under <code>src/sketches/</code>
    </footer>
  </main>
</template>

<style scoped>
main { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem; }
header { margin-bottom: 1.5rem; }
h1 { font-size: 1.6rem; font-weight: 700; }
header p a { color: var(--f-accent); text-decoration: none; border-bottom: 1px solid transparent; }
header p a:hover { border-bottom-color: var(--f-accent); }

nav { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
nav button {
  border: 1px solid var(--f-border);
  background: var(--f-surface);
  color: var(--f-text-dim);
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 120ms ease;
}
nav button:hover { color: var(--f-text); border-color: #d0ccc0; }
nav button.active {
  background: var(--f-accent);
  color: #ffffff;
  border-color: var(--f-accent);
}

.stage {
  background: var(--f-surface);
  border: 1px solid var(--f-border);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.canvas-wrap { min-height: 260px; display: flex; align-items: center; justify-content: center; }
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--f-border);
  padding-top: 0.5rem;
}
.hint { color: var(--f-text-dim); font-size: 0.8rem; }
.toolbar button {
  background: transparent;
  border: 1px solid var(--f-border);
  color: var(--f-text-dim);
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
}
.toolbar button:hover { color: var(--f-text); }

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
