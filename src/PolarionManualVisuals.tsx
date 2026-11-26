import { useId, useState, useEffect } from 'react'
import { Maximize2, X, ExternalLink } from 'lucide-react'
import { diagrams, screenshots, officialVisualLinks } from './polarion-visuals'
import type { Diagram } from './polarion-visuals'
function TechnicalDiagram({d}:{d:Diagram}){
 const marker=useId().replace(/:/g,'')
 const cols=Math.max(...d.nodes.map(n=>Number(n[2])))+1
 const rows=Math.max(...d.nodes.map(n=>Number(n[3])))+1
 const w=178,h=58,sx=224,sy=100,pad=18
 const width=(cols-1)*sx+w+2*pad,height=(rows-1)*sy+h+2*pad
 const point=(i:number)=>({x:pad+Number(d.nodes[i][2])*sx,y:pad+Number(d.nodes[i][3])*sy})
 return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={d.title} xmlns="http://www.w3.org/2000/svg">
 <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M0 0L7 3.5L0 7Z" fill="#49796c"/></marker></defs>
 {d.edges.map((e,i)=>{const a=point(Number(e[0])),b=point(Number(e[1]));const dx=b.x-a.x,dy=b.y-a.y;let x1=a.x+w/2,y1=a.y+h/2,x2=b.x+w/2,y2=b.y+h/2;let path:string;if(dx!==0){x1+=Math.sign(dx)*w/2;x2-=Math.sign(dx)*(w/2+5);const mid=(x1+x2)/2;path=`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}else{y1+=Math.sign(dy)*h/2;y2-=Math.sign(dy)*(h/2+5);path=`M ${x1} ${y1} L ${x2} ${y2}`}return <g key={i}><path d={path} fill="none" stroke="#49796c" strokeWidth="1.8" markerEnd={`url(#${marker})`}/>{e[2]&&<text x={(x1+x2)/2+(dx===0?9:0)} y={(y1+y2)/2-7} fontSize="10" fill="#396356" textAnchor={dx===0?'start':'middle'} stroke="#f5f9f7" strokeWidth="4" paintOrder="stroke">{String(e[2])}</text>}</g>})}
 {d.nodes.map((n,i)=>{const p=point(i);return <g key={i}><rect x={p.x} y={p.y} width={w} height={h} rx="8" fill={Number(n[2])===0?'#e5efea':'#fff'} stroke="#94b3a8" strokeWidth="1.2"/><text x={p.x+w/2} y={p.y+24} textAnchor="middle" fontSize="12.8" fontWeight="700" fill="#173f36">{String(n[0])}</text><text x={p.x+w/2} y={p.y+43} textAnchor="middle" fontSize="10.8" fill="#537166">{String(n[1])}</text></g>})}
 </svg>
}
export function ManualVisuals({id,printing=false}:{id:string;printing?:boolean}){
 const [zoom,setZoom]=useState<{url?:string;diagram?:Diagram;title:string}|null>(null)
 useEffect(()=>{if(!zoom)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setZoom(null)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[zoom])
 return <div className="pm-visuals">{(diagrams[id]||[]).map((d,i)=><figure className="pm-figure" key={d.title}><div className="pm-figure-head"><span>FIGURE {String(i+1).padStart(2,'0')} · 자체 기술 도식</span>{!printing&&<button onClick={()=>setZoom({diagram:d,title:d.title})}><Maximize2 size={13}/>확대</button>}</div><h4>{d.title}</h4><div className="pm-diagram"><TechnicalDiagram d={d}/></div><figcaption><p>{d.caption}</p><small>근거: {d.source} · 원본 그림 복제 아님</small></figcaption></figure>)}
 {(screenshots[id]||[]).map((s,i)=><figure className="pm-figure" key={s.title}><div className="pm-figure-head"><span>SCREEN {String(i+1).padStart(2,'0')} · WhatIs 학습용 화면</span>{!printing&&<button onClick={()=>setZoom({url:s.url,title:s.title})}><Maximize2 size={13}/>확대</button>}</div><h4>{s.title}</h4><img className="pm-screen" src={s.url} alt={s.title+' — WhatIs 시뮬레이션'} loading={printing?'eager':'lazy'} decoding="async"/><figcaption><p>{s.caption}</p><small>출처: WhatIs 자체 Polarion 화면 체험 · 실제 Siemens 운영 UI 캡처가 아닙니다.</small>{!printing&&<a href="#siemens/polarion-demo">학습용 화면 체험 <ExternalLink size={12}/></a>}</figcaption></figure>)}
 {(officialVisualLinks[id]||[]).map(v=><p key={v.url} className="pm-visual-link"><a href={v.url} target="_blank" rel="noreferrer">{v.label} <ExternalLink size={13}/></a><small>원본 제품 화면은 제공 사이트에서 확인합니다.</small></p>)}
 {zoom&&!printing&&<div className="pm-zoom-overlay" role="dialog" aria-modal="true" aria-label={zoom.title} onClick={e=>{if(e.target===e.currentTarget)setZoom(null)}}><div className="pm-zoom-box"><div><strong>{zoom.title}</strong><button aria-label="확대 닫기" onClick={()=>setZoom(null)} autoFocus><X size={22}/></button></div>{zoom.diagram?<TechnicalDiagram d={zoom.diagram}/>:<img src={zoom.url} alt={zoom.title}/>}</div></div>}</div>
}
