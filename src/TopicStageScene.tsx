import type { Topic } from './data'
import { AlertTriangle, ArrowDown, ArrowRight, BookOpen, Check, CheckCheck, FileCheck2, FileText, Layers3, Mic, Pencil, Search, ShieldCheck, Sparkles, Volume2, WandSparkles } from 'lucide-react'
import './topic-step-scenes.css'

type Props={topic:Topic; step:number}
function Arrow(){return <ArrowRight size={21} className="stage-motion-arrow" aria-hidden="true"/>}
function SceneBody({children,tag}:{children:React.ReactNode;tag:string}){return <div className="stage-scene-body"><span className="stage-scene-tag">{tag}</span>{children}</div>}
function Badge({children,tone='green'}:{children:React.ReactNode;tone?:string}){return <span className={'scene-label scene-label-'+tone}>{children}</span>}
function Illustration({topic,step}:{topic:Topic;step:number}){
  const id=topic.id
  // Unlike category loops, each state below is specific to the topic and to the selected step.
  if(id==='hallucination'){
    if(step===0)return <SceneBody tag="01 / ASK"><div className="stage-hallu-ask"><span className="hallu-user-icon">?</span><div className="hallu-user-card">행사 날짜가 언제야?</div><span className="hallu-arrow"><Arrow/></span><div className="hallu-ai-icon"><Sparkles size={27}/></div></div><span className="scene-caption">질문이 모델로 전달돼요</span></SceneBody>
    if(step===1)return <SceneBody tag="02 / GENERATE"><div className="hallu-generation"><div className="hallu-output-head"><Sparkles size={17}/> 답변 예시</div><div className="hallu-output-lines"><span>행사는</span><span>월요일에</span><span>열려요</span><b/></div><small>사실 확인 없이도 문장을 생성할 수 있어요</small></div></SceneBody>
    if(step===2)return <SceneBody tag="03 / CAUTION"><div className="hallu-uncertain"><div className="hallu-suspect">“월요일에 열려요”</div><div className="hallu-question-marks"><span>?</span><span>?</span><span>?</span></div><div className="hallu-warning"><AlertTriangle size={26}/><strong>근거가 확인되지 않았어요</strong></div></div></SceneBody>
    return <SceneBody tag="04 / VERIFY"><div className="hallu-compare"><div className="hallu-compare-card incorrect"><span>AI의 예시 답변</span><strong>월요일</strong><AlertTriangle size={21}/></div><Arrow/><div className="hallu-compare-card verified"><span>원문 기록 확인</span><strong>화요일</strong><FileCheck2 size={22}/></div></div><span className="scene-caption">가상의 예시 · 실제 사실은 원문 확인</span></SceneBody>
  }
  if(id==='image-generation'){
    if(step===0)return <SceneBody tag="01 / PROMPT"><div className="image-prompt"><WandSparkles size={23}/><div>“노을 지는 바다를 그려줘”</div></div><span className="scene-caption">원하는 장면을 글로 설명해요</span></SceneBody>
    if(step===1)return <SceneBody tag="02 / CONDITIONS"><div className="image-conditions"><Badge>바다</Badge><Badge tone="yellow">노을</Badge><Badge tone="blue">따뜻한 색감</Badge><div className="conditions-connector"><Arrow/></div></div><span className="scene-caption">요청한 조건을 반영해요</span></SceneBody>
    if(step===2)return <SceneBody tag="03 / CREATE"><div className="image-canvas"><div className="canvas-sky"/><div className="canvas-sun"/><div className="canvas-sea"/><div className="canvas-coast"/><span className="canvas-twinkle">✦</span></div><span className="scene-caption">새로운 이미지를 생성해요</span></SceneBody>
    return <SceneBody tag="04 / REVIEW"><div className="image-review"><div className="image-mini"><span className="image-mini-sun"/><span className="image-mini-sea"/></div><div className="image-review-lens"><Search size={26}/></div><div className="image-review-notes"><Badge>색감</Badge><Badge tone="yellow">구도</Badge><Badge tone="blue">수정</Badge></div></div><span className="scene-caption">보고 고쳐 달라고 할 수 있어요</span></SceneBody>
  }
  if(id==='search-vs-ai'){
    if(step===0)return <SceneBody tag="01 / ASK"><div className="stage-question-bubble">바로 확인할 자료가 있을까?</div><div className="question-echo"><Search size={25}/><Sparkles size={25}/></div></SceneBody>
    if(step===1)return <SceneBody tag="02 / FIND"><div className="search-results"><div><FileText size={19}/><span>자료 A</span><small>관련 내용</small></div><div><FileText size={19}/><span>자료 B</span><small>관련 내용</small></div><div><FileText size={19}/><span>자료 C</span><small>관련 내용</small></div></div></SceneBody>
    if(step===2)return <SceneBody tag="03 / WRITE"><div className="search-synthesis"><div className="source-stack"><FileText/><FileText/></div><Arrow/><div className="summary-sheet"><Sparkles size={17}/><i/><i/><i/></div></div><span className="scene-caption">찾은 자료를 활용해 문장을 만들 수 있어요</span></SceneBody>
    return <SceneBody tag="04 / VERIFY"><div className="hallu-compare"><div className="hallu-compare-card incorrect"><span>AI 요약</span><FileText size={29}/></div><Arrow/><div className="hallu-compare-card verified"><span>실제 원문</span><FileCheck2 size={32}/><Check size={17}/></div></div><span className="scene-caption">링크를 열어 사실인지 확인해요</span></SceneBody>
  }
  if(id==='speech-to-text'){
    if(step===0)return <SceneBody tag="01 / RECORD"><div className="speech-record"><Mic size={59}/><span className="record-ring one"/><span className="record-ring two"/><span className="record-dot"/></div><span className="scene-caption">목소리·녹음을 입력받아요</span></SceneBody>
    if(step===1)return <SceneBody tag="02 / AUDIO"><div className="speech-wave"><Volume2 size={27}/>{Array.from({length:17},(_,i)=><i key={i} style={{animationDelay:(i*.085)+'s',height:(18+(i*11%51))+'px'}}/>)}</div><span className="scene-caption">소리의 패턴을 분석해요</span></SceneBody>
    if(step===2)return <SceneBody tag="03 / TRANSCRIBE"><div className="speech-transcription"><div className="wave-small"><Mic size={22}/> ▮ ▮ ▮ ▮ ▮</div><ArrowDown size={19}/><div className="transcript-card">“다음 주에 만나요”<span className="transcript-caret"/></div></div></SceneBody>
    return <SceneBody tag="04 / CORRECT"><div className="speech-edit"><div>“다음 주에 만나요”</div><div><Pencil size={21}/> 고유명사 · 숫자 확인</div><Badge><Check size={15}/> 수정 완료</Badge></div></SceneBody>
  }
  if(id==='tokens'){
    if(step===0)return <SceneBody tag="01 / TEXT"><div className="stage-question-bubble">“안녕하세요, AI!”</div><span className="scene-caption">사람이 읽는 문장을 받아요</span></SceneBody>
    if(step===1)return <SceneBody tag="02 / SPLIT"><div className="tokens-pieces"><span>안녕</span><span>하세요</span><span>,</span><span>AI</span><span>!</span></div><span className="scene-caption">설명용 조각 · 실제 분할은 달라요</span></SceneBody>
    if(step===2)return <SceneBody tag="03 / NUMBERS"><div className="tokens-mapping"><div>안녕</div><Arrow/><div className="token-id">124</div><div>AI</div><Arrow/><div className="token-id">357</div></div><span className="scene-caption">숫자 ID는 가상의 예시입니다</span></SceneBody>
    if(step===3)return <SceneBody tag="04 / MODEL"><div className="token-model"><div className="token-inputs"><span>124</span><span>357</span><span>…</span></div><Arrow/><div className="model-layer"><Layers3 size={42}/></div></div><span className="scene-caption">토큰 시퀀스를 계산해요</span></SceneBody>
    return <SceneBody tag="05 / OUTPUT"><div className="tokens-output"><div className="token-id">963</div><Arrow/><div className="output-text">“반가워요!”</div></div><span className="scene-caption">토큰을 읽을 수 있는 글로 표시해요</span></SceneBody>
  }
  if(id==='personal-data'){
    if(step===0)return <SceneBody tag="01 / SENSITIVE"><div className="private-card"><span>이름: ○○○</span><span>연락처: 010-••••</span><span>비밀번호: ••••</span><AlertTriangle size={24}/></div><span className="scene-caption">입력 전에 개인정보를 살펴요</span></SceneBody>
    if(step===1)return <SceneBody tag="02 / POLICY"><div className="privacy-policy"><FileText size={42}/><strong>서비스 정책</strong><span>저장 · 활용 · 설정 확인</span></div></SceneBody>
    if(step===2)return <SceneBody tag="03 / REDACT"><div className="private-before-after"><div><span>이름</span><strong>홍○○</strong></div><Arrow/><div><span>대체</span><strong>사용자 A</strong></div></div><span className="scene-caption">꼭 필요한 정보만 제공해요</span></SceneBody>
    return <SceneBody tag="04 / CHECK"><div className="privacy-finish"><div className="privacy-message"><span>전달할 내용</span><i/><i/><i/></div><ShieldCheck size={57}/><Badge>공유 범위 확인</Badge></div></SceneBody>
  }
  return <DefaultStep topic={topic} step={step}/>
}
function DefaultStep({topic,step}:{topic:Topic;step:number}){
  const stage=topic.stages[step]
  const prev=step?topic.stages[step-1]:undefined
  const next=topic.stages[step+1]
  const kind=step===0?'receive':step===topic.stages.length-1?'finish':step%3===1?'transform':step%3===2?'process':'connect'
  if(kind==='receive')return <SceneBody tag="01 / INPUT"><div className="default-receive"><div className="default-question"><MessageBubbleIcon/> <span>{stage.name}</span></div><Arrow/><div className="default-big-icon"><Sparkles size={38}/></div></div><span className="scene-caption">{stage.note}</span></SceneBody>
  if(kind==='transform')return <SceneBody tag="TRANSFORM"><div className="default-transform"><div className="transform-old">{prev?.name||'입력'}</div><div className="transform-dots"><span/><span/><span/></div><div className="transform-pieces"><span>{stage.name}</span><span>{stage.note}</span></div></div></SceneBody>
  if(kind==='process')return <SceneBody tag="PROCESS"><div className="default-process"><span className="process-orbit one"/><span className="process-orbit two"/><span className="process-core"><Layers3 size={35}/></span><span className="process-mini top">{prev?.name||'입력'}</span><span className="process-mini bottom">{stage.name}</span></div><span className="scene-caption">{stage.note}</span></SceneBody>
  if(kind==='connect')return <SceneBody tag="NEXT"><div className="default-connect"><span>{prev?.name}</span><Arrow/><div>{stage.name}</div><Arrow/><span>{next?.name||'완료'}</span></div></SceneBody>
  return <SceneBody tag="OUTPUT"><div className="default-finish"><div className="finish-ribbon"><CheckCheck size={37}/></div><div><strong>{stage.name}</strong><span>{stage.note}</span></div></div></SceneBody>
}
function MessageBubbleIcon(){return <BookOpen size={26}/>}
export default function TopicStageScene({topic,step}:Props){
  return <div key={topic.id+'-'+step} className={'topic-step-scene scene-topic-'+topic.id+' scene-step-'+step} role="img" aria-label={topic.title+' '+(step+1)+'단계 '+topic.stages[step].name+' 애니메이션'}>
    <div className="topic-step-top"><span className="step-live-dot"/> STEP {String(step+1).padStart(2,'0')} OF {String(topic.stages.length).padStart(2,'0')}</div>
    <Illustration topic={topic} step={step}/>
  </div>
}
