import {useEffect, useMemo, useState} from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Box, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleHelp, ClipboardCheck, ExternalLink, FileCheck2, FileText, Filter,
  Folder, FolderOpen, GitBranch, Home, Layers3, ListTree, Maximize2, Menu, Minus,
  Package, Plus, RotateCcw, RotateCw, Save, Search, ShieldCheck, Workflow, X,
  Bell, Grid3X3, MessageSquare, Pencil, LayoutDashboard, Maximize, Minimize
} from 'lucide-react'
import {
  createDemoData, glossary, sources, type BomRow,
  type DemoData, type DemoRecord, type DemoStatus, type Section
} from './teamcenter-demo-data'
import './teamcenter-user-demo.css'
import './teamcenter-aw-2606.css'
import {TrainingCurriculum,useTrainingCourse} from './TrainingCurriculum'
import {teamcenterCourse} from './teamcenter-full-course'

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
const pickSaved=(name:string,fallback:string)=>{
  try{return localStorage.getItem('whatis:teamcenter:selected:'+name)||fallback}catch{return fallback}
}

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
  const [selectedId,setSelectedId]=useState(()=>pickSaved('item','DEMO-1100'))
  const [selectedDocId,setSelectedDocId]=useState(()=>pickSaved('doc','DEMO-D202'))
  const [selectedTaskId,setSelectedTaskId]=useState(()=>pickSaved('task','TASK-001'))
  const [selectedChangeId,setSelectedChangeId]=useState(()=>pickSaved('change','CN-2026-014'))
  const [editor,setEditor]=useState(false)
  const [editName,setEditName]=useState('')
  const [editDescription,setEditDescription]=useState('')
  const [editOwner,setEditOwner]=useState('')
  const [toast,setToast]=useState('')
  const [showCreateChange,setShowCreateChange]=useState(false)
  const [changeName,setChangeName]=useState('')
  const [changeReason,setChangeReason]=useState('')
  const [openRows,setOpenRows]=useState<string[]>(['occ-0'])
  const [selectedOccurrence,setSelectedOccurrence]=useState(()=>pickSaved('occurrence','occ-1'))
  const [showCompare,setShowCompare]=useState(false)
  const [whereUsed,setWhereUsed]=useState(false)
  const [selectedFolder,setSelectedFolder]=useState(()=>pickSaved('folder','제품 개발'))
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
  const [launcherOpen,setLauncherOpen]=useState(false)
  const [profileOpen,setProfileOpen]=useState(false)
  const [notificationsOpen,setNotificationsOpen]=useState(false)
  const [focusMode,setFocusMode]=useState(false)
  const [showFilters,setShowFilters]=useState(true)
  const [sessionGroup,setSessionGroup]=useState('Engineering')
  const [sessionRole,setSessionRole]=useState('Designer')
  const [revisionRule,setRevisionRule]=useState('Latest Working')
  const [workflowTarget,setWorkflowTarget]=useState<string|null>(null)
  const [workflowTemplate,setWorkflowTemplate]=useState('Review Demo')
  const [workflowReviewer,setWorkflowReviewer]=useState('나 (검토자)')
  const [workflowNote,setWorkflowNote]=useState('')
  const [workMode,setWorkMode]=useState<'Content'|'Details'|'Relations'|'Activity'>('Content')
  const course=useTrainingCourse('whatis:course:teamcenter:v3',teamcenterCourse,s=>{
    setSection(s);setMobileNav(false);setWorkMode('Content')
    setNotificationsOpen(false);setLauncherOpen(false);setProfileOpen(false)
    if(s==='search'){setQuery('');setKindFilter('all');setStatusFilter('all')}
  })
  useEffect(()=>{
    const step=teamcenterCourse.find(x=>x.id===course.progress.activeId)
    if(step&&!course.progress.paused)setSection(step.section)
  },[])

  useEffect(()=>{try{localStorage.setItem(savedKey,JSON.stringify(data))}catch{ /* storage disabled */ }},[data])
  useEffect(()=>{
    try{
      const base='whatis:teamcenter:selected:'
      localStorage.setItem(base+'item',selectedId)
      localStorage.setItem(base+'doc',selectedDocId)
      localStorage.setItem(base+'task',selectedTaskId)
      localStorage.setItem(base+'change',selectedChangeId)
      localStorage.setItem(base+'occurrence',selectedOccurrence)
      localStorage.setItem(base+'folder',selectedFolder)
    }catch{/* storage unavailable */}
  },[selectedId,selectedDocId,selectedTaskId,selectedChangeId,selectedOccurrence,selectedFolder])
  useEffect(()=>{document.title='Teamcenter 사용자 가이드 & 체험 데모 | whatis.'},[])
  const records=data.records
  const selected=records.find(r=>r.id===selectedId)
  const selectedDoc=records.find(r=>r.id===selectedDocId)
  const selectedTask=data.tasks.find(t=>t.id===selectedTaskId)
  const selectedChange=data.changes.find(c=>c.id===selectedChangeId)
  const byId=(id:string)=>records.find(r=>r.id===id)
  const itemOptions=records.filter(r=>r.kind==='Item')
  const pending=data.tasks.filter(t=>t.status==='대기').length
  const filtered=useMemo(()=>records.filter(r=>{
    const q=query.trim().toLocaleLowerCase()
    return (!q||[r.name,r.id,r.kind,r.description,r.owner].join(' ').toLocaleLowerCase().includes(q))&&(kindFilter==='all'||r.kind===kindFilter)&&(statusFilter==='all'||r.status===statusFilter)
  }),[records,query,kindFilter,statusFilter])
  const filteredDocs=records.filter(r=>r.kind==='Document')
  const folders=['제품 개발','전장 설계','기구 설계','제품 문서']
  const advance=(event:string)=>course.mark(event)
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(s=>s===message?'':s),4500)}
  const go=(s:Section)=>{
    setSection(s);setMobileNav(false);setLauncherOpen(false);setProfileOpen(false);setNotificationsOpen(false);setWorkMode('Content')
    if(s==='inbox')advance('open-inbox')
    else if(s==='home')advance('open-home')
    else if(s==='guide')advance('open-guide')
  }
  const openSelected=()=>{
    if(!selected)return
    if(selected.kind==='Document'){setSelectedDocId(selected.id);go('documents')}
    else {
      const occ=data.bom.find(x=>x.recordId===selected.id)
      if(occ){setSelectedOccurrence(occ.key);setOpenRows(old=>[...new Set([...old,'occ-0',...(occ.parent?[occ.parent]:[])])]);go('structure')}
      else{setSelectedFolder(selected.folder);go('explorer')}
    }
    advance('open-record')
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
    if(createKind==='Item')setNewBomId(id)
    notify('새 '+(createKind==='Document'?'문서':'아이템')+'을 생성했습니다.');advance(createKind==='Document'?'create-document':'create-record')
  }
  const submitReview=(id:string)=>{
    if(!byId(id))return
    if(data.tasks.some(t=>t.target===id&&t.status==='대기')){notify('이미 해당 객체의 대기 중인 검토 작업이 있습니다.');return}
    setWorkflowTarget(id);setWorkflowTemplate('Review Demo');setWorkflowReviewer('나 (검토자)');setWorkflowNote('')
  }
  const confirmWorkflow=()=>{
    const r=byId(workflowTarget||'');if(!r)return
    if(data.tasks.some(t=>t.target===r.id&&t.status==='대기')){notify('대기 중인 검토 작업이 이미 존재합니다.');setWorkflowTarget(null);return}
    const taskId=uid('TASK-',data.tasks.length+1)
    setData(old=>({...old,
      tasks:[{id:taskId,title:r.name+' · '+workflowTemplate,target:r.id,assignee:workflowReviewer,status:'대기',comment:'',priority:'보통'},...old.tasks],
      records:old.records.map(v=>v.id===r.id?{...v,status:'검토 중'}:v),
      history:['워크플로 요청: '+r.id+' · '+workflowTemplate+' · '+workflowReviewer+(workflowNote?' · '+workflowNote:''),
        ...old.history]
    }))
    setSelectedTaskId(taskId);setComment('');setWorkflowTarget(null)
    notify('새 검토 작업 '+taskId+'이(가) 받은 작업에 생성되었습니다.');advance('submit-review')
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
    setComment('');notify('작업을 '+status+' 처리했습니다.');advance(status==='승인'?'approve-task':'reject-task')
  }
  const changeQty=(key:string,delta:number)=>{
    setData(old=>({...old,bom:old.bom.map(v=>v.key===key?{...v,qty:Math.max(1,v.qty+delta)}:v),history:['BOM 수량 변경: '+key,...old.history]}))
    advance('quantity');notify('BOM 수량을 변경했습니다.')
  }
  const addBom=()=>{
    const id=data.bom.length+1
    setData(old=>({...old,bom:[...old.bom,{key:'occ-'+id,parent:'occ-0',recordId:newBomId,qty:1}],history:['BOM 구성품 연결: '+newBomId,...old.history]}))
    setShowAddBom(false);setSelectedOccurrence('occ-'+id);setSelectedId(newBomId)
    notify('선택한 부품을 최상위 어셈블리에 추가했습니다.');advance('add-bom')
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
    notify('변경 관리 상태가 갱신되었습니다.');advance(selectedChange.status==='초안'?'review-change':'complete-change')
  }
  const reset=(ask=true)=>{
    if(ask&&!window.confirm('학습용 부품, 문서, 작업, BOM, 실습 진행을 처음 상태로 되돌릴까요?'))return
    course.reset();setShowCreateChange(false);setData(createDemoData());setSection('home')
    setSelectedId('DEMO-1100');setSelectedTaskId('TASK-001');setSelectedDocId('DEMO-D202');setSelectedOccurrence('occ-1');setSelectedChangeId('CN-2026-014');setSelectedFolder('제품 개발')
    setOpenRows(['occ-0']);setEditor(false);setWorkflowTarget(null);notify('데모 데이터가 초기화되었습니다.')
  }
  const createChange=()=>{
    if(!changeName.trim()||!changeReason.trim())return
    const newId='CN-2026-'+String(15+data.changes.length).padStart(3,'0')
    setData(old=>({...old,changes:[...old.changes,{id:newId,title:changeName.trim(),status:'초안',reason:changeReason.trim(),affected:[],owner:'데모 사용자'}],history:['Change Notice 생성: '+newId,...old.history]}))
    setSelectedChangeId(newId);setShowCreateChange(false);setChangeName('');setChangeReason('')
    notify('변경 통지 '+newId+' 생성 완료');advance('create-change')
  }
  const renderInspector=(record:DemoRecord|undefined)=>{
    if(!record)return <p className="tcg-muted">항목을 선택하면 여기에 상세 정보가 표시됩니다.</p>
    return <div className="tcg-inspector-content">
      <div className="tcg-inspector-commandbar" role="toolbar" aria-label="선택된 객체 명령">
        <strong>{record.kind==='Document'?'Document Revision':'Item Revision'}</strong>
        {editor?<div className="tcg-inspector-commands"><button className="tcg-inspector-command primary" onClick={saveRecord} title="수정한 속성 저장"><Save size={16}/><span>Save Edits</span></button><button className="tcg-inspector-command" onClick={()=>setEditor(false)} title="편집 취소"><X size={16}/><span>Cancel</span></button></div>:
          <div className="tcg-inspector-commands">
            <button className="tcg-inspector-command" onClick={()=>{setSelectedId(record.id);setEditor(true)}} title="속성 편집 시작"><Pencil size={16}/><span>Edit</span></button>
            <button className="tcg-inspector-command" onClick={()=>reviseRecord(record.id)} title="새 리비전 생성"><GitBranch size={16}/><span>Revise</span></button>
            <button className="tcg-inspector-command" onClick={()=>submitReview(record.id)} title="워크플로 검토 요청"><Workflow size={16}/><span>Workflow</span></button>
          </div>}
      </div>
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
      </div>:<div className="tcg-description"><span>설명</span><p>{record.description}</p></div>}
      <details className="tcg-object-history"><summary onClick={()=>advance('open-object-history')}><RotateCcw size={14}/> 객체 처리 이력 ({data.history.filter(h=>h.includes(record.id)).length})</summary>{data.history.filter(h=>h.includes(record.id)).map((h,i)=><div key={i}>{h}</div>)}{!data.history.some(h=>h.includes(record.id))&&<p>아직 이 객체의 변경 이력이 없습니다.</p>}</details>
      <div className="tcg-explain"><CircleHelp size={16}/><span><strong>Item / Revision</strong>은 관리 대상과 그 개정판을 구분합니다. 이 데모는 개정판을 단순히 문자로 나타내며 실제 사이트별 규칙과 다를 수 있습니다.</span></div>
    </div>
  }
  const renderHome=()=> <div className="tcg-aw-home">
    <div className="tcg-aw-dashboard">
      <section className="tcg-aw-widget tcg-aw-tasks">
        <header className="tcg-aw-widget-title"><strong>Tasks</strong><div><button title="검색" onClick={()=>go('inbox')}><Search size={14}/></button><button title="작업함 열기" onClick={()=>go('inbox')}><ArrowRight size={14}/></button></div></header>
        <div className="tcg-aw-widget-scroll">{data.tasks.filter(t=>t.status==='대기').slice(0,7).map(t=><button className="tcg-aw-task-row" key={t.id} onClick={()=>{setSelectedTaskId(t.id);go('inbox')}}><span className="tcg-aw-task-icon"><ClipboardCheck size={19}/></span><span><strong>{t.title}</strong><small>{t.id} · Assigned to: Demo User</small><small>Target: {t.target}</small></span></button>)}{pending===0&&<div className="tcg-aw-empty"><ClipboardCheck size={35}/><strong>No Tasks</strong><small>현재 처리할 작업이 없습니다.</small></div>}</div>
      </section>
      <section className="tcg-aw-widget tcg-aw-recent">
        <header className="tcg-aw-widget-title"><strong>Recent</strong><div><button title="최근 항목 검색" onClick={()=>go('search')}><Search size={14}/></button><button title="검색으로 이동" onClick={()=>go('search')}><ArrowRight size={14}/></button></div></header>
        <div className="tcg-aw-recent-grid">{records.slice(0,6).map(r=><button key={r.id} onClick={()=>{setSelectedId(r.id);go('search')}}><TileIcon kind={r.kind}/><span><strong>{r.name}</strong><small>{r.id}</small><small>Revision: {r.revision}</small></span></button>)}</div>
      </section>
      <section className="tcg-aw-widget tcg-aw-actions">
        <header className="tcg-aw-widget-title"><strong>Actions</strong><button title="전체 도구" onClick={()=>{setLauncherOpen(true);advance('open-launcher')}}><Grid3X3 size={15}/></button></header>
        <div className="tcg-aw-action-list">
          {[{icon:FileText,name:'Create Document',desc:'문서 및 리비전을 생성합니다',section:'explorer'},{icon:Package,name:'Create Part',desc:'새 부품과 아이템을 생성합니다',section:'explorer'},{icon:ListTree,name:'Structure Manager',desc:'제품 구조와 BOM을 편집합니다',section:'structure'},{icon:Search,name:'Advanced Search',desc:'Teamcenter 객체를 검색합니다',section:'search'},{icon:Workflow,name:'Submit to Workflow',desc:'문서 검토 프로세스를 시작합니다',section:'documents'},{icon:GitBranch,name:'Create Change',desc:'변경 통지와 영향 항목을 관리합니다',section:'changes'}].map(item=><button key={item.name} onClick={()=>{go(item.section as Section);if(item.name==='Create Part'||item.name==='Create Document'){setCreateKind(item.name==='Create Part'?'Item':'Document');setSelectedFolder(item.name==='Create Part'?'제품 개발':'제품 문서');setShowCreate(true)}}}><item.icon size={20}/><span><strong>{item.name}</strong><small>{item.desc}</small></span><ChevronRight size={14}/></button>)}
        </div>
      </section>
      <section className="tcg-aw-widget tcg-aw-changes">
        <header className="tcg-aw-widget-title"><strong>Changes</strong><button title="변경 관리 열기" onClick={()=>go('changes')}><ArrowRight size={14}/></button></header>
        <div>{data.changes.map(c=><button className="tcg-aw-task-row" key={c.id} onClick={()=>{setSelectedChangeId(c.id);go('changes')}}><span className="tcg-aw-task-icon change"><GitBranch size={19}/></span><span><strong>{c.title}</strong><small>{c.id} · {c.status}</small><small>{c.reason}</small></span></button>)}</div>
      </section>
      <section className="tcg-aw-widget tcg-aw-report">
        <header className="tcg-aw-widget-title"><strong>Report Dashboard</strong><button title="보고서 설명" onClick={()=>go('guide')}><CircleHelp size={15}/></button></header>
        <div className="tcg-aw-report-charts">
          <div><strong>My Modified Objects</strong><small>Total Objects: {records.length}</small><div className="tcg-aw-bars">{[{name:'Item Revision',value:records.filter(r=>r.kind==='Item').length},{name:'Document',value:filteredDocs.length}].map((v,i)=><div className="tcg-aw-bar-group" key={v.name}><div className="tcg-aw-bar-area"><span style={{height:Math.max(10,Math.round(v.value/Math.max(records.length,1)*100))+'%',background:i===0?'#3684a6':'#d9b348'}}><b>{v.value}</b></span></div><small>{v.name}</small></div>)}</div></div>
          <div><strong>My Group Released Objects</strong><small>Released Objects: {records.filter(r=>r.status==='승인됨').length}</small><div className="tcg-aw-bars">{[{name:'Item Revision',value:records.filter(r=>r.kind==='Item'&&r.status==='승인됨').length},{name:'Document',value:records.filter(r=>r.kind==='Document'&&r.status==='승인됨').length}].map((v,i)=><div className="tcg-aw-bar-group" key={v.name}><div className="tcg-aw-bar-area"><span style={{height:Math.max(10,Math.round(v.value/Math.max(records.length,1)*100))+'%',background:i===0?'#3684a6':'#d9b348'}}><b>{v.value}</b></span></div><small>{v.name}</small></div>)}</div></div>
        </div>
      </section>
    </div>
    <div className="tcg-aw-training-link"><BookOpen size={15}/> <span>처음 사용하시나요? 실제 도구를 사용하는 <strong>단계별 체험 실습</strong>으로 시작하세요.</span><button onClick={course.start}>전체 실습 시작 <ArrowRight size={14}/></button></div>
  </div>
  const renderSearch=()=> <div className="tcg-aw-search">
    <div className="tcg-aw-results-bar"><div><strong>Search Results</strong><span>{filtered.length} results · {query?'“'+query+'”':'All Items'}</span></div><div><button onClick={()=>setShowFilters(v=>!v)}><Filter size={15}/> Filters</button><button onClick={()=>setQuery('')} title="검색 초기화"><RotateCcw size={15}/></button></div></div>
    <div className={'tcg-aw-search-grid '+(!showFilters?'no-filters':'')}>
      {showFilters&&<aside className="tcg-aw-facets">
        <header><strong>Filters</strong><button onClick={()=>{setKindFilter('all');setStatusFilter('all');setQuery('');advance('clear-filters')}}>Clear</button></header>
        <div className="tcg-aw-facet-group"><strong><ChevronDown size={14}/> Object Type</strong>
          {[{value:'all',title:'All Types',count:records.length},{value:'Item',title:'Item',count:records.filter(r=>r.kind==='Item').length},{value:'Document',title:'Document',count:filteredDocs.length}].map(v=><button className={kindFilter===v.value?'active':''} key={v.value} onClick={()=>{setKindFilter(v.value as typeof kindFilter);if(v.value!=='all')advance('filter-kind')}}><span className="tcg-aw-facet-square"/>{v.title}<small>{v.count}</small></button>)}
        </div>
        <div className="tcg-aw-facet-group"><strong><ChevronDown size={14}/> Release Status</strong>{['all','작업 중','검토 중','승인됨'].map(v=><button className={statusFilter===v?'active':''} key={v} onClick={()=>{setStatusFilter(v);if(v!=='all')advance('filter-status')}}><span className="tcg-aw-facet-square"/>{v==='all'?'All Status':v}</button>)}</div>
        <div className="tcg-aw-facet-foot"><CircleHelp size={16}/> 검색 필터는 학습용 예제 객체에 적용됩니다.</div>
      </aside>}
      <section className="tcg-aw-results">
        <div className="tcg-aw-results-toolbar"><strong>Results <span>({filtered.length})</span></strong><div><button title="정렬/표 보기" onClick={()=>notify('목록은 이름/ID로 탐색할 수 있습니다.')}><ListTree size={16}/></button><button title="재조회" onClick={()=>setQuery(v=>v.trim())}><RotateCcw size={15}/></button></div></div>
        <div className="tcg-search-line"><Search size={16}/><input aria-label="제품 데이터 검색" placeholder="Search in results (예: 배터리, DEMO-1100)" value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value.trim())advance('search')}}/><button onClick={()=>setQuery('')} aria-label="검색어 지우기"><X size={15}/></button></div>
        <RecordTable rows={filtered} selectedId={selectedId} onSelect={id=>selectRecord(id,'search')}/>
      </section>
      <aside className="tcg-aw-preview"><div className="tcg-aw-preview-tabs"><button className="active">Overview</button><button onClick={openSelected}>Open</button><button onClick={()=>go('guide')} title="도움말"><CircleHelp size={14}/></button></div><div className="tcg-aw-preview-scroll">{renderInspector(selected)}</div></aside>
    </div>
  </div>
  const renderExplorer=()=> <><PageHeading eyebrow="EXPLORER" title="폴더와 아이템 탐색기" desc="폴더를 열어 관련 데이터를 확인하고 새 아이템 또는 문서를 생성하는 연습을 해보세요."/>
    <div className="tcg-toolbar"><button className="tcg-primary" onClick={()=>setShowCreate(x=>!x)}><Plus size={16}/> 새 객체 생성</button><span className="tcg-spacer"/><span className="tcg-muted">예제 프로젝트 / 전동 스쿠터 개발</span></div>
    {showCreate&&<section className="tcg-panel tcg-create-panel"><div className="tcg-panel-head"><h3>새 객체 생성</h3><IconBtn title="닫기" onClick={()=>setShowCreate(false)}><X size={17}/></IconBtn></div><div className="tcg-form-grid"><label>객체 종류<select value={createKind} onChange={e=>setCreateKind(e.target.value as NewItemType)}><option value="Item">Item (부품·제품)</option><option value="Document">Document (문서)</option></select></label><label>이름<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="이름 입력"/></label><label className="tcg-span-all">설명<input value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="선택 입력"/></label></div><button className="tcg-primary" onClick={addRecord} disabled={!newName.trim()}><Plus size={15}/> 생성하기</button></section>}
    <div className="tcg-explorer-grid"><div className="tcg-panel tcg-folders"><PanelHead title="Explorer" subtitle="Folders"/><button onClick={()=>setSelectedFolder('제품 개발')}><BookOpen size={16}/> Favorites</button><button onClick={()=>setSelectedFolder('전장 설계')}><Search size={16}/> Active Folders</button><button onClick={()=>setSelectedFolder('제품 개발')}><Home size={16}/> Home</button><div className="tcg-folder-tree-caption"><ChevronDown size={14}/> Projects</div>{folders.map(f=><button key={f} className={selectedFolder===f?'active':''} onClick={()=>{setSelectedFolder(f);advance('select-folder')}}><Folder size={18}/>{f}<span>{records.filter(r=>r.folder===f).length}</span></button>)}</div><div className="tcg-panel"><PanelHead title={selectedFolder} subtitle="Contents"/><RecordTable rows={records.filter(r=>r.folder===selectedFolder)} selectedId={selectedId} onSelect={id=>selectRecord(id,'explorer')}/></div><aside className="tcg-panel tcg-side-panel"><PanelHead title="속성" subtitle="선택한 아이템"/>{renderInspector(selected)}</aside></div>
  </>
  const visibleBom=():Array<BomRow & {level:number}>=>
    {const result:Array<BomRow & {level:number}>=[];const walk=(parent:string|null,level:number)=>{data.bom.filter(r=>r.parent===parent).forEach(r=>{result.push({...r,level});if(openRows.includes(r.key))walk(r.key,level+1)})};walk(null,0);return result}
  const renderStructure=()=> <><PageHeading eyebrow="STRUCTURE MANAGER" title="제품 구조 · BOM 관리" desc="상위 어셈블리와 하위 부품의 관계를 확인하고, 수량을 조정하며 사용 위치를 탐색해 보세요."/>
    <div className="tcg-toolbar"><span className="tcg-current-item"><Layers3 size={18}/><strong>전동 스쿠터</strong><code>DEMO-1000 / B</code></span><span className="tcg-spacer"/><button className="tcg-secondary" onClick={()=>{setShowCompare(v=>!v);advance('compare-bom')}}><GitBranch size={15}/> {showCompare?'비교 닫기':'변경 비교'}</button><button className="tcg-primary" onClick={()=>setShowAddBom(x=>!x)}><Plus size={16}/> 구성품 추가</button></div>
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
    </div><aside className="tcg-panel tcg-side-panel tcg-doc-detail"><div className="tcg-document-commandbar"><strong>Document Revision</strong>{selectedDoc&&<button onClick={()=>{submitReview(selectedDoc.id);advance('open-workflow')}}><Workflow size={16}/> Submit to Workflow</button>}</div>{selectedDoc&&<><div className="tcg-object-head"><TileIcon kind="Document"/><div><h3>{selectedDoc.name}</h3><code>{selectedDoc.id} · Rev {selectedDoc.revision}</code></div></div><Tag status={selectedDoc.status}/><p>{selectedDoc.description}</p><div className="tcg-divider"/><strong className="tcg-files-head"><FileCheck2 size={16}/> 첨부 데이터셋 · 파일명</strong>{(data.files[selectedDoc.id]||[]).map((file,i)=><div className="tcg-file" key={i}><FileText size={16}/><span>{file}</span><button title="파일명 제거" aria-label={file+' 연결 해제'} onClick={()=>{setData(old=>({...old,files:{...old.files,[selectedDoc.id]:(old.files[selectedDoc.id]||[]).filter((_,n)=>n!==i)},history:['파일 연결 해제: '+selectedDoc.id+' / '+file,...old.history]}));notify('데모 파일명 연결을 제거했습니다.');advance('remove-file')}}><X size={15}/></button></div>)}
      <div className="tcg-file-form"><label>새 데이터셋 파일명 (실제 업로드 없음)</label><div><input value={fileName} onChange={e=>setFileName(e.target.value)} placeholder="예: drawing_rev_b.pdf" onKeyDown={e=>{if(e.key==='Enter')addFile()}}/><button className="tcg-secondary" onClick={addFile} disabled={!fileName.trim()}><Plus size={15}/> 연결</button></div></div>
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
    <div className="tcg-change-create-bar"><button className="tcg-primary" onClick={()=>setShowCreateChange(v=>!v)}><Plus size={15}/> Create Change Notice</button><span>변경 사유와 영향 부품을 연결하는 학습용 통지입니다.</span></div>
    {showCreateChange&&<div className="tcg-change-new tcg-panel"><strong>New Change Notice</strong><label>제목<input aria-label="새 Change Notice 제목" value={changeName} onChange={e=>setChangeName(e.target.value)} placeholder="변경 통지 제목"/></label><label>변경 사유<textarea aria-label="새 Change Notice 사유" rows={3} value={changeReason} onChange={e=>setChangeReason(e.target.value)} placeholder="변경이 필요한 이유"/></label><div><button className="tcg-primary" disabled={!changeName.trim()||!changeReason.trim()} onClick={createChange}>생성하기</button><button className="tcg-secondary" onClick={()=>setShowCreateChange(false)}>취소</button></div></div>}

    <div className="tcg-content-columns"><div className="tcg-panel"><PanelHead title="변경 통지" subtitle="Change notices"/>{data.changes.map(c=><button key={c.id} className={'tcg-change-row '+(selectedChangeId===c.id?'selected':'')} onClick={()=>{setSelectedChangeId(c.id);advance('select-change')}}><GitBranch size={20}/><span><strong>{c.title}</strong><small>{c.id} · {c.owner}</small></span><Tag status={c.status}/></button>)}</div>
    <aside className="tcg-panel tcg-side-panel"><PanelHead title="변경 상세" subtitle="Change Summary"/>{selectedChange&&<><h3 className="tcg-detail-title">{selectedChange.title}</h3><Tag status={selectedChange.status}/><p className="tcg-change-reason">{selectedChange.reason}</p><strong className="tcg-files-head">영향받는 항목 · Affected Items</strong>
      {selectedChange.affected.map(id=><div key={id} className="tcg-affected"><Package size={16}/><span><strong>{byId(id)?.name||id}</strong><small>{id}</small></span><button disabled={selectedChange.status==='완료'} title="연결 해제" onClick={()=>{setData(old=>({...old,changes:old.changes.map(c=>c.id===selectedChange.id?{...c,affected:c.affected.filter(k=>k!==id)}:c),history:['영향 항목 해제: '+selectedChange.id+' / '+id,...old.history]}));advance('remove-affected')}}><X size={15}/></button></div>)}
      {selectedChange.status!=='완료'&&<><div className="tcg-file-form"><label>영향 항목 추가</label><div><select value={affectedId} onChange={e=>setAffectedId(e.target.value)}>{itemOptions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><button className="tcg-secondary" onClick={addAffected}><Plus size={15}/> 추가</button></div></div><button className="tcg-primary tcg-full" onClick={reviewChange}><Workflow size={16}/>{selectedChange.status==='초안'?'검토 요청':'변경 완료 처리'}</button></>}
      <div className="tcg-explain"><CircleHelp size={15}/><span>변경 통지는 변경 대상과 이유, 검토·승인 결과를 연결합니다. 실제 상태 전이는 구성된 워크플로 및 권한에 의해 제어됩니다.</span></div>
    </>}</aside></div>
  </>
  const renderViewer=()=> <><PageHeading eyebrow="VISUALIZATION" title="3D 제품 보기 · 개념 시각화" desc="임의로 제작한 도해에서 부품을 선택하고 분해도와 회전을 조작해 보세요. 실제 JT/CAD 파일을 읽는 뷰어는 아닙니다."/>
    <div className="tcg-viewer-grid"><section className="tcg-panel tcg-cad-stage"><div className="tcg-cad-head"><span><Maximize2 size={16}/> CONCEPT VIEWER · NOT CAD</span><span>예제: 전동 스쿠터 구성품</span></div>
      <svg className="tcg-assembly" viewBox="0 0 700 410" role="img" aria-label="클릭할 수 있는 전동 스쿠터 구성요소의 독자적인 선형 도해">
        <defs><linearGradient id="tcg-metal" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#b5ced9"/><stop offset="1" stopColor="#5389a3"/></linearGradient><linearGradient id="tcg-dark" x1="0" x2="0" y1="1"><stop offset="0" stopColor="#294253"/><stop offset="1" stopColor="#537487"/></linearGradient></defs>
        <g className="tcg-assembly-body" style={{transform:'rotate('+rotate+'deg)'}} transform="translate(0 0)">
          <g onClick={()=>{setViewerPart('DEMO-1500');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1500'?'active':'')}><circle cx="185" cy="305" r="62" fill="#263c48" stroke="#66879b" strokeWidth="13"/><circle cx="185" cy="305" r="32" fill="#f3f8fa" stroke="#7d9ead" strokeWidth="10"/><circle cx="525" cy="305" r="62" fill="#263c48" stroke="#66879b" strokeWidth="13"/><circle cx="525" cy="305" r="32" fill="#f3f8fa" stroke="#7d9ead" strokeWidth="10"/></g>
          <g onClick={()=>{setViewerPart('DEMO-1400');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1400'?'active':'')} style={{transform:explode?'translate(0,-45px)':'none'}}><path d="M162 225 L480 225 Q508 225 502 247 L479 267 L199 267 Q168 267 162 246 Z" fill="url(#tcg-metal)" stroke="#386079" strokeWidth="6"/><path d="M196 239H462" stroke="#e5f4fb" strokeWidth="5"/><path d="M237 267L188 305M462 267L523 305" stroke="#537889" strokeWidth="11" strokeLinecap="round"/></g>
          <g onClick={()=>{setViewerPart('DEMO-1100');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1100'?'active':'')} style={{transform:explode?'translate(0,-95px)':'none'}}><rect x="265" y="168" width="173" height="58" rx="13" fill="#176e89" stroke="#8dc8d3" strokeWidth="5"/><rect x="281" y="181" width="143" height="30" rx="4" fill="#1f4d66"/><path d="M312 196h30m-15-15v30" stroke="#a6e3e0" strokeWidth="6"/><text x="362" y="202" fontSize="13" textAnchor="middle" fill="#d3f7f8">BATTERY</text></g>
          <g onClick={()=>{setViewerPart('DEMO-1200');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1200'?'active':'')} style={{transform:explode?'translate(-53,20px)':'none'}}><rect x="443" y="262" width="70" height="50" rx="14" fill="#8daab9" stroke="#315f72" strokeWidth="6"/><circle cx="479" cy="287" r="16" fill="#456679" stroke="#a7d0d8" strokeWidth="4"/></g>
          <g onClick={()=>{setViewerPart('DEMO-1600');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1600'?'active':'')} style={{transform:explode?'translate(80,-25px)':'none'}}><path d="M486 228L544 75 L583 75" stroke="#426479" strokeWidth="15" fill="none" strokeLinecap="round"/><path d="M545 73L610 73" stroke="#7ab0bf" strokeWidth="17" strokeLinecap="round"/><path d="M553 76L570 224" stroke="#a0bccb" strokeWidth="5" strokeDasharray="12 8"/></g>
          <g onClick={()=>{setViewerPart('DEMO-1300');advance('viewer-part')}} className={'tcg-svg-select '+(viewerPart==='DEMO-1300'?'active':'')} style={{transform:explode?'translate(-55,-100px)':'none'}}><rect x="188" y="166" width="65" height="54" rx="8" fill="url(#tcg-dark)" stroke="#8faeb8" strokeWidth="5"/><path d="M204 183h33M204 193h33M204 203h18" stroke="#7dbab7" strokeWidth="3"/></g>
        </g>
        <g fill="#47748b" fontSize="12" fontWeight="700"><text x="23" y="31">FRONT / SIDE</text><text x="616" y="382">DEMO 2606</text></g>
      </svg>
      <div className="tcg-viewer-control"><button className={explode?'tcg-primary':'tcg-secondary'} onClick={()=>{setExplode(e=>!e);advance('viewer-explode')}}><Layers3 size={16}/>{explode?'조립 상태로':'분해도 보기'}</button><label><RotateCw size={16}/> 회전 <input type="range" min="-8" max="8" step="1" value={rotate} onChange={e=>{setRotate(Number(e.target.value));advance('viewer-rotate')}}/></label><button className="tcg-quiet" onClick={()=>{setRotate(0);setExplode(false);advance('viewer-reset')}}><RotateCcw size={14}/> 초기화</button></div>
    </section><aside className="tcg-panel tcg-side-panel"><PanelHead title="부품 선택" subtitle="클릭해 세부 정보 확인"/>{['DEMO-1100','DEMO-1200','DEMO-1300','DEMO-1400','DEMO-1500','DEMO-1600'].map(id=><button key={id} className={'tcg-viewer-part '+(viewerPart===id?'selected':'')} onClick={()=>{setViewerPart(id);advance('viewer-part')}}><Box size={16}/><span>{byId(id)?.name}</span><ChevronRight size={15}/></button>)}<div className="tcg-divider"/><h3>{byId(viewerPart)?.name}</h3><Tag status={byId(viewerPart)?.status||'작업 중'}/><p className="tcg-description-text">{byId(viewerPart)?.description}</p><div className="tcg-explain"><CircleHelp size={15}/><span>이 도해는 UI 실습을 위해 직접 그린 벡터 그림입니다. 형상, 치수, 조립 관계는 실제 설계품이나 CAD 데이터가 아닙니다.</span></div></aside></div>
  </>
  const renderGuide=()=> <><PageHeading eyebrow="LEARN & REFERENCE" title="Teamcenter 사용자 가이드" desc="화면을 조작하기 전에 핵심 용어와 업무 순서를 알아보세요. 기초 개념부터 실제 기능을 연결했습니다."/>
    <div className="tcg-guide-intro"><BookOpen size={27}/><div><strong>초보자에게 권장하는 학습 순서</strong><p>① 검색과 속성 확인 → ② 제품 구조(BOM) → ③ 문서/첨부 → ④ 승인 워크플로 → ⑤ 변경 통지 → ⑥ 모델 시각화</p></div><button className="tcg-primary" onClick={course.start}>전체 실습 시작 <ArrowRight size={15}/></button></div>
    <div className="tcg-practice-grid">{[...new Set(teamcenterCourse.map(s=>s.chapter))].map(ch=><button key={ch} className="tcg-practice-card" onClick={()=>{course.setListOpen(true);course.jump(teamcenterCourse.find(x=>x.chapter===ch)!.id)}}><span>CONTINUOUS PRACTICE</span><strong>{ch}</strong><small>{teamcenterCourse.filter(s=>s.chapter===ch).length}개 단계</small><em>이 부분부터 실습 <ArrowRight size={14}/></em></button>)}</div>
    <div className="tcg-guide-verify"><strong>사용자 가이드 학습 확인</strong><p>원문 출처와 핵심 용어를 확인했다면 학습 완료 버튼을 누르세요.</p><button className="tcg-primary" onClick={()=>advance('open-guide')}><CheckCircle2 size={15}/> 가이드 확인 완료 · 다음 단계</button></div>
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
    <div className="tcg-breadcrumb"><button onClick={onBack}><ArrowLeft size={15}/> Siemens 아키텍처</button><ChevronRight size={13}/><span>Teamcenter 사용자 가이드</span><span className="tcg-breadcrumb-badge">2606 · ACTIVE WORKSPACE</span></div>
    <div className="tcg-shell-heading"><div><span className="tcg-shell-kicker">TEAMCENTER 2606 / INTERACTIVE TRAINING</span><h1>Active Workspace <span>사용자 체험</span></h1><p>실제 Teamcenter 화면 구성을 참고한 학습용 인터페이스 · 변경 사항은 이 브라우저에만 저장됩니다.</p></div>
      <div className="tcg-shell-controls"><button onClick={course.start}><BookOpen size={15}/> 실습하기</button><button onClick={()=>{course.setListOpen(true);document.querySelector('[data-training-host]')?.scrollIntoView({behavior:'smooth',block:'start'})}}><ListTree size={15}/> 실습 목록</button><button onClick={()=>go('guide')}><CircleHelp size={15}/> 사용 가이드</button><button onClick={()=>reset()}><RotateCcw size={15}/> 초기화</button></div>
    </div>
    <div className={'tcg-frame '+(focusMode?'tcg-focus-mode':'')}>
      <div className="tcg-appbar">
        <button className="tcg-mobile-menu" onClick={()=>setMobileNav(x=>!x)} aria-label="메뉴 열기"><Menu size={20}/></button>
        <button className="tcg-mark" onClick={()=>go('home')} title="Teamcenter Home"><span>Tc</span><strong>Teamcenter</strong></button>
        <div className="tcg-global-search">
          <select aria-label="검색 범위" value={kindFilter==='all'?'Any Category':kindFilter} onChange={e=>{setKindFilter(e.target.value==='Any Category'?'all':e.target.value as 'Item'|'Document');go('search')}}><option>Any Category</option><option>Item</option><option>Document</option></select>
          <div className="tcg-global-search-field"><input value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value.trim())advance('search')}} onFocus={()=>setSection('search')} onKeyDown={e=>{if(e.key==='Enter')go('search')}} placeholder="Search" aria-label="전역 검색"/><button aria-label="검색하기" title="검색하기" onClick={()=>go('search')}><Search size={16}/></button></div>
        </div>
        <div className="tcg-appbar-tools">
          <button title="활성 변경" aria-label="활성 변경" onClick={()=>go('changes')}><GitBranch size={17}/></button>
          <button title="대시보드 편집" aria-label="대시보드 편집" onClick={()=>notify('이 학습 화면에서는 대시보드 레이아웃이 고정되어 있습니다.')}><Pencil size={16}/></button>
          <button title="알림" aria-label="알림" onClick={()=>{setNotificationsOpen(v=>!v);setProfileOpen(false);advance('open-notifications')}}><Bell size={17}/>{pending>0&&<i/>}</button>
          <button title="토론" aria-label="토론" onClick={()=>notify('토론 화면은 학습용 데모에서 제공하지 않습니다.')}><MessageSquare size={16}/></button>
          <button title={focusMode?'확대 보기 종료':'전체 화면에 가깝게 보기'} aria-label="화면 확대" onClick={()=>setFocusMode(v=>!v)}>{focusMode?<Minimize size={17}/>:<Maximize size={17}/>}</button>
          <button className="tcg-session-trigger" title="현재 사용자와 작업 컨텍스트" aria-label="사용자 설정 열기" onClick={()=>{setProfileOpen(v=>!v);setNotificationsOpen(false);setLauncherOpen(false);advance('open-profile')}}><span className="tcg-user-dot">D</span><ChevronDown size={13}/></button>
          <strong className="tcg-siemens-wordmark">DEMO <small>2606</small></strong>
        </div>
        {notificationsOpen&&<div className="tcg-session-popover tcg-alerts-popover"><strong><Bell size={16}/> 알림</strong>{data.tasks.filter(t=>t.status==='대기').map(t=><button key={t.id} onClick={()=>{setSelectedTaskId(t.id);go('inbox')}}>{t.title}<small>검토 대기 · {t.id}</small></button>)}{pending===0&&<p>대기 중인 알림이 없습니다.</p>}</div>}
        {profileOpen&&<div className="tcg-session-popover tcg-user-popover"><strong>Demo User <small>학습용 작업 컨텍스트</small></strong>
          <label>Group<select value={sessionGroup} onChange={e=>{setSessionGroup(e.target.value);advance('change-group')}}><option>Engineering</option><option>Manufacturing</option><option>Quality</option></select></label>
          <label>Role<select value={sessionRole} onChange={e=>{setSessionRole(e.target.value);advance('change-role')}}><option>Designer</option><option>Reviewer</option><option>Engineer</option></select></label>
          <label>Revision Rule<select value={revisionRule} onChange={e=>{setRevisionRule(e.target.value);advance('change-rule')}}><option>Latest Working</option><option>Latest Released</option></select></label>
          <p>표시 컨텍스트 체험용입니다. 실제 권한과 리비전 규칙을 적용하지 않습니다.</p>
          <button onClick={()=>go('guide')}><CircleHelp size={15}/> 세션 속성 알아보기</button>
        </div>}
      </div>
      <div className="tcg-app-layout"><nav className={'tcg-sidebar '+(mobileNav?'open':'')} aria-label="Teamcenter 데모 탐색">
        <button className="tcg-nav-previous" title="홈으로 돌아가기" onClick={()=>go('home')}><ArrowLeft size={17}/><span>이전</span></button>
        {nav.map(o=><button key={o.id} className={section===o.id?'selected':''} onClick={()=>go(o.id)} title={o.label}><o.icon size={18}/><span>{o.title}</span>{o.id==='inbox'&&pending>0&&<b>{pending}</b>}</button>)}
        <button className="tcg-launcher-toggle" title="Launcher · 전체 도구" aria-label="Launcher 열기" onClick={()=>{setLauncherOpen(v=>!v);advance('open-launcher')}}><Grid3X3 size={19}/><span>Launcher</span></button>
      </nav>
      <div className="tcg-main-area"><div className="tcg-location"><span>Teamcenter</span><ChevronRight size={13}/><strong>{nav.find(o=>o.id===section)?.title}</strong><span className="tcg-spacer"/><span className="tcg-example-badge">TRAINING DEMO · NOT CONNECTED</span></div>
        {launcherOpen&&<div className="tcg-launcher-overlay"><div className="tcg-launcher-header"><strong>Launcher</strong><button onClick={()=>setLauncherOpen(false)} aria-label="Launcher 닫기"><X size={18}/></button></div><div className="tcg-launcher-search"><Search size={16}/> Pinned Tools</div><div className="tcg-launcher-grid">{nav.filter(n=>n.id!=='home').map(n=><button key={n.id} onClick={()=>go(n.id)}><n.icon size={22}/><span>{n.title}</span></button>)}</div><div className="tcg-launcher-bottom"><span>PINNED DATA</span><p>고정된 데이터가 없습니다.</p></div></div>}
        {['structure','documents'].includes(section)&&<div className="tcg-workmode-bar"><div className="tcg-workmode-tabs">{(['Content','Details','Relations','Activity'] as const).map(mode=><button key={mode} className={workMode===mode?'active':''} onClick={()=>{setWorkMode(mode);advance('workmode-'+mode.toLowerCase())}}>{mode}</button>)}</div><div className="tcg-workmode-command"><span>{section==='structure'?'DEMO-1000 · Rev B':'Document Management'}</span><IconBtn title="전체 컨텐츠 보기" onClick={()=>setWorkMode('Content')}><LayoutDashboard size={16}/></IconBtn></div></div>}
        <TrainingCurriculum title="TEAMCENTER · 연속 실습" lessons={teamcenterCourse} course={course} onResetData={()=>reset(false)}/>
        <div className="tcg-work-content">{workMode==='Activity'&&['structure','documents'].includes(section)?<div className="tcg-panel tcg-workmode-detail tcg-activity-view"><PanelHead title="Activity / 작업 이력" subtitle="Local training session"/>{data.history.map((h,i)=><div key={i}><RotateCcw size={14}/><span>{h}</span></div>)}</div>:workMode==='Details'&&section==='structure'?<div className="tcg-panel tcg-workmode-detail"><PanelHead title="Details / 속성" subtitle="Selected Object"/>{renderInspector(byId(data.bom.find(r=>r.key===selectedOccurrence)?.recordId||''))}</div>:workMode==='Details'&&section==='documents'?<div className="tcg-panel tcg-workmode-detail"><PanelHead title="Document Details" subtitle="Selected Object"/>{renderInspector(selectedDoc)}</div>:workMode==='Relations'&&['structure','documents'].includes(section)?<div className="tcg-panel tcg-workmode-detail"><PanelHead title="Relations / 연결 관계" subtitle="Related Objects"/>{(section==='structure'?data.bom:filteredDocs.map((r,i)=>({key:r.id,recordId:r.id,parent:null,qty:i+1}))).map(rel=><button className="tcg-relation-row" key={rel.key} onClick={()=>{setSelectedId(rel.recordId);setWorkMode('Details')}}><Package size={17}/>{byId(rel.recordId)?.name}<small>{rel.recordId}</small><ChevronRight size={15}/></button>)}</div>:renderContent()}</div>
      </div></div>
      <div className="tcg-app-status"><button onClick={()=>{setLauncherOpen(v=>!v);advance('open-launcher')}}><Grid3X3 size={14}/> Launcher</button><span><i/> LOCAL SIMULATION</span><span>Active Workspace 2606 UI-inspired · no Teamcenter connection</span><button onClick={()=>go('guide')}><CircleHelp size={13}/> Help</button></div>
    </div>
    <div className="tcg-after-demo"><div><span>BEYOND THE SIMULATION</span><h2>실무에서는 무엇이 더 필요할까요?</h2><p>실제 Teamcenter 환경에서는 사용자 권한, 워크플로 템플릿, 데이터 모델, 조직 정책, 저장소 구성에 따라 가능한 명령과 화면이 달라집니다. 이 페이지는 학습용 예제 데이터만 변경합니다.</p></div><button onClick={()=>go('guide')}>참고 문서와 핵심 용어 <ArrowRight size={16}/></button></div>
    {workflowTarget&&<div className="tcg-workflow-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setWorkflowTarget(null)}}><div className="tcg-workflow-dialog" role="dialog" aria-modal="true" aria-label="검토 워크플로 생성">
      <header><Workflow size={19}/><strong>Submit to Workflow</strong><button onClick={()=>setWorkflowTarget(null)} aria-label="닫기"><X size={18}/></button></header>
      <p>선택한 객체에 학습용 워크플로를 생성합니다. 실제 업무 템플릿과 역할은 고객별로 다릅니다.</p>
      <div className="tcg-workflow-selected"><Package size={19}/><span><strong>{byId(workflowTarget)?.name}</strong><small>{workflowTarget} · Rev {byId(workflowTarget)?.revision}</small></span></div>
      <label>Process Template<select value={workflowTemplate} onChange={e=>{setWorkflowTemplate(e.target.value);advance('change-workflow-template')}}><option>Review Demo</option><option>Release Demo</option></select></label>
      <label>Review Participant<select value={workflowReviewer} onChange={e=>{setWorkflowReviewer(e.target.value);advance('change-workflow-reviewer')}}><option>나 (검토자)</option><option>품질 검토자</option><option>설계 검토자</option></select></label>
      <label>Instructions<textarea rows={3} value={workflowNote} onChange={e=>setWorkflowNote(e.target.value)} placeholder="검토 내용 또는 요청 사항 (선택)"/></label>
      <footer><button className="tcg-secondary" onClick={()=>setWorkflowTarget(null)}>Cancel</button><button className="tcg-primary" onClick={confirmWorkflow}><Workflow size={15}/> Submit</button></footer>
    </div></div>}
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
