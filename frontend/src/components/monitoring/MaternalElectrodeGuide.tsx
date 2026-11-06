import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const sites = [
  { id: 'CH 1', x: 164, y: 204, color: '#38bdf8', detail: 'Upper abdomen · primary uterine signal' },
  { id: 'CH 2', x: 132, y: 244, color: '#38bdf8', detail: 'Lower-left abdomen · differential pair' },
  { id: 'CH 3', x: 228, y: 244, color: '#38bdf8', detail: 'Lower-right abdomen · differential pair' },
  { id: 'CH 4', x: 180, y: 278, color: '#38bdf8', detail: 'Lower midline · contraction reference' },
  { id: 'REF', x: 246, y: 288, color: '#fbbf24', detail: 'Iliac crest · reference electrode' },
]

export function MaternalElectrodeGuide({ height = 360 }: { height?: number }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.guide-figure', { opacity: 0, y: 16, duration: 0.8, ease: 'power2.out' })
      gsap.to('.guide-breath', { y: -2.5, scaleY: 1.008, transformOrigin: '50% 70%', duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.fromTo('.guide-ring', { scale: 0.92, opacity: 0.2 }, { scale: 1.04, opacity: 0.55, duration: 2.1, stagger: 0.25, repeat: -1, yoyo: true, transformOrigin: '50% 50%', ease: 'sine.inOut' })
      gsap.to('.guide-electrode-pulse', { opacity: 0.25, scale: 1.8, transformOrigin: '50% 50%', duration: 1.4, stagger: 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, root)
    return () => ctx.revert()
  }, [])

  return <div ref={root} className="maternal-guide" style={{ minHeight: height }}>
    <div className="guide-caption"><span className="guide-live-dot" /> ANATOMICAL EHG PLACEMENT · ILLUSTRATIVE</div>
    <svg className="guide-figure" viewBox="0 0 380 390" role="img" aria-label="Illustration of a pregnant adult with approximate EHG electrode locations">
      <defs>
        <linearGradient id="guideSkin" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#e7bca7"/><stop offset="45%" stopColor="#c99583"/><stop offset="100%" stopColor="#936b68"/>
        </linearGradient>
        <linearGradient id="guideCloth" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#20384a"/><stop offset="50%" stopColor="#31566a"/><stop offset="100%" stopColor="#1b3041"/>
        </linearGradient>
        <radialGradient id="guideLight"><stop stopColor="#1a5360" stopOpacity=".65"/><stop offset="100%" stopColor="#0d1720" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="190" cy="210" rx="170" ry="170" fill="url(#guideLight)"/>
      <circle className="guide-ring" cx="190" cy="210" r="132" fill="none" stroke="#1b6671" strokeWidth="1"/>
      <circle className="guide-ring" cx="190" cy="210" r="150" fill="none" stroke="#294451" strokeWidth="1"/>
      <g className="guide-breath">
        {/* Neutral, non-cartoon clinical illustration; clothing and silhouette remain modest. */}
        <path d="M160 92 C160 75 174 63 190 63 C206 63 220 75 220 92 L217 111 C238 117 254 133 264 157 L282 215 Q288 235 271 244 L254 239 L245 204 L241 177 L250 231 Q260 263 254 291 L244 324 L136 324 L126 291 Q118 263 130 231 L139 177 L135 204 L126 239 L109 244 Q92 235 98 215 L116 157 Q126 133 143 117 L163 111Z" fill="url(#guideSkin)"/>
        {/* Gown */}
        <path d="M142 132 Q166 119 190 138 Q214 119 238 132 L252 187 Q260 222 276 244 Q289 264 268 283 Q240 314 190 318 Q140 314 112 283 Q91 264 104 244 Q120 222 128 187Z" fill="url(#guideCloth)"/>
        {/* Belly silhouette */}
        <path d="M139 171 C122 199 121 239 145 266 C163 286 218 294 247 273 C275 254 273 215 253 171 C236 154 215 150 190 159 C165 150 151 158 139 171Z" fill="url(#guideSkin)" stroke="#e3b6a1" strokeOpacity=".35"/>
        {/* Resting arms */}
        <path d="M131 161 Q113 192 145 215 Q164 233 185 230" fill="none" stroke="url(#guideSkin)" strokeWidth="19" strokeLinecap="round"/>
        <path d="M249 161 Q267 192 235 215 Q216 233 195 230" fill="none" stroke="url(#guideSkin)" strokeWidth="19" strokeLinecap="round"/>
        {/* Legs */}
        <path d="M151 310 L145 356 Q145 367 163 367 L181 367 L184 326" fill="url(#guideSkin)"/>
        <path d="M229 310 L235 356 Q235 367 217 367 L199 367 L196 326" fill="url(#guideSkin)"/>
        {/* Head and hair */}
        <ellipse cx="190" cy="74" rx="30" ry="37" fill="url(#guideSkin)"/>
        <path d="M160 73 Q158 37 190 35 Q222 38 220 73 Q212 54 190 52 Q170 55 160 73Z" fill="#342b2b"/>
      </g>
      {sites.map((s) => <g key={s.id} className="guide-marker" tabIndex={0}>
        <title>{s.id}: {s.detail}</title>
        <circle className="guide-electrode-pulse" cx={s.x} cy={s.y} r="10" fill={s.color} opacity=".5"/>
        <circle cx={s.x} cy={s.y} r="6.5" fill="#101a24" stroke={s.color} strokeWidth="2.5"/>
        <circle cx={s.x} cy={s.y} r="2.4" fill={s.color}/>
      </g>)}
    </svg>
    <div className="guide-key">{sites.map(s => <span key={s.id}><i style={{ background: s.color }}/>{s.id}</span>)}</div>
    <p className="guide-disclaimer">Placement is illustrative; follow the study protocol and clinician guidance.</p>
  </div>
}
