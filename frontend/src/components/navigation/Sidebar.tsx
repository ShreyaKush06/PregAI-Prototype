import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROLE_PERMISSIONS } from '@/constants'
import { NAV_ITEMS, type NavItem } from './navItems'
import { ThemeToggle } from '@/components/common/ThemeToggle'

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d={d} />
    </svg>
  )
}

function NavList({ items }: { items: NavItem[] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-fade text-ink shadow-glow-sm'
                  : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden
                />
                <span className={isActive ? 'text-brand-glow' : 'text-ink-faint group-hover:text-ink-muted'}>
                  <Icon d={item.icon} />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export function Sidebar() {
  const { user, logout } = useAuth()
  if (!user) return null

  const allowed = new Set(ROLE_PERMISSIONS[user.role])
  const primary = NAV_ITEMS.filter((i) => i.group === 'primary' && allowed.has(i.id))
  const research = NAV_ITEMS.filter((i) => i.group === 'research' && allowed.has(i.id))

  return (
    <aside className="pregai-sidebar flex h-screen shrink-0 flex-col border-r border-border bg-base-raised">
      <div className="pregai-brand flex items-center gap-3">
        <div className="pregai-brand-mark shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M3 14h3l2-6 4 12 3-9 2 3h4" />
          </svg>
        </div>
        <div>
          <p className="pregai-brand-name font-display leading-none text-ink">PregAI</p>
          <p className="mt-1 block text-[10px] uppercase tracking-widest text-ink-faint">EHG MONITORING</p>
        </div>
      </div>

      <nav className="pregai-nav flex-1 overflow-y-auto px-3 py-2">
        <p className="pregai-nav-label px-2 pb-2 pt-3 text-[10px] font-medium uppercase tracking-wider text-ink-faint">Platform</p>
        <NavList items={primary} />

        {research.length > 0 && (
          <>
            <p className="pregai-nav-label px-2 pb-2 pt-5 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
              Research / Analysis
            </p>
            <NavList items={research} />
          </>
        )}
      </nav>

      <div className="pregai-user-meta border-t border-border p-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">Appearance</span>
          <ThemeToggle compact />
        </div>
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
            {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-[11px] capitalize text-ink-faint">{user.role}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="rounded p-1.5 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
