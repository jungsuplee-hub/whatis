import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle2, GitBranch, Network, Server, ShieldCheck, X } from 'lucide-react'
import './architecture-quick-view.css'

export type ArchitectureRelated={ id:string; title:string; subtitle:string }
export type ArchitectureDetail={
  kind:'component'|'connection'
  eyebrow:string
  title:string
  subtitle?:string
  description:string
  metricLabel:string
  metric:string
  secondaryLabel?:string
  secondary?:string
  status?:string
  reviewLabel:string
  review:string
  related?:ArchitectureRelated[]
}
type Props={
  detail:ArchitectureDetail|null
  onClose:()=>void
  onRelated?:(id:string)=>void
  onMatrix?:()=>void
}
export default function ArchitectureQuickView({detail,onClose,onRelated,onMatrix}:Props){
  const panel=useRef<HTMLElement|null>(null)
  const closeButton=useRef<HTMLButtonElement|null>(null)
  useEffect(()=>{
    if(!detail)return
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null
    const oldOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    closeButton.current?.focus()
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();onClose();return}
      if(event.key!=='Tab'||!panel.current)return
      const focusable=Array.from(panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'))
      if(!focusable.length)return
      const first=focusable[0],last=focusable[focusable.length-1]
      if(event.shiftKey&&(document.activeElement===first||!panel.current.contains(document.activeElement))){
        event.preventDefault();last.focus()
      }else if(!event.shiftKey&&(document.activeElement===last||!panel.current.contains(document.activeElement))){
        event.preventDefault();first.focus()
      }
    }
    document.addEventListener('keydown',onKeyDown)
    return ()=>{
      document.removeEventListener('keydown',onKeyDown)
      document.body.style.overflow=oldOverflow
      previous?.focus({preventScroll:true})
    }
    // Detail switching should update panel contents without resetting focus.
  },[Boolean(detail)]) // eslint-disable-line react-hooks/exhaustive-deps

  if(!detail)return null
  return createPortal(
    <div className="arch-qv-layer" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
      <section className="arch-qv-sheet" role="dialog" aria-modal="true" aria-labelledby="arch-qv-title" aria-describedby="arch-qv-description" ref={panel} tabIndex={-1}>
        <header className="arch-qv-header">
          <span className="arch-qv-kind">{detail.kind==='component'?<Server size={16}/>:<Network size={16}/>} {detail.kind==='component'?'구성요소 상세':'통신 연결 상세'}</span>
          <button className="arch-qv-close" ref={closeButton} type="button" onClick={onClose} aria-label="상세 패널 닫기"><X size={21}/></button>
        </header>
        <div className="arch-qv-scroll">
          <div className="arch-qv-title-block">
            <span className="arch-qv-eyebrow">{detail.eyebrow}</span>
            <h2 id="arch-qv-title">{detail.title}</h2>
            {detail.subtitle&&<span className="arch-qv-subtitle">{detail.subtitle}</span>}
            <p id="arch-qv-description">{detail.description}</p>
          </div>
          <div className="arch-qv-facts">
            <div className="arch-qv-fact"><span>{detail.metricLabel}</span><strong>{detail.metric}</strong></div>
            {detail.secondary&&<div className="arch-qv-fact"><span>{detail.secondaryLabel||'연결 정보'}</span><strong>{detail.secondary}</strong></div>}
          </div>
          {detail.status&&<span className="arch-qv-status"><CheckCircle2 size={14}/>{detail.status}</span>}
          <section className="arch-qv-review">
            <div><ShieldCheck size={18}/><strong>{detail.reviewLabel}</strong></div>
            <p>{detail.review}</p>
          </section>
          {detail.related&&detail.related.length>0&&<section className="arch-qv-related">
            <h3><GitBranch size={17}/> 연결 관계</h3>
            <p>다른 연결을 누르면 이 패널에서 바로 상세 정보가 바뀝니다.</p>
            <div>{detail.related.map(item=><button type="button" key={item.id} onClick={()=>onRelated?.(item.id)}><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowRight size={16}/></button>)}</div>
          </section>}
        </div>
        <footer className="arch-qv-footer">
          <button type="button" className="arch-qv-dismiss" onClick={onClose}>구성도로 돌아가기</button>
          {onMatrix&&<button type="button" className="arch-qv-matrix" onClick={onMatrix}>포트 매트릭스 <ArrowRight size={16}/></button>}
        </footer>
      </section>
    </div>,
    document.body
  )
}
