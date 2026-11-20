import { useMemo } from 'react'
import './computer-motion.css'

type Unit={id:string;name:string;sub:string;x:number;y:number;w?:number;tone?:'teal'|'blue'|'amber'|'violet'}
type Link={from:string;to:string;via?:[number,number][]}
type Diagram={kicker:string;caption:string;units:Unit[];links:Link[];focus:string[][]}
const unit=(id:string,name:string,sub:string,x:number,y:number,tone:Unit['tone']='teal',w=178):Unit=>({id,name,sub,x,y,tone,w})
const link=(from:string,to:string,via?:[number,number][]):Link=>({from,to,via})
const diagrams:Record<string,Diagram>={
 'cpu-instructions':{
  kicker:'INSTRUCTION EXECUTION',caption:'CPU가 명령어 한 개를 처리하는 기본 흐름',
  units:[unit('pc','PROGRAM COUNTER','다음 명령어 위치',44,102,'blue',181),unit('fetch','FETCH','명령 읽기',73,280,'blue',170),unit('decode','DECODE','명령 해석',286,280,'violet',170),unit('alu','EXECUTE / ALU','연산 수행',500,280,'teal',170),unit('write','WRITE BACK','결과 반영',714,280,'amber',167)],
  links:[link('pc','fetch'),link('fetch','decode'),link('decode','alu'),link('alu','write')],
  focus:[['pc','fetch'],['decode'],['alu'],['write']]
 },
 'instruction-set':{
  kicker:'RISC / CISC / MICROARCHITECTURE',caption:'명령어 설계와 내부 실행 단계의 차이',
  units:[unit('risc','RISC STYLE','간결한 명령 집합',66,130,'blue',188),unit('load','LOAD / OPERATE','단순 작업 조합',331,124,'teal',226),unit('complex','CISC STYLE','복합 명령 집합',66,337,'violet',188),unit('decode','DECODER','복잡한 명령 해석',331,331,'amber',226),unit('engine','EXECUTION UNITS','실제 CPU 실행',655,231,'teal',218)],
  links:[link('risc','load'),link('load','engine'),link('complex','decode'),link('decode','engine')],
  focus:[['risc','complex'],['load','decode'],['decode'],['engine']]
 },
 'parallel-units':{
  kicker:'INSTRUCTION LEVEL PARALLELISM',caption:'독립적인 작업을 여러 실행 자원이 처리',
  units:[unit('queue','ISSUE QUEUE','준비된 명령들',60,221,'blue',195),unit('a','EXECUTION A','산술 연산',378,92,'teal',197),unit('b','EXECUTION B','메모리 연산',378,235,'violet',197),unit('c','EXECUTION C','독립적 연산',378,379,'amber',197),unit('result','RETIRE','결과 반영',691,221,'blue',169)],
  links:[link('queue','a'),link('queue','b'),link('queue','c'),link('a','result'),link('b','result'),link('c','result')],
  focus:[['queue'],['a','b'],['a','b','c'],['result']]
 },
 'multiprocessor':{
  kicker:'SMP / NUMA / MULTIPROCESSOR',caption:'프로세서와 메모리의 물리적 거리',
  units:[unit('cpuA','CPU A','코어 / 소켓 A',59,138,'blue',185),unit('cpuB','CPU B','코어 / 소켓 B',365,138,'teal',185),unit('cpuC','CPU C','코어 / 소켓 C',671,138,'violet',185),unit('ramA','MEMORY A','Local access',184,335,'blue',225),unit('ramB','MEMORY B','Remote access',545,335,'violet',225)],
  links:[link('cpuA','ramA'),link('cpuB','ramA'),link('cpuB','ramB'),link('cpuC','ramB')],
  focus:[['cpuA','cpuB','cpuC'],['ramA','ramB'],['cpuA','ramA'],['cpuC','ramB']]
 },
 'cache-journey':{
  kicker:'CACHE LOOKUP / HIT OR MISS',caption:'CPU가 RAM으로 가기 전에 캐시를 확인',
  units:[unit('cpu','CPU','데이터 요청',60,205,'blue',206),unit('cache','L1 / L2 CACHE','Hit? · Miss?',351,205,'teal',216),unit('ram','MAIN MEMORY','Miss일 때 접근',665,205,'violet',211)],
  links:[link('cpu','cache'),link('cache','ram')],
  focus:[['cpu'],['cache'],['cache','ram'],['cache','cpu']]
 },
 'cache-policy':{
  kicker:'TEMPORAL / SPATIAL LOCALITY',caption:'쓰기 정책과 캐시 데이터의 수명',
  units:[unit('cpu','CPU WRITES','변경된 데이터',54,215,'blue',211),unit('cache','CACHE LINE','Modified / Dirty',344,215,'teal',223),unit('ram','MAIN MEMORY','Write-through/back',666,215,'violet',218)],
  links:[link('cpu','cache'),link('cache','ram')],
  focus:[['cpu','cache'],['cache'],['cache','ram'],['cache','ram']]
 },
 'cpu-scheduler':{
  kicker:'OPERATING SYSTEM SCHEDULER',caption:'Ready 상태에서 CPU 실행까지',
  units:[unit('a','THREAD A','Ready',53,112,'blue',180),unit('b','THREAD B','Ready',53,299,'violet',180),unit('sched','SCHEDULER','Select / Context',362,206,'teal',222),unit('cpu','CPU CORE','Running',680,206,'amber',186)],
  links:[link('a','sched'),link('b','sched'),link('sched','cpu')],
  focus:[['a','b'],['sched'],['sched','cpu'],['cpu']]
 },
 'synchronization':{
  kicker:'LOCK / MUTUAL EXCLUSION',caption:'공유 자원의 동시 접근을 제어',
  units:[unit('threadA','THREAD A','Lock request',61,113,'blue',189),unit('threadB','THREAD B','Waiting',61,325,'violet',189),unit('lock','MUTEX','Owner / Waiters',375,211,'amber',200),unit('data','SHARED DATA','Critical section',688,211,'teal',181)],
  links:[link('threadA','lock'),link('threadB','lock'),link('lock','data')],
  focus:[['threadA','threadB'],['lock'],['lock','threadB'],['data']]
 },
 'page-replacement':{
  kicker:'PAGE FAULT / REPLACEMENT',caption:'RAM에 없는 페이지를 가져오는 과정',
  units:[unit('app','PROCESS','Virtual page',60,216,'blue',196),unit('table','PAGE TABLE','Present bit',319,216,'amber',200),unit('ram','RAM FRAMES','Resident pages',644,114,'teal',221),unit('disk','BACKING STORE','Page in / out',644,330,'violet',221)],
  links:[link('app','table'),link('table','ram'),link('disk','ram')],
  focus:[['app'],['table'],['disk','ram'],['ram']]
 },
 'dma-io':{
  kicker:'DIRECT MEMORY ACCESS',caption:'CPU가 설정하고 장치가 메모리에 데이터 전송',
  units:[unit('cpu','CPU / DRIVER','Transfer setup',70,112,'blue',214),unit('device','I/O DEVICE','Data producer',70,327,'violet',214),unit('dma','DMA ENGINE','Transfer control',362,226,'amber',205),unit('ram','RAM BUFFER','Destination',682,226,'teal',195)],
  links:[link('cpu','dma'),link('device','dma'),link('dma','ram')],
  focus:[['cpu'],['cpu','dma'],['device','dma','ram'],['ram','cpu']]
 },
 'raid-levels':{
  kicker:'RAID / STRIPING / MIRROR / PARITY',caption:'디스크 여러 개에 데이터를 배치하는 방식',
  units:[unit('host','HOST / RAID','Logical volume',58,214,'blue',226),unit('disk1','DISK 01','Data / Copy / Parity',403,97,'teal',226),unit('disk2','DISK 02','Data / Copy / Parity',403,230,'violet',226),unit('disk3','DISK 03','Data / Copy / Parity',403,363,'amber',226),unit('backup','BACKUP','Separate recovery',692,230,'blue',181)],
  links:[link('host','disk1'),link('host','disk2'),link('host','disk3')],
  focus:[['host','disk1','disk2','disk3'],['disk1','disk2'],['disk1','disk2','disk3'],['backup']]
 },
 'das-nas-san':{
  kicker:'THREE STORAGE ACCESS MODELS',caption:'직접 연결 / 파일 네트워크 / 블록 네트워크',
  units:[unit('server','APPLICATION HOST','Data request',56,212,'blue',221),unit('das','DAS','Direct attach',374,99,'teal',215),unit('nas','NAS','Network file',374,238,'violet',215),unit('san','SAN','Block access',374,380,'amber',215),unit('array','STORAGE','Physical disks',690,239,'blue',183)],
  links:[link('server','das'),link('server','nas'),link('server','san'),link('nas','array'),link('san','array')],
  focus:[['server','das'],['server','nas'],['server','san'],['array']]
 },
 'storage-tier':{
  kicker:'STORAGE TIERS / DATA LIFECYCLE',caption:'데이터를 빈도와 정책에 따라 보관',
  units:[unit('policy','DATA POLICY','Usage / Retention',52,218,'blue',239),unit('hot','HOT TIER','Low latency',404,93,'teal',236),unit('warm','WARM TIER','General purpose',404,242,'amber',236),unit('cold','COLD ARCHIVE','Cost optimized',404,392,'violet',236)],
  links:[link('policy','hot'),link('policy','warm'),link('policy','cold')],
  focus:[['policy'],['hot'],['warm'],['cold']]
 },
 'disaster-recovery':{
  kicker:'DISASTER RECOVERY / SECOND SITE',caption:'백업·복제·전환 계획과 복구 검증',
  units:[unit('primary','PRIMARY SITE','Production traffic',49,193,'blue',222),unit('replica','REPLICATION','Continuous / Batch',364,193,'amber',218),unit('secondary','DR SITE','Standby / Recovery',673,193,'teal',203),unit('backup','OFFLINE BACKUP','Point-in-time copy',364,374,'violet',218)],
  links:[link('primary','replica'),link('replica','secondary'),link('primary','backup'),link('backup','secondary')],
  focus:[['primary'],['replica','backup'],['secondary'],['backup','secondary']]
 },
 'grid-cloud':{
  kicker:'GRID / CLUSTER / CLOUD',caption:'계산 자원 분배와 서비스 제공 방식',
  units:[unit('work','WORKLOAD','User request',45,217,'blue',186),unit('cluster','CLUSTER','Managed nodes',315,112,'teal',225),unit('grid','GRID','Federated systems',315,325,'violet',225),unit('cloud','CLOUD API','On-demand service',645,217,'amber',224)],
  links:[link('work','cluster'),link('work','grid'),link('cluster','cloud'),link('grid','cloud')],
  focus:[['cluster'],['grid'],['cloud'],['cloud','work']]
 }
}

