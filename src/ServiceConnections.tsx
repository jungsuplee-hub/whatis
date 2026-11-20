import { useLayoutEffect, useState } from 'react'

export type DiagramEdge = {
  id: string
  from: string
  to: string
  port: string
  proto: string
  status: 'drawing' | 'common' | 'verify'
  purpose: string
  check: string
  route?: { start:'top'|'bottom'|'left'|'right';end:'top'|'bottom'|'left'|'right';via:[number,number][] }
}

type VisibleEdge = DiagramEdge & {
  path: string
  labelX: number
  labelY: number
  showLabel: boolean
}

type Props = {
  boardElement: HTMLDivElement | null
  edges: DiagramEdge[]
  selectedIds: string[]
  selectedId: string
  showAll: boolean
  onSelect: (edge: DiagramEdge) => void
}

function getRelativeRect(board: HTMLDivElement, id: string) {
  const el = Array.from(board.querySelectorAll<HTMLElement>('[data-service]'))
    .find(node => node.dataset.service === id)
  if (!el) return null
  const box = el.getBoundingClientRect()
  const root = board.getBoundingClientRect()
  const sx = board.clientWidth / Math.max(1, root.width)
  const sy = board.clientHeight / Math.max(1, root.height)
  return {
    x: (box.left - root.left) * sx,
    y: (box.top - root.top) * sy,
    w: box.width * sx,
    h: box.height * sy,
    cx: (box.left - root.left + box.width / 2) * sx,
    cy: (box.top - root.top + box.height / 2) * sy,
  }
}

function routeEdge(board: HTMLDivElement, edge: DiagramEdge, index: number): VisibleEdge | null {
  const from = getRelativeRect(board, edge.from)
  const to = getRelativeRect(board, edge.to)
  if (!from || !to) return null

  if (edge.route) {
    const anchor=(r:typeof from,side:'top'|'bottom'|'left'|'right')=>{
      if(side==='top')return [r.cx,r.y] as const
      if(side==='bottom')return [r.cx,r.y+r.h] as const
      if(side==='left')return [r.x,r.cy] as const
      return [r.x+r.w,r.cy] as const
    }
    const points=[anchor(from,edge.route.start),...edge.route.via,anchor(to,edge.route.end)]
    const path=points.map((point,i)=>(i===0?'M ':'L ')+point[0]+' '+point[1]).join(' ')
    let maxSpan=0, labelX=0,labelY=0
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i]
      if(Math.abs(a[1]-b[1])<2 && Math.abs(b[0]-a[0])>maxSpan){
        maxSpan=Math.abs(b[0]-a[0]);labelX=(a[0]+b[0])/2;labelY=a[1]-9
      }
    }
    return { ...edge,path,labelX,labelY,showLabel:maxSpan>=94 }
  }
  const spread = ((index % 5) - 2) * 7
  const dx = to.cx - from.cx
  const dy = to.cy - from.cy
  let path = ''
  let labelX = 0
  let labelY = 0
  let showLabel = true

  // Horizontal service pairs stay in their tier and do not run through card labels.
  if (Math.abs(dy) < Math.min(from.h, to.h) * 0.74) {
    const towardRight = dx >= 0
    const sx = towardRight ? from.x + from.w : from.x
    const ex = towardRight ? to.x : to.x + to.w
    const sy = from.cy + spread * 0.24
    const ey = to.cy + spread * 0.24
    const midX = (sx + ex) / 2
    showLabel = Math.abs(ex - sx) >= 92
    path = `M ${sx} ${sy} H ${midX} V ${ey} H ${ex}`
    labelX = midX
    labelY = Math.min(sy, ey) - 10 + spread * 0.2
  } else {
    const downward = dy >= 0
    const sx = from.cx + spread * 0.34
    const sy = downward ? from.y + from.h : from.y
    const ex = to.cx + spread * 0.34
    const ey = downward ? to.y : to.y + to.h
    const gap = Math.abs(ey - sy)
    const longJump = gap > 365
    if (longJump) {
      // Keep longer cross-tier file/cache paths in a side corridor rather than
      // obscuring every intermediate service card.
      const useRight = dx >= 0
      const corridor = useRight
        ? board.clientWidth - 24 - (index % 3) * 9
        : 24 + (index % 3) * 9
      const firstY = sy + (downward ? 12 : -12)
      const lastY = ey + (downward ? -12 : 12)
      path = `M ${sx} ${sy} V ${firstY} H ${corridor} V ${lastY} H ${ex} V ${ey}`
      labelX = corridor + (useRight ? -42 : 42)
      labelY = (firstY + lastY) / 2
    } else {
      const midY = (sy + ey) / 2 + spread * 0.43
      path = `M ${sx} ${sy} V ${midY} H ${ex} V ${ey}`
      labelX = (sx + ex) / 2
      labelY = midY - 9
    }
  }
  return { ...edge, path, labelX, labelY, showLabel }
}

