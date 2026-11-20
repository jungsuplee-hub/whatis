import type { ComputerChapterId } from './computerContent'
import './computer-motion.css'

type Variant={chapter:ComputerChapterId;step?:number;compact?:boolean}
type CardProps={x:number;y:number;w?:number;h?:number;name:string;sub?:string;active?:boolean;tone?:'teal'|'blue'|'violet'|'amber'}
function Card({x,y,w=170,h=100,name,sub,active=false,tone='teal'}:CardProps){
 return <g className={'cm-card'+(active?' cm-on':'')+' cm-tone-'+tone} transform={`translate(${x},${y})`}>
  <rect width={w} height={h} rx={12} className="cm-card-bg"/>
  <rect x={13} y={14} width={26} height={26} rx={7} className="cm-icon-bg"/>
  <path d="M20 27h12M26 21v12" className="cm-icon-lines"/>
  <text x={15} y={h-35} className="cm-name">{name}</text>
  {sub&&<text x={15} y={h-16} className="cm-sub">{sub}</text>}
  <circle cx={w-16} cy={19} r={4} className="cm-led"/>
 </g>
}
function Wire({d,active=false,dotted=false}: {d:string;active?:boolean;dotted?:boolean}){
 return <g className={'cm-wire'+(active?' cm-wire-active':'')+(dotted?' cm-wire-dotted':'')}>
   <path d={d} className="cm-wire-glow"/>
   <path d={d} className="cm-wire-stroke" markerEnd="url(#cm-arrow)"/>
 </g>
}
function Tag({x,y,text}:{x:number;y:number;text:string}){
 return <g transform={`translate(${x},${y})`}><rect x={0} y={-17} width={Math.max(48,text.length*8+22)} height={27} rx={7} fill="#213b4c"/><text x={11} y={1} className="cm-tag">{text}</text></g>
}
const pipelineColumns=['FETCH','DECODE','EXECUTE','WRITE BACK']
function Pipeline({step}:{step:number}){
 return <>
  <text x={56} y={72} className="cm-overline">INSTRUCTION PIPELINE / OVERLAPPED EXECUTION</text>
  <text x={56} y={108} className="cm-heading">한 명령의 다음 단계와 다음 명령의 첫 단계가 겹칩니다.</text>
  {Array.from({length:5},(_,i)=><g key={i}>
    <text x={58} y={170+i*61} className="cm-line-name">I{String(i+1).padStart(2,'0')}</text>
    {pipelineColumns.map((col,j)=>{
     const x=117+(j+i)*95,y=142+i*61,hot=step%4===j
     return <g key={j} className={hot?'cm-pipe-hot':''}>
       <rect x={x} y={y} width={87} height={44} rx={7} className={'cm-pipe-cell cm-pipe-'+j}/>
       <text x={x+43.5} y={y+27} textAnchor="middle" className="cm-pipe-label">{col}</text>
     </g>
    })}
  </g>)}
  <path d="M100 455 H790" className="cm-axis"/><path d="m781 449 10 6-10 6" className="cm-axis"/>
  <text x={680} y={477} className="cm-sub">CLOCK CYCLES →</text>
 </>
}
function Hardware({step}:{step:number}){
 return <>
  <text x={45} y={64} className="cm-overline">STORED-PROGRAM COMPUTER / DATA PATH</text>
  <Wire d="M206 215 H312" active={step===0||step===2}/>
  <Wire d="M518 214 H611" active={step===1||step===2}/>
  <Wire d="M712 284 V350 H424 V293" active={step>=2}/>
  <Wire d="M206 260 H264 V406 H314" dotted/>
  <Card x={44} y={165} w={164} h={120} name="INPUT / I·O" sub="요청 · 장치" active={step===0} tone="amber"/>
  <Card x={314} y={155} w={204} h={140} name="CPU" sub="CU · ALU · Registers" active={step===2} tone="teal"/>
  <Card x={613} y={165} w={212} h={120} name="RAM" sub="실행 중인 코드 · 데이터" active={step===1} tone="blue"/>
  <Card x={314} y={353} w={204} h={110} name="STORAGE" sub="SSD / HDD" active={step===1||step===3} tone="violet"/>
  <Tag x={539} y={172} text="Memory bus"/>
  <Tag x={545} y={341} text="Read / Write"/>
 </>
}
function Memory({step}:{step:number}){
 const items=[{name:'REGISTER',sub:'가장 가까운 작업 공간',w:235,x:330,y:93},{name:'L1 / L2 CACHE',sub:'자주 사용하는 데이터',w:342,x:276,y:190},{name:'MAIN MEMORY · RAM',sub:'실행 중인 코드와 데이터',w:484,x:205,y:287},{name:'SSD / HDD',sub:'지속 저장 · 비교적 큰 용량',w:615,x:140,y:384}]
 return <>
  <text x={45} y={63} className="cm-overline">MEMORY HIERARCHY / CLOSER IS FASTER</text>
  {items.map((v,i)=><g key={i} className={'cm-tier'+(step%4===i?' cm-tier-on':'')}>
   <rect x={v.x} y={v.y} width={v.w} height={77} rx={12} className="cm-tier-rect"/>
   <text x={v.x+20} y={v.y+32} className="cm-tier-name">{v.name}</text>
   <text x={v.x+20} y={v.y+54} className="cm-tier-sub">{v.sub}</text>
  </g>)}
  <Wire d="M450 173 V188" active/><Wire d="M450 271 V285" active/><Wire d="M450 369 V382" active/>
  <Tag x={705} y={175} text={step===1?'Cache lookup':step===2?'Hit / Miss':'Data path'}/>
 </>
}
function Operating({step}:{step:number}){
 return <>
  <text x={49} y={64} className="cm-overline">USER SPACE / KERNEL SPACE / HARDWARE</text>
  <rect x={45} y={88} width={825} height={147} rx={16} className="cm-zone cm-zone-user"/>
  <rect x={45} y={260} width={825} height={108} rx={16} className="cm-zone cm-zone-kernel"/>
  <rect x={45} y={394} width={825} height={91} rx={16} className="cm-zone cm-zone-hw"/>
  <text x={63} y={112} className="cm-zone-name">USER SPACE</text><text x={64} y={283} className="cm-zone-name">KERNEL SPACE</text><text x={64} y={417} className="cm-zone-name">HARDWARE</text>
  <Card x={110} y={131} w={185} h={87} name="PROCESS A" sub="Thread 01" active={step===0||step===3} tone="blue"/>
  <Card x={366} y={131} w={185} h={87} name="PROCESS B" sub="Thread 02" active={step===1} tone="blue"/>
  <Card x={618} y={131} w={185} h={87} name="PROCESS C" sub="Thread 03" active={step===2} tone="blue"/>
  <Wire d="M201 219 V260" active={step===0}/><Wire d="M459 219 V260" active={step===1}/><Wire d="M711 219 V260" active={step===2}/>
  <rect x={182} y={290} width={556} height={54} rx={11} className={'cm-core-kernel'+(step===2?' cm-kernel-on':'')}/>
  <text x={460} y={324} className="cm-kernel-text" textAnchor="middle">KERNEL · SYSTEM CALLS · SCHEDULER</text>
  <Wire d="M460 346 V398" active={step>=2}/>
  <text x={461} y={458} className="cm-hardware-label" textAnchor="middle">CPU     /     RAM     /     STORAGE     /     DEVICE</text>
 </>
}
function Virtual({step}:{step:number}){
 const vp=[0,1,2,3]
 return <>
  <text x={50} y={63} className="cm-overline">VIRTUAL ADDRESS → TRANSLATION → PHYSICAL FRAME</text>
  <rect x={42} y={96} width={216} height={366} rx={15} className="cm-virtual-zone"/>
  <rect x={649} y={96} width={218} height={366} rx={15} className="cm-virtual-zone"/>
  <text x={64} y={128} className="cm-zone-name">VIRTUAL PAGES</text><text x={670} y={128} className="cm-zone-name">PHYSICAL FRAMES</text>
  {vp.map((i)=><g key={i}>
   <rect x={70} y={148+i*73} width={160} height={52} rx={7} className={'cm-page'+(step===i?' cm-page-on':'')}/>
   <text x={93} y={179+i*73} className="cm-page-name">PAGE 0{i+1}</text>
   <rect x={677} y={148+i*73} width={163} height={52} rx={7} className={'cm-page'+(step===i?' cm-page-on':'')}/>
   <text x={698} y={179+i*73} className="cm-page-name">FRAME 0{i+1}</text>
   <Wire d={`M231 ${174+i*73} H314 V${190+i*64} H596 V${174+i*73} H675`} active={step===i}/>
  </g>)}
  <Card x={342} y={108} w={225} h={94} name="TLB / PAGE TABLE" sub="주소 변환" active={step===1||step===2} tone="amber"/>
  <Tag x={342} y={408} text={step===2?'Page walk':'Address mapping'}/>
 </>
}
function Storage({step}:{step:number}){
 return <>
  <text x={49} y={64} className="cm-overline">FILES → FILE SYSTEM → STORAGE LAYOUT</text>
  <Card x={53} y={212} w={188} h={128} name="APPLICATION" sub="File read / write" active={step===0} tone="blue"/>
  <Card x={330} y={212} w={208} h={128} name="FILE SYSTEM" sub="Blocks · Metadata" active={step===1} tone="teal"/>
  <Wire d="M243 277 H328" active={step<2}/><Wire d="M539 278 H619" active={step>=2}/>
  <rect x={628} y={122} width={220} height={327} rx={18} className="cm-array-bg"/>
  <text x={655} y={154} className="cm-overline">STORAGE ARRAY</text>
  {[0,1,2].map(i=><g key={i} className={step===i+1?'cm-disk-on':''}>
    <rect x={652} y={177+i*80} width={166} height={55} rx={8} className="cm-disk"/>
    <ellipse cx={691} cy={205+i*80} rx={18} ry={8} className="cm-disk-plate"/>
    <path d={`M673 ${204+i*80}v7c8 7 27 7 36 0v-7`} className="cm-disk-detail"/>
    <text x={730} y={209+i*80} className="cm-page-name">DISK 0{i+1}</text>
  </g>)}
  <Tag x={357} y={187} text={step===1?'Metadata':step===2?'RAID / NAS':'Block I/O'}/>
 </>
}
function Resilience({step}:{step:number}){
 return <>
  <text x={55} y={64} className="cm-overline">AVAILABILITY / ACTIVE · STANDBY / FAILOVER</text>
  <Card x={58} y={201} w={159} h={108} name="CLIENTS" sub="사용자 요청" active={step===0} tone="blue"/>
  <Card x={296} y={201} w={190} h={108} name="LOAD BALANCER" sub="Health check" active={step===1||step===2} tone="teal"/>
  <Card x={585} y={122} w={244} h={116} name={step===2?'NODE A · DOWN':'NODE A · ACTIVE'} sub="Application service" active={step<2} tone="teal"/>
  <Card x={585} y={293} w={244} h={116} name={step>=2?'NODE B · ACTIVE':'NODE B · STANDBY'} sub="Backup service" active={step>=2} tone="violet"/>
  <Wire d="M218 256 H294" active/><Wire d="M488 248 H541 V180 H583" active={step<2}/><Wire d="M488 264 H541 V349 H583" active={step>=2}/>
  <Tag x={300} y={378} text={step>=2?'Failover active':'Monitor / standby'}/>
 </>
}
function Cloud({step}:{step:number}){
 return <>
  <text x={56} y={60} className="cm-overline">RESOURCE POOL / PROVISIONING / CONSUMPTION</text>
  <Card x={50} y={199} w={184} h={126} name="USER / API" sub="Resource request" active={step===0} tone="blue"/>
  <Card x={304} y={199} w={227} h={126} name="CONTROL PLANE" sub="Provision · Meter" active={step===1} tone="amber"/>
  <Wire d="M235 261 H302" active={step<=1}/>
  <rect x={594} y={91} width={257} height={344} rx={16} className="cm-cloud-pool"/>
  <text x={624} y={124} className="cm-overline">COMPUTE POOL</text>
  {[0,1,2].map((i)=><g key={i}>
    <rect x={617} y={146+i*88} width={212} height={67} rx={10} className={'cm-cloud-instance'+(step===i+1?' cm-cloud-active':'')}/>
    <text x={642} y={184+i*88} className="cm-page-name">{['VIRTUAL MACHINES','STORAGE SERVICES','MANAGED APPS'][i]}</text>
  </g>)}
  <Wire d="M533 262 H580 V179 H614" active={step===2}/><Wire d="M580 262 V268 H614" active={step===3}/>
  <Tag x={311} y={172} text={step===3?'Service delivery':'Automation'}/>
 </>
}
export default function ComputerMotion({chapter,step=0,compact=false}:Variant){
 const active=step%4
 return <div className={'cm-motion cm-motion-'+chapter+(compact?' cm-compact':'')}>
   <svg viewBox="0 0 920 520" role="img" aria-label={`${chapter} 기술 원리 애니메이션 도식, 현재 단계 ${active+1}`}>
    <defs>
      <pattern id="cm-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#3d586e" opacity=".25"/></pattern>
      <marker id="cm-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 11 11" markerWidth="11" markerHeight="11" refX="10" refY="5.5" orient="auto"><path d="M1 1.5 L10 5.5 L1 9.5 Z" fill="#52bfad"/></marker>
      <radialGradient id="cm-glow"><stop offset="0" stopColor="#2d857f" stopOpacity=".28"/><stop offset="1" stopColor="#2d857f" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="920" height="520" rx="13" fill="#132735"/><rect width="920" height="520" fill="url(#cm-grid)"/>
    <circle cx="790" cy="80" r="240" fill="url(#cm-glow)"/>
    <g className="cm-content" key={chapter+'-'+active}>
     {chapter==='hardware'&&<Hardware step={active}/>}
     {chapter==='parallel'&&<Pipeline step={active}/>}
     {chapter==='memory'&&<Memory step={active}/>}
     {chapter==='operating'&&<Operating step={active}/>}
     {chapter==='virtual'&&<Virtual step={active}/>}
     {chapter==='storage'&&<Storage step={active}/>}
     {chapter==='resilience'&&<Resilience step={active}/>}
     {chapter==='cloud'&&<Cloud step={active}/>}
    </g>
    <text x="44" y="501" className="cm-footer-caption">WHATIS. / INTERACTIVE CONCEPT DIAGRAM</text>
    <text x="867" y="501" textAnchor="end" className="cm-footer-caption">0{active+1} / 04</text>
   </svg>
 </div>
}
