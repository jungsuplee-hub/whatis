import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleHelp, Pause, Play, RotateCcw, Sparkles, WandSparkles } from 'lucide-react'
import QuestionJourney from './QuestionJourney'
import './conversation.css'
import HiddenTechAtlas from './HiddenTechAtlas'

type Episode = { question:string; answer:string; mode:'standard'|'search'; id:string }
type PhaseName = 'typing'|'sending'|'context'|'tokens'|'compute'|'search'|'answer'|'complete'
type Phase = { id:PhaseName; label:string; hint:string; duration:number }
const DEMOS: Episode[] = [
  { id:'rainbow',question:'무지개는 왜 생겨?',answer:'햇빛이 공기 중 물방울을 통과하면서 여러 색으로 나뉘기 때문이에요. 그래서 비가 온 뒤에 무지개를 볼 수 있어요. 🌈',mode:'standard' },
  { id:'mistake',question:'AI는 왜 틀린 답을 할까?',answer:'AI는 문맥에 어울리는 말을 만들어 내지만, 모든 사실을 확인하는 것은 아니에요. 그래서 중요한 내용은 출처를 확인해야 해요.',mode:'standard' },
  { id:'weather',question:'오늘 서울 날씨 알려줘',answer:'최신 날씨를 알려면 외부 날씨 정보를 조회해야 해요. 이 체험은 실제 날씨를 조회하지 않는 애니메이션이에요.',mode:'search' }
]
const CUSTOM_ANSWER='이 화면에서는 실제 AI에 질문을 보내지 않아요. 대신 질문이 처리되고 답변이 한 부분씩 나타나는 모습을 보여드리고 있어요.'
const PHASES: Phase[] = [
  {id:'typing',label:'질문 입력',hint:'궁금한 것을 입력해요',duration:1650},
  {id:'sending',label:'질문 전송',hint:'질문이 전달돼요',duration:900},
  {id:'context',label:'문맥 구성',hint:'질문과 필요한 대화 내용을 모아요',duration:1500},
  {id:'tokens',label:'토큰 변환',hint:'글을 작은 단위로 바꿔요',duration:1450},
  {id:'compute',label:'모델 계산',hint:'이어질 말을 계산해요',duration:2050},
  {id:'answer',label:'답변 생성',hint:'말이 조금씩 나타나요',duration:4200},
  {id:'complete',label:'완성',hint:'하나의 답변이 만들어졌어요',duration:0}
]
const TOOL_PHASE:Phase={id:'search',label:'외부 정보',hint:'필요한 경우 도구를 사용할 수 있어요',duration:1600}
const TICK=48
function sceneAt(ms:number, phases:Phase[]) {
  let start=0
  for(let i=0;i<phases.length;i++){
    const item=phases[i]
    if(item.duration===0 || ms<start+item.duration){
      return {phase:item,index:i,local:Math.max(0,ms-start),start,duration:item.duration}
    }
    start+=item.duration
  }
  const last=phases[phases.length-1]
  return {phase:last,index:phases.length-1,local:0,start,duration:0}
}
function sliceChars(s:string,progress:number) {
  return Array.from(s).slice(0,Math.floor(Array.from(s).length*Math.max(0,Math.min(1,progress)))).join('')
}
const EXPAND_HELP:Record<PhaseName,string>={
  typing:'이 장면은 사용자가 질문을 작성하는 모습을 보여줘요.',
  sending:'입력한 질문이 AI를 사용하는 서비스에 전달되는 과정을 표현했어요.',
  context:'서비스는 현재 질문과 필요한 지시·대화 내용을 묶어 모델 입력을 구성할 수 있어요. 포함되는 정보는 설정과 서비스에 따라 달라요.',
  tokens:'모델이 텍스트를 처리하기 위해 작은 숫자 단위로 바꾸는 과정을 나타냈어요. 화면의 조각은 실제 토크나이저 결과가 아닌 예시예요.',
  compute:'언어 모델은 앞 문맥을 바탕으로 다음에 이어질 토큰의 확률을 계산해요. 이 장면은 비공개 사고 과정이나 실제 서버 내부를 보여주는 것이 아니에요.',
  search:'도구가 제공되고 필요한 경우 검색·API 등을 호출할 수 있어요. 이 시뮬레이션은 실제 네트워크 조회를 하지 않아요.',
  answer:'만들어진 토큰을 사람이 읽을 수 있는 글로 표시해요. 일부 서비스에서는 완성되기 전에 답변을 순서대로 보여줘요.',
  complete:'하나의 답변이 화면에 표시됐어요. 그럴듯한 말이라도 사실 확인이 필요할 수 있어요.'
}
export default function FlowPlayground() {
  const [episode,setEpisode]=useState<Episode>(DEMOS[0])
  const [elapsed,setElapsed]=useState(0)
  const [playing,setPlaying]=useState(true)
  const [draft,setDraft]=useState('')
  const [editing,setEditing]=useState(false)
  const [showWhy,setShowWhy]=useState(false)
  const [techIndex,setTechIndex]=useState(0)
  const [reduced,setReduced]=useState(false)

  const phases=useMemo(()=>episode.mode==='search'?[...PHASES.slice(0,5),TOOL_PHASE,...PHASES.slice(5)]:PHASES,[episode.mode])
  const total=phases.reduce((sum,p)=>sum+p.duration,0)
  const scene=sceneAt(elapsed,phases)
  const stage=scene.phase.id
  const hasSent=scene.index>=1
  const composing=stage==='answer'||stage==='complete'
  const finished=stage==='complete'
  const percent=total?Math.min(100,elapsed/total*100):0
  const inputValue=editing?draft:stage==='typing'?sliceChars(episode.question,scene.local/scene.duration):''
  const response=stage==='complete'?episode.answer:stage==='answer'?sliceChars(episode.answer,scene.local/scene.duration):''
  const active=playing&&!finished
  const journeyProgress=scene.duration>0?Math.max(0,Math.min(1,scene.local/scene.duration)):1
  const simulatedQuestion=stage==='typing'?sliceChars(episode.question,journeyProgress):episode.question

  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync=()=>setReduced(media.matches)
    sync()
    media.addEventListener?.('change',sync)
    return()=>media.removeEventListener?.('change',sync)
  },[])
  useEffect(()=>{if(reduced)setPlaying(false)},[reduced])
  useEffect(()=>{
    if(!playing||reduced||finished)return
    const timer=window.setInterval(()=>setElapsed(ms=>Math.min(total,ms+TICK)),TICK)
    return()=>window.clearInterval(timer)
  },[playing,reduced,finished,total])
  useEffect(()=>{if(finished)setPlaying(false)},[finished])
  useEffect(()=>setShowWhy(false),[stage])

  const playEpisode=(next:Episode,fromSend=false)=>{
    setEpisode(next);setElapsed(fromSend?PHASES[0].duration:0);setDraft('');setEditing(false);setShowWhy(false);setPlaying(true)
  }
  const send=()=>{
    const q=(editing?draft:inputValue||episode.question).trim()
    if(!q)return
    const canned=DEMOS.find(x=>x.question===q)
    const next=canned??{id:'custom',question:q,answer:CUSTOM_ANSWER,mode:episode.mode}
    playEpisode(next,true)
  }
  const jump=(index:number)=>{
    setElapsed(phases.slice(0,index).reduce((sum,p)=>sum+p.duration,0))
    setPlaying(false);setEditing(false);setDraft('')
  }
  const toggle=()=>{
    if(finished){playEpisode(episode);return}
    setPlaying(x=>!x);setEditing(false)
  }
  const onChangeDraft=(value:string)=>{setDraft(value);setEditing(true);setPlaying(false)}
  const technologyForStage:Record<PhaseName,number>={typing:0,sending:0,context:1,tokens:2,compute:3,search:6,answer:10,complete:11}
  const openTechnology=(index:number)=>{
    setPlaying(false)
    setTechIndex(index)
    window.requestAnimationFrame(()=>document.getElementById('hidden-tech-atlas')?.scrollIntoView({behavior:'smooth',block:'start'}))
  }
  return <section className="chat-cinema" id="how-it-works" aria-label="AI 질문 처리 체험">
    <div className="cinema-topline">
      <div className="cinema-tag"><span className="cinema-tag-light"/> INTERACTIVE STORY <span className="cinema-tag-separator">/</span> 01</div>
      <div className="cinema-top-actions"><span className="cinema-simulation">실제 AI 연결 없는 시뮬레이션</span><button type="button" className="cinema-replay" onClick={()=>playEpisode(episode)}><RotateCcw size={15}/> 처음부터</button></div>
    </div>
    <div className="cinema-panes">
      <div className="cinema-chat">
        <div className="cinema-chat-heading"><span className="chat-mini-mark"><Sparkles size={16}/></span><strong>대화</strong><span className="chat-demo-tag">DEMO</span><span className="chat-window-dots"><i/><i/><i/></span></div>
        <div className="cinema-conversation" aria-live="off">
          {!hasSent&&<div className="conversation-welcome">
            <div className="welcome-symbol"><WandSparkles size={31}/></div>
            <strong>무엇이 궁금하세요?</strong><span>하나의 질문이 답이 되는 과정을 살펴보세요.</span>
          </div>}
          {hasSent&&<div className="cinema-messages">
            <div className="cinema-user-line"><div className="cinema-user-bubble">{episode.question}</div></div>
            <div className="cinema-ai-line">
              <div className="ai-avatar"><Sparkles size={17}/></div>
              <div className="ai-message-body">
                {!composing&&<div className="cinema-working"><span className="working-dots"><i/><i/><i/></span><span>{scene.phase.hint}</span></div>}
                {composing&&<div className="cinema-answer-text">{response}{!finished&&<span className="cinema-type-caret"/>}</div>}
                {finished&&<>
                  <div className="message-complete"><Check size={13}/> 답변 완성</div>
                  <button type="button" className="cinema-learn-next" onClick={()=>openTechnology(0)}>이 화면에서 숨은 기술 12개 보기 <ArrowUpRight size={16}/></button>
                </>}
              </div>
            </div>
          </div>}
        </div>
        <div className="cinema-compose-wrap">
          <div className="cinema-presets" role="group" aria-label="예시 질문 선택">
            {DEMOS.map((d,i)=><button key={d.id} onClick={()=>playEpisode(d)} className={episode.id===d.id?'chosen':''}>{i===0?'🌈 ':i===1?'💭 ':'🔎 '}{i===0?'무지개':i===1?'AI는 왜 틀릴까?':'도구 사용'}<ArrowUpRight size={13}/></button>)}
          </div>
          <form onSubmit={e=>{e.preventDefault();send()}} className={'cinema-composer '+(stage==='typing'&&!editing?'composer-typing':'')}>
            <label htmlFor="cinema-question" className="cinema-visually-hidden">질문을 입력해 처리 과정 체험하기</label>
            <input id="cinema-question" value={inputValue} onFocus={()=>{if(!editing&&stage==='typing'){setEditing(true);setDraft('');setPlaying(false)}}} onChange={e=>onChangeDraft(e.target.value)} placeholder="질문을 입력해 보세요" maxLength={170} autoComplete="off"/>
            <button type="submit" className="cinema-send-btn" disabled={editing&&!draft.trim()} aria-label="질문 전송"><ArrowRight size={19}/></button>
          </form>
          <p className="cinema-input-foot">답변은 미리 준비된 예시입니다. 직접 쓴 질문에는 실제 답변이 생성되지 않습니다.</p>
        </div>
      </div>
      <div className="cinema-behind">
        <div className="behind-top"><span className="behind-top-marker"/><span>BEHIND THE ANSWER</span><span>{String(scene.index+1).padStart(2,'0')} / {String(phases.length).padStart(2,'0')}</span></div>
        <div className="behind-illustration">
          <QuestionJourney key={episode.id+'-'+stage} stage={stage} episode={episode} progress={journeyProgress} partialAnswer={response} partialQuestion={simulatedQuestion}/>
          <span className="behind-corner corner-tl"/><span className="behind-corner corner-br"/>
        </div>
        <div className="behind-description">
          <span className="behind-kicker">지금 일어나는 일</span>
          <h3 key={stage}>{scene.phase.label}<span className="heading-signal">.</span></h3>
          <p>{scene.phase.hint}</p>
          <button type="button" className="behind-why" onClick={()=>{setShowWhy(v=>!v);setPlaying(false)}} aria-expanded={showWhy}>{showWhy?'설명 접기':'왜 이렇게 될까?'} <ArrowUpRight size={15}/></button>
          {showWhy&&<div className="behind-extra">{EXPAND_HELP[stage]}</div>}
          <button type="button" className="behind-tech-open" onClick={()=>openTechnology(technologyForStage[stage])}>이 단계의 기술 보기 <ArrowUpRight size={14}/></button>
        </div>
      </div>
    </div>
    <div className="cinema-controls">
      <div className="cinema-control-top">
        <div className="cinema-timeline-label"><span className={'timeline-live '+(active?'on':'')}/><span>{finished?'체험이 끝났어요':playing?'재생 중':'멈춤'}</span></div>
        <div className="cinema-transport">
          <button onClick={()=>jump(Math.max(0,scene.index-1))} aria-label="이전 장면"><ChevronLeft size={18}/></button>
          <button className="transport-main" onClick={toggle}>{playing?<Pause size={14}/>:finished?<RotateCcw size={14}/>:<Play size={14}/>} {playing?'멈추기':finished?'다시 보기':'이어 보기'}</button>
          <button onClick={()=>jump(Math.min(phases.length-1,scene.index+1))} aria-label="다음 장면"><ChevronRight size={18}/></button>
        </div>
      </div>
      <div className="cinema-progress" role="group" aria-label="애니메이션 단계 선택">
        {phases.map((p,i)=><button key={p.id} type="button" className={'cinema-step '+(i===scene.index?'current':i<scene.index?'passed':'')} onClick={()=>jump(i)} title={p.label} aria-label={p.label+' 단계로 이동'} aria-pressed={i===scene.index}>
          <span className="cinema-step-bar"><span style={{width:i<scene.index?'100%':i===scene.index?(p.duration?scene.local/p.duration*100:100)+'%':'0%'}}/></span>
          <span className="cinema-step-name">{p.label}</span>
        </button>)}
      </div>
    </div>
    <HiddenTechAtlas index={techIndex} onIndexChange={setTechIndex}/>
    <div className="cinema-note"><CircleHelp size={14}/><span>공개된 기술 원리를 단순화한 애니메이션입니다. 실제 ChatGPT의 비공개 내부 동작이나 사고 과정을 재현한 것은 아닙니다.</span><span className="cinema-progress-value">{Math.round(percent)}%</span></div>
  </section>
}
