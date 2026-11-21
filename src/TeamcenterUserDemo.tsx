import {useEffect, useMemo, useState} from 'react'
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Box, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleHelp, ClipboardCheck, ExternalLink, FileCheck2, FileText, Filter,
  Folder, FolderOpen, GitBranch, History, Home, Layers3, ListTree, Maximize2, Menu, Minus,
  Package, Plus, RotateCcw, RotateCw, Save, Search, Settings2, ShieldCheck, Sparkles, Workflow, X
} from 'lucide-react'
import {
  createDemoData, glossary, sources, tours, type BomRow,
  type DemoData, type DemoRecord, type DemoStatus, type Section
} from './teamcenter-demo-data'
import './teamcenter-user-demo.css'

const nav = [
  {id:'home',title:'홈',label:'대시보드',icon:Home},
  {id:'search',title:'검색',label:'통합 검색',icon:Search},
  {id:'explorer',title:'탐색기',label:'폴더와 아이템',icon:FolderOpen},
  {id:'structure',title:'제품 구조',label:'BOM 편집',icon:ListTree},
  {id:'documents',title:'문서 관리',label:'파일과 데이터셋',icon:FileText},
  {id:'changes',title:'변경 관리',label:'영향 분석',icon:GitBranch},
  {id:'inbox',title:'받은 작업',label:'승인과 검토',icon:ClipboardCheck},
  {id:'viewer',title:'3D 보기',label:'시각화 체험',icon:Box},
  {id:'guide',title:'사용자 가이드',label:'용어와 출처',icon:BookOpen}
] as const
const STATUS_COLOR:Record<DemoStatus,string>={'작업 중':'draft','검토 중':'review','승인됨':'approved'}
const nextRev=(rev:string)=>rev.length===1&&rev>='A'&&rev<'Z'?String.fromCharCode(rev.charCodeAt(0)+1):rev+'-1'
const uid=(prefix:string,count:number)=>prefix+String(count).padStart(3,'0')
const demoDate = ()=>'2026-11-21'
const savedKey = 'whatis:teamcenter-demo-v2'
const getInitial=():DemoData=>{
  try {
    const data=JSON.parse(localStorage.getItem(savedKey)||'null')
    if(data&&Array.isArray(data.records)&&Array.isArray(data.bom)&&Array.isArray(data.tasks)&&Array.isArray(data.changes))return data as DemoData
  }catch{ /* create a clean learning sandbox */ }
  return createDemoData()
}
type NewItemType='Item'|'Document'
function IconBtn({title,onClick,children,disabled}:{title:string;onClick:()=>void;children:React.ReactNode;disabled?:boolean}){
  return <button className="tcg-icon-button" title={title} aria-label={title} onClick={onClick} disabled={disabled}>{children}</button>
}
function Tag({status}:{status:string}){
  const cn=STATUS_COLOR[status as DemoStatus]||(status==='대기'?'review':status==='승인'||status==='완료'?'approved':status==='반려'?'rejected':'draft')
  return <span className={'tcg-tag '+cn}><span className="tcg-tag-dot"/>{status}</span>
}
function TileIcon({kind}:{kind:string}){return <span className={'tcg-type-icon '+(kind==='Document'?'document':'item')}>{kind==='Document'?<FileText size={18}/>:<Package size={18}/>}</span>}

