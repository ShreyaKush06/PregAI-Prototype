import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Topbar } from './Topbar'
import { PageTransition } from './PageTransition'

export function AppLayout() {
  return (
    <div className="pregai-shell flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="pregai-main flex-1 overflow-y-auto px-7 py-7">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
