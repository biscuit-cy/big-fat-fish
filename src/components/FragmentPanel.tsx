import { HOTSPOTS, TOTAL_HOTSPOTS } from '@/content/hotspots'
import type { ZoneId } from '@/content/hotspots'
import { ZONES } from '@/content/zones'
import { Modal } from '@/components/Modal'
import { useGameStore } from '@/stores/game'

export function FragmentPanel() {
  const collected = useGameStore((state) => state.collected)
  const closePanel = useGameStore((state) => state.closePanel)
  const progress = Math.round((collected.length / TOTAL_HOTSPOTS) * 100)

  return (
    <Modal
      variant="drawer"
      labelId="fragments-title"
      onClose={closePanel}
      className="panel panel--fragments"
    >
      <div className="panel__head">
        <div>
          <p className="panel__eyebrow">烟火碎片</p>
          <h2 id="fragments-title" className="panel__title">
            {collected.length} / {TOTAL_HOTSPOTS}
          </h2>
        </div>
        <button type="button" className="panel__close" onClick={closePanel} aria-label="关闭碎片册">
          ×
        </button>
      </div>

      <div className="panel__progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <p className="panel__note">
        点击街上的摊位、海报和猫，收下属于它们的烟火碎片。集齐八枚，走到街的尽头。
      </p>

      <div className="fragment-list">
        {ZONES.map((zone) => (
          <section key={zone.id} className="fragment-group" aria-label={zone.name}>
            <h3 className="fragment-group__title">
              <span>{zone.name}</span>
              <small>{zone.timeRange}</small>
            </h3>
            <ul>
              {HOTSPOTS.filter((hotspot) => hotspot.zone === (zone.id as ZoneId)).map((hotspot) => {
                const unlocked = collected.includes(hotspot.id)
                return (
                  <li key={hotspot.id} className={`fragment-item${unlocked ? ' is-unlocked' : ''}`}>
                    <span className="fragment-item__seal" aria-hidden="true">
                      {unlocked ? hotspot.fragment.seal : '？'}
                    </span>
                    <span className="fragment-item__text">
                      <span className="fragment-item__name">
                        {unlocked ? hotspot.fragment.name : '尚未收集'}
                      </span>
                      <span className="fragment-item__place">
                        {hotspot.name} · {hotspot.time}
                      </span>
                      {unlocked && (
                        <span className="fragment-item__quote">“{hotspot.fragment.quote}”</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  )
}