export default function TeamcenterUserDemo({onBack}:{onBack:()=>void}){
  const [data,setData]=useState<DemoData>(getInitial)
  const [section,setSection]=useState<Section>('home')
  const [query,setQuery]=useState('')
  const [kindFilter,setKindFilter]=useState<'all'|'Item'|'Document'>('all')
  const [statusFilter,setStatusFilter]=useState<string>('all')
  const [selectedId,setSelectedId]=useState('DEMO-1100')
  const [selectedDocId,setSelectedDocId]=useState('DEMO-D202')
  const [selectedTaskId,setSelectedTaskId]=useState('TASK-001')
  const [selectedChangeId,setSelectedChangeId]=useState('CN-2026-014')
  const [editor,setEditor]=useState(false)
  const [editName,setEditName]=useState('')
  const [editDescription,setEditDescription]=useState('')
  const [editOwner,setEditOwner]=useState('')
  const [toast,setToast]=useState('')
  const [tourId,setTourId]=useState<string|null>(null)
  const [tourStep,setTourStep]=useState(0)
  const [tourDone,setTourDone]=useState(false)
  const [openRows,setOpenRows]=useState<string[]>(['occ-0'])
  const [selectedOccurrence,setSelectedOccurrence]=useState('occ-1')
  const [showCompare,setShowCompare]=useState(false)
  const [whereUsed,setWhereUsed]=useState(false)
  const [selectedFolder,setSelectedFolder]=useState('제품 개발')
  const [showCreate,setShowCreate]=useState(false)
  const [createKind,setCreateKind]=useState<NewItemType>('Item')
  const [newName,setNewName]=useState('')
  const [newDescription,setNewDescription]=useState('')
  const [fileName,setFileName]=useState('')
  const [comment,setComment]=useState('')
  const [affectedId,setAffectedId]=useState('DEMO-1300')
  const [explode,setExplode]=useState(false)
  const [rotate,setRotate]=useState(0)
  const [viewerPart,setViewerPart]=useState('DEMO-1100')
  const [mobileNav,setMobileNav]=useState(false)
  const [guideQuery,setGuideQuery]=useState('')
  const [newBomId,setNewBomId]=useState('DEMO-1700')
  const [showAddBom,setShowAddBom]=useState(false)

  useEffect(()=>{try{localStorage.setItem(savedKey,JSON.stringify(data))}catch{ /* storage disabled */ }},[data])
  useEffect(()=>{document.title='Teamcenter 사용자 가이드 & 체험 데모 | whatis.'},[])
  const records=data.records
  const selected=records.find(r=>r.id===selectedId)
  const selectedDoc=records.find(r=>r.id===selectedDocId)
  const selectedTask=data.tasks.find(t=>t.id===selectedTaskId)
  const selectedChange=data.changes.find(c=>c.id===selectedChangeId)
  const activeTour=tours.find(t=>t.id===tourId)
  const activeStep=activeTour?.steps[tourStep]
  const byId=(id:string)=>records.find(r=>r.id===id)
  const itemOptions=records.filter(r=>r.kind==='Item')
  const pending=data.tasks.filter(t=>t.status==='대기').length
  const filtered=useMemo(()=>records.filter(r=>{
    const q=query.trim().toLocaleLowerCase()
    return (!q||[r.name,r.id,r.kind,r.description,r.owner].join(' ').toLocaleLowerCase().includes(q))&&(kindFilter==='all'||r.kind===kindFilter)&&(statusFilter==='all'||r.status===statusFilter)
  }),[records,query,kindFilter,statusFilter])
  const filteredDocs=records.filter(r=>r.kind==='Document')
  const folders=['제품 개발','전장 설계','기구 설계','제품 문서']
  const eventList:Record<string,string[]> = {
    find:['search','select-record','save-record','new-revision'],
    bom:['expand','select-row','quantity','where-used'],
    document:['select-document','attach-file','submit-review','open-inbox'],
    approval:['select-task','comment-task','decide-task','open-home'],
    change:['select-change','add-affected','review-change','show-change']
  }
  const advance=(event:string)=>{
    if(!tourId||tourDone)return
    if(eventList[tourId]?.[tourStep]!==event)return
    if(activeTour&&tourStep===activeTour.steps.length-1){setTourDone(true);setToast('실습을 완료했습니다! 다른 시나리오에도 도전해 보세요.')}
    else setTourStep(s=>s+1)
  }
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(s=>s===message?'':s),4500)}
  const go=(s:Section)=>{
    setSection(s);setMobileNav(false)
    if(s==='inbox')advance('open-inbox')
    if(s==='home')advance('open-home')
    if(s==='changes'&&selectedChange?.status==='검토 중')advance('show-change')
  }
  const startTour=(id:string)=>{
    const tour=tours.find(t=>t.id===id)
    if(!tour)return
    setTourId(id);setTourStep(0);setTourDone(false);setSection(tour.steps[0].section)
    setSelectedId('DEMO-1100');setSelectedDocId('DEMO-D202');setSelectedTaskId('TASK-001')
    setToast('실습 시작: 화면 속 조작을 따라 해보세요.')
    window.requestAnimationFrame(()=>document.querySelector('.tcg-frame')?.scrollIntoView({behavior:'smooth',block:'start'}))
  }
  const selectRecord=(id:string, from:'search'|'explorer'|'structure'='search')=>{
    setSelectedId(id);setEditor(false);setWhereUsed(false)
    if(from==='search')advance('select-record')
    if(from==='structure')advance('select-row')
  }
  useEffect(()=>{
    if(!selected)return
    setEditName(selected.name);setEditDescription(selected.description);setEditOwner(selected.owner)
  },[selectedId,selected?.name,selected?.description,selected?.owner])
  const saveRecord=()=>{
    if(!selected||!editName.trim())return
    setData(old=>({...old,records:old.records.map(r=>r.id===selected.id?{...r,name:editName.trim(),description:editDescription.trim(),owner:editOwner.trim()||r.owner,modified:demoDate()}:r),history:['속성 수정: '+selected.id,...old.history]}))
    setEditor(false);notify('속성이 저장되었습니다 (이 브라우저의 데모 데이터).');advance('save-record')
  }
  const reviseRecord=(recordId:string)=>{
    const record=byId(recordId);if(!record)return
    const next=nextRev(record.revision)
    setData(old=>({...old,records:old.records.map(r=>r.id===recordId?{...r,revision:next,status:'작업 중',modified:demoDate()}:r),history:['새 리비전 생성: '+recordId+' / '+next,...old.history]}))
    notify('리비전 '+record.revision+' → '+next+' (시뮬레이션)');advance('new-revision')
  }
  const addRecord=()=>{
    if(!newName.trim())return
    const id='DEMO-'+(createKind==='Document'?'D':'')+(200+data.records.length)
    const r:DemoRecord={id,name:newName.trim(),kind:createKind,revision:'A',status:'작업 중',owner:'데모 사용자',description:newDescription||'학습용으로 추가한 항목',folder:selectedFolder,modified:demoDate()}
    setData(old=>({...old,records:[...old.records,r],history:['새 객체 생성: '+r.id,...old.history]}))
    setSelectedId(id);if(createKind==='Document')setSelectedDocId(id)
    setNewName('');setNewDescription('');setShowCreate(false)
    notify('새 '+(createKind==='Document'?'문서':'아이템')+'을 생성했습니다.')
  }
  const submitReview=(id:string)=>{
    const r=byId(id);if(!r)return
    setData(old=>({...old,
      tasks:[{id:uid('TASK-',old.tasks.length+1),title:r.name+' 검토 요청',target:id,assignee:'나 (검토자)',status:'대기',comment:'',priority:'보통'},...old.tasks],
      records:old.records.map(v=>v.id===id?{...v,status:'검토 중'}:v),
      history:['검토 워크플로 시작: '+id,...old.history]
    }))
    notify('받은 작업에 검토 요청이 생성되었습니다.');advance('submit-review')
  }
  const addFile=()=>{
    if(!selectedDoc||!fileName.trim())return
    const name=fileName.trim().replaceAll(/[\\/]/g,'_')
    setData(old=>({...old,files:{...old.files,[selectedDoc.id]:[...(old.files[selectedDoc.id]||[]),name]},history:['파일 데이터셋 연결: '+selectedDoc.id+' / '+name,...old.history]}))
    setFileName('');notify('파일명 연결이 완료되었습니다. 실제 파일은 업로드하지 않습니다.');advance('attach-file')
  }
  const decide=(status:'승인'|'반려')=>{
    if(!selectedTask||selectedTask.status!=='대기')return
    setData(old=>({...old,tasks:old.tasks.map(t=>t.id===selectedTask.id?{...t,status,comment:comment||'검토 완료'}:t),records:old.records.map(r=>r.id===selectedTask.target?{...r,status:status==='승인'?'승인됨':'작업 중'}:r),history:['작업 '+status+': '+selectedTask.id,...old.history]}))
    setComment('');notify('작업을 '+status+' 처리했습니다.');advance('decide-task')
  }
  const changeQty=(key:string,delta:number)=>{
    setData(old=>({...old,bom:old.bom.map(v=>v.key===key?{...v,qty:Math.max(1,v.qty+delta)}:v),history:['BOM 수량 변경: '+key,...old.history]}))
    advance('quantity');notify('BOM 수량을 변경했습니다.')
  }
  const addBom=()=>{
    const id=data.bom.length+1
    setData(old=>({...old,bom:[...old.bom,{key:'occ-'+id,parent:'occ-0',recordId:newBomId,qty:1}],history:['BOM 구성품 연결: '+newBomId,...old.history]}))
    setShowAddBom(false);notify('선택한 부품을 최상위 어셈블리에 추가했습니다.')
  }
  const addAffected=()=>{
    if(!selectedChange)return
    if(selectedChange.affected.includes(affectedId)){notify('이미 변경 영향 항목에 있습니다.');return}
    setData(old=>({...old,changes:old.changes.map(c=>c.id===selectedChange.id?{...c,affected:[...c.affected,affectedId]}:c),history:['변경 영향 항목 추가: '+affectedId,...old.history]}))
    notify('변경 영향 항목을 연결했습니다.');advance('add-affected')
  }
  const reviewChange=()=>{
    if(!selectedChange)return
    setData(old=>({...old,changes:old.changes.map(c=>c.id===selectedChange.id?{...c,status:c.status==='초안'?'검토 중':'완료'}:c),history:['변경 상태 갱신: '+selectedChange.id,...old.history]}))
    notify('변경 관리 상태가 갱신되었습니다.');advance('review-change')
  }
  const reset=()=>{
    if(!window.confirm('학습용으로 변경한 부품, 문서, 작업, BOM을 처음 상태로 되돌릴까요?'))return
    setData(createDemoData());setSection('home');setTourId(null);setTourDone(false);setTourStep(0)
    setSelectedId('DEMO-1100');setSelectedTaskId('TASK-001');setSelectedDocId('DEMO-D202')
    setOpenRows(['occ-0']);setEditor(false);notify('데모 데이터가 초기화되었습니다.')
  }
  const renderInspector=(record:DemoRecord|undefined)=>{
    if(!record)return <p className="tcg-muted">항목을 선택하면 여기에 상세 정보가 표시됩니다.</p>
    return <div className="tcg-inspector-content">
      <div className="tcg-object-head"><TileIcon kind={record.kind}/><div><span>{record.kind==='Document'?'문서 리비전':'아이템 리비전'}</span><h3>{record.name}</h3><code>{record.id} / {record.revision}</code></div></div>
      <Tag status={record.status}/>
      <div className="tcg-property-table">
        <div><span>객체 ID</span><strong>{record.id}</strong></div>
        <div><span>리비전</span><strong>{record.revision}</strong></div>
        <div><span>담당자</span><strong>{record.owner}</strong></div>
        <div><span>소속 폴더</span><strong>{record.folder}</strong></div>
        <div><span>수정일</span><strong>{record.modified}</strong></div>
      </div>
      {editor?<div className="tcg-form">
        <label>이름<input value={editName} onChange={e=>setEditName(e.target.value)} maxLength={110}/></label>
        <label>담당자<input value={editOwner} onChange={e=>setEditOwner(e.target.value)} maxLength={35}/></label>
        <label>설명<textarea value={editDescription} onChange={e=>setEditDescription(e.target.value)} rows={4} maxLength={500}/></label>
        <div className="tcg-actions"><button className="tcg-primary" onClick={saveRecord}><Save size={15}/> 저장</button><button className="tcg-quiet" onClick={()=>setEditor(false)}>취소</button></div>
      </div>:<div className="tcg-description"><span>설명</span><p>{record.description}</p></div>}
      {!editor&&<div className="tcg-actions tcg-wrap">
        <button className="tcg-secondary" onClick={()=>{setSelectedId(record.id);setEditor(true)}}><Settings2 size={15}/> 속성 편집</button>
        <button className="tcg-secondary" onClick={()=>reviseRecord(record.id)}><GitBranch size={15}/> 새 리비전</button>
        <button className="tcg-secondary" onClick={()=>submitReview(record.id)}><Workflow size={15}/> 검토 요청</button>
      </div>}
      <div className="tcg-explain"><CircleHelp size={16}/><span><strong>Item / Revision</strong>은 관리 대상과 그 개정판을 구분합니다. 이 데모는 개정판을 단순히 문자로 나타내며 실제 사이트별 규칙과 다를 수 있습니다.</span></div>
    </div>
  }
  const renderHome=()=> <div className="tcg-home">
    <div className="tcg-page-title"><div><span className="tcg-overline">MY WORKSPACE / OVERVIEW</span><h2>안녕하세요, 데모 사용자님</h2><p>제품 개발 데이터를 직접 탐색하면서 Teamcenter의 기본 업무 흐름을 배워보세요.</p></div><Tag status="학습용 환경"/></div>
    <div className="tcg-stats">
      {[{n:records.filter(r=>r.kind==='Item').length,label:'관리 아이템',icon:Package},{n:filteredDocs.length,label:'관리 문서',icon:FileText},{n:pending,label:'승인 대기',icon:ClipboardCheck},{n:data.changes.filter(c=>c.status!=='완료').length,label:'진행 중 변경',icon:GitBranch}].map(o=><div className="tcg-stat" key={o.label}><o.icon size={20}/><strong>{o.n}<small>건</small></strong><span>{o.label}</span></div>)}
    </div>
    <div className="tcg-dashboard-grid">
      <section className="tcg-panel tcg-welcome-panel"><div className="tcg-panel-head"><h3><Sparkles size={18}/> 추천 체험 과정</h3><span>GET STARTED</span></div>
        <p>처음 사용한다면 검색 → 제품 구조 → 문서 검토 순서로 시작하세요. 모든 데이터는 가상 예시입니다.</p>
        <div className="tcg-tour-grid">{tours.map((t,i)=><button className="tcg-tour-tile" key={t.id} onClick={()=>startTour(t.id)}><span>{String(i+1).padStart(2,'0')}</span><strong>{t.title.slice(5)}</strong><small>{t.subtitle}</small><ArrowRight size={16}/></button>)}</div>
      </section>
      <section className="tcg-panel tcg-inbox-card"><div className="tcg-panel-head"><h3>내 작업함</h3><button onClick={()=>go('inbox')}>전체 보기 <ArrowRight size={14}/></button></div>
        {data.tasks.filter(t=>t.status==='대기').slice(0,4).map(t=><button className="tcg-card-row" key={t.id} onClick={()=>{setSelectedTaskId(t.id);go('inbox')}}><ClipboardCheck size={19}/><span><strong>{t.title}</strong><small>{t.target} · {t.priority} 우선순위</small></span><ChevronRight size={16}/></button>)}
        {pending===0&&<p className="tcg-empty-small">현재 대기 중인 승인 작업이 없습니다.</p>}
      </section>
      <section className="tcg-panel tcg-shortcuts"><div className="tcg-panel-head"><h3>빠른 실행</h3><span>COMMON ACTIONS</span></div>
        <div>{[{id:'search',name:'아이템 검색',icon:Search},{id:'structure',name:'BOM 열기',icon:ListTree},{id:'documents',name:'문서 검토',icon:FileText},{id:'viewer',name:'3D 보기',icon:Box}].map(o=><button key={o.id} onClick={()=>go(o.id as Section)}><o.icon size={20}/>{o.name}<ArrowRight size={15}/></button>)}</div>
      </section>
      <section className="tcg-panel tcg-activity"><div className="tcg-panel-head"><h3>최근 활동</h3><History size={17}/></div>{data.history.slice(0,5).map((v,i)=><div key={i}><span className="tcg-pulse"/><span>{v}</span></div>)}</section>
    </div>
  </div>
  const renderSearch=()=> <><PageHeading eyebrow="FIND DATA" title="통합 검색" desc="아이템과 문서의 이름, ID, 담당자를 검색하고 결과를 선택해 상세 속성을 확인하세요."/>
    <div className="tcg-search-line"><Search size={20}/><input aria-label="제품 데이터 검색" autoFocus placeholder="이름이나 ID를 입력하세요 (예: 배터리, DEMO-1100)" value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value.trim())advance('search')}}/><button onClick={()=>setQuery('')} aria-label="검색어 지우기"><X size={16}/></button></div>
    <div className="tcg-filters"><Filter size={15}/><span>종류</span><select aria-label="종류 필터" value={kindFilter} onChange={e=>setKindFilter(e.target.value as typeof kindFilter)}><option value="all">모든 종류</option><option value="Item">Item</option><option value="Document">Document</option></select><span>상태</span><select aria-label="상태 필터" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">모든 상태</option>{['작업 중','검토 중','승인됨'].map(v=><option key={v}>{v}</option>)}</select><small>{filtered.length}개 결과</small></div>
    <div className="tcg-content-columns"><div className="tcg-panel tcg-table-panel"><RecordTable rows={filtered} selectedId={selectedId} onSelect={id=>selectRecord(id,'search')}/></div><aside className="tcg-panel tcg-side-panel"><PanelHead title="속성" subtitle="선택한 데이터 객체"/>{renderInspector(selected)}</aside></div>
  </>
  const renderExplorer=()=> <><PageHeading eyebrow="EXPLORER" title="폴더와 아이템 탐색기" desc="폴더를 열어 관련 데이터를 확인하고 새 아이템 또는 문서를 생성하는 연습을 해보세요."/>
    <div className="tcg-toolbar"><button className="tcg-primary" onClick={()=>setShowCreate(x=>!x)}><Plus size={16}/> 새 객체 생성</button><span className="tcg-spacer"/><span className="tcg-muted">예제 프로젝트 / 전동 스쿠터 개발</span></div>
    {showCreate&&<section className="tcg-panel tcg-create-panel"><div className="tcg-panel-head"><h3>새 객체 생성</h3><IconBtn title="닫기" onClick={()=>setShowCreate(false)}><X size={17}/></IconBtn></div><div className="tcg-form-grid"><label>객체 종류<select value={createKind} onChange={e=>setCreateKind(e.target.value as NewItemType)}><option value="Item">Item (부품·제품)</option><option value="Document">Document (문서)</option></select></label><label>이름<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="이름 입력"/></label><label className="tcg-span-all">설명<input value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="선택 입력"/></label></div><button className="tcg-primary" onClick={addRecord} disabled={!newName.trim()}><Plus size={15}/> 생성하기</button></section>}
    <div className="tcg-explorer-grid"><div className="tcg-panel tcg-folders"><PanelHead title="프로젝트 폴더" subtitle="예제 구조"/>{folders.map(f=><button key={f} className={selectedFolder===f?'active':''} onClick={()=>setSelectedFolder(f)}><Folder size={18}/>{f}<span>{records.filter(r=>r.folder===f).length}</span></button>)}</div><div className="tcg-panel"><PanelHead title={selectedFolder} subtitle="Contents"/><RecordTable rows={records.filter(r=>r.folder===selectedFolder)} selectedId={selectedId} onSelect={id=>selectRecord(id,'explorer')}/></div><aside className="tcg-panel tcg-side-panel"><PanelHead title="속성" subtitle="선택한 아이템"/>{renderInspector(selected)}</aside></div>
  </>
  const visibleBom=():Array<BomRow & {level:number}>=>
    {const result:Array<BomRow & {level:number}>=[];const walk=(parent:string|null,level:number)=>{data.bom.filter(r=>r.parent===parent).forEach(r=>{result.push({...r,level});if(openRows.includes(r.key))walk(r.key,level+1)})};walk(null,0);return result}
  const renderStructure=()=> <><PageHeading eyebrow="STRUCTURE MANAGER" title="제품 구조 · BOM 관리" desc="상위 어셈블리와 하위 부품의 관계를 확인하고, 수량을 조정하며 사용 위치를 탐색해 보세요."/>
    <div className="tcg-toolbar"><span className="tcg-current-item"><Layers3 size={18}/><strong>전동 스쿠터</strong><code>DEMO-1000 / B</code></span><span className="tcg-spacer"/><button className="tcg-secondary" onClick={()=>setShowCompare(v=>!v)}><GitBranch size={15}/> {showCompare?'비교 닫기':'변경 비교'}</button><button className="tcg-primary" onClick={()=>setShowAddBom(x=>!x)}><Plus size={16}/> 구성품 추가</button></div>
    {showAddBom&&<section className="tcg-panel tcg-inline"><label>추가할 부품 <select value={newBomId} onChange={e=>setNewBomId(e.target.value)}>{itemOptions.filter(r=>r.id!=='DEMO-1000').map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label><button className="tcg-primary" onClick={addBom}><Plus size={15}/> 상위 구조에 연결</button><button className="tcg-quiet" onClick={()=>setShowAddBom(false)}>취소</button></section>}
    {showCompare&&<div className="tcg-compare"><strong><GitBranch size={17}/> 변경 비교 · 예제 초기 상태 대비</strong><p>이 브라우저에서 수량을 바꾼 항목만 표시합니다. 실제 Teamcenter의 리비전 비교 기능을 그대로 구현한 것은 아닙니다.</p>{data.bom.filter(row=>{const original=createDemoData().bom.find(x=>x.key===row.key);return !original||original.qty!==row.qty}).map(row=><div key={row.key}>{byId(row.recordId)?.name} <strong>{createDemoData().bom.find(x=>x.key===row.key)?.qty??'신규'} → {row.qty}</strong></div>)}{data.bom.every(row=>createDemoData().bom.find(x=>x.key===row.key)?.qty===row.qty)&&<small>아직 수량 변경이 없습니다.</small>}</div>}
    <div className="tcg-bom-grid"><section className="tcg-panel tcg-bom"><div className="tcg-bom-head"><span>구조 · Name / ID</span><span>리비전</span><span>수량</span><span>상태</span></div>
      {visibleBom().map(o=>{const r=byId(o.recordId);if(!r)return null;const children=data.bom.some(x=>x.parent===o.key);const selectedRow=selectedOccurrence===o.key;return <div key={o.key} className={'tcg-bom-row '+(selectedRow?'selected':'')} onClick={()=>{setSelectedOccurrence(o.key);selectRecord(r.id,'structure')}}>
        <div className="tcg-bom-object" style={{paddingLeft:8+o.level*24}}>{children?<button aria-label={openRows.includes(o.key)?'접기':'펼치기'} aria-expanded={openRows.includes(o.key)} onClick={e=>{e.stopPropagation();setOpenRows(v=>v.includes(o.key)?v.filter(x=>x!==o.key):[...v,o.key]);advance('expand')}}>{openRows.includes(o.key)?<ChevronDown size={15}/>:<ChevronRight size={15}/>}</button>:<span className="tcg-bom-leaf"/>}<Package size={16}/><span><strong>{r.name}</strong><small>{r.id}</small></span></div>
        <span>{r.revision}</span><span className="tcg-qty"><button aria-label={r.name+' 수량 감소'} onClick={e=>{e.stopPropagation();changeQty(o.key,-1)}} disabled={o.parent===null||o.qty===1}><Minus size={13}/></button><strong>{o.qty}</strong><button aria-label={r.name+' 수량 증가'} onClick={e=>{e.stopPropagation();changeQty(o.key,1)}} disabled={o.parent===null}><Plus size={13}/></button></span><Tag status={r.status}/>
      </div>})}
      <p className="tcg-bom-tip"><CircleHelp size={15}/> 화살표로 구조를 펼치고 행을 선택하세요. 하위 조립품 수량은 해당 조립품 내에서 사용되는 수량입니다.</p>
    </section><aside className="tcg-panel tcg-side-panel"><PanelHead title="구조 속성" subtitle="선택된 Occurrence"/>{renderInspector(byId(data.bom.find(r=>r.key===selectedOccurrence)?.recordId||''))}
      <div className="tcg-divider"/><button className="tcg-secondary tcg-full" onClick={()=>{setWhereUsed(v=>!v);advance('where-used')}}><GitBranch size={16}/> 어디에 사용되나? (Where Used)</button>
      {whereUsed&&<div className="tcg-where"><strong>사용 중인 상위 구조</strong>{data.bom.filter(o=>o.recordId===(data.bom.find(x=>x.key===selectedOccurrence)?.recordId)).map(o=><div key={o.key}>{o.parent?byId(data.bom.find(x=>x.key===o.parent)?.recordId||'')?.name:'최상위 제품'} <small>수량 {o.qty}</small></div>)}</div>}
    </aside></div>
  </>
  const renderDocuments=()=> <><PageHeading eyebrow="DOCUMENT MANAGEMENT" title="문서와 첨부 데이터셋" desc="문서 리비전을 열고 연결된 파일 목록을 확인하거나 가상 파일을 추가하고 검토를 요청해 보세요."/>
    <div className="tcg-content-columns"><div className="tcg-panel tcg-doc-list"><PanelHead title="제품 문서" subtitle={filteredDocs.length+'개의 관리 문서'}/>
      {filteredDocs.map(r=><button key={r.id} className={'tcg-doc-row '+(selectedDocId===r.id?'selected':'')} onClick={()=>{setSelectedDocId(r.id);setSelectedId(r.id);setEditor(false);advance('select-document')}}><TileIcon kind="Document"/><span><strong>{r.name}</strong><small>{r.id} · Revision {r.revision}</small></span><Tag status={r.status}/><ChevronRight size={17}/></button>)}
    </div><aside className="tcg-panel tcg-side-panel tcg-doc-detail"><PanelHead title="문서 상세" subtitle="Document Revision"/>{selectedDoc&&<><div className="tcg-object-head"><TileIcon kind="Document"/><div><h3>{selectedDoc.name}</h3><code>{selectedDoc.id} · Rev {selectedDoc.revision}</code></div></div><Tag status={selectedDoc.status}/><p>{selectedDoc.description}</p><div className="tcg-divider"/><strong className="tcg-files-head"><FileCheck2 size={16}/> 첨부 데이터셋 · 파일명</strong>{(data.files[selectedDoc.id]||[]).map((file,i)=><div className="tcg-file" key={i}><FileText size={16}/><span>{file}</span><button title="파일명 제거" aria-label={file+' 연결 해제'} onClick={()=>{setData(old=>({...old,files:{...old.files,[selectedDoc.id]:(old.files[selectedDoc.id]||[]).filter((_,n)=>n!==i)}}));notify('데모 파일명 연결을 제거했습니다.')}}><X size={15}/></button></div>)}
      <div className="tcg-file-form"><label>새 데이터셋 파일명 (실제 업로드 없음)</label><div><input value={fileName} onChange={e=>setFileName(e.target.value)} placeholder="예: drawing_rev_b.pdf" onKeyDown={e=>{if(e.key==='Enter')addFile()}}/><button className="tcg-secondary" onClick={addFile} disabled={!fileName.trim()}><Plus size={15}/> 연결</button></div></div>
      <button className="tcg-primary tcg-full" onClick={()=>submitReview(selectedDoc.id)}><Workflow size={16}/> 검토 워크플로 시작</button>
      <div className="tcg-explain"><CircleHelp size={15}/><span><strong>Dataset</strong>은 파일 콘텐츠를 문서 리비전에 연결하는 데이터 객체입니다. 이 연습에서는 업로드 대신 파일명만 저장합니다.</span></div>
    </>}</aside></div>
  </>
  const renderInbox=()=> <><PageHeading eyebrow="MY TASKS" title="받은 작업 · 승인함" desc="할당된 검토 작업을 선택해 의견을 남기고 승인 또는 반려로 업무 상태를 전환하세요."/>
    <div className="tcg-content-columns"><div className="tcg-panel tcg-task-list"><PanelHead title="내가 처리할 업무" subtitle={pending+'개 대기'}/>
      {data.tasks.map(t=><button key={t.id} className={'tcg-task-row '+(selectedTaskId===t.id?'selected':'')} onClick={()=>{setSelectedTaskId(t.id);setComment(t.comment||'');advance('select-task')}}><span className="tcg-task-flag"><ClipboardCheck size={18}/></span><span><strong>{t.title}</strong><small>{t.id} · {t.target} · 우선순위 {t.priority}</small></span><Tag status={t.status}/></button>)}
    </div><aside className="tcg-panel tcg-side-panel"><PanelHead title="업무 처리" subtitle="Task details"/>{selectedTask&&<><h3 className="tcg-detail-title">{selectedTask.title}</h3><Tag status={selectedTask.status}/><div className="tcg-property-table"><div><span>Task ID</span><strong>{selectedTask.id}</strong></div><div><span>대상 객체</span><strong>{selectedTask.target}</strong></div><div><span>할당 대상</span><strong>{selectedTask.assignee}</strong></div><div><span>우선순위</span><strong>{selectedTask.priority}</strong></div></div>
      <label className="tcg-form">검토 의견<textarea value={comment} onChange={e=>{setComment(e.target.value);if(e.target.value.trim())advance('comment-task')}} rows={4} placeholder="검토 의견을 작성해 보세요" disabled={selectedTask.status!=='대기'}/></label>
      {selectedTask.status==='대기'?<div className="tcg-actions"><button className="tcg-primary" onClick={()=>decide('승인')}><Check size={16}/> 승인</button><button className="tcg-danger" onClick={()=>decide('반려')}><X size={16}/> 반려</button></div>:<p className="tcg-reviewed"><CheckCircle2 size={17}/> {selectedTask.status} 처리됨. {selectedTask.comment&&'의견: '+selectedTask.comment}</p>}
      <div className="tcg-explain"><CircleHelp size={15}/><span>실제 Teamcenter에서는 워크플로 템플릿, 할당된 참가자와 사이트의 권한 정책에 따라 작업 처리 방법이 달라집니다.</span></div>
    </>}</aside></div>
  </>
  const renderChanges=()=> <><PageHeading eyebrow="CHANGE MANAGEMENT" title="변경 관리 · Change Notice" desc="변경 사유와 영향 부품을 한곳에서 관리하고 검토 상태가 어떻게 바뀌는지 확인하세요."/>
    <div className="tcg-content-columns"><div className="tcg-panel"><PanelHead title="변경 통지" subtitle="Change notices"/>{data.changes.map(c=><button key={c.id} className={'tcg-change-row '+(selectedChangeId===c.id?'selected':'')} onClick={()=>{setSelectedChangeId(c.id);advance('select-change')}}><GitBranch size={20}/><span><strong>{c.title}</strong><small>{c.id} · {c.owner}</small></span><Tag status={c.status}/></button>)}</div>
    <aside className="tcg-panel tcg-side-panel"><PanelHead title="변경 상세" subtitle="Change Summary"/>{selectedChange&&<><h3 className="tcg-detail-title">{selectedChange.title}</h3><Tag status={selectedChange.status}/><p className="tcg-change-reason">{selectedChange.reason}</p><strong className="tcg-files-head">영향받는 항목 · Affected Items</strong>
      {selectedChange.affected.map(id=><div key={id} className="tcg-affected"><Package size={16}/><span><strong>{byId(id)?.name||id}</strong><small>{id}</small></span><button disabled={selectedChange.status==='완료'} title="연결 해제" onClick={()=>{setData(old=>({...old,changes:old.changes.map(c=>c.id===selectedChange.id?{...c,affected:c.affected.filter(k=>k!==id)}:c)}))}}><X size={15}/></button></div>)}
      {selectedChange.status!=='완료'&&<><div className="tcg-file-form"><label>영향 항목 추가</label><div><select value={affectedId} onChange={e=>setAffectedId(e.target.value)}>{itemOptions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><button className="tcg-secondary" onClick={addAffected}><Plus size={15}/> 추가</button></div></div><button className="tcg-primary tcg-full" onClick={reviewChange}><Workflow size={16}/>{selectedChange.status==='초안'?'검토 요청':'변경 완료 처리'}</button></>}
      <div className="tcg-explain"><CircleHelp size={15}/><span>변경 통지는 변경 대상과 이유, 검토·승인 결과를 연결합니다. 실제 상태 전이는 구성된 워크플로 및 권한에 의해 제어됩니다.</span></div>
    </>}</aside></div>
  </>
  const renderViewer=()=> <><PageHeading eyebrow="VISUALIZATION" title="3D 제품 보기 · 개념 시각화" desc="임의로 제작한 도해에서 부품을 선택하고 분해도와 회전을 조작해 보세요. 실제 JT/CAD 파일을 읽는 뷰어는 아닙니다."/>
    <div className="tcg-viewer-grid"><section className="tcg-panel tcg-cad-stage"><div className="tcg-cad-head"><span><Maximize2 size={16}/> CONCEPT VIEWER · NOT CAD</span><span>예제: 전동 스쿠터 구성품</span></div>
      <svg className="tcg-assembly" viewBox="0 0 700 410" role="img" aria-label="클릭할 수 있는 전동 스쿠터 구성요소의 독자적인 선형 도해">
        <defs><linearGradient id="tcg-metal" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#b5ced9"/><stop offset="1" stopColor="#5389a3"/></linearGradient><linearGradient id="tcg-dark" x1="0" x2="0" y1="1"><stop offset="0" stopColor="#294253"/><stop offset="1" stopColor="#537487"/></linearGradient></defs>
        <g className="tcg-assembly-body" style={{transform:'rotate('+rotate+'deg)'}} transform="translate(0 0)">
          <g onClick={()=>setViewerPart('DEMO-1500')} className={'tcg-svg-select '+(viewerPart==='DEMO-1500'?'active':'')}><circle cx="185" cy="305" r="62" fill="#263c48" stroke="#66879b" strokeWidth="13"/><circle cx="185" cy="305" r="32" fill="#f3f8fa" stroke="#7d9ead" strokeWidth="10"/><circle cx="525" cy="305" r="62" fill="#263c48" stroke="#66879b" strokeWidth="13"/><circle cx="525" cy="305" r="32" fill="#f3f8fa" stroke="#7d9ead" strokeWidth="10"/></g>
          <g onClick={()=>setViewerPart('DEMO-1400')} className={'tcg-svg-select '+(viewerPart==='DEMO-1400'?'active':'')} style={{transform:explode?'translate(0,-45px)':'none'}}><path d="M162 225 L480 225 Q508 225 502 247 L479 267 L199 267 Q168 267 162 246 Z" fill="url(#tcg-metal)" stroke="#386079" strokeWidth="6"/><path d="M196 239H462" stroke="#e5f4fb" strokeWidth="5"/><path d="M237 267L188 305M462 267L523 305" stroke="#537889" strokeWidth="11" strokeLinecap="round"/></g>
          <g onClick={()=>setViewerPart('DEMO-1100')} className={'tcg-svg-select '+(viewerPart==='DEMO-1100'?'active':'')} style={{transform:explode?'translate(0,-95px)':'none'}}><rect x="265" y="168" width="173" height="58" rx="13" fill="#176e89" stroke="#8dc8d3" strokeWidth="5"/><rect x="281" y="181" width="143" height="30" rx="4" fill="#1f4d66"/><path d="M312 196h30m-15-15v30" stroke="#a6e3e0" strokeWidth="6"/><text x="362" y="202" fontSize="13" textAnchor="middle" fill="#d3f7f8">BATTERY</text></g>
          <g onClick={()=>setViewerPart('DEMO-1200')} className={'tcg-svg-select '+(viewerPart==='DEMO-1200'?'active':'')} style={{transform:explode?'translate(-53,20px)':'none'}}><rect x="443" y="262" width="70" height="50" rx="14" fill="#8daab9" stroke="#315f72" strokeWidth="6"/><circle cx="479" cy="287" r="16" fill="#456679" stroke="#a7d0d8" strokeWidth="4"/></g>
          <g onClick={()=>setViewerPart('DEMO-1600')} className={'tcg-svg-select '+(viewerPart==='DEMO-1600'?'active':'')} style={{transform:explode?'translate(80,-25px)':'none'}}><path d="M486 228L544 75 L583 75" stroke="#426479" strokeWidth="15" fill="none" strokeLinecap="round"/><path d="M545 73L610 73" stroke="#7ab0bf" strokeWidth="17" strokeLinecap="round"/><path d="M553 76L570 224" stroke="#a0bccb" strokeWidth="5" strokeDasharray="12 8"/></g>
          <g onClick={()=>setViewerPart('DEMO-1300')} className={'tcg-svg-select '+(viewerPart==='DEMO-1300'?'active':'')} style={{transform:explode?'translate(-55,-100px)':'none'}}><rect x="188" y="166" width="65" height="54" rx="8" fill="url(#tcg-dark)" stroke="#8faeb8" strokeWidth="5"/><path d="M204 183h33M204 193h33M204 203h18" stroke="#7dbab7" strokeWidth="3"/></g>
        </g>
        <g fill="#47748b" fontSize="12" fontWeight="700"><text x="23" y="31">FRONT / SIDE</text><text x="616" y="382">DEMO 2606</text></g>
      </svg>
      <div className="tcg-viewer-control"><button className={explode?'tcg-primary':'tcg-secondary'} onClick={()=>setExplode(e=>!e)}><Layers3 size={16}/>{explode?'조립 상태로':'분해도 보기'}</button><label><RotateCw size={16}/> 회전 <input type="range" min="-8" max="8" step="1" value={rotate} onChange={e=>setRotate(Number(e.target.value))}/></label><button className="tcg-quiet" onClick={()=>{setRotate(0);setExplode(false)}}><RotateCcw size={14}/> 초기화</button></div>
    </section><aside className="tcg-panel tcg-side-panel"><PanelHead title="부품 선택" subtitle="클릭해 세부 정보 확인"/>{['DEMO-1100','DEMO-1200','DEMO-1300','DEMO-1400','DEMO-1500','DEMO-1600'].map(id=><button key={id} className={'tcg-viewer-part '+(viewerPart===id?'selected':'')} onClick={()=>setViewerPart(id)}><Box size={16}/><span>{byId(id)?.name}</span><ChevronRight size={15}/></button>)}<div className="tcg-divider"/><h3>{byId(viewerPart)?.name}</h3><Tag status={byId(viewerPart)?.status||'작업 중'}/><p className="tcg-description-text">{byId(viewerPart)?.description}</p><div className="tcg-explain"><CircleHelp size={15}/><span>이 도해는 UI 실습을 위해 직접 그린 벡터 그림입니다. 형상, 치수, 조립 관계는 실제 설계품이나 CAD 데이터가 아닙니다.</span></div></aside></div>
  </>
  const renderGuide=()=> <><PageHeading eyebrow="LEARN & REFERENCE" title="Teamcenter 사용자 가이드" desc="화면을 조작하기 전에 핵심 용어와 업무 순서를 알아보세요. 기초 개념부터 실제 기능을 연결했습니다."/>
    <div className="tcg-guide-intro"><BookOpen size={27}/><div><strong>초보자에게 권장하는 학습 순서</strong><p>① 검색과 속성 확인 → ② 제품 구조(BOM) → ③ 문서/첨부 → ④ 승인 워크플로 → ⑤ 변경 통지 → ⑥ 모델 시각화</p></div><button className="tcg-primary" onClick={()=>startTour('find')}>첫 실습 시작 <ArrowRight size={15}/></button></div>
    <div className="tcg-guide-title"><div><h3>핵심 용어 사전</h3><p>검색해 필요한 개념만 확인할 수 있습니다.</p></div><div className="tcg-guide-search"><Search size={17}/><input placeholder="용어 찾기" value={guideQuery} onChange={e=>setGuideQuery(e.target.value)}/></div></div>
    <div className="tcg-glossary-grid">{glossary.filter(g=>[g.name,g.meaning].join(' ').toLowerCase().includes(guideQuery.toLowerCase())).map(g=><div key={g.name}><strong>{g.name}</strong><p>{g.meaning}</p></div>)}</div>
    <div className="tcg-guide-title"><div><h3>참고한 원문 문서</h3><p>사용자가 제공한 Teamcenter 2606 자료의 기능·용어를 참고했습니다. 원문 접근에는 파일 소유자의 권한이 필요할 수 있습니다.</p></div></div>
    <div className="tcg-source-list">{sources.map(s=><a key={s.title} href={s.url} target="_blank" rel="noreferrer"><FileText size={19}/><span><strong>{s.title}</strong><small>{s.topic} · Siemens / 2606</small></span><ExternalLink size={16}/></a>)}</div>
    <div className="tcg-legal"><ShieldCheck size={19}/><span>학습용 모의 인터페이스로, 공식 Siemens 화면이나 Teamcenter 서버와 연결되지 않습니다. 원문 캡처·표·도해를 복제해 게시하지 않았으며 기능 흐름을 학습 목적에 맞게 독자적으로 단순화했습니다. 실제 동작과 권한은 고객 시스템 구성에 따라 달라집니다.</span></div>
  </>
  const renderContent=()=>{
    switch(section){
      case 'home':return renderHome()
      case 'search':return renderSearch()
      case 'explorer':return renderExplorer()
      case 'structure':return renderStructure()
      case 'documents':return renderDocuments()
      case 'inbox':return renderInbox()
      case 'changes':return renderChanges()
      case 'viewer':return renderViewer()
      case 'guide':return renderGuide()
    }
  }
  return <section className="tcg-page">
    <div className="tcg-breadcrumb"><button onClick={onBack}><ArrowLeft size={15}/> Siemens 아키텍처</button><ChevronRight size={13}/><span>Teamcenter 사용자 가이드</span><span className="tcg-breadcrumb-badge">NEW / INTERACTIVE</span></div>
    <header className="tcg-hero"><div><span className="tcg-kicker"><span/> INTERACTIVE PRODUCT TOUR · 2606</span><h1>Teamcenter,<br/><em>직접 써보면서 이해하기.</em></h1><p>메뉴 설명만 읽는 대신 부품 검색, BOM 수정, 문서 등록, 승인과 변경 관리까지 손으로 체험하는 사용자 가이드입니다.</p><div className="tcg-hero-actions"><button onClick={()=>startTour('find')}><Sparkles size={17}/> 첫 실습 시작 <ArrowRight size={16}/></button><button onClick={()=>{go('guide')}}><BookOpen size={17}/> 기능·용어 먼저 보기</button></div></div><div className="tcg-hero-illustration"><div className="tcg-hero-card"><span>PRODUCT LIFECYCLE</span><div className="tcg-hero-track"><span>Part</span><ArrowRight size={18}/><span>BOM</span><ArrowRight size={18}/><span>Review</span></div><strong>데이터 한 개가 승인까지 가는 여정</strong><div><i/><i/><i/></div></div><div className="tcg-hero-number">08 <small>WORKSPACES</small></div></div></header>
    <div className="tcg-demo-label"><div><Activity size={16}/><strong>LIVE INTERACTION</strong><span>실제 서버 연동 없는 학습용 시뮬레이션</span></div><button onClick={reset}><RotateCcw size={15}/> 데모 초기화</button></div>
    <div className="tcg-frame">
      <div className="tcg-appbar"><button className="tcg-mobile-menu" onClick={()=>setMobileNav(x=>!x)} aria-label="메뉴 열기"><Menu size={21}/></button><div className="tcg-mark"><span>TC</span><strong>Teamcenter</strong><small>LEARNING SANDBOX</small></div>
        <div className="tcg-global-search"><Search size={17}/><input value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value.trim())advance('search')}} onFocus={()=>setSection('search')} placeholder="Global search  /  ID 또는 이름 검색" aria-label="전역 검색"/><kbd>DEMO</kbd></div>
        <div className="tcg-user"><span className="tcg-user-dot">D</span><span>Demo User<small>Design Engineering</small></span><ChevronDown size={15}/></div>
      </div>
      <div className="tcg-app-layout"><nav className={'tcg-sidebar '+(mobileNav?'open':'')} aria-label="Teamcenter 데모 탐색"><div className="tcg-side-label">WORKSPACES</div>
        {nav.map(o=><button key={o.id} className={section===o.id?'selected':''} onClick={()=>go(o.id)} title={o.label}><o.icon size={17}/><span>{o.title}</span>{o.id==='inbox'&&pending>0&&<b>{pending}</b>}</button>)}
        <div className="tcg-sidebar-foot"><ShieldCheck size={16}/><span>로컬 데모 모드<br/><small>읽기·수정 모두 체험 가능</small></span></div>
      </nav>
      <div className="tcg-main-area"><div className="tcg-location"><span>Teamcenter Demo</span><ChevronRight size={13}/><strong>{nav.find(o=>o.id===section)?.title}</strong><span className="tcg-spacer"/><span className="tcg-example-badge">예제 데이터 · 2606</span></div>
        {activeTour&&<div className={'tcg-tour-callout '+(tourDone?'done':'')}><div className="tcg-tour-track"><span>GUIDED PRACTICE</span><strong>{activeTour.title}</strong><div className="tcg-tour-progress">{activeTour.steps.map((_,i)=><span key={i} className={tourDone||i<=tourStep?'on':''}/>)}</div></div>
          <div className="tcg-tour-instruction"><span>STEP {String(tourStep+1).padStart(2,'0')} / {activeTour.steps.length}</span><strong>{tourDone?'실습 완료!':activeStep?.title}</strong><p>{tourDone?'이번 시나리오의 주요 기능을 모두 체험했습니다.':' '+(activeStep?.description||'')}</p><small>{tourDone?'다른 실습도 시작해 보세요.':'조작 힌트: '+activeStep?.hint}</small></div><div className="tcg-tour-buttons">{!tourDone&&activeStep&&section!==activeStep.section&&<button className="tcg-primary" onClick={()=>go(activeStep.section)}>해당 화면 열기 <ArrowRight size={14}/></button>}{!tourDone&&<button className="tcg-quiet" onClick={()=>{if(tourStep===activeTour.steps.length-1)setTourDone(true);else setTourStep(i=>i+1)}}>단계 건너뛰기</button>}<button className="tcg-quiet" onClick={()=>{setTourId(null);setTourDone(false)}}><X size={14}/> 닫기</button></div>
        </div>}
        <div className="tcg-work-content">{renderContent()}</div>
      </div></div>
      <div className="tcg-app-status"><span><i/> SIMULATION ONLINE</span><span>Teamcenter 2606 concepts · Original learning UI</span><button onClick={()=>go('guide')}><CircleHelp size={13}/> 도움말</button></div>
    </div>
    <div className="tcg-after-demo"><div><span>BEYOND THE SIMULATION</span><h2>실무에서는 무엇이 더 필요할까요?</h2><p>실제 Teamcenter 환경에서는 사용자 권한, 워크플로 템플릿, 데이터 모델, 조직 정책, 저장소 구성에 따라 가능한 명령과 화면이 달라집니다. 이 페이지는 학습용 예제 데이터만 변경합니다.</p></div><button onClick={()=>go('guide')}>참고 문서와 핵심 용어 <ArrowRight size={16}/></button></div>
    {toast&&<div className="tcg-toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="알림 닫기"><X size={15}/></button></div>}
  </section>
}
function PageHeading({eyebrow,title,desc}:{eyebrow:string;title:string;desc:string}){
  return <div className="tcg-page-title"><div><span className="tcg-overline">{eyebrow}</span><h2>{title}</h2><p>{desc}</p></div></div>
}
function PanelHead({title,subtitle}:{title:string;subtitle:string}){
  return <div className="tcg-panel-head"><h3>{title}</h3><span>{subtitle}</span></div>
}
function RecordTable({rows,selectedId,onSelect}:{rows:DemoRecord[];selectedId:string;onSelect:(id:string)=>void}){
  return <div className="tcg-table-scroll"><table className="tcg-record-table"><thead><tr><th>객체명 / Name</th><th>리비전</th><th>상태</th><th>담당자</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className={selectedId===r.id?'selected':''} onClick={()=>onSelect(r.id)} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')onSelect(r.id)}}><td><TileIcon kind={r.kind}/><span><strong>{r.name}</strong><small>{r.id} · {r.kind}</small></span></td><td>{r.revision}</td><td><Tag status={r.status}/></td><td>{r.owner}</td></tr>)}</tbody></table>{rows.length===0&&<p className="tcg-empty-small">조건에 맞는 객체가 없습니다. 검색어 또는 필터를 변경해 보세요.</p>}</div>
}
