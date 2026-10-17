import { useGameStore } from '@/stores/game'
import { IntroScene } from '@/scenes/IntroScene'
import { RoamScene } from '@/scenes/RoamScene'

/** 顶层场景路由：序章 → 老街漫游（片尾复用在漫游场景之上） */
export function StreetScene() {
  const phase = useGameStore((state) => state.phase)
  return phase === 'intro' ? <IntroScene /> : <RoamScene />
}
