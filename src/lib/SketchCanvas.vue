<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import type { SketchDefinition } from './types'
import { render, type PlayHandle } from './interpret'

const props = withDefaults(defineProps<{
  definition: SketchDefinition
  autoplay?: boolean
  loop?: boolean
  reducedMotion?: boolean | 'auto'
  width?: number | string
  height?: number | string
}>(), {
  autoplay: true,
  loop: false,
  reducedMotion: 'auto',
})

const emit = defineEmits<{
  ready: [handle: PlayHandle]
  finished: []
}>()

const svgEl = ref<SVGSVGElement | null>(null)
let handle: PlayHandle | null = null

function shouldReduce(): boolean {
  if (props.reducedMotion === true) return true
  if (props.reducedMotion === false) return false
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function mount() {
  if (!svgEl.value) return
  handle?.destroy()
  handle = render(svgEl.value, props.definition, { reducedMotion: shouldReduce() })
  emit('ready', handle)
  if (props.autoplay && !shouldReduce()) handle.play()
}

onMounted(mount)
onBeforeUnmount(() => handle?.destroy())
watch(() => props.definition, mount, { deep: false })

defineExpose({
  play:  () => handle?.play(),
  pause: () => handle?.pause(),
  reset: () => handle?.reset(),
})
</script>

<template>
  <svg
    ref="svgEl"
    class="feijoa-sketch"
    :style="{
      width:  typeof width  === 'number' ? width  + 'px' : (width  ?? '100%'),
      height: typeof height === 'number' ? height + 'px' : (height ?? 'auto'),
    }"
    xmlns="http://www.w3.org/2000/svg"
  />
</template>

<style scoped>
.feijoa-sketch {
  display: block;
  max-width: 100%;
  border-radius: 8px;
  background: transparent;
}
</style>
