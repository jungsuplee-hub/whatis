import {useEffect,useState} from 'react'
import {ArrowRight,Check,CheckCircle2,ChevronRight,Play,BookOpen,Database,Layers3,Search,Server,ShieldCheck,AlertTriangle,Cpu,HardDrive,Network} from 'lucide-react'
import {
  sampleTokenizer,toyProbabilities,vectorDocuments,similarity,chunksOf,
  roundRobin,lruCache,raidResult,
  type LabDomain
} from './practiceLabData'

type ExerciseProps={solve:(message:string)=>void;solved:boolean;domain:LabDomain;id:string}
function useExerciseState<T>(domain:LabDomain,id:string,initial:T):[T,(value:T|((prev:T)=>T))=>void]{
  const key='whatis:lab:exercise:'+domain+':'+id
  const [value,setValue]=useState<T>(()=>{
    try{const saved=JSON.parse(localStorage.getItem(key)||'null') as T|null;return saved===null?initial:saved}catch{return initial}
  })
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{/* optional browser storage */}},[key,value])
  return [value,setValue]
}
function Feedback({text}:{text:string}){return text&&<div className="plab-try-feedback" role="status"><AlertTriangle size={16}/>{text}</div>}
function CheckAction({onClick,disabled=false,label='완료 확인'}:{onClick:()=>void;disabled?:boolean;label?:string}){
  return <button className="plab-check" type="button" onClick={onClick} disabled={disabled}><CheckCircle2 size={17}/>{label}<ArrowRight size={17}/></button>
}
function Tile({label,value,caption}:{label:string;value:string|number;caption?:string}){
  return <div className="plab-stat"><small>{label}</small><strong>{value}</strong>{caption&&<span>{caption}</span>}</div>
}
function AiPrompt({solve,domain,id}:ExerciseProps){
  const [fields,setFields]=useExerciseState(domain,id,{question:'프로그램 실행 과정을 초보자에게 설명해 주세요.',format:'3단계 표로 정리',evidence:''})
  const [feedback,setFeedback]=useState('')
  const update=(name:keyof typeof fields,value:string)=>setFields(old=>({...old,[name]:value}))
  const ready=fields.question.trim().length>=8&&fields.format.trim().length>=4&&fields.evidence.trim().length>=6
  return <div className="plab-layout">
    <div className="plab-control"><h3><BookOpen size={17}/> 프롬프트 조립기</h3><p>아래 세 영역은 서로 다른 역할을 합니다. 한 부분씩 수정하면서 오른쪽 요청문이 어떻게 변하는지 확인하세요.</p>
      <label>① 목적 / 질문<textarea rows={3} value={fields.question} onChange={e=>update('question',e.target.value)}/></label>
      <label>② 출력 형식<input value={fields.format} onChange={e=>update('format',e.target.value)}/></label>
      <label>③ 검증 조건<textarea rows={3} value={fields.evidence} onChange={e=>update('evidence',e.target.value)} placeholder="예: 확인할 수 없는 부분은 추측하지 말고 출처 확인이 필요하다고 표시해 주세요."/></label>
      <CheckAction onClick={()=>{if(ready)solve('목적·형식·검증 조건을 모두 포함한 요청을 작성했습니다. 실제 답변의 사실성은 추가 확인이 필요합니다.');else setFeedback('목적·형식·검증 조건의 세 칸을 모두 구체적으로 작성해 주세요.')}}/>
      <Feedback text={feedback}/>
    </div>
    <div className="plab-output"><div className="plab-output-head"><span>LIVE PROMPT PREVIEW</span><span className="plab-live-dot">설정 반영</span></div><div className="plab-prompt-paper">
      <strong>당신이 보낼 요청</strong><p>{fields.question||'질문을 입력하세요.'}</p>
      <strong>출력 조건</strong><p>{fields.format||'출력 형식을 지정하세요.'}</p>
      <strong>사실 확인 조건</strong><p>{fields.evidence||'추측이나 불확실성에 대한 처리 원칙을 추가하세요.'}</p>
    </div><p className="plab-output-note">실제 언어 모델에 요청을 보내지 않습니다. 입력문 구성 자체를 연습하는 실습입니다.</p></div>
  </div>
}
function AiTokens({solve,domain,id}:ExerciseProps){
  const initial='AI는 검색한 문서를 참고해 질문에 답할 수 있습니다.'
  const [s,set]=useExerciseState(domain,id,{text:initial,budget:5})
  const [feedback,setFeedback]=useState('')
  const tokens=sampleTokenizer(s.text)
  const active=tokens.slice(0,s.budget),excluded=tokens.slice(s.budget)
  return <div className="plab-layout"><div className="plab-control"><h3><Layers3 size={17}/> 문맥 예산 조절</h3>
    <label>입력 예시<textarea value={s.text} rows={3} onChange={e=>set(o=>({...o,text:e.target.value}))}/></label>
    <label>예제 토큰 예산 <strong>{s.budget}개</strong><input type="range" min={2} max={30} value={s.budget} onChange={e=>set(o=>({...o,budget:Number(e.target.value)}))}/></label>
    <div className="plab-stat-row"><Tile label="모형 토큰 수" value={tokens.length}/><Tile label="예산에 포함" value={active.length}/><Tile label="범위 초과" value={excluded.length}/></div>
    <CheckAction onClick={()=>{if(tokens.length>0&&excluded.length===0)solve('선택한 예제 토큰 예산 안에 문장이 모두 들어왔습니다. 실제 모델의 토큰 수는 토크나이저로 따로 확인해야 합니다.');else setFeedback('토큰 예산을 늘려 아래의 붉은색 범위 초과 조각이 없어지게 해 보세요.')}}/>
    <Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">TOY TOKENIZER · NOT MODEL TOKENS</div><div className="plab-token-cloud">{tokens.map((t,i)=><span key={i} className={i<s.budget?'included':'excluded'}><small>{i+1}</small>{t}</span>)}</div><div className="plab-spectrum"><span style={{width:tokens.length?Math.min(100,s.budget/tokens.length*100)+'%':'0%'}}/></div><p className="plab-output-note">여기서는 단어/기호를 단순히 분리합니다. 실제 한국어 토큰화와 토큰 ID는 모델에 따라 달라집니다.</p></div></div>
}
function AiSampling({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{temp:.8,low:false,high:false})
  const [feedback,setFeedback]=useState('')
  const probs=toyProbabilities(s.temp)
  const labels=['정확한','유용한','흥미로운']
  const record=()=>{
    if(s.temp<=.6)set(v=>({...v,low:true}))
    else if(s.temp>=1.2)set(v=>({...v,high:true}))
    else {setFeedback('낮은 온도(0.6 이하) 또는 높은 온도(1.2 이상)로 이동한 뒤 기록하세요.');return}
    setFeedback('')
  }
  return <div className="plab-layout"><div className="plab-control"><h3><Layers3 size={17}/> 다음 토큰 확률 모형</h3>
    <p>가상 문장: “이 설명은 _____” 뒤에 올 수 있는 세 단어의 상대적인 확률을 관찰합니다.</p>
    <label>Temperature <strong>{s.temp.toFixed(1)}</strong><input type="range" min=".2" max="1.6" step=".1" value={s.temp} onChange={e=>set(v=>({...v,temp:Number(e.target.value)}))}/></label>
    <button className="plab-secondary" onClick={record}><Check size={16}/> 현재 설정 기록</button>
    <div className="plab-checklist"><span className={s.low?'done':''}>{s.low?'✓':'○'} 낮은 온도 기록</span><span className={s.high?'done':''}>{s.high?'✓':'○'} 높은 온도 기록</span></div>
    <CheckAction onClick={()=>{if(s.low&&s.high)solve('낮은 온도와 높은 온도의 토큰 분포를 비교했습니다. 다양성 설정은 사실 정확도를 보장하지 않습니다.');else setFeedback('0.6 이하와 1.2 이상의 값을 각각 기록해 보세요.')}}/>
    <Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">ILLUSTRATIVE SOFTMAX DISTRIBUTION</div><div className="plab-bars">{labels.map((label,i)=><div className="plab-bar-row" key={label}><span>{label}</span><div><i style={{width:(probs[i]*100)+'%'}}/></div><strong>{(probs[i]*100).toFixed(1)}%</strong></div>)}</div><p className="plab-output-note">고정 로짓 [2.4, 1.4, 0.4]에 softmax(로짓/temperature)를 적용한 계산 결과입니다. 실제 LLM의 예측이 아닙니다.</p></div></div>
}
function AiEmbedding({solve,domain,id}:ExerciseProps){
  const [selected,setSelected]=useExerciseState(domain,id,'')
  const [feedback,setFeedback]=useState('')
  const query=[1,0,0]
  const scored=vectorDocuments.map(d=>({...d,score:similarity(query,d.vector)})).sort((a,b)=>b.score-a.score)
  return <div className="plab-layout"><div className="plab-control"><h3><Search size={17}/> 벡터 검색 결과 선택</h3><p>질문: <strong>“배터리 수명 관리에 관한 문서를 찾아줘.”</strong></p><p>오른쪽에 있는 모형 벡터 유사도 점수를 비교하고, 관련성이 가장 높은 문서를 선택해 보세요.</p>
    <div className="plab-checklist"><span>질문 벡터: [1.00, 0.00, 0.00]</span><span>방법: 코사인 유사도</span></div>
    <CheckAction onClick={()=>{if(selected==='doc1')solve('질문 벡터와 가장 가까운 문서를 찾았습니다. 벡터의 수치는 학습용으로 만든 값입니다.');else setFeedback('가장 높은 코사인 유사도 점수를 가진 문서를 선택하세요.')}}/>
    <Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">VECTOR SIMILARITY RANKING</div><div className="plab-doc-results">{scored.map((d,i)=><button key={d.id} className={selected===d.id?'selected':''} onClick={()=>setSelected(d.id)}><span className="plab-result-rank">{String(i+1).padStart(2,'0')}</span><span className="plab-result-title"><strong>{d.title}</strong><span className="plab-mini-meter"><i style={{width:(d.score*100)+'%'}}/></span><small>예제 벡터 [{d.vector.map(x=>x.toFixed(2)).join(', ')}]</small></span><strong>{(d.score*100).toFixed(1)}%</strong></button>)}</div><p className="plab-output-note">유사도는 실제 임베딩 모델의 예측이 아니며, 문서의 사실 여부도 검증하지 않습니다.</p></div></div>
}
const SAMPLE_SENTENCES=['RAG는 질의와 관련된 자료를 검색합니다.','관련 자료를 문맥에 포함할 수 있습니다.','언어 모델은 주어진 맥락을 참고해 응답합니다.','근거가 부족한 응답은 다시 검증해야 합니다.','출처 표시는 사용자에게 확인 경로를 제공합니다.']
function AiChunking({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{size:3,overlap:0})
  const [feedback,setFeedback]=useState('')
  const fragments=chunksOf(SAMPLE_SENTENCES,s.size,s.overlap)
  return <div className="plab-layout"><div className="plab-control"><h3><Layers3 size={17}/> 문서 쪼개기</h3>
    <label>청크 크기 <strong>{s.size}문장</strong><input type="range" min={1} max={4} value={s.size} onChange={e=>set(v=>({...v,size:Number(e.target.value),overlap:Math.min(v.overlap,Number(e.target.value)-1)}))}/></label>
    <label>중첩 <strong>{s.overlap}문장</strong><input type="range" min={0} max={Math.max(0,s.size-1)} value={s.overlap} onChange={e=>set(v=>({...v,overlap:Number(e.target.value)}))}/></label>
    <div className="plab-stat-row"><Tile label="분할 수" value={fragments.length}/><Tile label="원본 문장" value={SAMPLE_SENTENCES.length}/><Tile label="중복 포함 문장" value={fragments.reduce((a,b)=>a+b.length,0)-SAMPLE_SENTENCES.length}/></div>
    <CheckAction onClick={()=>{if(s.size===2&&s.overlap===1)solve('두 문장씩 묶고 한 문장씩 겹치는 구성을 만들었습니다. 검색 정확도는 실제 데이터에서 검증해야 합니다.');else setFeedback('청크 크기를 2문장, 중첩을 1문장으로 설정해 주세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">DOCUMENT CHUNKS</div><div className="plab-chunks">{fragments.map((part,i)=><div key={i}><strong>CHUNK {i+1}</strong>{part.map((sentence,n)=><p key={n}><span>{SAMPLE_SENTENCES.indexOf(sentence)+1}</span>{sentence}</p>)}</div>)}</div></div></div>
}
const ragDocs=[
 {id:'rag',title:'문서 A · RAG의 정의',body:'RAG는 질문에 관련된 외부 문서를 검색해 모델 입력의 참고자료로 제공하는 방식입니다.'},
 {id:'train',title:'문서 B · 재학습',body:'파인튜닝은 별도 학습으로 모델의 가중치 일부 또는 전체를 조정하는 접근입니다.'},
 {id:'device',title:'문서 C · 하드웨어',body:'CPU는 프로그램 명령을 실행하는 하드웨어 장치입니다.'}
]
function AiRag({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{source:'',answer:''})
  const [feedback,setFeedback]=useState('')
  return <div className="plab-layout"><div className="plab-control"><h3><Search size={17}/> 문서를 찾아 근거로 답하기</h3><p><strong>질문:</strong> “RAG는 모델을 매번 다시 학습하는 방식인가요?”</p><div className="plab-choice-label">① 답을 뒷받침할 문서 선택</div><div className="plab-selection">{ragDocs.map(d=><button key={d.id} className={s.source===d.id?'selected':''} onClick={()=>set(v=>({...v,source:d.id}))}>{s.source===d.id?'●':'○'} {d.title}</button>)}</div>
    <div className="plab-choice-label">② 근거에 맞는 답 선택</div><div className="plab-selection">{[{id:'yes',name:'네. 질문할 때마다 모델을 재학습합니다.'},{id:'no',name:'아니요. 검색한 자료를 입력 문맥으로 전달하는 접근입니다.'},{id:'unknown',name:'언어 모델에는 검색 자료를 사용할 방법이 없습니다.'}].map(a=><button key={a.id} className={s.answer===a.id?'selected':''} onClick={()=>set(v=>({...v,answer:a.id}))}>{s.answer===a.id?'●':'○'} {a.name}</button>)}</div>
    <CheckAction onClick={()=>{if(s.source==='rag'&&s.answer==='no')solve('문서 A를 출처로 선택하고 RAG와 재학습을 구분했습니다.');else setFeedback('질문과 직접 관련된 문서를 선택하고 그 문서의 내용에 근거한 답을 고르세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">RETRIEVAL EVIDENCE · DEMO</div><div className="plab-evidence-list">{ragDocs.map(d=><div key={d.id} className={s.source===d.id?'picked':''}><strong>{d.title}</strong><p>{d.body}</p></div>)}</div><p className="plab-output-note">이 실습은 위에 제공된 짧은 문서만 활용합니다. 외부 검색이나 모델 생성을 실제로 수행하지 않습니다.</p></div></div>
}
const TOOL_TASKS=[
 {q:'정확한 42 × 17 계산값이 필요합니다.',correct:'calculator'},
 {q:'오늘 발표된 경기 결과를 확인해야 합니다.',correct:'search'},
 {q:'지금 제공된 긴 글을 간단히 요약해야 합니다.',correct:'text'},
] as const
const TOOLS=[{id:'calculator',title:'계산기'},{id:'search',title:'검색·조회 도구'},{id:'text',title:'텍스트 처리'}]
function AiTools({solve,domain,id}:ExerciseProps){
  const [choices,setChoices]=useExerciseState(domain,id,['','',''])
  const [feedback,setFeedback]=useState('')
  const ready=choices.every(Boolean)
  return <div className="plab-layout"><div className="plab-control"><h3><Network size={17}/> 어떤 도구를 쓸까?</h3><p>아래 세 요청마다 적절한 처리 수단을 고르세요. 실제 외부 도구는 호출하지 않습니다.</p><div className="plab-tool-requests">{TOOL_TASKS.map((task,i)=><div key={i}><span>요청 {i+1}</span><strong>{task.q}</strong><select aria-label={'요청 '+(i+1)+' 도구'} value={choices[i]} onChange={e=>setChoices(v=>v.map((x,j)=>i===j?e.target.value:x))}><option value="">도구 선택</option>{TOOLS.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select></div>)}</div>
    <CheckAction onClick={()=>{if(choices.every((c,i)=>c===TOOL_TASKS[i].correct))solve('계산, 최신 조회, 제공된 텍스트 처리를 요구에 따라 올바르게 구분했습니다.');else setFeedback(ready?'선택 중 하나 이상이 맞지 않습니다. 최신 정보와 정확한 계산에 필요한 도구를 다시 살펴보세요.':'세 요청에 사용할 도구를 모두 선택하세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">APPLICATION TOOL ROUTER</div><div className="plab-routing">{TOOL_TASKS.map((_,i)=><div key={i}><span>REQUEST {i+1}</span><ArrowRight size={17}/><strong>{TOOLS.find(tool=>tool.id===choices[i])?.title||'도구 미선택'}</strong></div>)}</div><p className="plab-output-note">모델이 도구 사용을 제안하더라도, 실제 실행·권한 검사는 애플리케이션의 책임입니다.</p></div></div>
}
const EVIDENCE=['CPU는 명령어를 가져오고 실행합니다.','RAM은 실행 중 필요한 데이터를 저장하며, 전원이 끊기면 내용이 유지되지 않습니다.','SSD는 파일을 보관할 수 있는 비휘발성 저장장치입니다.']
const CLAIMS=[
 {claim:'CPU는 명령어를 실행합니다.',answer:'supported'},
 {claim:'RAM은 전원 공급이 없어도 항상 내용을 유지합니다.',answer:'contradicted'},
 {claim:'이 시스템의 SSD는 2TB입니다.',answer:'unknown'},
 {claim:'SSD는 파일 보관에 사용할 수 있습니다.',answer:'supported'}
] as const
function AiEvaluation({solve,domain,id}:ExerciseProps){
  const [choices,setChoices]=useExerciseState(domain,id,['','','',''])
  const [feedback,setFeedback]=useState('')
  const statuses=[{id:'supported',name:'자료로 확인됨'},{id:'contradicted',name:'자료와 충돌'},{id:'unknown',name:'자료만으로 판단 불가'}]
  return <div className="plab-layout"><div className="plab-control"><h3><ShieldCheck size={17}/> 주장을 근거와 대조</h3><p>오른쪽 참고자료만 사용해 각 주장에 가장 가까운 판정을 해 보세요.</p><div className="plab-tool-requests">{CLAIMS.map((row,i)=><div key={i}><span>주장 {i+1}</span><strong>{row.claim}</strong><select aria-label={'주장 '+(i+1)+' 판정'} value={choices[i]} onChange={e=>setChoices(v=>v.map((x,j)=>i===j?e.target.value:x))}><option value="">근거 판정 선택</option>{statuses.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>)}</div>
    <CheckAction onClick={()=>{if(choices.every((x,i)=>x===CLAIMS[i].answer))solve('확인된 사실·자료와 충돌하는 주장·자료로 판단할 수 없는 주장을 정확히 구별했습니다.');else setFeedback('제공된 세 문장만 기준으로 다시 판단해 보세요. 자료가 없다는 사실과 거짓임은 서로 다릅니다.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">REFERENCE NOTES · PROVIDED EVIDENCE</div><div className="plab-evidence-list">{EVIDENCE.map((text,i)=><div key={i}><strong>참고자료 {i+1}</strong><p>{text}</p></div>)}</div><p className="plab-output-note">이 판정은 위에 표시된 내용만 대상으로 합니다. 외부 사실관계 확인을 대신하지 않습니다.</p></div></div>
}
function ComputerBinary({solve,domain,id}:ExerciseProps){
  const [bits,setBits]=useExerciseState(domain,id,[0,0,0,0,0,0,0,0])
  const [feedback,setFeedback]=useState('')
  const sum=bits.reduce((n,b,i)=>n+b*2**(7-i),0)
  return <div className="plab-layout"><div className="plab-control"><h3><Cpu size={17}/> 8비트 스위치</h3><p>각 스위치를 누르면 해당 자리값을 더하거나 뺍니다. 목표는 부호 없는 정수 <strong>13</strong>입니다.</p>
    <div className="plab-bit-switches">{bits.map((v,i)=><button key={i} className={v?'on':''} aria-pressed={Boolean(v)} aria-label={(2**(7-i))+'자리 비트'} onClick={()=>setBits(o=>o.map((x,j)=>j===i?1-x:x))}><small>{2**(7-i)}</small><strong>{v}</strong></button>)}</div>
    <div className="plab-stat-row"><Tile label="현재 10진수" value={sum}/><Tile label="목표" value="13"/><Tile label="8비트 표기" value={bits.join('')}/></div>
    <CheckAction onClick={()=>{if(sum===13)solve('13을 이진수 00001101로 표현했습니다.');else setFeedback('자리값 8 + 4 + 1을 선택하면 13이 됩니다.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">BINARY REPRESENTATION</div><div className="plab-large-number">{bits.join('')}<span>BASE 2</span></div><div className="plab-equation">{bits.map((bit,i)=>bit?String(2**(7-i)):null).filter(Boolean).join(' + ')||'0'} = <strong>{sum}</strong></div><p className="plab-output-note">8비트 부호 없는 정수 범위는 0~255입니다. 이 모형은 문자 인코딩이나 부호 표현을 다루지 않습니다.</p></div></div>
}
const CPU_STEPS=[{ins:'LOAD 5',note:'즉시값 5를 누산기(ACC)에 적재합니다.'},{ins:'ADD 3',note:'ACC의 값에 3을 더합니다.'},{ins:'STORE [0]',note:'ACC 값을 메모리 주소 0에 저장합니다.'},{ins:'HALT',note:'실행을 종료합니다.'}]
function ComputerCPU({solve,domain,id}:ExerciseProps){
  const [pc,setPC]=useExerciseState(domain,id,0)
  const [feedback,setFeedback]=useState('')
  const acc=pc===0?0:pc===1?5:8
  const memory=pc>=3?8:0
  return <div className="plab-layout"><div className="plab-control"><h3><Cpu size={17}/> 작은 CPU 실행기</h3><p>프로그램 카운터(PC)가 가리키는 다음 명령을 한 번씩 실행해 보세요.</p>
    <div className="plab-instructions">{CPU_STEPS.map((instruction,i)=><div className={i===pc?'next':i<pc?'done':''} key={i}><span>{String(i).padStart(2,'0')}</span><code>{instruction.ins}</code><small>{i<pc?'실행됨':i===pc?'다음 실행':'대기'}</small></div>)}</div>
    <button className="plab-secondary" disabled={pc>=4} onClick={()=>setPC(v=>Math.min(4,v+1))}><Play size={15}/> {pc<4?CPU_STEPS[pc].ins+' 실행':'실행 종료'}</button>
    <CheckAction onClick={()=>{if(pc===4&&memory===8)solve('LOAD → ADD → STORE → HALT를 순서대로 실행해 메모리 [0]에 8을 저장했습니다.');else setFeedback('모든 명령을 실행한 다음 결과를 확인하세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">CPU REGISTERS / MEMORY</div><div className="plab-registers"><Tile label="PC" value={pc}/><Tile label="ACC" value={acc}/><Tile label="MEMORY [0]" value={memory}/></div><div className="plab-cpu-graphic"><span>PROGRAM</span><ArrowRight/><strong>CPU / ACC</strong><ArrowRight/><span>RAM[0]</span></div><p className="plab-execution-note">{pc===0?'첫 명령을 실행하세요.':CPU_STEPS[pc-1].note}</p><p className="plab-output-note">실제 CPU의 명령어 형식이나 타이밍을 복제한 것은 아닌 단순 누산기 모형입니다.</p></div></div>
}
const CACHE_SEQ=['A','B','A','C','A','B']
function ComputerCache({solve,domain,id}:ExerciseProps){
  const [step,setStep]=useExerciseState(domain,id,0)
  const [feedback,setFeedback]=useState('')
  const records=lruCache(CACHE_SEQ.slice(0,step),2)
  const last=records.at(-1)
  const hits=records.filter(x=>x.hit).length
  const cache=last?.cache||[]
  return <div className="plab-layout"><div className="plab-control"><h3><Database size={17}/> 두 칸짜리 LRU 캐시</h3><p>접근 순서는 <strong>A → B → A → C → A → B</strong>입니다. 다음 요청을 차례로 실행하세요.</p>
    <div className="plab-access-seq">{CACHE_SEQ.map((x,i)=><span key={i} className={i<step?'done':i===step?'current':''}>{x}</span>)}</div>
    <button className="plab-secondary" disabled={step>=CACHE_SEQ.length} onClick={()=>setStep(v=>Math.min(CACHE_SEQ.length,v+1))}><Play size={15}/> {step<CACHE_SEQ.length?'다음 접근 '+CACHE_SEQ[step]:'접근 완료'}</button>
    <div className="plab-stat-row"><Tile label="Cache Hit" value={hits}/><Tile label="Cache Miss" value={step-hits}/><Tile label="접근 완료" value={step+' / '+CACHE_SEQ.length}/></div>
    <CheckAction onClick={()=>{if(step===CACHE_SEQ.length)solve('6회 접근 중 Hit '+hits+'회, Miss '+(step-hits)+'회를 계산했습니다. 이 결과는 2칸 LRU 모형의 결과입니다.');else setFeedback('접근을 6회 모두 실행하고 Hit/Miss를 관찰해 주세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">CACHE SLOTS · LRU (OLDEST → NEWEST)</div><div className="plab-cache-slots">{[0,1].map(i=><div key={i}><span>SLOT {i+1}</span><strong>{cache[i]||'—'}</strong></div>)}</div><div className="plab-cache-history">{records.map((r,i)=><div key={i}><span>{i+1}. {r.value}</span><strong className={r.hit?'hit':'miss'}>{r.hit?'HIT':'MISS'}</strong><small>[{r.cache.join(', ')}]</small></div>)}</div><p className="plab-output-note">캐시 라인은 같은 크기이며 교체 정책은 LRU라고 가정합니다.</p></div></div>
}
function ComputerScheduler({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{quantum:4,ran:false})
  const [feedback,setFeedback]=useState('')
  const schedule=roundRobin(s.quantum)
  return <div className="plab-layout"><div className="plab-control"><h3><Cpu size={17}/> Round Robin 스케줄러</h3><p>세 작업의 실행 시간: A=5, B=3, C=2. 모든 작업은 시간 0에 도착합니다.</p>
    <label>Time quantum <strong>{s.quantum}단위</strong><input type="range" min={1} max={4} value={s.quantum} onChange={e=>set(o=>({...o,quantum:Number(e.target.value),ran:false}))}/></label>
    <button className="plab-secondary" onClick={()=>set(o=>({...o,ran:true}))}><Play size={15}/> 스케줄 실행</button>
    <CheckAction onClick={()=>{if(s.quantum===2&&s.ran)solve('타임 퀀텀 2로 실행 순서와 대기 시간을 계산했습니다.');else setFeedback('타임 퀀텀을 2로 변경하고 [스케줄 실행]을 누르세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">TIMELINE · SINGLE CPU</div>{s.ran?<><div className="plab-timeline">{schedule.timeline.map((run,i)=><div key={i} className={'process-'+run.name} style={{flex:run.end-run.start}} title={run.name+': '+run.start+'~'+run.end}><strong>{run.name}</strong><small>{run.start}–{run.end}</small></div>)}</div><div className="plab-stat-row"><Tile label="A 대기" value={schedule.waiting.A}/><Tile label="B 대기" value={schedule.waiting.B}/><Tile label="C 대기" value={schedule.waiting.C}/></div></>:<p className="plab-empty-result">[스케줄 실행]을 누르면 시간 배분 결과가 나타납니다.</p>}<p className="plab-output-note">단위는 가상 시간 단위입니다. 문맥 전환 비용·선점 우선순위·I/O 대기는 포함하지 않습니다.</p></div></div>
}
function ComputerPaging({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{page:'',offset:''})
  const [feedback,setFeedback]=useState('')
  const addr=12345,pageSize=4096,expectedPage=Math.floor(addr/pageSize),expectedOffset=addr%pageSize
  return <div className="plab-layout"><div className="plab-control"><h3><Layers3 size={17}/> 가상 주소 변환</h3><p>페이지 크기 4KiB(4,096바이트), 가상 주소 <strong>12,345</strong>를 페이지 번호와 페이지 내부 오프셋으로 분해합니다.</p>
    <div className="plab-inline-fields"><label>페이지 번호<input type="number" min={0} placeholder="정수 입력" value={s.page} onChange={e=>set(o=>({...o,page:e.target.value}))}/></label><label>오프셋 (바이트)<input type="number" min={0} placeholder="0 ~ 4095" value={s.offset} onChange={e=>set(o=>({...o,offset:e.target.value}))}/></label></div>
    <CheckAction onClick={()=>{if(Number(s.page)===expectedPage&&Number(s.offset)===expectedOffset&&s.page!==''&&s.offset!=='')solve('가상 페이지 3, 오프셋 57을 구했습니다. 프레임 7에 매핑된 경우 물리 주소는 28,729입니다.');else setFeedback('12,345를 4,096으로 나눈 몫과 나머지를 입력해 보세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">PAGE TABLE · EXAMPLE MAPPING</div><div className="plab-table"><div><span>가상 페이지</span><span>물리 프레임</span></div>{[[0,4],[1,2],[2,'미할당'],[3,7],[4,'미할당']].map(([p,f])=><div key={p} className={p===3?'selected':''}><span>PAGE {p}</span><strong>{f==='미할당'?f:'FRAME '+f}</strong></div>)}</div><p className="plab-equation">물리 주소 = 프레임 번호 × 페이지 크기 + 오프셋</p><p className="plab-output-note">페이지가 매핑되어 있다는 예제 조건입니다. TLB, 접근 권한, 페이지 부재 처리 과정은 생략했습니다.</p></div></div>
}
function ComputerRAID({solve,domain,id}:ExerciseProps){
  const [s,set]=useExerciseState(domain,id,{level:'0',capacity:'',faults:''})
  const [feedback,setFeedback]=useState('')
  const calc=raidResult(s.level as '0'|'1'|'5')
  const cellLabels=s.level==='5'?[['A','B','P'],['C','P','D'],['P','E','F']]:s.level==='1'?[['A','A','A'],['B','B','B'],['C','C','C']]:[['A','B','C'],['D','E','F'],['G','H','I']]
  return <div className="plab-layout"><div className="plab-control"><h3><HardDrive size={17}/> 디스크 구성 선택</h3><p>동일한 크기의 1TB 디스크 3개를 사용합니다. <strong>RAID 5</strong> 구성의 사용 가능 용량과 허용 가능한 디스크 장애 수를 답하세요.</p>
    <label>배열 방식<select value={s.level} onChange={e=>set(o=>({...o,level:e.target.value}))}><option value="0">RAID 0 (Striping)</option><option value="1">RAID 1 (3-way Mirror 예제)</option><option value="5">RAID 5 (Distributed Parity)</option></select></label>
    <div className="plab-inline-fields"><label>사용 가능 용량 (TB)<input value={s.capacity} type="number" min={0} onChange={e=>set(o=>({...o,capacity:e.target.value}))}/></label><label>허용 디스크 장애 개수<input value={s.faults} type="number" min={0} onChange={e=>set(o=>({...o,faults:e.target.value}))}/></label></div>
    <CheckAction onClick={()=>{if(s.level==='5'&&s.capacity==='2'&&s.faults==='1')solve('RAID 5, 1TB 디스크 3개의 사용 가능 용량 2TB와 단일 디스크 장애 허용을 확인했습니다.');else setFeedback('RAID 5에서 패리티 1개 디스크 분량을 제외하면 몇 TB가 남는지 계산하세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">DISK LAYOUT · SIMPLIFIED</div><div className="plab-raid-grid">{[0,1,2].map(d=><div key={d}><strong>DISK {d+1} · 1 TB</strong>{cellLabels.map((row,i)=><span className={row[d]==='P'?'parity':''} key={i}>{row[d]==='P'?'PARITY':row[d]}</span>)}</div>)}</div><div className="plab-stat-row"><Tile label="모형 용량" value={calc.usable+' TB'}/><Tile label="허용 장애" value={calc.tolerated+'개'}/></div><p className="plab-output-note">RAID 1은 디스크 3개에 동일 데이터를 복제하는 가상의 3-way Mirror를 가정합니다. 제품별 배열 구성은 다를 수 있으며 RAID가 백업을 대체하지 않습니다.</p></div></div>
}
const FAILOVER_PHASES=[
 {name:'정상 운영',info:'Primary에서 서비스 중, Standby는 대기 중입니다.'},
 {name:'Primary 장애',info:'Primary가 중단되어 서비스 요청 처리가 실패합니다.'},
 {name:'장애 감지',info:'Health Check가 Primary 장애를 확인했습니다.'},
 {name:'대체 노드 전환',info:'Standby가 서비스 역할을 넘겨받았습니다.'},
 {name:'서비스 확인',info:'요청이 대체 노드에서 처리되는지 확인했습니다.'}
]
function ComputerFailover({solve,domain,id}:ExerciseProps){
  const [phase,setPhase]=useExerciseState(domain,id,0)
  const [feedback,setFeedback]=useState('')
  return <div className="plab-layout"><div className="plab-control"><h3><Network size={17}/> 장애 대응 순서 연습</h3><p>아래 버튼으로 장애 발생 → 감지 → 대체 노드로 전환 → 서비스 확인을 수행하세요.</p>
    <div className="plab-fail-actions">{FAILOVER_PHASES.slice(1).map((step,i)=><button key={step.name} disabled={phase!==i} className={phase>i?'done':phase===i?'next':''} onClick={()=>setPhase(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{step.name}<ChevronRight size={16}/></button>)}</div>
    <CheckAction onClick={()=>{if(phase===4)solve('서비스 장애를 감지하고 대체 노드에서 요청이 처리되는지 확인했습니다. 실제 복구 시간·데이터 정합성은 별도로 검증해야 합니다.');else setFeedback('위쪽 네 단계의 버튼을 순서대로 실행하세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">HA NODE STATUS</div><div className="plab-ha-nodes"><div className={phase>=1?'failed':'online'}><Server size={28}/><strong>PRIMARY</strong><span>{phase===0?'정상 서비스':'장애 발생'}</span></div><div className={phase>=3?'online':'standby'}><Server size={28}/><strong>STANDBY</strong><span>{phase>=3?'서비스 담당':'대기 중'}</span></div></div><div className="plab-stage-message"><strong>{FAILOVER_PHASES[phase].name}</strong><p>{FAILOVER_PHASES[phase].info}</p></div><p className="plab-output-note">실제 서버에 장애를 일으키지 않는 안전한 상태 시뮬레이션입니다.</p></div></div>
}
function ComputerCapacity({solve,domain,id}:ExerciseProps){
  const [instances,setInstances]=useExerciseState(domain,id,1)
  const [feedback,setFeedback]=useState('')
  const load=120,perServer=50,capacity=instances*perServer
  const handled=Math.min(load,capacity),waiting=Math.max(load-capacity,0)
  return <div className="plab-layout"><div className="plab-control"><h3><Server size={17}/> 서버 수와 처리 용량</h3><p>분당 요청 <strong>120건</strong>, 각 서버가 분당 <strong>50건</strong>을 처리할 수 있다는 가정입니다. 모든 요청을 처리하는 <strong>최소 서버 수</strong>를 찾으세요.</p>
    <label>서버 인스턴스 <strong>{instances}대</strong><input type="range" min={1} max={5} value={instances} onChange={e=>setInstances(Number(e.target.value))}/></label>
    <div className="plab-stat-row"><Tile label="들어온 요청" value={load+' / 분'}/><Tile label="처리 가능" value={capacity+' / 분'}/><Tile label="미처리 수" value={waiting}/></div>
    <CheckAction onClick={()=>{if(instances===3)solve('서버 3대라면 분당 150건의 이론적 용량으로 120건을 처리할 수 있습니다. 실제 운영에는 여유 자원을 추가로 고려해야 합니다.');else setFeedback(instances<3?'요청이 처리 용량보다 많습니다. 서버를 더 추가하세요.':'모두 처리할 수 있지만 최소 용량 구성은 아닙니다. 서버 수를 조정하세요.')}}/><Feedback text={feedback}/></div>
    <div className="plab-output"><div className="plab-output-head">SIMULATED SCALING · NOT BENCHMARK</div><div className="plab-service-demand"><span>요청 120건/분</span><div><i style={{width:(handled/load*100)+'%'}}/></div><strong>{waiting===0?'전체 처리 가능':waiting+'건/분 용량 부족'}</strong></div><div className="plab-server-grid">{Array.from({length:instances},(_,i)=><div key={i}><Server size={25}/><strong>INSTANCE {i+1}</strong><span>50 req/min</span></div>)}</div><p className="plab-output-note">고정 처리량 가정의 산술 모형입니다. 응답 지연, 병목, 장애, 부하의 변화는 반영하지 않습니다.</p></div></div>
}
export default function PracticeExercise(props:ExerciseProps){
  if(props.domain==='ai'){
    switch(props.id){
      case 'prompt':return <AiPrompt {...props}/>
      case 'tokens':return <AiTokens {...props}/>
      case 'sampling':return <AiSampling {...props}/>
      case 'embedding':return <AiEmbedding {...props}/>
      case 'chunking':return <AiChunking {...props}/>
      case 'rag':return <AiRag {...props}/>
      case 'tools':return <AiTools {...props}/>
      case 'evaluation':return <AiEvaluation {...props}/>
    }
  }else{
    switch(props.id){
      case 'binary':return <ComputerBinary {...props}/>
      case 'cpu':return <ComputerCPU {...props}/>
      case 'cache':return <ComputerCache {...props}/>
      case 'scheduler':return <ComputerScheduler {...props}/>
      case 'paging':return <ComputerPaging {...props}/>
      case 'raid':return <ComputerRAID {...props}/>
      case 'failover':return <ComputerFailover {...props}/>
      case 'capacity':return <ComputerCapacity {...props}/>
    }
  }
  return <p>이 실습 유형은 준비되지 않았습니다.</p>
}
