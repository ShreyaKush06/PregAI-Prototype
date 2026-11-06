import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/components/navigation/navItems'
import { useAppMode } from '@/context/AppModeContext'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'

export function Topbar() {
  const location = useLocation()
  const { isDemoMode } = useAppMode()
  const current = NAV_ITEMS.find((i) => location.pathname.startsWith(i.path))

  return (
    <header className="pregai-topbar flex shrink-0 items-center justify-between border-b border-border px-7">
      <div>
        <p className="text-[17px] font-semibold uppercase tracking-wide text-ink">{current?.label || 'PREG AI'}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-base-raised px-3 py-2 text-sm text-ink-faint md:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <span>Search PregAI...</span>
          <span className="ml-8 rounded border border-border px-1.5 py-0.5 text-[10px]">⌘ K</span>
        </div>
        <div className="relative text-ink-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-base" />
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-purple-700 text-sm font-semibold text-white">P</div>
      </div>
    </header>
  )
}
