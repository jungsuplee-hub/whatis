import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BrainCircuit, Check, ChevronLeft, ChevronRight, CircleHelp, Database, Globe2, MessageCircle, Pause, Play, RotateCcw, Send, Sparkles, Wrench } from 'lucide-react'
import './flow.css'

type Mode = 'basic' | 'tools'
type Stage = { id: string; title: string; caption: string; detail: string; icon: typeof MessageCircle }
const commonStart: Stage[] = [
  { id:'receive', title:'질문 수신', caption:'사용자 → 서비스', icon:MessageCircle, detail:'입력한 질문이 앱에서 처리 요청으로 전달됩니다. 실제 서비스에서는 인증·전송 등 별도 처리가 있을 수 있습니다.' },
  { id:'context', title:'문맥 구성', caption:'지시 + 대화 이력', icon:Database, detail:'서비스는 해당 요청에 필요한 지시와 허용된 대화 맥락을 모아 모델 입력을 구성합니다. 포함되는 정보는 서비스마다 다릅니다.' },
  { id:'tokens', title:'토큰 변환', caption:'텍스트 → 토큰', icon:Sparkles, detail:'텍스트가 토큰 ID로 변환됩니다. 토큰은 단어, 단어 일부 또는 기호일 수 있으며 모델별 분할 방식이 다릅니다.' },
  { id:'inference', title:'모델 계산', caption:'문맥에서 예측', icon:BrainCircuit, detail:'모델이 입력 문맥을 처리하고 이어질 토큰의 확률을 계산합니다. 실제 모델 내부의 구체적인 구조와 실행 순서는 달라질 수 있습니다.' }
]
const tool: Stage = { id:'tools', title:'필요 시 도구 사용', caption:'검색 · API 등', icon:Wrench, detail:'질문 해결에 외부 정보가 필요하고 기능이 제공된 경우, 모델이 도구 호출을 요청할 수 있습니다. 실제 조회와 권한 검사는 연결된 시스템이 수행합니다.' }
const finish: Stage = { id:'reply', title:'답변 생성 · 전달', caption:'토큰 → 텍스트', icon:Send, detail:'응답 토큰을 생성하고 읽을 수 있는 텍스트로 바꿔 화면에 표시합니다. 일부 서비스에서는 결과를 순차적으로 스트리밍합니다.' }
const samples = [
  { label:'일반 질문', text:'RAG가 뭔지 쉽게 설명해줘', mode:'basic' as Mode },
  { label:'도구 사용', text:'최신 AI 뉴스를 찾아서 정리해줘', mode:'tools' as Mode }
]
const DEMO_MS=1850
export default function FlowPlayground() {
  const [question,setQuestion]=useState(samples[0].text)
  const [mode,setMode]=useState<Mode>('basic')
  const [step,setStep]=useState(0)
  const [playing,setPlaying]=useState(true)
  const stages=useMemo(()=>mode==='basic'?[...commonStart,finish]:[...commonStart,tool,finish],[mode])
  const stage=stages[Math.max(0,Math.min(step,stages.length-1))]
  useEffect(()=>{
    if (!playing) return
    if (step>=stages.length-1){ setPlaying(false); return }
    const handle=window.setTimeout(()=>setStep(s=>s+1),DEMO_MS)
    return ()=>window.clearTimeout(handle)
  },[playing,step,stages.length])
  const restart=()=>{if(!question.trim())return;setStep(0);setPlaying(true)}
  const changeMode=(value:Mode)=>{setMode(value);setStep(0);setPlaying(false)}
  const jump=(next:number)=>{setStep(Math.max(0,Math.min(next,stages.length-1)));setPlaying(false)}
  const selectSample=(index:number)=>{const x=samples[index];setQuestion(x.text);setMode(x.mode);setStep(0);setPlaying(true)}
  const togglePlay=()=>{
    if(!question.trim())return
    if(playing){setPlaying(false)}
    else if(step===stages.length-1){setStep(0);setPlaying(true)}
    else setPlaying(true)
  }
  return <div className="flow-demo" id="how-it-works">
    <div className="flow-demo-head">
      <div className="flow-demo-eyebrow"><span className="live-indicator"/> INTERACTIVE SIMULATION <span className="flow-demo-head-caption">실제 요청이 아닌 시각화 예시</span></div>
      <div className="flow-mode-switch" role="group" aria-label="처리 흐름 유형">
        <button type="button" className={mode==='basic'?'active':''} aria-pressed={mode==='basic'} onClick={()=>changeMode('basic')}>일반 답변</button>
        <button type="button" className={mode==='tools'?'active':''} aria-pressed={mode==='tools'} onClick={()=>changeMode('tools')}>도구 사용 시</button>
      </div>
    </div>
    <form className="flow-prompt" onSubmit={e=>{e.preventDefault();restart()}}>
      <span className="flow-prompt-icon"><MessageCircle size={20}/></span>
      <label className="visually-hidden" htmlFor="flow-question">시뮬레이션에 사용할 예시 질문</label>
      <input id="flow-question" maxLength={150} value={question} onChange={e=>{setQuestion(e.target.value);setPlaying(false)}} placeholder="질문을 입력해 보세요" autoComplete="off"/>
      <button className="flow-prompt-submit" type="submit" disabled={!question.trim()}><span>흐름 보기</span><ArrowRight size={17}/></button>
    </form>
    <div className="flow-sample-row">
      <span>예시</span>
      {samples.map((sample,i)=><button key={sample.label} type="button" onClick={()=>selectSample(i)}>{sample.label} <ArrowRight size={12}/></button>)}
    </div>
    <div className="flow-stage" aria-label="AI 질문 처리 흐름">
      <div className="flow-stage-top"><span className="flow-stage-caption">PROCESS FLOW</span><span className="flow-stage-status"><span className={'flow-status-dot '+(playing?'is-playing':'')}/>{playing?'흐름 재생 중':step===stages.length-1?'시뮬레이션 완료':'일시정지'}</span></div>
      <div className={'flow-timeline '+(mode==='tools'?'has-tools':'')}>
        {stages.map((s,i)=>{
          const StageIcon=s.icon
          const active=i===step
          return <div className="flow-timeline-item" key={s.id}>
            <button type="button" onClick={()=>jump(i)} aria-pressed={active} aria-label={s.title+' 단계 보기'} className={'flow-node '+(active?'is-active':i<step?'is-complete':'')}>
              <span className="flow-node-circle">{i<step?<Check size={22}/>:<StageIcon size={23}/>}</span>
              <span className="flow-node-title">{s.title}</span>
              <span className="flow-node-caption">{s.caption}</span>
              <span className="flow-node-number">{String(i+1).padStart(2,'0')}</span>
            </button>
            {i<stages.length-1 && <div className={'flow-node-link '+(i<step?'is-complete':i===step&&playing?'is-running':'')} aria-hidden="true"><div className="flow-link-dot"/></div>}
          </div>
        })}
      </div>
      <div className="flow-focus" key={mode+'-'+step}>
        <div className={'flow-focus-visual visual-'+stage.id}><StageVisual id={stage.id} question={question}/></div>
        <div className="flow-focus-copy">
          <span className="flow-focus-eyebrow">STEP {String(step+1).padStart(2,'0')} / {String(stages.length).padStart(2,'0')}</span>
          <h3>{stage.title}</h3>
          <p>{stage.detail}</p>
          {stage.id==='tools'&&<span className="flow-optional"><CircleHelp size={14}/> 모든 질문에서 도구를 호출하지는 않습니다.</span>}
          {stage.id==='tokens'&&<span className="flow-optional"><CircleHelp size={14}/> 위 조각은 실제 토크나이저 출력이 아닙니다.</span>}
        </div>
      </div>
      <div className="flow-stage-footer">
        <span className="flow-progress-label"><span className="flow-progress-ring"/> {step+1} / {stages.length} 단계</span>
        <div className="flow-progress-dots">{stages.map((s,i)=><button key={s.id} aria-label={String(i+1)+'단계'} title={s.title} onClick={()=>jump(i)} className={step===i?'on':''}/>)}</div>
        <div className="flow-controls">
          <button type="button" className="flow-control-small" onClick={()=>jump(step-1)} disabled={step===0} aria-label="이전 단계"><ChevronLeft size={17}/></button>
          <button type="button" className="flow-control-primary" onClick={togglePlay}>{playing?<><Pause size={15}/> 일시정지</>:step===stages.length-1?<><RotateCcw size={15}/> 다시 보기</>:<><Play size={15}/> 계속 보기</>}</button>
          <button type="button" className="flow-control-small" onClick={()=>jump(step+1)} disabled={step===stages.length-1} aria-label="다음 단계"><ChevronRight size={17}/></button>
        </div>
      </div>
    </div>
    <div className="flow-legal"><CircleHelp size={15}/><p><strong>개념 시뮬레이션</strong> · 실제 ChatGPT 서버에 연결하지 않으며 질문에 대한 답을 생성하지 않습니다. 공개된 일반 원리를 단순화한 도식으로, 모델·설정·도구 사용 여부에 따라 처리 과정이 다릅니다.</p></div>
    <div className="flow-references"><span>참고 자료</span><a href="https://help.openai.com/ko-kr/articles/7842364-how-chatgpt-and-our-foundation-models-are-developed" target="_blank" rel="noopener noreferrer">OpenAI · 모델 작동 원리 <Globe2 size={13}/></a><a href="https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens" target="_blank" rel="noopener noreferrer">OpenAI · 토큰 설명 <Globe2 size={13}/></a><a href="https://platform.openai.com/docs/guides/function-calling" target="_blank" rel="noopener noreferrer">OpenAI · 도구 호출 <Globe2 size={13}/></a></div>
  </div>
}
function StageVisual({id,question}:{id:string;question:string}){
  switch(id){
    case 'receive': return <div className="visual-receive">
      <div className="visual-chat-bubble"><span className="visual-chat-user">사용자</span><p>{question||'질문을 입력해 주세요'}</p></div>
      <div className="visual-send-path"><span/><span/><span/></div><div className="visual-mini-server"><MessageCircle size={28}/></div>
    </div>
    case 'context': return <div className="visual-context">
      <div className="visual-context-chip"><span className="visual-chip-dot blue"/> 대화 맥락</div>
      <div className="visual-context-chip"><span className="visual-chip-dot violet"/> 요청 지시</div>
      <div className="visual-context-chip"><span className="visual-chip-dot mint"/> 사용자 질문</div>
      <ArrowRight size={22} className="visual-context-arrow"/><div className="visual-context-stack"><span/><span/><span/></div>
    </div>
    case 'tokens': return <div className="visual-tokens"><div className="visual-tokens-before">자연어 텍스트</div><ArrowRight size={20}/><div className="visual-token-chips"><span>토큰 A</span><span>토큰 B</span><span>토큰 C</span><span>…</span></div></div>
    case 'inference': return <div className="visual-inference"><span className="visual-orbit ring-a"/><span className="visual-orbit ring-b"/><span className="visual-neuron n1"/><span className="visual-neuron n2"/><span className="visual-neuron n3"/><span className="visual-neuron n4"/><span className="visual-inference-core"><BrainCircuit size={37}/></span><span className="visual-inference-label">NEXT TOKEN</span></div>
    case 'tools': return <div className="visual-tools"><div className="visual-tool-box"><BrainCircuit size={25}/><span>모델</span></div><span className="visual-tools-arrows"><ArrowRight size={20}/><ArrowRight size={20}/></span><div className="visual-tool-box external"><Wrench size={25}/><span>외부 도구</span></div></div>
    default: return <div className="visual-reply"><div className="visual-answer-icon"><Sparkles size={20}/></div><div className="visual-reply-lines"><span/><span/><span/><span/></div><span className="visual-reply-tag">답변 전달</span></div>
  }
}