export default function ServiceConnections({ boardElement, edges, selectedIds, selectedId, showAll, onSelect }: Props) {
  const [layout, setLayout] = useState<{ width: number; height: number; paths: VisibleEdge[] }>({
    width: 0, height: 0, paths: [],
  })

  useLayoutEffect(() => {
    const board = boardElement
    if (!board) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const width = board.clientWidth
        const height = board.clientHeight
        const paths = edges.map((edge, index) => routeEdge(board, edge, index))
          .filter((p): p is VisibleEdge => p !== null)
        setLayout({ width, height, paths })
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(board)
    board.querySelectorAll('[data-service]').forEach(el => observer.observe(el))
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    measure()
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [boardElement, edges])

  if (!layout.width || !layout.height) return null
  const active = new Set(selectedIds)
  return <svg
    className="tcd-connection-layer"
    viewBox={`0 0 ${layout.width} ${layout.height}`}
    preserveAspectRatio="none"
    aria-label="서비스 간 통신 방향과 연결선"
    role="group"
  >
    <defs>
      {/* Default SVG markers scale their dimensions by stroke-width. With 3–4px
          lines that produced 25–35px triangles, larger than inter-node gaps.
          Use absolute SVG units so the tip stays consistently compact. */}
      <marker id="tcd-arrow-muted" markerUnits="userSpaceOnUse" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M1 1.5 L9 5 L1 8.5 Z" fill="#93a9b2"/></marker>
      <marker id="tcd-arrow-active" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto"><path d="M1 1.75 L11 6 L1 10.25 Z" fill="#188e78"/></marker>
      <marker id="tcd-arrow-selected" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto"><path d="M1 1.5 L11 6 L1 10.5 Z" fill="#df873e"/></marker>
    </defs>
    {layout.paths.filter(edge => showAll || active.has(edge.id) || edge.id === selectedId).map(edge => {
      const isSelected = selectedId === edge.id
      const isActive = active.has(edge.id)
      const emphasized = isSelected || isActive
      const className = [
        'tcd-wire',
        isSelected ? 'tcd-wire-selected' : isActive ? 'tcd-wire-active' : 'tcd-wire-muted',
        'tcd-wire-' + edge.status,
      ].join(' ')
      const labelWidth = Math.max(36, Math.min(92, edge.port.length * 6.3 + 13))
      const lx = Math.max(labelWidth / 2 + 10, Math.min(layout.width - labelWidth / 2 - 10, edge.labelX))
      const ly = Math.max(21, Math.min(layout.height - 20, edge.labelY))
      return <g key={edge.id} className={className} data-edge-id={edge.id} role="button" tabIndex={0}
        aria-label={`${edge.from}에서 ${edge.to}, ${edge.port} 연결 보기`}
        onClick={() => onSelect(edge)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(edge)
          }
        }}
      >
        <title>{`${edge.from} → ${edge.to}: ${edge.port} (${edge.proto})`}</title>
        {emphasized && <path d={edge.path} className="tcd-wire-halo" />}
        <path d={edge.path} className="tcd-wire-visible"
          markerEnd={`url(#${isSelected ? 'tcd-arrow-selected' : isActive ? 'tcd-arrow-active' : 'tcd-arrow-muted'})`} />
        <path d={edge.path} className="tcd-wire-hit" />
        {emphasized && edge.showLabel && <>
          <rect x={lx-labelWidth/2} y={ly-13} width={labelWidth} height="20" rx="5"
            className="tcd-wire-port-back" />
          <text x={lx} y={ly+0.5} className="tcd-wire-port" textAnchor="middle">{edge.port}</text>
        </>}
      </g>
    })}
  </svg>
}
