import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowLeft, Search, BookOpen, Menu, X, Printer, ExternalLink, ChevronRight } from 'lucide-react'
import { handover } from './teamcenter-handover-data'
import './teamcenter-handover.css'
import { teamcenterProcedureDetails } from './operations-procedure-details'
import { teamcenterStandard } from './teamcenter-standard-manual'

const groups=[...new Set(handover.map(x=>x.group))]
const flows:Record<string,string[][]>={
 architecture:[['Active Workspace / Rich Client 4-tier','Gateway / Web tier','Server Manager / tcserver','DB'],['Client file request','FCC / FSC','Volume']],
 gateway:[['Browser','AW Gateway','TcGQL / Web tier','Teamcenter'],['Gateway','File Repository']],
 fms:[['File request','FCC (where installed)','FSC','Volume']],
 dispatcher:[['Translation request','Scheduler','Module / Translator','Client / result registration']],
 index:[['Teamcenter data','TcFTSIndexer','Solr index','AW search']],
 ai:[['Teamcenter data','Indexer / embedding','Vector DB','Retrieval'],['User question','Copilot','LLM','Answer']],
 jenkins:[['Git','Build','Test / approval','Deploy','Verify / rollback']],
 sso:[['Client','Identity provider','Security Services','Teamcenter session']],
}
export default function TeamcenterHandover({id,onNavigate,onArchitecture,onDemo}:{id?:string;onNavigate:(id?:string)=>void;onArchitecture:()=>void;onDemo:()=>void}){
 const [q,setQ]=useState(''),[group,setGroup]=useState(''),[mobile,setMobile]=useState(false)
 useEffect(()=>{setMobile(false);setQ('');setGroup('')},[id])
 const doc=handover.find(x=>x.id===id)
 const standard=doc?teamcenterStandard[doc.id]:undefined
 const matches=useMemo(()=>handover.filter(x=>(!group||x.group===group)&&(!q.trim()||q.trim().toLowerCase().split(/\s+/).every(t=>JSON.stringify([x,teamcenterProcedureDetails[x.id],teamcenterStandard[x.id]]).toLowerCase().includes(t)))),[q,group])
 const choose=(next?:string)=>{setQ('');setGroup('');setMobile(false);onNavigate(next)}
 const index=doc?handover.indexOf(doc):-1
 return <div className="tc-ho">
  <div className="tc-ho-top"><button className="tc-ho-brand" onClick={()=>choose()}><BookOpen size={21}/> <span>Teamcenter <small>운영 인수인계 가이드</small></span></button><div className="tc-ho-actions"><button onClick={onArchitecture}>아키텍처 상세</button><button onClick={onDemo}>사용자 실습 <ArrowRight size={15}/></button><button onClick={()=>window.print()} aria-label="인쇄"><Printer size={16}/></button></div></div>
  <div className="tc-ho-search"><Search size={19}/><input id="teamcenter-ops-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="가이드 검색: FMS, BMIDE, 401, Reindex, Copilot…" aria-label="Teamcenter 운영 가이드 검색"/>{q&&<button onClick={()=>setQ('')} aria-label="검색어 지우기"><X size={17}/></button>}</div>
  <div className="tc-ho-tabs"><button className={!group?'active':''} onClick={()=>setGroup('')}>전체</button>{groups.map(g=><button key={g} className={group===g?'active':''} onClick={()=>setGroup(g)}>{g}</button>)}</div>
  <button className="tc-ho-mobile" onClick={()=>setMobile(!mobile)}><Menu size={18}/> 목차 {mobile?'닫기':'열기'}</button>
  <div className="tc-ho-layout">
   <aside className={'tc-ho-sidebar '+(mobile?'open':'')}><button className={!doc&&!q&&!group?'active':''} onClick={()=>choose()}>가이드 홈</button>{groups.map(g=><section key={g}><h3>{g}</h3>{handover.filter(x=>x.group===g).map(x=><button className={id===x.id?'active':''} key={x.id} onClick={()=>choose(x.id)}>{x.title}</button>)}</section>)}</aside>
   <div className="tc-ho-main">{q.trim()||group?<article className="tc-ho-paper"><span className="tc-ho-kicker">GUIDE INDEX</span><h1>{q.trim()?'검색 결과':group}</h1><p>{matches.length}개 주제</p>{matches.map(d=><button className="tc-ho-result" key={d.id} onClick={()=>choose(d.id)}><div><small>{d.group}</small><strong>{d.title}</strong><p>{d.summary}</p></div><ChevronRight size={18}/></button>)}{!matches.length&&<p>검색 결과가 없습니다. 다른 검색어를 입력하세요.</p>}</article>:doc?<article className="tc-ho-paper">
    <div className="tc-ho-breadcrumb"><button onClick={()=>choose()}>가이드 홈</button><ChevronRight size={13}/>{doc.group}</div>
    <span className="tc-ho-kicker">TEAMCENTER OPERATIONS · {String(index+1).padStart(2,'0')}</span><h1>{doc.title}</h1><p className="tc-ho-lead">{doc.summary}</p>
    <div className="tc-ho-explain"><strong>처음 배우는 사람을 위한 설명</strong><p>{doc.beginner}</p></div>
    {flows[doc.id]&&<section><h2>구성 및 처리 흐름</h2><div className="tc-ho-diagram">{flows[doc.id].map((flow,i)=><div key={i} className="tc-ho-flow">{flow.map((node,n)=><div key={node} className="tc-ho-flow-item">{n>0&&<ArrowRight className="tc-ho-arrow" size={19}/>}<span>{node}</span></div>)}</div>)}</div><small>개념도이며 실제 연결과 설치 구성은 제품 버전 및 현장 환경에 따라 확인합니다.</small></section>}
    {standard&&<><section className="tc-ho-standard"><h2>설치 경로 및 관리 위치</h2><p className="tc-ho-note">/Teamcenter_ROOT, /Teamcenter_DATA 등은 설명용 경로입니다. TC_ROOT, TC_DATA 등 실제 제품 변수와 설치된 구성요소를 기준으로 확인하세요. 별도 설치 제품은 이 경로에 없을 수 있습니다.</p>{doc.id==='start'&&<><h3>Linux 예시 디렉터리 구조</h3><pre className="tc-ho-code"><code>{"/Teamcenter_ROOT/             # TC_ROOT: 제품 설치\n  bin/                        # 실행 파일 및 CLI\n  fsc/                        # FSC 설치 예시\n  TcFTSIndexer/               # 해당 컴포넌트 설치 시\n    bin/\n    log/ 또는 logs/           # 실제 버전 확인\n/Teamcenter_DATA/             # TC_DATA: 환경별 구성\n  tc_profilevars              # Linux 프로파일 예시\n/data/tcvolume01/             # 원본 파일 Volume 예시\n/apps/dc/                    # 별도 Deployment Center 예시\n/apps/dispatcher/            # 별도 Dispatcher 예시"}</code></pre></>}<div className="tc-ho-table-scroll"><table><thead><tr><th>항목</th><th>경로 / 관리 위치</th><th>용도</th></tr></thead><tbody>{standard.where.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>
    {standard.code&&<section><h2>명령어 및 환경 확인 예시</h2><p className="tc-ho-note">설치된 환경의 조회 예시입니다. 주석으로 표시된 대체 명령은 사용 중인 OS와 제품 버전에서 지원되는 경우에만 참고합니다. 실제 경로와 권한을 먼저 확인하세요.</p><pre className="tc-ho-code"><code>{standard.code.trim()}</code></pre></section>}
    <section className="tc-ho-method"><h2>상세 운영 방법</h2>{standard.how.map((body,i)=><div className="tc-ho-method-step" key={i}><h3><span>{String(i+1).padStart(2,'0')}</span>{['확인 대상과 선행 조건','구성 및 로그 확인','실제 작업과 기능 검증','운영 기록 및 복구 범위'][i]||'추가 설명'}</h3><p>{body}</p></div>)}</section>
    <section><h2>결과 해석 및 장애 판단</h2><div className="tc-ho-verify">{standard.result}</div></section></>}
    <section><h2>운영 개요</h2>{(teamcenterProcedureDetails[doc.id]||doc.steps).map((body,i)=><p key={i}>{body}</p>)}</section>
    <section><h2>정상 동작을 확인하는 방법</h2><div className="tc-ho-verify">{doc.verify}</div></section>
    <section><h2>변경 전 주의사항</h2><p>운영 설정 변경, 서비스 재기동, 데이터베이스 변경, 캐시 삭제 및 재색인은 승인·백업·복구 절차와 대상 버전의 공식 지침을 확인한 뒤 수행합니다. 이 페이지는 운영 설명서이며 현장 설정값을 확정하지 않습니다.</p></section>
    <section><h2>참고 자료</h2><div className="tc-ho-source">{doc.source}{standard?.ref&&<p>{standard.ref.split(/(https?:\/\/[^\s;)]+)/g).map((part,i)=>part.startsWith("http")?<a key={i} href={part} target="_blank" rel="noreferrer">기술 참고 문서 <ExternalLink size={13}/></a>:<span key={i}>{part}</span>)}</p>}<p>OneNote 주제 표기는 업무 분류 참고이며, 사례를 모든 버전의 공식 절차로 적용하지 않습니다.</p><a href="https://support.sw.siemens.com/" target="_blank" rel="noreferrer">Siemens Support Center <ExternalLink size={13}/></a></div></section>
    <div className="tc-ho-pager">{index>0?<button onClick={()=>choose(handover[index-1].id)}><ArrowLeft size={17}/> {handover[index-1].title}</button>:<span/>}{index<handover.length-1?<button onClick={()=>choose(handover[index+1].id)}>{handover[index+1].title} <ArrowRight size={17}/></button>:<button onClick={()=>choose()}>가이드 홈 <ArrowRight size={17}/></button>}</div>
   </article>:<article className="tc-ho-home"><div className="tc-ho-cover"><span>TEAMCENTER · OPERATIONS HANDBOOK</span><h1>Teamcenter<br/>운영 인수인계 가이드</h1><p>시스템 구성부터 설치, 운영, 개발·배포, 장애 대응까지. 설치 경로, 서비스 설정, 로그, 관리 화면과 실제 명령 예시를 포함한 기술 운영 매뉴얼입니다.</p><div className="tc-ho-stats"><div><strong>{groups.length}</strong><small>업무 영역</small></div><div><strong>{handover.length}</strong><small>가이드 주제</small></div></div><button onClick={()=>choose('start')}>인수인계 시작 <ArrowRight size={17}/></button></div><div className="tc-ho-feature"><button onClick={()=>choose('architecture')}><strong>시스템 구조 이해</strong><p>서비스별 역할과 요청 흐름</p><ArrowRight size={16}/></button><button onClick={()=>choose('login-error')}><strong>장애 발생 시</strong><p>증상별 원인 분리와 정상 확인</p><ArrowRight size={16}/></button></div><h2>전체 목차</h2>{groups.map(g=><section className="tc-ho-chapter" key={g}><h3>{g}</h3>{handover.filter(x=>x.group===g).map(x=><button key={x.id} onClick={()=>choose(x.id)}><div><strong>{x.title}</strong><p>{x.summary}</p></div><ChevronRight size={17}/></button>)}</section>)}<section className="tc-ho-source"><h2>가이드의 기준과 범위</h2><p>2606 설치 및 참조 아키텍처 문서, Deployment Center 구성 목록, AWS AI 구축 자료와 OneNote Teamcenter 운영 주제를 참고했습니다. 구버전 사례와 일반 운영 점검을 구분하며, 원본 비공개 자료 및 현장 식별 정보는 공개하지 않습니다.</p><a href="https://support.sw.siemens.com/" target="_blank" rel="noreferrer">공식 제품 문서 확인 <ExternalLink size={13}/></a></section></article>}</div>
  </div>
 </div>
}
