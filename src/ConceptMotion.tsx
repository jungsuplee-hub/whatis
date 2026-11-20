import { BookOpen, Brain, Check, Database, FileText, MessagesSquare, MoveRight, Search, ShieldCheck, Sparkles, Wrench, Mic, MessageCircle, AlertCircle, LockKeyhole } from 'lucide-react'
import type { CategoryId } from './data'
import './editorial.css'

interface Props { category: CategoryId; compact?: boolean; step?: number; label?: string; topicId?: string }
export default function ConceptMotion({category,compact=false,step=0,label,topicId}:Props){
  const specialized=['search-vs-ai','image-generation','hallucination','speech-to-text','tokens','personal-data'].includes(topicId||'')
  const progress=step%3
  return <div className={'motion-scene scene-'+category+(compact?' scene-compact':'')} role="img" aria-label={label || '기술 개념을 설명하는 움직이는 예시'}>
    <span className="scene-grid" aria-hidden="true"/>

    {topicId==='search-vs-ai'&&<div className="scene-demo comparison-demo"><div className="compare-search"><Search size={27}/><FileText size={20}/></div><span className="compare-flow">→</span><div className="compare-answer"><MessageCircle size={32}/><span/><span/></div><span className="scene-caption">찾아보기 / 설명 만들기</span></div>}
    {topicId==='image-generation'&&<div className="scene-demo image-demo"><div className="image-caption"><Sparkles size={20}/> 말로 장면을 요청</div><div className="image-created"><span className="art-sun"/><span className="art-hill hill-one"/><span className="art-hill hill-two"/><span className="art-cloud"/></div><span className="scene-caption">새로운 그림이 나타나요</span></div>}
    {topicId==='hallucination'&&<div className="scene-demo verify-demo"><span className="verify-question">정말 맞을까?</span><span className="verify-connecting">→</span><div className="verify-check"><AlertCircle size={30}/><strong>근거 확인</strong></div><span className="scene-caption">그럴듯한 말도 다시 확인하기</span></div>}
    {topicId==='speech-to-text'&&<div className="scene-demo voice-demo"><Mic size={35}/><div className="voice-bars">{Array.from({length:11},(_,i)=><i key={i}/>)}</div><span className="voice-arrow">→</span><div className="voice-text"><span/><span/><span/></div><span className="scene-caption">목소리를 글자로 바꿔요</span></div>}
    {topicId==='tokens'&&<div className="scene-demo token-demo"><div className="token-origin">AI에게 질문해요</div><div className="token-tiles"><span>AI</span><span>에게</span><span>질문</span><span>해요</span></div><span className="scene-caption">실제 토큰 분할은 모델마다 달라요</span></div>}
    {topicId==='personal-data'&&<div className="scene-demo privacy-demo"><div className="privacy-card"><span>••• •••</span></div><LockKeyhole size={35}/><ShieldCheck size={39}/><span className="scene-caption">꼭 필요한 정보만 입력해요</span></div>}
    {!specialized&&category==='foundations' && <div className="scene-demo foundation-demo">
      <div className="sorting-source"><span className="sorting-shape shape-one"/><span className="sorting-shape shape-two"/><span className="sorting-shape shape-three"/></div>
      <span className="scene-travel-line"/><div className="sorting-target"><span className="sorting-bin"><span className="sorting-shape shape-one"/></span><span className="sorting-bin"><span className="sorting-shape shape-two"/></span></div>
      <span className="scene-caption">비슷한 것을 구별하기</span>
    </div>}
    {!specialized&&category==='models' && <div className="scene-demo model-demo">
      <div className="model-question">오늘 하늘은…</div><div className="model-chips"><span>맑고</span><span>파랗다</span><span className="model-chip-typing">▮</span></div><div className="model-cursor"><Sparkles size={21}/></div><span className="scene-caption">다음에 이어질 말을 계산하기</span>
    </div>}
    {!specialized&&category==='retrieval' && <div className="scene-demo retrieval-demo">
      <div className="retrieval-files"><FileText/><FileText/><FileText/></div><span className="retrieval-laser"/><div className="retrieval-result"><Search size={20}/><span/><span/></div><span className="scene-caption">필요한 자료를 찾아보기</span>
    </div>}
    {!specialized&&category==='agents' && <div className="scene-demo agent-demo">
      <div className="agent-orbit"><span className="agent-dot dot-a"/><span className="agent-dot dot-b"/><span className="agent-dot dot-c"/><span className="agent-traveler"/><div className="agent-center"><Wrench size={25}/></div></div>
      <span className="scene-caption">순서대로 도구 사용하기</span>
    </div>}
    {!specialized&&category==='training' && <div className="scene-demo training-demo">
      <div className="training-bars"><span/><span/><span/><span/><span/></div><div className="training-target"><span/><span/><span/></div><div className="training-indicator"><Check size={19}/></div><span className="scene-caption">예시를 보고 점점 맞춰보기</span>
    </div>}
    {!specialized&&category==='production' && <div className="scene-demo production-demo">
      <span className="production-input"><MessagesSquare size={25}/></span><span className="production-pipe"/><div className="production-shield"><ShieldCheck size={44}/></div><span className="production-output"><Check size={25}/></span><span className="scene-caption">사용 전에 살펴보고 확인하기</span>
    </div>}
    {!specialized&&category==='plm' && <div className="scene-demo agent-demo"><BookOpen size={60}/></div>}
    {!specialized&&category==='alm' && <div className="scene-demo agent-demo"><Brain size={60}/></div>}
    {!specialized&&category==='engineering' && <div className="scene-demo agent-demo"><Database size={60}/></div>}
    {!specialized&&category==='manufacturing' && <div className="scene-demo agent-demo"><MoveRight size={60}/></div>}
    <span className="scene-live" aria-hidden="true"><span/> LIVE EXAMPLE</span>
    <span className={'scene-phase phase-'+progress} aria-hidden="true"><i/><i/><i/></span>
  </div>
}
