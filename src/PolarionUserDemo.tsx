import {useEffect,useMemo,useState} from 'react'
import {
  ArrowLeft,ArrowRight,BarChart3,Bell,BookOpen,CalendarDays,Check,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,
  CircleHelp,ClipboardCheck,Clock,FileText,Folder,GitBranch,Grid2X2,
  History,Home,Layers,Link2,List,Maximize,Menu,MessageSquare,Minimize,Network,Pencil,Plus,RefreshCw,Save,Search,
  Settings,ShieldCheck,SquareCheck,TestTube2,X
} from 'lucide-react'
import {
  polarionSource,polarionTerms,sampleDate,seedPolarion,
  type PolarionSection,type PolarionState,type WorkItem,type WorkType,type WorkStatus,
  type TestResult,type PolarionDoc
} from './polarion-demo-data'
import './polarion-demo.css'
import {TrainingCurriculum,useTrainingCourse} from './TrainingCurriculum'
import {polarionCourse} from './polarion-full-course'

const NAV=[
  {id:'home',title:'Home',detail:'프로젝트 홈',icon:Home},
  {id:'work-items',title:'Work Items',detail:'요구사항·결함·테스트',icon:SquareCheck},
  {id:'documents',title:'Documents & Pages',detail:'LiveDocs',icon:FileText},
  {id:'plans',title:'Plans',detail:'릴리스·이터레이션',icon:CalendarDays},
  {id:'test-runs',title:'Test Runs',detail:'시험 실행',icon:TestTube2},
  {id:'traceability',title:'Traceability',detail:'연결 및 영향 관계',icon:Network},
  {id:'baselines',title:'Baselines',detail:'기준선 관리',icon:Layers},
  {id:'reports',title:'Reports',detail:'상태별 보고서',icon:BarChart3},
  {id:'guide',title:'User Guide',detail:'용어 및 문서',icon:BookOpen}
] as const
const TYPES:WorkType[]=['Requirement','Test Case','Defect','Task','Change Request']
const STATUSES:WorkStatus[]=['Open','In Progress','In Review','Approved','Done']
const RESULTS:TestResult[]=['Not Run','Passed','Failed','Blocked']
const storage='whatis:polarion-demo-v1'
const pickSaved=(name:string,fallback:string)=>{
  try{return localStorage.getItem('whatis:polarion:selected:'+name)||fallback}catch{return fallback}
}

const load=():PolarionState=>{
  try{
    const data=JSON.parse(localStorage.getItem(storage)||'null') as PolarionState|null
    if(data&&Array.isArray(data.workItems)&&Array.isArray(data.documents)&&Array.isArray(data.testRuns)&&Array.isArray(data.links)&&Array.isArray(data.plans))return {...data,baselines:Array.isArray(data.baselines)?data.baselines:[]}
  }catch{/* localStorage may be disabled */}
  return seedPolarion()
}
const kind=(type:WorkType)=>type.toLowerCase().replace(' ','-')
const labelStatus=(status:string)=> <span className={'pl-status '+status.toLowerCase().replaceAll(' ','-')}>{status}</span>
function ItemIcon({type}:{type:WorkType}){
  return <span className={'pl-item-icon '+kind(type)}>{type==='Test Case'?<TestTube2 size={17}/>:type==='Requirement'?<ClipboardCheck size={17}/>:type==='Defect'?<CircleHelp size={17}/>:type==='Change Request'?<GitBranch size={17}/>:<SquareCheck size={17}/>}</span>
}
const IconAction=({title,onClick,children}:{title:string;onClick:()=>void;children:React.ReactNode})=><button className="pl-icon-action" title={title} aria-label={title} onClick={onClick}>{children}</button>

