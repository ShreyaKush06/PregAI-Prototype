import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import { usePatients } from '@/hooks/usePatients'
import { useEHGBuffer } from '@/hooks/useEHGBuffer'
import { StatCard } from '@/components/dashboard/StatCard'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { Card } from '@/components/common/Card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'
import { EHGWaveformChart } from '@/components/charts/EHGWaveformChart'
import { ElectrodeLegend } from '@/components/monitoring/ElectrodeLegend'
import { MaternalElectrodeGuide } from '@/components/monitoring/MaternalElectrodeGuide'
import { mockAlerts } from '@/services/mock/mockData'
import { riskService } from '@/services/riskService'
import type { RiskAssessment } from '@/types'
import { useAppMode } from '@/context/AppModeContext'

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d={d} />
    </svg>
  )
}


const demoTimeline = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  ch1: 0.25 + Math.sin(i * 0.78) * 0.16 + Math.sin(i * 1.9) * 0.05,
  ch2: 0.18 + Math.cos(i * 0.63) * 0.12 + Math.sin(i * 1.4) * 0.035,
  uterine: 18 + Math.sin(i * 0.45) * 5 + (i > 14 && i < 19 ? 12 : 0),
  heart: 138 + Math.sin(i * 0.9) * 7,
}))
const radarMetrics = [
  { metric: 'Signal quality', value: 86 }, { metric: 'SNR', value: 78 },
  { metric: 'Electrode contact', value: 92 }, { metric: 'Stability', value: 72 },
  { metric: 'Consistency', value: 81 },
]
const riskBars = [
  { name: 'Baseline', value: 24 }, { name: 'Current', value: 39 },
  { name: '1h ago', value: 31 }, { name: '2h ago', value: 27 },
  { name: '3h ago', value: 22 }, { name: '4h ago', value: 26 },
]
function FetusIllustration() {
  return <div className="fetus-stage maternal-stage">
    <div className="fetus-orbit orbit-one"/><div className="fetus-orbit orbit-two"/>
    <div className="fetus-caption"><span className="live-dot"/> ANATOMICAL PLACEMENT GUIDE</div>
    <svg className="fetus-art maternal-art" viewBox="0 0 420 360" role="img" aria-label="Illustrative pregnant woman with EHG electrode placement markers">
      <defs>
        <linearGradient id="maternalSkin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0c3aa"/><stop offset="55%" stopColor="#d99b8d"/><stop offset="100%" stopColor="#a86f78"/></linearGradient>
        <linearGradient id="maternalDress" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#203e5a"/><stop offset="50%" stopColor="#2a5870"/><stop offset="100%" stopColor="#172d43"/></linearGradient>
        <radialGradient id="maternalGlow"><stop offset="0%" stopColor="#174653"/><stop offset="100%" stopColor="#101a25" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="210" cy="190" rx="190" ry="165" fill="url(#maternalGlow)"/>
      <g className="maternal-breathe">
        {/* Head, neck and shoulders */}
        <ellipse cx="210" cy="65" rx="31" ry="38" fill="url(#maternalSkin)"/>
        <path d="M195 96 L193 119 Q155 119 136 145 L112 205 Q102 224 116 231 L137 236 L151 191 L159 164 L164 222 Q162 253 171 278 L249 278 Q258 249 256 221 L262 164 L273 193 L287 236 L309 230 Q318 219 309 202 L285 145 Q265 120 228 119 L225 96Z" fill="url(#maternalSkin)"/>
        {/* Maternity gown and prominent third-trimester abdomen */}
        <path d="M157 132 Q180 120 194 123 L210 145 L226 123 Q245 120 264 132 L274 184 Q286 218 280 232 Q291 251 272 274 Q246 300 210 303 Q173 300 148 277 Q130 255 145 232 Q151 210 145 184Z" fill="url(#maternalDress)" opacity=".96"/>
        <path d="M161 161 C145 194 145 231 166 257 C185 280 233 282 255 258 C276 236 271 198 255 161 C245 147 228 142 236 139 L210 157 L184 139 C174 142 166 151 161 161Z" fill="url(#maternalSkin)" stroke="#f3c8b3" strokeOpacity=".45" strokeWidth="1.4"/>
        {/* arms gently resting above belly */}
        <path d="M148 158 Q126 188 155 213 Q176 229 194 210" fill="none" stroke="url(#maternalSkin)" strokeWidth="20" strokeLinecap="round"/>
        <path d="M269 158 Q291 188 264 213 Q245 229 226 210" fill="none" stroke="url(#maternalSkin)" strokeWidth="20" strokeLinecap="round"/>
        {/* legs */}
        <path d="M174 278 L168 327 Q167 342 185 342 L202 342 L204 300" fill="url(#maternalSkin)"/>
        <path d="M246 278 L252 327 Q253 342 235 342 L218 342 L216 300" fill="url(#maternalSkin)"/>
      </g>
      {/* Electrode positions: 4 signal sites + iliac reference */}
      <g className="electrode-points">
        <circle cx="178" cy="181" r="9" fill="#0d1722" stroke="#58a0ff" strokeWidth="3"/><circle cx="178" cy="181" r="3" fill="#58a0ff"/>
        <circle cx="242" cy="181" r="9" fill="#0d1722" stroke="#58a0ff" strokeWidth="3"/><circle cx="242" cy="181" r="3" fill="#58a0ff"/>
        <circle cx="181" cy="224" r="9" fill="#0d1722" stroke="#58a0ff" strokeWidth="3"/><circle cx="181" cy="224" r="3" fill="#58a0ff"/>
        <circle cx="239" cy="224" r="9" fill="#0d1722" stroke="#58a0ff" strokeWidth="3"/><circle cx="239" cy="224" r="3" fill="#58a0ff"/>
        <circle cx="210" cy="250" r="8" fill="#0d1722" stroke="#ffb547" strokeWidth="3"/><circle cx="210" cy="250" r="3" fill="#ffb547"/>
      </g>
    </svg>
    <div className="maternal-labels"><span>CH 1</span><span>CH 2</span><span>CH 3</span><span>CH 4</span><span>REF</span></div>
    <div className="fetus-footer"><span>Illustrative placement · confirm clinically</span><span>Not diagnostic</span></div>
  </div>
}
function DashboardVisuals() {
  return <div className="pregai-visuals grid grid-cols-1 xl:grid-cols-3 gap-4">
    <Card className="xl:col-span-2" title="Maternal & fetal overview" eyebrow="Interactive anatomical guide with EHG electrode landmarks">
      <FetusIllustration/>
    </Card>
    <Card title="Signal performance" eyebrow="5-axis quality profile · pentagon plot">
      <div style={{height:300}}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarMetrics} outerRadius="72%">
            <PolarGrid stroke="#293844"/>
            <PolarAngleAxis dataKey="metric" tick={{fill:'#9aabba',fontSize:11}}/>
            <Radar dataKey="value" stroke="#00e6e9" fill="#00e6e9" fillOpacity={0.22} strokeWidth={2}/>
            <Tooltip contentStyle={{background:'#101a24',border:'1px solid #263541',borderRadius:10,color:'#f4f8fb'}}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <Link to="/signal-eda" className="mt-2 inline-block text-xs font-medium text-brand hover:underline">Explore signal analytics →</Link>
    </Card>
  </div>
}


