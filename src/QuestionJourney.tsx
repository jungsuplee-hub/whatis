import { ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, CloudSun, FileText, MessageCircle, Network, Radio, Search, Sparkles } from 'lucide-react'
import './question-journey.css'

export type JourneyStage='typing'|'sending'|'context'|'tokens'|'compute'|'search'|'answer'|'complete'
export type JourneyEpisode={id:string;question:string;answer:string;mode:'standard'|'search'}
type Props={stage:JourneyStage;episode:JourneyEpisode;progress:number;partialAnswer:string;partialQuestion:string}
const concepts:Record<string,{terms:string[];mini:string}> = {
  rainbow:{terms:['햇빛','물방울','빛의 굴절·반사','색의 분리'],mini:'햇빛 + 물방울 → 여러 색'},
  mistake:{terms:['문맥','다음 말 예측','확인되지 않은 정보','근거 확인'],mini:'그럴듯한 답변 ≠ 사실'},
  weather:{terms:['오늘','서울','날씨','실시간 조회 필요'],mini:'외부 정보가 필요한 질문'},
}
function questionPieces(q:string){
  const chars=Array.from(q.trim())
  const pieces:string[]=[]
  const stride=Math.max(2,Math.ceil(chars.length/4))
  for(let i=0;i<chars.length;i+=stride)pieces.push(chars.slice(i,i+stride).join(''))
  return pieces.slice(0,5)
}
function Brief({children}:{children:React.ReactNode}){return <div className="journey-brief">{children}</div>}
export default function QuestionJourney({stage,episode,progress,partialAnswer,partialQuestion}:Props){
  const terms=concepts[episode.id]?.terms||['질문의 목적','대화 문맥','관련 표현','응답 생성']
  const text=episode.question
  return <div className={'journey-story journey-'+stage} role="img" aria-label={stage+' 단계에서 '+text+' 질문이 이동하는 시뮬레이션'}>
    <div className="journey-overline"><span className="journey-echo"><Radio size={12}/> {stage==='complete'?'RETURNED':'LIVE FLOW'}</span><span>EXAMPLE · NOT LIVE AI</span></div>
    {stage==='typing'&&<div className="journey-type">
      <div className="journey-illustrated-chat"><MessageCircle size={17}/><span>{partialQuestion||'│'}<b className="journey-caret"/></span></div>
      <div className="journey-type-caption">화면에서 질문을 만들고 있어요</div>
    </div>}
    {stage==='sending'&&<div className="journey-send">
      <div className="journey-message-card"><span>사용자 질문</span><strong>{text}</strong></div>
      <div className="journey-flight"><span className="flight-track"/><ArrowRight size={22}/></div>
      <div className="journey-receiver"><Sparkles size={26}/><span>AI 서비스</span></div>
    </div>}
    {stage==='context'&&<div className="journey-context">
      <div className="journey-context-sources"><div className="context-user"><span>현재 질문</span><strong>{text}</strong></div><div className="context-instructions"><FileText size={16}/><span>필요한 지시 · 대화 맥락</span></div></div>
      <div className="journey-context-arrow"><ArrowRight size={21}/></div>
      <div className="journey-context-result"><span>입력 문맥</span><div className="context-result-lines"><i/><i/><i/></div><CheckCircle2 size={19}/></div>
    </div>}
    {stage==='tokens'&&<div className="journey-tokens">
      <div className="journey-original"><span>입력</span><strong>{text}</strong></div>
      <ArrowDown size={23} className="journey-token-arrow"/>
      <div className="journey-token-list">{questionPieces(text).map((part,i)=><span key={i}>{part}</span>)}</div>
      <Brief>질문의 일부를 나눈 예시 · 실제 토큰 분할 아님</Brief>
    </div>}
    {stage==='compute'&&<div className="journey-compute">
      <span className="compute-question">{text}</span>
      <div className="compute-cluster">
        <span className="compute-orbit orbit-a"/><span className="compute-orbit orbit-b"/>
        <span className="compute-center"><Network size={30}/></span>
        <span className="compute-term term-one">{terms[0]}</span>
        <span className="compute-term term-two">{terms[1]}</span>
        <span className="compute-term term-three">{terms[2]}</span>
        <span className="compute-term term-four">{terms[3]}</span>
      </div>
      <Brief>개념적 연관성 표현 · 모델의 실제 내부 상태 아님</Brief>
    </div>}
    {stage==='search'&&<div className="journey-search">
      <div className="search-current"><Search size={20}/><span>{text}</span></div>
      <span className="search-direction"><ArrowDown size={22}/></span>
      <div className="search-external"><CloudSun size={24}/><strong>외부 정보 요청</strong><span>실제 조회는 하지 않음</span></div>
    </div>}
    {stage==='answer'&&<div className="journey-answer">
      <div className="answer-heading"><Sparkles size={19}/><strong>답변 생성 중</strong><span>{Math.min(100,Math.round(progress*100))}%</span></div>
      <div className="answer-moving"><div className="journey-word-steps"><span>{terms[0]}</span><span>{terms[1]}</span><span>{terms[2]}</span></div><ArrowLeft size={22}/></div>
      <div className="answer-paper"><span>AI 답변이 채팅창으로</span><p>{partialAnswer}<b className="journey-caret"/></p></div>
    </div>}
    {stage==='complete'&&<div className="journey-complete">
      <div className="completed-question"><span>질문</span><strong>{text}</strong></div>
      <div className="completed-return"><ArrowLeft size={18}/><span>답변 전달</span></div>
      <div className="completed-answer"><span><CheckCircle2 size={14}/> 답변 도착</span><p>{episode.answer}</p></div>
    </div>}
    <span className="journey-corner north"/><span className="journey-corner south"/>
  </div>
}
