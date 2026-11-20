import { useState } from 'react'
import {
  ArrowRight, BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp,
  Eye, FileSearch, Layers3, MessageCircle,
  Search, ShieldCheck, Sparkles, Wrench
} from 'lucide-react'
import './hidden-tech.css'

type Chapter = {
  id:string
  short:string
  question:string
  takeaway:string
  analogy:string
  optional:boolean
  source:string
}
const docs = {
  text:'https://developers.openai.com/api/docs/guides/text',
  token:'https://huggingface.co/docs/transformers/main_classes/tokenizer',
  tool:'https://developers.openai.com/api/docs/guides/function-calling',
  context:'https://platform.openai.com/docs/guides/conversation-state',
  rag:'https://platform.openai.com/docs/guides/retrieval',
  safety:'https://www.nist.gov/itl/ai-risk-management-framework'
}
export const hiddenChapters:Chapter[] = [
  {id:'input',short:'질문',question:'AI에게 무엇을 부탁했을까?',takeaway:'질문에 목적과 조건이 들어가면 답변 방향을 잡는 데 도움이 돼요.',analogy:'친구에게 “여행 추천”보다 “하루 일정, 가까운 곳”이라고 말하는 것과 같아요.',optional:false,source:docs.text},
  {id:'context',short:'문맥',question:'앞에서 한 말도 함께 볼까?',takeaway:'서비스는 필요에 따라 지시와 이전 대화를 현재 질문과 함께 전달해요.',analogy:'대화할 때 앞에서 나눈 이야기를 참고하는 것과 비슷해요.',optional:false,source:docs.context},
  {id:'token',short:'토큰',question:'AI는 문장을 통째로 볼까?',takeaway:'글은 모델이 계산할 수 있는 작은 조각인 토큰으로 바뀌어요.',analogy:'문장을 작은 레고 블록으로 나눈다고 생각해 보세요.',optional:false,source:docs.token},
  {id:'attention',short:'관계 파악',question:'이 단어가 가리키는 것은 뭘까?',takeaway:'트랜스포머 계열 모델은 문맥 속 토큰들 사이의 관계를 계산해요.',analogy:'“그것”이 앞 문장의 무엇인지 연결해 보는 모습이에요.',optional:false,source:docs.text},
  {id:'weights',short:'이미 배운 것',question:'AI는 지금 새로 공부하는 걸까?',takeaway:'일반적인 질문 응답은 앞서 학습한 모델의 가중치를 사용해 계산해요.',analogy:'시험을 볼 때 매 문제마다 교과서를 처음부터 다시 배우지는 않죠.',optional:false,source:docs.text},
  {id:'predict',short:'다음 말',question:'그럼 답변은 어떻게 시작될까?',takeaway:'언어 모델이 이어질 토큰을 계산하며 문장을 차례로 만들어요.',analogy:'말을 한 조각씩 이어 가며 글을 완성하는 과정이에요.',optional:false,source:docs.text},
  {id:'tools',short:'도구 연결',question:'모르는 최신 정보는 어디서 올까?',takeaway:'연결된 기능이 있다면 필요한 외부 검색이나 API 호출을 요청할 수 있어요.',analogy:'스스로 모르는 정보를 비서에게 찾아 달라고 부탁하는 것 같아요.',optional:true,source:docs.tool},
  {id:'rag',short:'자료 찾아보기',question:'내 문서를 참고하게 할 수 있을까?',takeaway:'RAG를 구성했다면 관련 자료를 찾아 답변 생성의 참고 문맥으로 추가해요.',analogy:'외운 내용에만 의존하지 않고 책에서 필요한 페이지를 찾아보는 거예요.',optional:true,source:docs.rag},
  {id:'memory',short:'기억',question:'AI가 내 정보를 기억할까?',takeaway:'일부 서비스는 허용된 기록을 다시 참고하지만, 저장·이용 방식은 제품과 설정마다 달라요.',analogy:'필요한 메모를 찾아 펼쳐 놓는 것과 비슷해요.',optional:true,source:docs.context},
  {id:'safety',short:'안전 장치',question:'AI가 아무 말이나 하지는 않을까?',takeaway:'서비스마다 입력·출력 검사와 도구 권한 제한 등 안전장치를 둘 수 있어요.',analogy:'건물에 안내문뿐 아니라 출입증과 잠금장치도 두는 것과 같아요.',optional:true,source:docs.safety},
  {id:'stream',short:'화면에 표시',question:'답이 왜 한 줄씩 나타날까?',takeaway:'생성되는 글을 순서대로 사용자 화면에 보내는 방식을 스트리밍이라고 해요.',analogy:'완성된 편지를 기다리지 않고 쓰는 모습을 바로 보는 것 같아요.',optional:false,source:docs.text},
  {id:'verify',short:'확인',question:'그럴듯한 답이면 믿어도 될까?',takeaway:'AI는 잘못된 사실도 자연스럽게 말할 수 있어요. 중요한 내용은 원문을 대조하세요.',analogy:'친구가 확신해도 날짜나 숫자는 한 번 더 확인하는 것과 같아요.',optional:false,source:docs.safety}
]
export function HiddenPicture({id}:{id:string}) {
  switch(id){
    case 'input':return <div className="ht-art ht-prompt"><span className="prompt-message"><MessageCircle size={20}/> 여행 추천해 줘</span><ArrowRight size={17}/><span className="prompt-precise">하루 일정<br/>가까운 곳</span></div>
    case 'context':return <div className="ht-art ht-context"><span className="paper-one">이전 대화</span><span className="paper-two">요청 조건</span><span className="paper-three">지금 질문</span><span className="context-binding"/></div>
    case 'token':return <div className="ht-art ht-token"><span className="token-word">AI가 답해요</span><div><span>AI</span><span>가</span><span>답</span><span>해요</span></div><small>예시 분할 · 실제 토큰은 다를 수 있어요</small></div>
    case 'attention':return <div className="ht-art ht-attention"><svg viewBox="0 0 320 185" aria-hidden="true"><g fill="none" stroke="#91a9a1" strokeWidth="2"><path d="M62 130 Q160 5 258 130"/><path d="M62 130 Q160 185 258 130"/><path d="M160 50 L160 130" strokeDasharray="5 6"/></g><g fontSize="15" fontWeight="700" textAnchor="middle"><rect x="18" y="105" width="88" height="47" rx="12" fill="#dcecdf"/><text x="62" y="135" fill="#395747">고양이가</text><rect x="116" y="27" width="88" height="45" rx="12" fill="#f1e4c8"/><text x="160" y="55" fill="#645635">그것을</text><rect x="215" y="105" width="89" height="47" rx="12" fill="#d5deef"/><text x="259" y="135" fill="#485a83">쫓았다</text></g><circle cx="160" cy="92" r="6" fill="#779b8a" className="attention-dot"/></svg></div>
    case 'weights':return <div className="ht-art ht-weights"><span className="weights-history">학습은 이전에</span><div className="weights-core"><Layers3 size={29}/><span className="weight-one"/><span className="weight-two"/><span className="weight-three"/></div><span className="weights-query">지금은 활용</span></div>
    case 'predict':return <div className="ht-art ht-predict"><div className="predict-intro">하늘이 맑아서...</div><div className="predict-options"><span className="active">산책을</span><span>오늘은</span><span>구름이</span></div><div className="predict-chosen">산책을 <span>할까요?</span></div></div>
    case 'tools':return <div className="ht-art ht-tools"><div className="tools-core"><Sparkles size={24}/><small>AI</small></div><span className="tools-moving"><ArrowRight size={22}/></span><div className="tools-window"><Wrench size={26}/><span>검색 도구</span></div></div>
    case 'rag':return <div className="ht-art ht-rag"><div className="rag-files"><span/><span className="chosen"/><span/></div><span className="rag-light"><Search size={20}/></span><div className="rag-result"><FileSearch size={26}/><small>관련 문단</small></div></div>
    case 'memory':return <div className="ht-art ht-memory"><div className="memory-notebook"><span className="memory-ring"/><span className="memory-row"/><span className="memory-row"/><span className="memory-row"/></div><ArrowRight size={19}/><span className="memory-open"><BookOpenCheck size={37}/></span></div>
    case 'safety':return <div className="ht-art ht-safety"><div className="safety-gates"><span>정보</span><span>권한</span><span>검사</span></div><ShieldCheck size={67}/><div className="safety-lock"><CheckCircle2 size={24}/></div></div>
    case 'stream':return <div className="ht-art ht-stream"><div className="stream-lines"><span/><span/><span/><span/></div><span className="stream-caret"/><div className="stream-bytes"><i/><i/><i/></div></div>
    default:return <div className="ht-art ht-verify"><span className="verify-claim">이 정보가<br/>정확할까?</span><div className="verify-lens"><Eye size={30}/></div><span className="verify-proof"><CheckCircle2 size={25}/><small>출처 확인</small></span></div>
  }
}
export default function HiddenTechAtlas({index,onIndexChange}:{index:number;onIndexChange:(index:number)=>void}) {
  const [explain,setExplain]=useState(false)
  const active=hiddenChapters[index]
  const choose=(value:number)=>{onIndexChange((value+hiddenChapters.length)%hiddenChapters.length);setExplain(false)}
  return <section id="hidden-tech-atlas" className="hidden-tech-atlas" aria-label="질문 뒤에 숨은 AI 기술을 이 자리에서 알아보기">
    <div className="atlas-head">
      <div><span className="atlas-eyebrow"><span/> THE STORY CONTINUES</span><h3>답변 뒤에 숨어 있는 <em>12가지 기술</em></h3></div>
      <span className="atlas-count">{String(index+1).padStart(2,'0')} <span>/ {hiddenChapters.length}</span></span>
    </div>
    <div className="atlas-scroller" role="group" aria-label="숨은 기술 선택">
      {hiddenChapters.map((c,i)=><button type="button" key={c.id} className={'atlas-chip '+(index===i?'selected':'')} onClick={()=>choose(i)} aria-pressed={index===i}>
        <span>{String(i+1).padStart(2,'0')}</span>{c.short}{c.optional&&<i title="일부 상황에서만 사용">선택</i>}
      </button>)}
    </div>
    <div className="atlas-stage">
      <div className={'atlas-picture atlas-picture-'+active.id}><HiddenPicture id={active.id}/></div>
      <div className="atlas-content">
        <div className="atlas-meta"><span>{active.optional?'필요할 때만 사용':'기본 흐름에서 알아두기'}</span><span>CHAPTER {String(index+1).padStart(2,'0')}</span></div>
        <h4>{active.question}</h4>
        <p className="atlas-short">{active.takeaway}</p>
        <button type="button" className="atlas-expand" onClick={()=>setExplain(e=>!e)} aria-expanded={explain}>{explain?'비유 접기':'생활 속 비유로 이해하기'} <ArrowRight size={16}/></button>
        {explain&&<p className="atlas-analogy">{active.analogy}</p>}
        <div className="atlas-bottom">
          <div className="atlas-arrows"><button type="button" onClick={()=>choose(index-1)} aria-label="이전 기술"><ChevronLeft size={20}/></button><button type="button" onClick={()=>choose(index+1)} aria-label="다음 기술"><ChevronRight size={20}/></button></div>
        </div>
      </div>
    </div>
    <p className="atlas-accuracy"><CircleHelp size={15}/> 이 기술들은 하나의 고정된 처리 순서가 아닙니다. 검색·기억·안전 검사 등은 제품이나 설정에 따라 다르게 사용됩니다. 시각화는 교육용 개념 예시입니다.</p>
  </section>
}