export default function PolarionUserDemo({onBack}:{onBack:()=>void}){
  const [data,setData]=useState<PolarionState>(load)
  const [section,setSection]=useState<PolarionSection>('home')
  const [sidebar,setSidebar]=useState(true)
  const [tools,setTools]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const [profile,setProfile]=useState(false)
  const [search,setSearch]=useState('')
  const [typeFilter,setTypeFilter]=useState<'All'|WorkType>('All')
  const [statusFilter,setStatusFilter]=useState('All')
  const [selected,setSelected]=useState(()=>pickSaved('item','DP-101'))
  const [selectedDoc,setSelectedDoc]=useState(()=>pickSaved('doc','DOC-001'))
  const [selectedSection,setSelectedSection]=useState(()=>pickSaved('section','sec-1'))
  const [selectedPlan,setSelectedPlan]=useState(()=>pickSaved('plan','PLAN-01'))
  const [selectedRun,setSelectedRun]=useState(()=>pickSaved('run','TR-001'))
  const [createOpen,setCreateOpen]=useState(false)
  const [createType,setCreateType]=useState<WorkType>('Requirement')
  const [createTitle,setCreateTitle]=useState('')
  const [createDescription,setCreateDescription]=useState('')
  const [itemEditing,setItemEditing]=useState(false)
  const [editTitle,setEditTitle]=useState('')
  const [editDescription,setEditDescription]=useState('')
  const [editAssignee,setEditAssignee]=useState('')
  const [editStatus,setEditStatus]=useState<WorkStatus>('Open')
  const [editPriority,setEditPriority]=useState<'High'|'Medium'|'Low'>('Medium')
  const [comment,setComment]=useState('')
  const [linkTarget,setLinkTarget]=useState('DP-201')
  const [linkRole,setLinkRole]=useState<'verifies'|'relates to'|'depends on'|'implements'>('verifies')
  const [showLink,setShowLink]=useState(false)
  const [docEditing,setDocEditing]=useState(false)
  const [docBody,setDocBody]=useState('')
  const [docTitle,setDocTitle]=useState('')
  const [newDocOpen,setNewDocOpen]=useState(false)
  const [docName,setDocName]=useState('')
  const [docAttach,setDocAttach]=useState('DP-201')
  const [newPlanName,setNewPlanName]=useState('')
  const [newPlanOpen,setNewPlanOpen]=useState(false)
  const [planAttach,setPlanAttach]=useState('DP-103')
  const [newRunOpen,setNewRunOpen]=useState(false)
  const [newRunName,setNewRunName]=useState('')
  const [runAttach,setRunAttach]=useState('DP-203')
  const [message,setMessage]=useState('')
  const [guideSearch,setGuideSearch]=useState('')
  const [navSearch,setNavSearch]=useState('')
  const [view,setView]=useState<'Table'|'Tree'>('Table')
  const [itemTab,setItemTab]=useState<'details'|'activity'>('details')
  const [quickCreateOpen,setQuickCreateOpen]=useState(false)
  const [focusMode,setFocusMode]=useState(false)
  const [compactMode,setCompactMode]=useState(false)
  const [baselineName,setBaselineName]=useState('')
  const [baselineId,setBaselineId]=useState('')
  const [baselineCompare,setBaselineCompare]=useState(false)
  const [reportStatus,setReportStatus]=useState('All')
  const [reportRefresh,setReportRefresh]=useState(0)
  const [selectedCase,setSelectedCase]=useState(()=>pickSaved('test-case','DP-201'))
  const [runNote,setRunNote]=useState('')
  const [fileLabel,setFileLabel]=useState('')
  const [watching,setWatching]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('whatis:polarion-watch-v1')||'[]') as string[]}catch{return []}})
  const [treeOpen,setTreeOpen]=useState<string[]>(seedPolarion().workItems.map(i=>i.id))
  const course=useTrainingCourse('whatis:course:polarion:v3',polarionCourse,s=>{
    setSection(s);setMenuOpen(false);setProfile(false);setQuickCreateOpen(false);setDocEditing(false);setItemEditing(false)
    if(s==='work-items'){setSearch('');setTypeFilter('All');setStatusFilter('All')}
    if(s==='test-runs')setRunAttach('DP-201')
  })
  useEffect(()=>{
    const step=polarionCourse.find(x=>x.id===course.progress.activeId)
    if(step&&!course.progress.paused)setSection(step.section)
    // On first mount only: resume the previous browser session's active chapter.
  },[])

  useEffect(()=>{document.title='Polarion ALM 2606 · 사용자 체험 | whatis.'},[])
  useEffect(()=>{
    const selectedRunRecord=data.testRuns.find(r=>r.id===selectedRun)
    if(!selectedRunRecord)return
    const first=Object.keys(selectedRunRecord.cases)[0]||''
    const active=selectedCase in selectedRunRecord.cases?selectedCase:first
    setSelectedCase(active)
    setRunNote(selectedRunRecord.notes?.[active]||'')
  },[selectedRun])
  useEffect(()=>{try{localStorage.setItem(storage,JSON.stringify(data))}catch{/* private browser */}},[data])
  useEffect(()=>{
    try{
      const base='whatis:polarion:selected:'
      localStorage.setItem(base+'item',selected)
      localStorage.setItem(base+'doc',selectedDoc)
      localStorage.setItem(base+'section',selectedSection)
      localStorage.setItem(base+'plan',selectedPlan)
      localStorage.setItem(base+'run',selectedRun)
      localStorage.setItem(base+'test-case',selectedCase)
    }catch{/* storage unavailable */}
  },[selected,selectedDoc,selectedSection,selectedPlan,selectedRun,selectedCase])
  useEffect(()=>{try{localStorage.setItem('whatis:polarion-watch-v1',JSON.stringify(watching))}catch{/* private browser */}},[watching])
  const byId=(id:string)=>data.workItems.find(i=>i.id===id)
  const item=byId(selected)
  const doc=data.documents.find(d=>d.id===selectedDoc)
  const docSection=doc?.sections.find(s=>s.id===selectedSection)
  const plan=data.plans.find(p=>p.id===selectedPlan)
  const run=data.testRuns.find(r=>r.id===selectedRun)
  const requirements=data.workItems.filter(i=>i.type==='Requirement')
  const testCases=data.workItems.filter(i=>i.type==='Test Case')
  const finished=(id:string)=>byId(id)?.status==='Done'||byId(id)?.status==='Approved'
  const filtered=useMemo(()=>data.workItems.filter(i=>(!search.trim()||[i.id,i.title,i.type,i.description,i.assignee].join(' ').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))&&(typeFilter==='All'||i.type===typeFilter)&&(statusFilter==='All'||i.status===statusFilter)),[data.workItems,search,typeFilter,statusFilter])
  const visibleRows=useMemo(()=>{
    if(view==='Table')return filtered.map(i=>({item:i,level:0,hasChildren:false}))
    const byKey=new Map(filtered.map(i=>[i.id,i]))
    const parentFor=new Map<string,string>()
    data.links.forEach(l=>{if(byKey.has(l.source)&&byKey.has(l.target)&&!parentFor.has(l.source))parentFor.set(l.source,l.target)})
    const result:Array<{item:WorkItem;level:number;hasChildren:boolean}>=[]
    const visited=new Set<string>()
    const walk=(item:WorkItem,level:number)=>{
      if(visited.has(item.id))return
      visited.add(item.id)
      const children=filtered.filter(child=>parentFor.get(child.id)===item.id)
      result.push({item,level,hasChildren:children.length>0})
      if(treeOpen.includes(item.id))children.forEach(child=>walk(child,level+1))
    }
    filtered.filter(i=>!parentFor.has(i.id)).forEach(i=>walk(i,0))
    // Hidden descendants of collapsed parents must not reappear as root rows.
    return result
  },[filtered,view,treeOpen,data.links])
  const announce=(msg:string)=>{setMessage(msg);window.setTimeout(()=>setMessage(x=>x===msg?'':x),3900)}
  const advance=(event:string)=>course.mark(event)
  const go=(s:PolarionSection)=>{
    setSection(s);setMenuOpen(false);setProfile(false);setQuickCreateOpen(false);setDocEditing(false);setItemEditing(false)
    if(s==='traceability')advance('nav-traceability')
    else if(s==='home')advance('home-open')
    else advance('nav-'+s)
  }
  const selectItem=(id:string)=>{
    setSelected(id);setItemEditing(false);setItemTab('details');advance('select-item')
    window.requestAnimationFrame(()=>document.querySelector('.pl-work-detail')?.scrollIntoView({behavior:'smooth',block:'nearest'}))
  }
  useEffect(()=>{
    if(!item)return
    setEditTitle(item.title);setEditDescription(item.description);setEditAssignee(item.assignee);setEditPriority(item.priority);setEditStatus(item.status)
  },[item?.id,item?.title,item?.description,item?.assignee,item?.priority,item?.status])
  useEffect(()=>{
    setDocBody(docSection?.body||'')
  },[doc?.id,docSection?.id,docSection?.body])
  const createItem=()=>{
    if(!createTitle.trim())return
    const suffix=Math.max(600,...data.workItems.map(x=>Number(x.id.split('-')[1])||0))+1
    const id='DP-'+suffix
    const newItem:WorkItem={id,title:createTitle.trim(),type:createType,description:createDescription.trim(),status:'Open',priority:'Medium',assignee:'Demo User',comments:[],updated:sampleDate}
    setData(prev=>({...prev,workItems:[newItem,...prev.workItems],history:['Work Item 생성: '+id,...prev.history]}))
    setSelected(id);setCreateOpen(false);setCreateTitle('');setCreateDescription('');setSearch('');setTypeFilter('All');setStatusFilter('All')
    setSection('work-items');setItemTab('details');announce('새 Work Item '+id+' 생성 완료 (데모)');advance(createType==='Defect'?'create-defect-item':'create-'+createType.toLowerCase().replaceAll(' ','-'))
    window.requestAnimationFrame(()=>document.querySelector('.pl-work-detail')?.scrollIntoView({behavior:'smooth',block:'nearest'}))
  }
  const saveItem=()=>{
    if(!item||!editTitle.trim())return
    setData(prev=>({...prev,workItems:prev.workItems.map(x=>x.id===item.id?{...x,title:editTitle.trim(),description:editDescription,assignee:editAssignee.trim()||'Demo User',status:editStatus,priority:editPriority,updated:sampleDate}:x),history:['Work Item 편집: '+item.id,...prev.history]}))
    setItemEditing(false);announce('변경 사항이 저장되었습니다.');advance('edit-item')
  }
  const setItemStatus=(status:WorkStatus)=>{
    if(!item)return
    setData(prev=>({...prev,workItems:prev.workItems.map(x=>x.id===item.id?{...x,status,updated:sampleDate}:x),history:['상태 변경: '+item.id+' / '+status,...prev.history]}))
    announce('상태: '+status);if(status!==item.status)advance('item-status')
  }
  const addComment=()=>{
    if(!item||!comment.trim())return
    setData(prev=>({...prev,workItems:prev.workItems.map(x=>x.id===item.id?{...x,comments:[...x.comments,comment.trim()]}:x),history:['댓글: '+item.id,...prev.history]}))
    setComment('');announce('댓글을 추가했습니다.');advance('comment-item')
  }
  const addLink=()=>{
    if(!item||!linkTarget||linkTarget===item.id)return
    // In Polarion a Test Case "verifies" a Requirement; store that relationship direction.
    const reverse=linkRole==='verifies'&&item.type==='Requirement'&&byId(linkTarget)?.type==='Test Case'
    const source=reverse?linkTarget:item.id
    const target=reverse?item.id:linkTarget
    if(data.links.some(l=>l.source===source&&l.target===target&&l.role===linkRole)){announce('이미 존재하는 링크입니다.');return}
    setData(prev=>({...prev,links:[...prev.links,{source,target,role:linkRole}],history:[source+' → '+target+' 링크 연결',...prev.history]}))
    setShowLink(false);announce('Work Item 링크를 생성했습니다.');advance('create-link')
  }
  const selectDoc=(id:string)=>{
    const d=data.documents.find(x=>x.id===id);setSelectedDoc(id);setSelectedSection(d?.sections[0]?.id||'');setDocEditing(false);advance('select-doc')
  }
  const createDoc=()=>{
    if(!docName.trim())return
    const id='DOC-'+String(Math.max(0,...data.documents.map(d=>Number(d.id.split('-')[1])||0))+1).padStart(3,'0')
    const d:PolarionDoc={id,title:docName.trim(),space:'Default Space',status:'Draft',sections:[{id:'sec-1',heading:'1. 시작',body:'새로 만든 학습용 문서입니다.'}]}
    setData(prev=>({...prev,documents:[...prev.documents,d],history:['LiveDoc 생성: '+id,...prev.history]}))
    setSelectedDoc(id);setSelectedSection('sec-1');setDocName('');setNewDocOpen(false);announce('LiveDoc 생성 완료');advance('create-doc')
  }
  const saveDoc=()=>{
    if(!doc||!docSection)return
    setData(prev=>({...prev,documents:prev.documents.map(d=>d.id===doc.id?{...d,sections:d.sections.map(s=>s.id===docSection.id?{...s,heading:docTitle||s.heading,body:docBody}:s)}:d),history:['LiveDoc 내용 수정: '+doc.id,...prev.history]}))
    setDocEditing(false);announce('문서 내용을 저장했습니다.');advance('edit-doc')
  }
  const addDocWorkItem=()=>{
    if(!doc||!docAttach)return
    const id='sec-'+String(Date.now())
    setData(prev=>({...prev,documents:prev.documents.map(d=>d.id===doc.id?{...d,sections:[...d.sections,{id,heading:'연결된 Work Item · '+docAttach,body:'Work Item을 참조하는 문서 섹션입니다.',workItemId:docAttach}]}:d),history:['LiveDoc에 Work Item 삽입: '+docAttach,...prev.history]}))
    setSelectedSection(id);announce('Work Item을 문서에 연결했습니다.');advance('add-doc-item')
  }
  const addPlan=()=>{
    if(!newPlanName.trim())return
    const id='PLAN-'+String(data.plans.length+1).padStart(2,'0')
    setData(prev=>({...prev,plans:[...prev.plans,{id,title:newPlanName.trim(),start:sampleDate,end:'2026-12-31',status:'Not Started',workItemIds:[]}],history:['Plan 생성: '+id,...prev.history]}))
    setSelectedPlan(id);setNewPlanName('');setNewPlanOpen(false);announce('새 Plan을 만들었습니다.');advance('create-plan')
  }
  const attachPlan=()=>{
    if(!plan||plan.workItemIds.includes(planAttach))return
    setData(prev=>({...prev,plans:prev.plans.map(p=>p.id===plan.id?{...p,workItemIds:[...p.workItemIds,planAttach]}:p),history:['Plan에 Work Item 추가: '+planAttach,...prev.history]}))
    announce('Plan 범위에 추가했습니다.');advance('attach-plan')
  }
  const updatePlanStatus=()=>{
    if(!plan)return
    const status=plan.status==='Not Started'?'In Progress':plan.status==='In Progress'?'Finished':'Not Started'
    setData(prev=>({...prev,plans:prev.plans.map(p=>p.id===plan.id?{...p,status}:p),history:['Plan 상태 변경: '+status,...prev.history]}))
    announce('Plan 상태: '+status);advance('plan-status')
  }
  const addRun=()=>{
    if(!newRunName.trim())return
    const id='TR-'+String(data.testRuns.length+1).padStart(3,'0')
    setData(prev=>({...prev,testRuns:[...prev.testRuns,{id,title:newRunName.trim(),template:'Manual Test',date:sampleDate,cases:{'DP-203':'Not Run'}}],history:['Test Run 생성: '+id,...prev.history]}))
    setSelectedRun(id);setRunAttach('DP-201');setNewRunName('');setNewRunOpen(false);announce('Test Run을 생성했습니다.');advance('create-run')
  }
  const recordTest=(id:string,status:TestResult)=>{
    if(!run)return
    setData(prev=>({...prev,testRuns:prev.testRuns.map(r=>r.id===run.id?{...r,cases:{...r.cases,[id]:status}}:r),history:[run.id+' / '+id+' 시험 결과: '+status,...prev.history]}))
    setSelectedCase(id);announce('시험 결과: '+status)
    if(status!=='Not Run')advance(status==='Passed'?'record-pass':status==='Failed'?'record-failure':'record-test')
  }
  const attachCase=()=>{
    if(!run||!runAttach||run.cases[runAttach])return
    setData(prev=>({...prev,testRuns:prev.testRuns.map(r=>r.id===run.id?{...r,cases:{...r.cases,[runAttach]:'Not Run'}}:r),history:['Test Run에 Test Case 추가: '+runAttach,...prev.history]}))
    announce('Test Case를 추가했습니다.');advance('attach-case')
  }
  const saveTestNote=()=>{
    if(!run||!selectedCase)return
    setData(prev=>({...prev,testRuns:prev.testRuns.map(r=>r.id===run.id?{...r,notes:{...r.notes,[selectedCase]:runNote.trim()}}:r),history:['Test evidence updated: '+run.id+' / '+selectedCase,...prev.history]}))
    announce('시험 수행 메모가 저장되었습니다.');advance('save-test-note')
  }
  const createDefect=()=>{
    if(!run||!selectedCase||run.cases[selectedCase]!=='Failed')return
    const id='DP-'+(Math.max(600,...data.workItems.map(i=>Number(i.id.split('-')[1])||0))+1)
    const test=byId(selectedCase)
    const newItem:WorkItem={id,title:'시험 실패: '+(test?.title||selectedCase),type:'Defect',status:'Open',priority:'High',assignee:'Demo QA',description:run.title+' / '+selectedCase+' 시험 실패를 검토하기 위한 학습용 결함입니다.'+(runNote.trim()?' 실행 메모: '+runNote.trim():''),updated:sampleDate,comments:[]}
    setData(prev=>({...prev,workItems:[newItem,...prev.workItems],links:[...prev.links,{source:id,target:selectedCase,role:'relates to'}],history:['Defect '+id+' created from '+run.id+' / '+selectedCase,...prev.history]}))
    setSelected(id);setSearch('');setStatusFilter('All');setTypeFilter('All')
    advance('create-defect');go('work-items');announce('Defect '+id+' 생성 및 테스트 링크 연결 완료')
  }
  const reset=(ask=true)=>{
    if(ask&&!window.confirm('Polarion 데모 데이터와 실습 진행을 처음 상태로 되돌릴까요?'))return
    course.reset();setBaselineId('');setBaselineCompare(false);setReportStatus('All')
    setData(seedPolarion());setSection('home');setSelected('DP-101');setSelectedDoc('DOC-001');setSelectedSection('sec-1');setSelectedPlan('PLAN-01');setSelectedRun('TR-001');setSelectedCase('DP-201')
    setSearch('');setTypeFilter('All');setWatching([]);setItemTab('details');announce('데모 데이터 초기화 완료')
  }
  const openCreate=(type:WorkType='Requirement')=>{
    setCreateType(type);setCreateOpen(true);setCreateTitle('');setCreateDescription('')
  }
  const startReview=()=>{
    if(!item||item.status==='In Review')return
    setData(prev=>({...prev,workItems:prev.workItems.map(w=>w.id===item.id?{...w,status:'In Review' as WorkStatus,updated:sampleDate}:w),history:['Review requested for '+item.id+' by Demo User',...prev.history]}))
    setItemTab('activity');announce(item.id+' 검토 요청 완료');advance('submit-item-review')
  }
  const resolveReview=(approve:boolean)=>{
    if(!item||item.status!=='In Review')return
    const status:WorkStatus=approve?'Approved':'Open'
    setData(prev=>({...prev,workItems:prev.workItems.map(w=>w.id===item.id?{...w,status,updated:sampleDate}:w),history:[(approve?'Approved ':'Changes requested for ')+item.id+' by Demo Reviewer',...prev.history]}))
    setItemTab('activity');announce(approve?'검토 승인 완료':'수정 요청 완료');advance(approve?'approve-item':'rework-item')
  }
  const toggleWatching=()=>{
    if(!item)return
    setWatching(old=>old.includes(item.id)?old.filter(id=>id!==item.id):[...old,item.id])
    announce(watching.includes(item.id)?'관심 항목에서 해제했습니다.':'관심 항목에 추가했습니다.');advance('watch-item')
  }
  const attachItemFile=()=>{
    if(!item||!fileLabel.trim())return
    const name=fileLabel.trim().replace(/[\\/]/g,'_')
    setData(prev=>({...prev,workItems:prev.workItems.map(w=>w.id===item.id?{...w,attachments:[...(w.attachments||[]),name]}:w),history:['Attachment added to '+item.id+': '+name,...prev.history]}))
    setFileLabel('');announce('파일명을 등록했습니다. 실제 파일은 업로드되지 않습니다.');advance('attach-item-file')
  }
  const chooseQuickCreate=(kind:'work'|'doc'|'run'|'plan')=>{
    setQuickCreateOpen(false)
    if(kind==='work'){openCreate();return}
    if(kind==='doc'){go('documents');setNewDocOpen(true)}
    if(kind==='run'){go('test-runs');setNewRunOpen(true)}
    if(kind==='plan'){go('plans');setNewPlanOpen(true)}
  }
  const createBaseline=()=>{
    if(!baselineName.trim())return
    const id='BASE-'+String(data.baselines.length+1).padStart(3,'0')
    const snapshot={id,title:baselineName.trim(),createdAt:new Date().toLocaleString('ko-KR'),items:data.workItems.map(w=>({id:w.id,title:w.title,status:w.status,priority:w.priority,assignee:w.assignee})),linkCount:data.links.length}
    setData(old=>({...old,baselines:[...old.baselines,snapshot],history:['Baseline 생성: '+id,...old.history]}))
    setBaselineId(id);setBaselineName('');setBaselineCompare(false)
    announce(id+' 기준선을 생성했습니다.');advance('create-baseline')
  }
  const updateDocStatus=(newStatus:'In Review'|'Approved')=>{
    if(!doc||doc.status===newStatus)return
    setData(old=>({...old,documents:old.documents.map(d=>d.id===doc.id?{...d,status:newStatus}:d),history:['LiveDoc '+doc.id+' → '+newStatus,...old.history]}))
    announce('LiveDoc 상태: '+newStatus);advance(newStatus==='In Review'?'doc-review':'doc-approve')
  }
  const renderBaselines=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / VERSION HISTORY</span><h2>Baselines</h2><p>작업 상태를 기준선에 저장한 뒤 현재 프로젝트와 비교하는 학습용 기능입니다.</p></div></div>
    <div className="pl-creation-bar"><input aria-label="새 Baseline 이름" value={baselineName} onChange={e=>setBaselineName(e.target.value)} placeholder="예: Safety milestone"/><button className="pl-primary" onClick={createBaseline} disabled={!baselineName.trim()}><Layers size={15}/> Save Snapshot</button></div>
    <div className="pl-data-layout"><section className="pl-card pl-entity-list"><div className="pl-panel-title"><strong>Project Baselines ({data.baselines.length})</strong></div>{data.baselines.map(b=><button className={baselineId===b.id?'active':''} key={b.id} onClick={()=>{setBaselineId(b.id);setBaselineCompare(false);advance('select-baseline')}}><Layers size={18}/><span><strong>{b.title}</strong><small>{b.id} · {b.createdAt}</small></span><ChevronRight size={14}/></button>)}{!data.baselines.length&&<p className="pl-muted" style={{padding:16}}>저장된 기준선이 없습니다. 위에서 첫 기준선을 만들어 보세요.</p>}</section>
    <section className="pl-card pl-entity-body">{data.baselines.filter(b=>b.id===baselineId).map(b=><div key={b.id}><div className="pl-entity-title"><div><small>{b.id} · Snapshot · {b.createdAt}</small><h3>{b.title}</h3></div></div><div className="pl-plan-properties"><div><span>Work Items</span><strong>{b.items.length}</strong></div><div><span>Links</span><strong>{b.linkCount}</strong></div></div><button className="pl-primary" onClick={()=>{setBaselineCompare(true);advance('compare-baseline')}}>Compare with Current <ArrowRight size={15}/></button>
      {baselineCompare&&<div className="pl-table-scroll"><table className="pl-table"><thead><tr><th>ID</th><th>Snapshot Status</th><th>Current Status</th><th>Change</th></tr></thead><tbody>{b.items.map(i=>{const now=byId(i.id);return <tr key={i.id}><td>{i.id} · {i.title}</td><td>{i.status}</td><td>{now?.status||'Deleted'}</td><td>{now?.status===i.status?'Unchanged':'Changed'}</td></tr>})}</tbody></table></div>}
    </div>)}</section></div><div className="pl-inline-note"><CircleHelp size={15}/> 실제 Polarion 기준선/리비전 기능과 독립된 학습용 Work Item 상태 스냅샷입니다. 이 데모는 내용 전체 또는 서버의 SVN Baseline을 저장하지 않습니다.</div>
  </div>
  const renderReports=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / REPORTS</span><h2>Project Reports</h2><p>현재 데모 데이터의 요구사항·작업·시험 상태를 동적으로 집계합니다.</p></div><button className="pl-primary" onClick={()=>{setReportRefresh(n=>n+1);advance('open-reports')}}><RefreshCw size={15}/> Refresh Metrics</button></div>
    <div className="pl-report-filter"><label>Status <select value={reportStatus} onChange={e=>{setReportStatus(e.target.value);advance('report-filter')}}><option>All</option>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label><small>Last refresh: {reportRefresh?'Updated in this session':'Current browser data'}</small></div>
    <div className="pl-home-overview">{[{title:'ALL WORK ITEMS',count:data.workItems.filter(x=>reportStatus==='All'||x.status===reportStatus).length},{title:'REQUIREMENTS',count:data.workItems.filter(x=>x.type==='Requirement'&&(reportStatus==='All'||x.status===reportStatus)).length},{title:'DEFECTS',count:data.workItems.filter(x=>x.type==='Defect'&&(reportStatus==='All'||x.status===reportStatus)).length},{title:'TEST CASES',count:data.workItems.filter(x=>x.type==='Test Case'&&(reportStatus==='All'||x.status===reportStatus)).length}].map(x=><div key={x.title}><span>{x.title}</span><strong>{x.count}</strong><small>Current session</small></div>)}</div>
    <div className="pl-card pl-report-section"><h3>Work Item by Type</h3>{TYPES.map(type=><div className="pl-report-line" key={type}><span>{type}</span><div><i style={{width:(data.workItems.filter(w=>w.type===type&&(reportStatus==='All'||w.status===reportStatus)).length/Math.max(data.workItems.length,1)*100)+'%'}}/></div><strong>{data.workItems.filter(w=>w.type===type&&(reportStatus==='All'||w.status===reportStatus)).length}</strong></div>)}<h3>Test Execution</h3><div className="pl-run-stats">{RESULTS.map(result=><div key={result}><strong>{data.testRuns.flatMap(r=>Object.values(r.cases)).filter(x=>x===result).length}</strong><small>{result}</small></div>)}</div></div>
    <div className="pl-inline-note"><CircleHelp size={15}/> 이 보고서는 로컬 예제 데이터를 집계한 단순 학습용 화면이며 공식 Polarion 리포트 엔진이나 실제 데이터 소스가 아닙니다.</div>
  </div>
  const renderHome=()=> <div className="pl-home">
    <div className="pl-page-heading"><div><span>PROJECT HOME · DRIVE PILOT</span><h2>Drive Pilot Project</h2><p>요구사항부터 검증 결과까지 연결하는 제품 개발 ALM 학습 프로젝트</p></div><span className="pl-demo-tag">Sample Project / Training</span></div>
    <div className="pl-home-overview"><div><span>WORK ITEMS</span><strong>{data.workItems.length}</strong><small>Requirements · Tests · Defects</small></div><div><span>REQUIREMENTS</span><strong>{requirements.length}</strong><small>요구사항</small></div><div><span>TEST RUNS</span><strong>{data.testRuns.length}</strong><small>검증 실행 단위</small></div><div><span>TRACE LINKS</span><strong>{data.links.length}</strong><small>연결된 관계</small></div></div>
    <div className="pl-home-columns">
      <section className="pl-card pl-home-welcome"><header><h3><Home size={17}/> Project Overview</h3><IconAction title="학습 안내" onClick={()=>go('guide')}><CircleHelp size={16}/></IconAction></header><div className="pl-home-body">
        <h3>Welcome to Drive Pilot</h3><p>Polarion에서 요구사항을 Work Item으로 작성하고, LiveDoc에서 공유하고, Test Case로 검증하는 전체 업무 흐름을 직접 체험하세요.</p>
        <div className="pl-home-shortcuts">{[{id:'work-items',title:'Browse Work Items',icon:SquareCheck},{id:'documents',title:'Open Documents',icon:FileText},{id:'test-runs',title:'Execute Test Run',icon:TestTube2},{id:'traceability',title:'Traceability',icon:Network}].map(n=><button key={n.id} onClick={()=>go(n.id as PolarionSection)}><n.icon size={19}/>{n.title}<ArrowRight size={14}/></button>)}</div>
      </div></section>
      <section className="pl-card pl-home-work"><header><h3><SquareCheck size={17}/> My Work Items</h3><button onClick={()=>go('work-items')}>Open <ArrowRight size={14}/></button></header><div>{data.workItems.filter(i=>i.status!=='Done').slice(0,5).map(i=><button key={i.id} className="pl-home-work-row" onClick={()=>{setSelected(i.id);go('work-items')}}><ItemIcon type={i.type}/><span><strong>{i.title}</strong><small>{i.id} · {i.type}</small></span>{labelStatus(i.status)}</button>)}</div></section>
      <section className="pl-card pl-home-docs"><header><h3><FileText size={17}/> Documents & Pages</h3><button onClick={()=>go('documents')}>Browse <ArrowRight size={14}/></button></header>{data.documents.map(d=><button key={d.id} onClick={()=>{selectDoc(d.id);go('documents')}}><FileText size={21}/><span><strong>{d.title}</strong><small>Space: {d.space} · {d.status}</small></span><ChevronRight size={14}/></button>)}</section>
      <section className="pl-card pl-home-progress"><header><h3><TestTube2 size={17}/> Test Progress</h3><button onClick={()=>go('test-runs')}>Test Runs <ArrowRight size={14}/></button></header>{data.testRuns.map(r=>{const stats=Object.values(r.cases),done=stats.filter(x=>x!=='Not Run').length;return <button className="pl-progress-row" key={r.id} onClick={()=>{setSelectedRun(r.id);go('test-runs')}}><span><strong>{r.title}</strong><small>{done} / {stats.length} executed</small></span><span className="pl-bar"><i style={{width:(done/Math.max(1,stats.length)*100)+'%'}}/></span></button>})}</section>
    </div>
    <div className="pl-home-guide"><BookOpen size={21}/><span><strong>Learn by doing</strong><small>사용자 기능 {polarionCourse.length}개 단계를 순서대로 직접 수행합니다. 진행 위치는 자동 저장됩니다.</small></span><button onClick={course.start}>전체 실습 시작 <ArrowRight size={15}/></button></div>
  </div>
  const renderItemDetails=()=>{
    if(!item)return <div className="pl-empty">Work Item을 선택하세요.</div>
    const related=data.links.filter(l=>l.source===item.id||l.target===item.id)
    return <div className="pl-item-details">
      <div className="pl-item-title"><ItemIcon type={item.type}/><div><small>DRIVE PILOT / {item.type.toUpperCase()} / {item.id}</small><h3>{item.id} – {item.title}</h3></div><div className="pl-title-meta"><span>Updated {item.updated}</span>{labelStatus(item.status)}</div></div>
      <div className="pl-commandbar"><strong>WORK ITEM EDITOR</strong><div>{itemEditing?<><button onClick={saveItem}><Save size={15}/> Save</button><button onClick={()=>setItemEditing(false)}><X size={15}/> Cancel</button></>:<><button onClick={()=>{setItemTab('details');setItemEditing(true)}}><Pencil size={15}/> Edit</button><button onClick={()=>{setItemTab('details');setShowLink(true)}}><Link2 size={15}/> Link</button><button onClick={toggleWatching}><Check size={15}/> {watching.includes(item.id)?'Watching':'Watch'}</button>{item.status==='In Review'?<><button onClick={()=>resolveReview(true)}><CheckCircle2 size={15}/> Approve</button><button onClick={()=>resolveReview(false)}><RefreshCw size={15}/> Rework</button></>:<button onClick={startReview}><ShieldCheck size={15}/> Request Review</button>}</>}</div></div>
      <div className="pl-item-tabs"><button className={itemTab==='details'?'active':''} onClick={()=>{setItemTab('details');advance('show-fields')}}>Fields · Description · Links</button><button className={itemTab==='activity'?'active':''} onClick={()=>{setItemTab('activity');advance('show-activity')}}>Review · History · Attachments</button></div>
      {itemTab==='details'?<>
      {itemEditing?<div className="pl-edit-fields"><label>Title<input value={editTitle} onChange={e=>setEditTitle(e.target.value)}/></label><label>Assignee<input value={editAssignee} onChange={e=>setEditAssignee(e.target.value)}/></label><div className="pl-two-fields"><label>Status<select value={editStatus} onChange={e=>setEditStatus(e.target.value as WorkStatus)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label><label>Priority<select value={editPriority} onChange={e=>setEditPriority(e.target.value as typeof editPriority)}>{['High','Medium','Low'].map(s=><option key={s}>{s}</option>)}</select></label></div><label>Description<textarea rows={4} value={editDescription} onChange={e=>setEditDescription(e.target.value)}/></label></div>:<><div className="pl-property-grid">{[['Type',item.type],['Status',item.status],['Priority',item.priority],['Assignee',item.assignee],['Updated',item.updated]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><h4 className="pl-section-title">Description</h4><p className="pl-description">{item.description}</p><div className="pl-status-quick"><label>Quick status change</label><select aria-label="빠른 상태 전환" value={item.status} onChange={e=>setItemStatus(e.target.value as WorkStatus)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div></>}
      <div className="pl-section-heading"><h4><Link2 size={15}/> Linked Work Items</h4><button onClick={()=>setShowLink(v=>!v)}><Plus size={14}/> Add Link</button></div>
      {related.length?related.map((l,i)=><div key={i} className="pl-linked-row"><Link2 size={14}/><span><small>{l.role}</small><strong>{l.source===item.id?l.target:l.source} · {byId(l.source===item.id?l.target:l.source)?.title}</strong></span><button title="연결 삭제" aria-label="연결 삭제" onClick={()=>{setData(prev=>({...prev,links:prev.links.filter(x=>x!==l)}));announce('연결을 해제했습니다.');advance('remove-link')}}><X size={14}/></button></div>):<p className="pl-muted">연결된 Work Item이 없습니다.</p>}
      {showLink&&<div className="pl-inline-form"><label>Relation<select value={linkRole} onChange={e=>setLinkRole(e.target.value as typeof linkRole)}>{['verifies','relates to','depends on','implements'].map(x=><option key={x}>{x}</option>)}</select></label><label>Target<select value={linkTarget} onChange={e=>setLinkTarget(e.target.value)}>{data.workItems.filter(x=>x.id!==item.id).map(x=><option value={x.id} key={x.id}>{x.id} · {x.title}</option>)}</select></label><button className="pl-primary" onClick={addLink}><Plus size={14}/> Add Link</button></div>}
      <div className="pl-section-heading"><h4><MessageSquare size={15}/> Comments ({item.comments.length})</h4></div>{item.comments.map((c,i)=><div className="pl-comment" key={i}><strong>Demo User</strong><p>{c}</p></div>)}
      <div className="pl-comment-input"><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment" onKeyDown={e=>{if(e.key==='Enter')addComment()}}/><button onClick={addComment} disabled={!comment.trim()}>Add</button></div>
      </>:<div className="pl-activity-panel">
        <section><h4><ShieldCheck size={16}/> Review and Approval</h4><p>학습용 승인 단계입니다. 실제 Polarion 워크플로는 프로젝트 설정에 따라 달라집니다.</p>
          <div className="pl-review-flow"><span className={item.status!=='Open'?'checked':''}>Open / Draft</span><ArrowRight size={15}/><span className={item.status==='In Review'?'current':''}>In Review</span><ArrowRight size={15}/><span className={item.status==='Approved'?'checked':''}>Approved</span></div>
          <div className="pl-review-buttons">{item.status==='In Review'?<><button className="pl-primary" onClick={()=>resolveReview(true)}><CheckCircle2 size={15}/> Approve</button><button className="pl-secondary" onClick={()=>resolveReview(false)}><RefreshCw size={15}/> Request Rework</button></>:<button className="pl-primary" onClick={startReview}><ShieldCheck size={15}/> Request Review</button>}</div>
        </section>
        <section><h4><History size={16}/> Work Item History</h4>
          {(data.history.filter(h=>h.includes(item.id)).length?data.history.filter(h=>h.includes(item.id)):['Example item '+item.id+' loaded']).map((line,i)=><div className="pl-history-entry" key={i}><Clock size={14}/><span>{line}</span><small>Demo session</small></div>)}
        </section>
        <section><h4><FileText size={16}/> Attachments</h4>
          {(item.attachments||[]).map((file,i)=><div className="pl-attachment" key={i}><FileText size={15}/>{file}<button title="파일명 연결 해제" onClick={()=>setData(prev=>({...prev,workItems:prev.workItems.map(w=>w.id===item.id?{...w,attachments:(w.attachments||[]).filter((_,index)=>index!==i)}:w)}))}><X size={14}/></button></div>)}
          <div className="pl-comment-input"><input value={fileLabel} onChange={e=>setFileLabel(e.target.value)} placeholder="File label (e.g. test-plan.pdf)" onKeyDown={e=>{if(e.key==='Enter')attachItemFile()}}/><button onClick={attachItemFile} disabled={!fileLabel.trim()}>Add</button></div><p className="pl-muted">파일 이름만 기록하며 실제 콘텐츠를 업로드하지 않습니다.</p>
        </section>
      </div>}
    </div>
  }
  const renderWorkItems=()=> <div className="pl-view">
    <div className="pl-page-heading"><div><span>DRIVE PILOT / TRACKER</span><h2>Work Items</h2><p>Requirement · Test Case · Defect · Task · Change Request</p></div><button className="pl-primary" onClick={()=>openCreate('Requirement')}><Plus size={15}/> Create Work Item</button></div>
    <div className="pl-work-grid"><section className="pl-card pl-work-list">
      <div className="pl-list-topbar"><div className="pl-view-select"><button className={view==='Table'?'selected':''} onClick={()=>{setView('Table');advance('table-view')}}><List size={16}/> Table</button><button className={view==='Tree'?'selected':''} onClick={()=>{setView('Tree');advance('tree-view')}}><GitBranch size={15}/> Tree</button></div><div className="pl-spacer"/><strong>{filtered.length} Items</strong><IconAction title="필터 초기화" onClick={()=>{setSearch('');setTypeFilter('All');setStatusFilter('All');advance('clear-filters')}}><RefreshCw size={15}/></IconAction></div>
      <div className="pl-list-search"><Search size={17}/><input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value.trim())advance("search-items")}} placeholder="Search Work Items by title or ID"/><select aria-label="종류 필터" value={typeFilter} onChange={e=>{setTypeFilter(e.target.value as typeof typeFilter);if(e.target.value!=='All')advance('filter-type')}}><option>All</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select><select aria-label="상태 필터" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);if(e.target.value!=='All')advance('filter-status')}}><option>All</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
      <div className="pl-table-scroll"><table className="pl-table"><thead><tr><th>Key / ID</th><th>Title</th><th>Type</th><th>Status</th><th>Assignee</th></tr></thead><tbody>{visibleRows.map(({item:i,level,hasChildren})=><tr key={i.id} tabIndex={0} className={selected===i.id?'active':''} onKeyDown={e=>{if(e.key==='Enter')selectItem(i.id)}} onClick={()=>selectItem(i.id)}><td>{i.id}</td><td><span className="pl-table-title" style={{paddingLeft:view==='Tree'?level*21:0}}>{view==='Tree'&&(hasChildren?<button className="pl-tree-toggle" aria-expanded={treeOpen.includes(i.id)} aria-label={treeOpen.includes(i.id)?'하위 항목 접기':'하위 항목 펼치기'} onClick={e=>{e.stopPropagation();setTreeOpen(rows=>rows.includes(i.id)?rows.filter(x=>x!==i.id):[...rows,i.id]);advance('tree-toggle')}}>{treeOpen.includes(i.id)?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</button>:<span className="pl-tree-spacer"/>)}<ItemIcon type={i.type}/><strong>{i.title}</strong></span></td><td>{i.type}</td><td>{labelStatus(i.status)}</td><td>{i.assignee}</td></tr>)}</tbody></table>{filtered.length===0&&<div className="pl-empty">검색 조건에 맞는 Work Item이 없습니다.</div>}</div>
      {view==='Tree'&&<div className="pl-table-hint"><GitBranch size={14}/> Tree View: 링크 방향에 따라 하위 항목을 배치했습니다. 화살표로 펼치고 접을 수 있습니다.</div>}
    </section><section className="pl-card pl-work-detail"><div className="pl-work-detail-heading"><SquareCheck size={16}/> SELECTED WORK ITEM <span>{selected} · 항목 선택 후 아래에서 편집</span></div>{renderItemDetails()}</section></div>
  </div>
  const renderDocuments=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / DOCUMENTS</span><h2>Documents & Pages</h2><p>LiveDocs · Spaces · Work Items in Documents</p></div><button className="pl-primary" onClick={()=>setNewDocOpen(v=>!v)}><Plus size={15}/> Create Document</button></div>
    {newDocOpen&&<div className="pl-creation-bar"><input placeholder="새 문서 이름" value={docName} onChange={e=>setDocName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')createDoc()}}/><button className="pl-primary" onClick={createDoc} disabled={!docName.trim()}>Create</button><button onClick={()=>setNewDocOpen(false)}>Cancel</button></div>}
    <div className="pl-doc-layout"><aside className="pl-card pl-doc-tree"><div className="pl-panel-title"><strong>Spaces</strong><span>DRIVE PILOT</span></div><div className="pl-tree-folder"><Folder size={17}/> Project Spaces</div>{[...new Set(data.documents.map(d=>d.space))].map(space=><div key={space}><div className="pl-tree-space"><ChevronDown size={14}/><Folder size={16}/> {space}</div>{data.documents.filter(d=>d.space===space).map(d=><button key={d.id} data-doc-status={d.status} className={selectedDoc===d.id?'selected':''} onClick={()=>selectDoc(d.id)}><FileText size={16}/>{d.title}</button>)}</div>)}</aside>
      <section className="pl-card pl-doc-editor"><div className="pl-document-nav"><span><Folder size={15}/> {doc?.space||'Default Space'} <ChevronRight size={13}/></span><strong>{doc?.title}</strong><span className="pl-spacer"/><span className="pl-demo-tag">{doc?.status}</span></div>
        <div className="pl-document-toolbar"><strong><FileText size={18}/> {doc?.title}</strong><div>{doc?.status!=='In Review'&&<button onClick={()=>updateDocStatus('In Review')}><ShieldCheck size={15}/> Request Review</button>}{doc?.status==='In Review'&&<button onClick={()=>updateDocStatus('Approved')}><CheckCircle2 size={15}/> Approve</button>}<button onClick={()=>{if(!docSection)return;setDocEditing(true);setDocTitle(docSection.heading)}}><Pencil size={15}/> Edit Section</button><button onClick={addDocWorkItem}><Plus size={15}/> Add Work Item</button></div></div>
        <div className="pl-document-body">{doc?.sections.map(s=><section className={'pl-doc-section '+(selectedSection===s.id?'selected':'')} key={s.id} onClick={()=>{setSelectedSection(s.id);setDocEditing(false)}}>
          <h3>{s.heading}</h3><p>{s.body}</p>{s.workItemId&&<button className="pl-embedded-item" onClick={e=>{e.stopPropagation();setSelected(s.workItemId!);go('work-items')}}><ItemIcon type={byId(s.workItemId)?.type||'Requirement'}/><span><strong>{byId(s.workItemId)?.id}</strong> {byId(s.workItemId)?.title}</span><ChevronRight size={15}/></button>}
        </section>)}</div>
      </section>
      <aside className="pl-card pl-doc-properties"><div className="pl-panel-title"><strong>Document Editor</strong><span>PROPERTIES</span></div><p className="pl-muted">문서 섹션을 선택하면 이 영역에서 편집할 수 있습니다.</p>
        {docSection&&<div className="pl-property-box"><strong>{docSection.heading}</strong><p>{docSection.workItemId?'Linked: '+docSection.workItemId:'Text Section'}</p></div>}
        {docEditing&&docSection&&<div className="pl-edit-fields"><label>Heading<input value={docTitle} onChange={e=>setDocTitle(e.target.value)}/></label><label>Body<textarea rows={7} value={docBody} onChange={e=>setDocBody(e.target.value)}/></label><div className="pl-command-actions"><button className="pl-primary" onClick={saveDoc}><Save size={14}/> Save</button><button onClick={()=>setDocEditing(false)}>Cancel</button></div></div>}
        {!docEditing&&<button className="pl-secondary pl-full" onClick={()=>{if(!docSection)return;setDocTitle(docSection.heading);setDocEditing(true)}}><Pencil size={14}/> Edit selected section</button>}
        <div className="pl-doc-attach"><strong><Link2 size={14}/> Insert Work Item</strong><select value={docAttach} onChange={e=>setDocAttach(e.target.value)}>{data.workItems.map(i=><option key={i.id} value={i.id}>{i.id} · {i.title}</option>)}</select><button className="pl-secondary" onClick={addDocWorkItem}><Plus size={14}/> Add to Document</button></div>
        <div className="pl-inline-note"><CircleHelp size={15}/> 실제 Polarion LiveDoc은 문서 편집과 Work Item의 구조적 통합을 지원합니다. 여기서는 그 흐름만 학습합니다.</div>
      </aside></div>
  </div>
  const renderPlans=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / PLANNING</span><h2>Plans</h2><p>Release · Iteration · Work Items</p></div><button className="pl-primary" onClick={()=>setNewPlanOpen(v=>!v)}><Plus size={15}/> Create Plan</button></div>
    {newPlanOpen&&<div className="pl-creation-bar"><input placeholder="예: Sprint 3" value={newPlanName} onChange={e=>setNewPlanName(e.target.value)}/><button className="pl-primary" disabled={!newPlanName.trim()} onClick={addPlan}>Create</button><button onClick={()=>setNewPlanOpen(false)}>Cancel</button></div>}
    <div className="pl-data-layout"><section className="pl-card pl-entity-list"><div className="pl-panel-title"><strong>Plans ({data.plans.length})</strong><CalendarDays size={16}/></div>{data.plans.map(p=><button className={selectedPlan===p.id?'active':''} key={p.id} onClick={()=>{setSelectedPlan(p.id);advance('select-plan')}}><CalendarDays size={20}/><span><strong>{p.title}</strong><small>{p.start} — {p.end}</small></span>{labelStatus(p.status)}</button>)}</section>
      <section className="pl-card pl-entity-body">{plan&&<><div className="pl-entity-title"><div><small>{plan.id} · Project Plan</small><h3>{plan.title}</h3></div>{labelStatus(plan.status)}</div><div className="pl-plan-properties"><div><span>Start Date</span><strong>{plan.start}</strong></div><div><span>End Date</span><strong>{plan.end}</strong></div><div><span>Planned Work Items</span><strong>{plan.workItemIds.length}</strong></div></div>
        <div className="pl-section-heading"><h4>Plan Progress</h4><button onClick={updatePlanStatus}><RefreshCw size={14}/> Change Status</button></div><div className="pl-plan-progress"><div style={{width:plan.workItemIds.filter(finished).length/Math.max(plan.workItemIds.length,1)*100+'%'}}/><span>{plan.workItemIds.filter(finished).length} / {plan.workItemIds.length} completed</span></div>
        <div className="pl-section-heading"><h4>Planned Work Items</h4></div>{plan.workItemIds.map(id=><div className="pl-plan-item" key={id}><ItemIcon type={byId(id)?.type||'Task'}/><span><strong>{id} · {byId(id)?.title}</strong><small>{byId(id)?.type}</small></span>{labelStatus(byId(id)?.status||'Open')}<button aria-label={id+' Plan에서 제거'} onClick={()=>{setData(prev=>({...prev,plans:prev.plans.map(p=>p.id===plan.id?{...p,workItemIds:p.workItemIds.filter(x=>x!==id)}:p)}));advance('remove-plan-item')}}><X size={14}/></button></div>)}
        <div className="pl-inline-form"><label>Add Work Item<select value={planAttach} onChange={e=>setPlanAttach(e.target.value)}>{data.workItems.map(i=><option key={i.id} value={i.id}>{i.id} · {i.title}</option>)}</select></label><button onClick={attachPlan} className="pl-primary" disabled={plan.workItemIds.includes(planAttach)}><Plus size={15}/> {plan.workItemIds.includes(planAttach)?'Already added':'Add to Plan'}</button></div>
      </>}</section></div>
  </div>
  const renderRuns=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / TEST MANAGEMENT</span><h2>Test Runs</h2><p>테스트 케이스 실행과 결과 기록</p></div><button className="pl-primary" onClick={()=>setNewRunOpen(v=>!v)}><Plus size={15}/> Create Test Run</button></div>
    {newRunOpen&&<div className="pl-creation-bar"><input placeholder="새 Test Run 이름" value={newRunName} onChange={e=>setNewRunName(e.target.value)}/><button className="pl-primary" onClick={addRun} disabled={!newRunName.trim()}>Create</button><button onClick={()=>setNewRunOpen(false)}>Cancel</button></div>}
    <div className="pl-data-layout"><section className="pl-card pl-entity-list"><div className="pl-panel-title"><strong>Test Runs ({data.testRuns.length})</strong><TestTube2 size={17}/></div>{data.testRuns.map(r=><button key={r.id} className={selectedRun===r.id?'active':''} onClick={()=>{setSelectedRun(r.id);advance('select-run')}}><TestTube2 size={20}/><span><strong>{r.title}</strong><small>{r.id} · {r.template}</small></span><ChevronRight size={15}/></button>)}</section>
      <section className="pl-card pl-entity-body">{run&&<><div className="pl-entity-title"><div><small>{run.id} · {run.template}</small><h3>{run.title}</h3></div><span className="pl-demo-tag">Manual Test</span></div>
        <div className="pl-run-stats">{RESULTS.map(result=><div key={result} className={'result-'+result.toLowerCase().replace(' ','-')}><strong>{Object.values(run.cases).filter(v=>v===result).length}</strong><small>{result}</small></div>)}</div>
        <div className="pl-section-heading"><h4>Test Records</h4><span>{Object.values(run.cases).filter(v=>v!=='Not Run').length} / {Object.keys(run.cases).length} executed</span></div>
        <div className="pl-table-scroll"><table className="pl-table pl-test-table"><thead><tr><th>Test Case</th><th>Result</th><th>Action</th></tr></thead><tbody>{Object.entries(run.cases).map(([id,result])=><tr key={id}><td><button className={'pl-test-case-button '+(selectedCase===id?'active':'')} onClick={()=>{setSelectedCase(id);setRunNote(run.notes?.[id]||'');advance('select-case')}}><span className="pl-test-id">{id}</span><strong>{byId(id)?.title||id}</strong></button></td><td>{labelStatus(result)}</td><td><select aria-label={id+' 실행 결과'} value={result} onChange={e=>recordTest(id,e.target.value as TestResult)}>{RESULTS.map(x=><option key={x}>{x}</option>)}</select></td></tr>)}</tbody></table></div>
        {selectedCase&&selectedCase in run.cases&&<div className="pl-test-step-detail">
          <div className="pl-section-heading"><h4><ClipboardCheck size={16}/> Manual Test Execution · {selectedCase}</h4>{labelStatus(run.cases[selectedCase])}</div>
          <div className="pl-test-instructions"><strong>{byId(selectedCase)?.title||selectedCase}</strong><ol><li>테스트 대상과 사전 조건을 확인합니다.</li><li>정의된 테스트 절차를 수행합니다. (학습용 예시)</li><li>기대 결과와 실제 결과를 비교하고 판정합니다.</li></ol></div>
          <label className="pl-test-evidence">Actual Result / Execution Notes<textarea rows={3} value={runNote} onChange={e=>setRunNote(e.target.value)} placeholder="수행 중 확인한 내용을 입력해 보세요."/></label>
          <div className="pl-test-actions"><button className="pl-secondary" onClick={saveTestNote}><Save size={14}/> Save Notes</button>
          {run.cases[selectedCase]==='Failed'&&<button className="pl-primary" onClick={createDefect}><Plus size={15}/> Create linked Defect</button>}</div>
        </div>}
        <div className="pl-inline-form"><label>Add Test Case<select value={runAttach} onChange={e=>setRunAttach(e.target.value)}>{testCases.map(i=><option value={i.id} key={i.id}>{i.id} · {i.title}</option>)}</select></label><button className="pl-secondary" onClick={attachCase} disabled={Boolean(run.cases[runAttach])}><Plus size={14}/> Add</button></div>
        <div className="pl-run-summary"><CheckCircle2 size={18}/><span>현재 실행률: <strong>{Math.round(Object.values(run.cases).filter(v=>v!=='Not Run').length/Math.max(Object.keys(run.cases).length,1)*100)}%</strong></span><button onClick={()=>{advance('view-test');announce('Test Run 실행 결과를 확인했습니다.')}}>Review Summary <ArrowRight size={14}/></button></div>
      </>}</section></div>
  </div>
  const renderTrace=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>DRIVE PILOT / RELATIONS</span><h2>Traceability</h2><p>요구사항이 어떤 Test Case로 검증되는지 연결 관계를 탐색하세요.</p></div><button className="pl-secondary" onClick={()=>go('work-items')}><Link2 size={15}/> Manage Links</button></div>
    <div className="pl-card pl-trace-graph"><div className="pl-panel-title"><strong>Requirements → Verification</strong><span>{data.links.length} trace links</span></div><div className="pl-trace-columns"><div className="pl-trace-column"><h3>Requirements</h3>{requirements.map(i=><button key={i.id} className={selected===i.id?'active':''} onClick={()=>{setSelected(i.id);go('work-items')}}><ItemIcon type="Requirement"/><span><strong>{i.id}</strong><small>{i.title}</small></span><ChevronRight size={15}/></button>)}</div><div className="pl-trace-middle"><Network size={38}/><span>linked to / verified by</span><svg viewBox="0 0 120 160" preserveAspectRatio="none" aria-hidden="true"><path d="M1 22 C50 22 70 24 119 22 M1 78 C50 78 70 81 119 78 M1 136 C50 136 70 136 119 136" stroke="#6cacc1" strokeWidth="2" fill="none" strokeDasharray="6 4"/><path d="M114 16l5 6-5 6m0 44l5 6-5 6m0 44l5 6-5 6" stroke="#3687a2" strokeWidth="2" fill="none"/></svg></div><div className="pl-trace-column"><h3>Test Cases</h3>{testCases.map(i=><button key={i.id} className={selected===i.id?'active':''} onClick={()=>{setSelected(i.id);go('work-items')}}><ItemIcon type="Test Case"/><span><strong>{i.id}</strong><small>{i.title}</small></span><ChevronRight size={15}/></button>)}</div></div>
    <div className="pl-trace-links"><h3><Link2 size={16}/> 실제 연결된 Work Item 관계 (Demo)</h3><div>{data.links.map((l,i)=><button key={i} onClick={()=>{setSelected(l.source);go('work-items');advance('show-trace')}}><span>{l.source} <small>{byId(l.source)?.title}</small></span><strong>{l.role}</strong><ArrowRight size={15}/><span>{l.target} <small>{byId(l.target)?.title}</small></span></button>)}</div></div></div>
    <div className="pl-inline-note"><CircleHelp size={15}/> 도해의 좌우 배치는 개념 설명용이며, 실제 연결은 아래 관계 목록에서 확인하세요. 링크 유형과 방향은 프로젝트 설정에 따라 달라집니다.</div>
  </div>
  const renderGuide=()=> <div className="pl-view"><div className="pl-page-heading"><div><span>POLARION 2606 / USER GUIDE</span><h2>Getting Started & Help</h2><p>제공하신 Siemens Polarion 2606 원문을 참고한 입문 가이드입니다.</p></div></div>
    <div className="pl-guide-intro"><BookOpen size={28}/><div><h3>Learn Polarion by doing</h3><p>Work Items · LiveDocs · Plans · Test Runs · Traceability를 실제 화면처럼 조작하며 배웁니다.</p></div><button className="pl-primary" onClick={course.start}>전체 실습 시작 <ArrowRight size={15}/></button></div>
    <div className="pl-guide-heading"><h3>Full Feature Practice</h3><small>{polarionCourse.length}개 조작 단계 · 분야별 연속 실습 · 중간 재개</small></div><div className="pl-curriculum-preview">{[...new Set(polarionCourse.map(x=>x.chapter))].map(ch=><button key={ch} onClick={()=>{course.setListOpen(true);course.jump(polarionCourse.find(x=>x.chapter===ch)!.id)}}><BookOpen size={16}/><strong>{ch}</strong><small>{polarionCourse.filter(x=>x.chapter===ch).length} Steps</small><ArrowRight size={14}/></button>)}</div>
    <div className="pl-guide-heading"><h3>Terminology</h3><label><Search size={16}/><input value={guideSearch} onChange={e=>setGuideSearch(e.target.value)} placeholder="Search terms"/></label></div><div className="pl-terms">{polarionTerms.filter(t=>t.join(' ').toLowerCase().includes(guideSearch.toLowerCase())).map(([term,desc])=><div key={term}><strong>{term}</strong><p>{desc}</p></div>)}</div>
    <div className="pl-guide-heading"><h3>Reference Source</h3></div><a className="pl-source" target="_blank" rel="noreferrer" href={polarionSource.url}><FileText size={23}/><span><strong>{polarionSource.title}</strong><small>Google Drive 원문 문서 · 접근 권한이 필요할 수 있습니다.</small></span><ArrowRight size={17}/></a>
    <p className="pl-legal">본 페이지는 Siemens의 공식 제품 또는 실제 Polarion 서버가 아닌 독자 제작 학습용 시뮬레이터입니다. 원문 문서의 스크린샷을 공개적으로 재배포하지 않았습니다. 실제 화면·유형·상태·권한·워크플로는 프로젝트 구성에 따라 달라질 수 있습니다.</p>
  </div>
  const content=()=>{
    switch(section){case 'home':return renderHome();case 'work-items':return renderWorkItems();case 'documents':return renderDocuments();case 'plans':return renderPlans();case 'test-runs':return renderRuns();case 'traceability':return renderTrace();case 'baselines':return renderBaselines();case 'reports':return renderReports();case 'guide':return renderGuide()}
  }
  return <div className={'pl-demo-root '+(focusMode?'immersive ':'')+(compactMode?'compact':'')}>
    <div className="pl-backbar"><button onClick={onBack}><ArrowLeft size={15}/> Siemens 아키텍처</button><ChevronRight size={14}/><span>Polarion 2606 사용자 체험</span><span className="pl-spacer"/><span className="pl-training-badge"><ShieldCheck size={13}/> LEARNING SANDBOX</span></div>
    <div className="pl-introduction"><div><span>POLARION ALM 2606 · INTERACTIVE EXPERIENCE</span><h1>Polarion 사용자 가이드</h1><p>원문에 설명된 Navigation·Work Items·LiveDocs·Plans·Test Runs를 독자적인 체험 UI로 구성했습니다.</p></div><button onClick={course.start}><BookOpen size={15}/> 실습하기</button><button onClick={()=>{course.setListOpen(true);document.querySelector('[data-training-host]')?.scrollIntoView({behavior:'smooth',block:'start'})}}><List size={15}/> 실습 목록</button><button onClick={()=>go('guide')}><CircleHelp size={15}/> 사용자 가이드</button><button onClick={()=>reset()}><RefreshCw size={15}/> 초기화</button></div>
    <div className="pl-workspace">
      <header className="pl-header"><button className="pl-brand" onClick={()=>go('home')} title="Home"><span className="pl-brand-glyph">P</span><span>POLARION</span></button>
        <button className="pl-context" onClick={()=>{setSidebar(true);go('home')}}><span className="pl-project-icon"><GitBranch size={20}/></span><strong>Drive Pilot <ChevronDown size={13}/></strong></button>
        <div className="pl-header-path"><ChevronRight size={15}/><span>{NAV.find(n=>n.id===section)?.title}</span></div><span className="pl-spacer"/>
        <div className="pl-header-actions"><button className="pl-quick-create" onClick={()=>{setQuickCreateOpen(v=>!v);setProfile(false)}}><Plus size={15}/> CREATE...</button><IconAction title="사용자 도움말" onClick={()=>go('guide')}><CircleHelp size={18}/></IconAction><IconAction title="알림" onClick={()=>announce('이 데모에는 서버 알림이 없습니다.')}><Bell size={18}/></IconAction><IconAction title={focusMode?'일반 보기로 돌아가기':'앱 집중 보기'} onClick={()=>setFocusMode(v=>!v)}>{focusMode?<Minimize size={18}/>:<Maximize size={18}/>}</IconAction><IconAction title="세션 도구" onClick={()=>setProfile(v=>!v)}><Settings size={18}/></IconAction></div>
        {quickCreateOpen&&<div className="pl-quick-menu"><strong>CREATE NEW...</strong><button onClick={()=>chooseQuickCreate('work')}><SquareCheck size={16}/> Work Item</button><button onClick={()=>chooseQuickCreate('doc')}><FileText size={16}/> Document</button><button onClick={()=>chooseQuickCreate('plan')}><CalendarDays size={16}/> Plan</button><button onClick={()=>chooseQuickCreate('run')}><TestTube2 size={16}/> Test Run</button></div>}
        {profile&&<div className="pl-profile-menu"><strong>Demo User</strong><small>Demo project / local simulation</small><button onClick={()=>{setTools(true);setProfile(false)}}>Tools / Settings</button><button onClick={()=>setCompactMode(v=>!v)}>View: {compactMode?'Compact':'Normal'} (Switch)</button><button onClick={()=>{setProfile(false);go('guide')}}>Help</button></div>}
      </header>
      <div className="pl-main">
        <aside className={'pl-sidebar '+(!sidebar?'collapsed':'')+(menuOpen?' mobile-open':'')}>
          <div className="pl-sidebar-top"><button title="Topics/Tools 변경" aria-label="Topics 또는 Tools 변경" onClick={()=>setTools(v=>!v)}><Settings size={18}/></button><button title="즐겨찾기" onClick={()=>go('home')}><Grid2X2 size={18}/></button><button className="pl-collapse" title={sidebar?'탐색 축소':'탐색 확장'} aria-label="탐색 영역 접기/펼치기" onClick={()=>setSidebar(v=>!v)}>{sidebar?<ChevronLeft size={18}/>:<ChevronRight size={18}/>}</button></div>
          {sidebar&&<><label className="pl-sidebar-search" title="Enter: 프로젝트 Work Item 검색"><Search size={15}/><input placeholder="Search Topics / Items" value={navSearch} onChange={e=>setNavSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&navSearch.trim()){setSearch(navSearch);setNavSearch('');go('work-items')}}}/></label>
            <div className="pl-side-profile"><span className="pl-avatar">D</span><div><small>Demo User</small><strong>{tools?'Tools':'Drive Pilot'}</strong></div></div>
          </>}
          <nav className="pl-topics" aria-label="Polarion 데모 탐색">{tools?<>{[{title:'My Account',icon:Settings,action:()=>setProfile(true)},{title:'Manage Shortcuts',icon:Grid2X2,action:()=>announce('학습용 환경에서는 바로가기가 고정되어 있습니다.')},{title:'Help',icon:CircleHelp,action:()=>go('guide')},{title:'Topics',icon:List,action:()=>setTools(false)}].map(n=><button key={n.title} title={n.title} onClick={n.action}><n.icon size={17}/>{sidebar&&<span>{n.title}</span>}</button>)}</>:NAV.filter(n=>n.title.toLowerCase().includes(navSearch.toLowerCase())||!navSearch).map(n=><button key={n.id} className={section===n.id?'active':''} title={n.detail} onClick={()=>go(n.id)}><n.icon size={18}/>{sidebar&&<span>{n.title}</span>}</button>)}</nav>
          {sidebar&&<div className="pl-sidebar-footer"><small>Polarion 2606 concepts</small><span>Demo only · No server access</span></div>}
        </aside>
        <main className="pl-main-panel"><div className="pl-location"><button className="pl-mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label="프로젝트 메뉴 열기"><Menu size={17}/></button><span>Drive Pilot</span><ChevronRight size={13}/><strong>{NAV.find(n=>n.id===section)?.title}</strong><span className="pl-spacer"/><span>DEMO PROJECT</span></div>
          <TrainingCurriculum title="POLARION ALM · 연속 실습" lessons={polarionCourse} course={course} brand="polarion" onResetData={()=>reset(false)}/>

          <div className="pl-content">{content()}</div>
        </main>
      </div>
      <footer className="pl-statusbar"><span><span className="pl-connection-dot"/> WORKSPACE: TRAINING DEMO</span><span>Sample data · Saved in browser</span><button onClick={()=>go('guide')}><CircleHelp size={14}/> Help</button></footer>
    </div>
    <div className="pl-after-demo"><ShieldCheck size={19}/><span>이 페이지는 학습용 가상 데이터로만 동작합니다. Polarion 서버에 연결되거나 실제 프로젝트를 변경하지 않습니다.</span></div>
    {createOpen&&<div className="pl-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setCreateOpen(false)}}><div className="pl-modal" role="dialog" aria-modal="true" aria-label="Create Work Item"><header><strong><Plus size={18}/> Create Work Item</strong><IconAction title="닫기" onClick={()=>setCreateOpen(false)}><X size={19}/></IconAction></header><div className="pl-edit-fields"><label>Project<input readOnly value="Drive Pilot"/></label><label>Work Item Type<select value={createType} onChange={e=>setCreateType(e.target.value as WorkType)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label><label>Title *<input value={createTitle} autoFocus placeholder="Enter Work Item title" onChange={e=>setCreateTitle(e.target.value)} maxLength={120}/></label><label>Description<textarea rows={5} value={createDescription} onChange={e=>setCreateDescription(e.target.value)} maxLength={2000}/></label></div><footer><button onClick={()=>setCreateOpen(false)}>Cancel</button><button className="pl-primary" onClick={createItem} disabled={!createTitle.trim()}><Check size={15}/> Create</button></footer></div></div>}
    {message&&<div role="status" className="pl-toast"><CheckCircle2 size={17}/>{message}<button onClick={()=>setMessage('')} aria-label="알림 닫기"><X size={14}/></button></div>}
  </div>
}
