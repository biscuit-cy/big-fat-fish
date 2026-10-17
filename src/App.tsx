import { MotionConfig } from 'framer-motion'
import { StreetScene } from '@/scenes/StreetScene'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StreetScene />
    </MotionConfig>
  )
}

export default App
