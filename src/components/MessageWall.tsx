import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '@/components/Modal'
import { useGameStore } from '@/stores/game'

const MAX_LENGTH = 60

export function MessageWall() {
  const wall = useGameStore((state) => state.wall)
  const addWallEntry = useGameStore((state) => state.addWallEntry)
  const closePanel = useGameStore((state) => state.closePanel)
  const [text, setText] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) return
    addWallEntry(text)
    setText('')
  }

  return (
    <Modal variant="drawer" labelId="wall-title" onClose={closePanel} className="panel panel--wall">
      <div className="panel__head">
        <div>
          <p className="panel__eyebrow">烟火留言墙</p>
          <h2 id="wall-title" className="panel__title">
            你记忆里的市井味道
          </h2>
        </div>
        <button type="button" className="panel__close" onClick={closePanel} aria-label="关闭留言墙">
          ×
        </button>
      </div>

      <form className="wall-form" onSubmit={handleSubmit}>
        <label htmlFor="wall-input" className="wall-form__label">
          写一句，贴在街上（最多 {MAX_LENGTH} 字）
        </label>
        <textarea
          id="wall-input"
          className="wall-form__input"
          value={text}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="比如：外婆家门口的藕汤，冬天总留一碗。"
          onChange={(event) => setText(event.target.value)}
        />
        <div className="wall-form__foot">
          <span className="wall-form__count" aria-hidden="true">
            {MAX_LENGTH - text.length} 字
          </span>
          <button type="submit" className="wall-form__submit" disabled={!text.trim()}>
            贴上墙
          </button>
        </div>
      </form>

      {wall.length === 0 ? (
        <p className="wall-empty">墙上还空着。第一句话，留给你。</p>
      ) : (
        <ul className="wall-list">
          {wall.map((entry) => (
            <li key={entry.id} className="wall-entry">
              <p className="wall-entry__text">{entry.text}</p>
              <time className="wall-entry__time" dateTime={new Date(entry.createdAt).toISOString()}>
                {formatDate(entry.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      )}

      <p className="panel__note panel__note--local">
        留言只保存在这台设备的浏览器里，不会上传到任何服务器。
      </p>
    </Modal>
  )
}

function formatDate(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}