export default function DashboardPage() {
  const { patients, loading } = usePatients()
  const { isDemoMode } = useAppMode()
  const demoSessionId = 'SES-DEMO-DASHBOARD'
  const { points, quality } = useEHGBuffer(demoSessionId)
  const [risk, setRisk] = useState<RiskAssessment | null>(null)

  const selectedPatient = patients[1]

  useEffect(() => {
    if (!selectedPatient) return
    riskService.getForSession(demoSessionId, selectedPatient.id).then(setRisk)
  }, [selectedPatient?.id])

  const activeSessions = 1
  const totalPatients = patients.length
  const recentSessions = useMemo(() => patients.slice(0, 4), [patients])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">Monitoring summary across all active patients.</p>
        </div>
        <Link
          to="/patients"
          className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim"
        >
          Select Patient
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Sessions"
          value={activeSessions}
          hint="Currently monitoring"
          tooltip="Monitoring sessions currently in progress across all patients."
          icon={<Icon d="M3 12h3l2-7 4 14 3-9 2 3h4" />}
          accent="brand"
        />
        <StatCard
          label="Monitored Patients"
          value={loading ? '—' : totalPatients}
          hint="Total in system"
          tooltip="Total number of patients registered in PREG AI."
          icon={<Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />}
          accent="secondary"
        />
        <StatCard
          label="Signal Quality"
          value={quality ? quality.score : '—'}
          unit="/100"
          hint="Current session"
          tooltip="Composite score from electrode contact, motion artifact, and SNR for the active session."
          icon={<Icon d="M4 19V10m5 9V5m5 14v-7m5 7V8" />}
          accent="gold"
        />
        <StatCard
          label="System Status"
          value={isDemoMode ? 'Demo' : 'Live'}
          hint={isDemoMode ? 'Simulated data source' : 'Connected to FastAPI'}
          tooltip="Whether the app is showing simulated data or a live FastAPI connection. Never shown ambiguously."
          icon={<Icon d="M12 2a10 10 0 1 0 10 10M12 2v10l6 3" />}
          accent="purple"
        />
      </div>

      <DashboardVisuals />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          eyebrow={selectedPatient ? `${selectedPatient.name} · Session in progress` : undefined}
          title="Current Monitoring · EHG Waveform"
          action={<ConnectionIndicator state={isDemoMode ? 'demo' : 'connected'} />}
        >
          <EHGWaveformChart points={points} height={220} />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4 text-sm">
            <div>
              <p className="text-xs text-ink-faint">Electrode contact</p>
              <p className="mt-0.5 capitalize text-ink">{quality?.electrodeContact || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Motion artifact</p>
              <p className="mt-0.5 capitalize text-ink">{quality?.motionArtifact || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">SNR</p>
              <p className="mt-0.5 text-ink">{quality?.snrDb ? `${quality.snrDb.toFixed(1)} dB` : '—'}</p>
            </div>
          </div>
          <Link
            to="/ehg-signal"
            className="mt-4 inline-block text-xs font-medium text-brand hover:underline"
          >
            View full signal analysis →
          </Link>
        </Card>

        <AlertsPanel alerts={mockAlerts} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="EHG Electrode Placement" eyebrow="Where the sensors attach">
          <MaternalElectrodeGuide height={340} />
        </Card>
        <Card title="Channel Legend">
          <ElectrodeLegend />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Recent Sessions"
          action={<Link to="/patients" className="text-xs text-brand hover:underline">View all</Link>}
        >
          <div className="divide-y divide-border-subtle">
            {recentSessions.map((p) => (
              <Link
                key={p.id}
                to={`/patients/${p.id}`}
                className="flex items-center justify-between rounded-md px-2 py-3 -mx-2 transition-colors first:pt-0 last:pb-0 hover:bg-surface-hover"
              >
                <div>
                  <p className="text-sm text-ink">{p.name}</p>
                  <p className="text-xs text-ink-faint">
                    {p.gestationalAgeWeeks} wks · {p.lastSessionAt ? new Date(p.lastSessionAt).toLocaleDateString() : 'No sessions yet'}
                  </p>
                </div>
                <StatusBadge level={p.riskFlag} />
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Risk · Latest Assessment" eyebrow={risk ? `Model ${risk.modelName} v${risk.modelVersion}` : undefined}>
          {risk ? (
            <div>
              <StatusBadge level={risk.riskCategory} label={risk.label} />
              <p className="mt-3 font-display text-2xl font-semibold text-ink tabular">
                {(risk.probability * 100).toFixed(0)}
                <span className="ml-1 text-sm font-normal text-ink-faint">% confidence</span>
              </p>
              <p className="mt-2 text-xs text-ink-faint">
                Assessed {new Date(risk.timestamp).toLocaleString()}
              </p>
              <Link to="/risk-assessment" className="mt-3 inline-block text-xs font-medium text-brand hover:underline">
                Full risk assessment →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Loading…</p>
          )}
        </Card>
      </div>
    </div>
  )
}