export const hasComputerDetailDiagram=(id:string)=>Boolean(diagrams[id])
function pathFor(a:Unit,b:Unit,via?:[number,number][]){
 const aw=a.w??178,bw=b.w??178
 const ah=113
 const aRight=a.x+aw,bLeft=b.x
 const start:[number,number]=bLeft>=aRight?[aRight,a.y+ah/2]:[a.x+aw/2,a.y+(b.y>a.y?ah:0)]
 const end:[number,number]=bLeft>=aRight?[bLeft,b.y+ah/2]:[b.x+bw/2,b.y+(b.y>a.y?0:ah)]
 const midX=(start[0]+end[0])/2
 const pts=via?[start,...via,end]:(bLeft>=aRight?[start,[midX,start[1]],[midX,end[1]],end]:[start,[start[0],(start[1]+end[1])/2],[end[0],(start[1]+end[1])/2],end])
 return pts.map((pt,i)=>(i?'L':'M')+pt[0]+' '+pt[1]).join(' ')
}
export default function ComputerDetailDiagram({topicId,step=0}:{topicId:string;step?:number}){
 const d=diagrams[topicId]
 const active=step%4
 const activeIds=useMemo(()=>new Set(d?.focus[active]??[]),[d,active])
 if(!d)return null
 return <div className="cm-motion cm-detail-motion">
  <svg viewBox="0 0 920 520" role="img" aria-label={d.kicker+' 기술 구조도'}>
   <defs>
    <pattern id={'cm-dots-'+topicId} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#435d72" opacity=".34"/></pattern>
    <marker id={'cm-arrow-'+topicId} markerUnits="userSpaceOnUse" viewBox="0 0 11 11" markerWidth="11" markerHeight="11" refX="10" refY="5.5" orient="auto"><path d="M1 1.4 L10 5.5 L1 9.6 Z" fill="#58c5aa"/></marker>
   </defs>
   <rect width="920" height="520" fill="#142b38" rx="12"/>
   <rect width="920" height="520" fill={'url(#cm-dots-'+topicId+')'}/>
   <text x="38" y="53" className="cm-overline">{d.kicker}</text>
   <text x="38" y="80" className="cm-detail-caption">{d.caption}</text>
   {d.links.map((l,i)=>{
    const a=d.units.find(x=>x.id===l.from)!,b=d.units.find(x=>x.id===l.to)!
    const hot=activeIds.has(a.id)&&activeIds.has(b.id)
    return <path key={i} d={pathFor(a,b,l.via)} className={'cm-detail-link'+(hot?' cm-detail-link-on':'')} markerEnd={'url(#cm-arrow-'+topicId+')'}/>
   })}
   {d.units.map((u)=>{
    const hot=activeIds.has(u.id)
    const w=u.w??178
    return <g key={u.id} className={'cm-detail-node cm-detail-node-'+(u.tone??'teal')+(hot?' cm-detail-node-on':'')} transform={`translate(${u.x},${u.y})`}>
      <rect width={w} height="113" rx="13" className="cm-detail-node-bg"/>
      <rect x="13" y="13" width="27" height="27" rx="7" className="cm-detail-node-icon"/>
      <path d="M19 27h14M26 20v14" className="cm-detail-node-plus"/>
      <circle cx={w-18} cy="21" r="4" className="cm-detail-node-dot"/>
      <text x="14" y="68" className="cm-detail-node-name">{u.name}</text>
      <text x="14" y="92" className="cm-detail-node-sub">{u.sub}</text>
    </g>
   })}
   <text x="38" y="501" className="cm-footer-caption">WHATIS. / SELECTED TOPIC SCHEMATIC</text><text x="873" y="501" textAnchor="end" className="cm-footer-caption">0{active+1} / 04</text>
  </svg>
 </div>
}
