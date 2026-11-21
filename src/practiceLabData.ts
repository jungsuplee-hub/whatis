export type LabDomain='ai'|'computer'
export type LabLesson={
  id:string
  chapter:string
  title:string
  english:string
  goal:string
  concept:string
  sourceId:string
  sourceTitle:string
  sourceNote?:string
}
export const aiLessons:LabLesson[]=[
 {id:'prompt',chapter:'AI 기초',title:'좋은 질문 설계하기',english:'Prompt Design',goal:'질문, 출력 형식, 사실 확인 조건을 조립하세요.',concept:'프롬프트에 목적과 원하는 출력 형식을 명확히 적으면 원하는 형태의 결과를 요청하기 쉬워집니다. 정확성은 별도 검증이 필요합니다.',sourceId:'prompt-engineering',sourceTitle:'프롬프트 엔지니어링'},
 {id:'tokens',chapter:'AI 기초',title:'토큰과 문맥 창',english:'Token / Context Budget',goal:'모형 문장이 모두 포함되도록 토큰 예산을 조절하세요.',concept:'토큰은 언어 모델이 처리하는 단위입니다. 실제 토큰 경계는 모델마다 다르며 여기에서는 개념용 분할기를 사용합니다.',sourceId:'tokens',sourceTitle:'토큰'},
 {id:'sampling',chapter:'생성 과정',title:'Temperature 비교 실험',english:'Toy Sampling',goal:'낮은 온도와 높은 온도에서 선택 확률이 어떻게 달라지는지 모두 기록하세요.',concept:'동일한 점수(로짓)에 대해 temperature를 적용하면 출력 분포의 뾰족한 정도가 달라질 수 있습니다. 실제 LLM의 성능이나 정확도를 직접 의미하지는 않습니다.',sourceId:'llm',sourceTitle:'대규모 언어 모델',sourceNote:'아래 확률은 실제 서비스 모델이 아닌 고정 점수의 수학적 예시입니다.'},
 {id:'embedding',chapter:'검색과 RAG',title:'의미 유사도 검색',english:'Embedding / Cosine Similarity',goal:'질문과 가장 가까운 문서를 코사인 유사도 결과로 골라보세요.',concept:'벡터 간 유사도를 활용하면 관련 문서 후보를 순위화할 수 있습니다. 유사도가 높다고 문서의 사실이 참이라는 뜻은 아닙니다.',sourceId:'embeddings',sourceTitle:'임베딩'},
 {id:'chunking',chapter:'검색과 RAG',title:'문서 청킹 구성',english:'Chunking / Overlap',goal:'문장 2개씩, 1문장 중첩하여 문서 조각을 만들어보세요.',concept:'작은 청크와 중첩은 검색에서 필요한 문맥을 보존하는 데 도움이 될 수 있지만 저장량과 중복을 늘리기도 합니다.',sourceId:'chunking',sourceTitle:'청킹'},
 {id:'rag',chapter:'검색과 RAG',title:'근거를 찾아 답변하기',english:'Retrieval-Augmented Generation',goal:'질문에 맞는 근거 문서를 고르고, 근거에 맞는 답을 선택하세요.',concept:'RAG는 관련 자료를 검색해 모델 입력에 제공하는 방식입니다. 실제 답변은 검색 결과와 생성 결과를 다시 검증해야 합니다.',sourceId:'rag',sourceTitle:'RAG'},
 {id:'tools',chapter:'Agent와 도구',title:'상황별 도구 호출',english:'Tool Routing',goal:'계산·최신 정보·제공된 글에 적합한 도구를 각각 선택하세요.',concept:'도구 호출은 필요한 기능을 선택·제안하는 단계와 실제로 실행하는 애플리케이션 단계를 구분합니다.',sourceId:'function-calling',sourceTitle:'툴 호출'},
 {id:'evaluation',chapter:'신뢰성',title:'근거에 맞는 주장 평가',english:'Grounded Evaluation',goal:'제공된 참고자료에서 확인되는 주장과 확인할 수 없는 주장을 구분하세요.',concept:'AI의 문장이 그럴듯해도 출처와 원문의 범위를 대조해야 합니다. 증거가 없다고 반드시 거짓인 것은 아닙니다.',sourceId:'hallucination',sourceTitle:'환각과 검증'}
]
export const computerLessons:LabLesson[]=[
 {id:'binary',chapter:'01 · 기본 구조',title:'비트로 숫자 표현하기',english:'8-bit Binary',goal:'8개 비트 스위치를 조작해 10진수 13을 만들어보세요.',concept:'이진수는 각 비트가 2의 거듭제곱 자리값을 가집니다. 아래는 부호 없는 8비트 정수 모형입니다.',sourceId:'computer-parts',sourceTitle:'컴퓨터 기본 구조'},
 {id:'cpu',chapter:'01 · 기본 구조',title:'CPU 명령 실행',english:'Fetch / Decode / Execute',goal:'네 개 명령어를 순서대로 실행하고 메모리 결과를 확인하세요.',concept:'CPU는 명령어를 가져와 해석·실행합니다. 실제 CPU는 파이프라인 등으로 중첩할 수 있지만 여기서는 순차 모형입니다.',sourceId:'cpu-instructions',sourceTitle:'CPU 명령어 처리'},
 {id:'cache',chapter:'02 · 캐시와 메모리',title:'캐시 적중과 교체',english:'LRU Cache',goal:'메모리 접근 6회를 실행해 Hit/Miss를 관찰하세요.',concept:'캐시는 최근 사용 데이터를 가까이 보관합니다. 아래는 용량 2개인 완전 연관 LRU 캐시의 단순 모형입니다.',sourceId:'cache-journey',sourceTitle:'캐시 메모리'},
 {id:'scheduler',chapter:'03 · 운영체제',title:'CPU 스케줄러 구성',english:'Round Robin',goal:'타임 퀀텀을 2로 설정해 세 프로세스의 실행 순서를 살펴보세요.',concept:'Round Robin은 준비된 작업에 일정 시간씩 CPU를 제공합니다. 실제 스케줄러는 우선순위·입출력 등 더 많은 조건이 있습니다.',sourceId:'cpu-scheduler',sourceTitle:'CPU 스케줄링'},
 {id:'paging',chapter:'04 · 가상 메모리',title:'주소 변환 계산',english:'Paging / Page Table',goal:'가상 주소 12,345의 페이지 번호와 오프셋을 구하세요.',concept:'페이지 크기로 가상 주소를 나누어 페이지 번호와 오프셋을 얻습니다. 페이지 테이블을 통해 프레임을 찾거나 페이지 부재를 처리할 수 있습니다.',sourceId:'paging-tlb',sourceTitle:'페이징과 TLB'},
 {id:'raid',chapter:'05 · 저장장치',title:'RAID 용량과 장애 허용',english:'RAID 0 / 1 / 5',goal:'1TB 디스크 3개를 RAID 5로 묶을 때 사용 가능 용량과 허용 장애 개수를 답하세요.',concept:'RAID 5는 분산 패리티로 디스크 1개 장애에 대비합니다. RAID는 삭제·손상에 대비한 별도 백업을 대신하지 않습니다.',sourceId:'raid-levels',sourceTitle:'RAID 수준'},
 {id:'failover',chapter:'06 · 가용성',title:'장애 대응 실습',english:'High Availability / Failover',goal:'장애 발생부터 감지·전환·정상 확인까지 순서대로 진행하세요.',concept:'HA 구성은 감지와 대체 경로가 있어야 중단을 줄일 수 있습니다. 실제 전환 시간과 데이터 정합성은 시스템 설계에 따라 다릅니다.',sourceId:'availability',sourceTitle:'고가용성'},
 {id:'capacity',chapter:'07 · 클라우드',title:'서비스 용량 계획',english:'Capacity / Scale Out',goal:'분당 120개 요청을 처리할 수 있도록 서버 수를 최소로 조절하세요.',concept:'요청 수와 서버당 처리량을 비교하는 단순 용량 계산입니다. 실제 배포에서는 여유 용량, 장애, 부하 변동을 고려해야 합니다.',sourceId:'utility-computing',sourceTitle:'컴퓨팅 자원 제공'}
]
export const allLessons={ai:aiLessons,computer:computerLessons}

export const sampleTokenizer=(text:string)=>text.match(/[가-힣a-zA-Z0-9]+|[^\s]/g)||[]

export function toyProbabilities(temp:number){
  const logits=[2.4,1.4,0.4]
  const scaled=logits.map(x=>Math.exp(x/temp))
  const total=scaled.reduce((a,b)=>a+b,0)
  return scaled.map(x=>x/total)
}
export const vectorDocuments=[
 {id:'doc1',title:'배터리 수명 관리 지침',vector:[.95,.12,.08]},
 {id:'doc2',title:'회의실 예약 안내',vector:[.1,.95,.12]},
 {id:'doc3',title:'서버 운영 점검표',vector:[.22,.13,.93]},
] as const
export function similarity(a:readonly number[],b:readonly number[]){
  const dot=a.reduce((sum,x,i)=>sum+x*b[i],0)
  const m1=Math.sqrt(a.reduce((sum,x)=>sum+x*x,0))
  const m2=Math.sqrt(b.reduce((sum,x)=>sum+x*x,0))
  return m1&&m2?dot/(m1*m2):0
}
export function chunksOf(sentences:readonly string[],size:number,overlap:number){
  const chunks:string[][]=[]
  if(size<1||overlap<0||overlap>=size)return chunks
  for(let i=0;i<sentences.length;i+=size-overlap){
    const slice=sentences.slice(i,i+size)
    if(slice.length===0)break
    chunks.push([...slice])
    if(i+size>=sentences.length)break
  }
  return chunks
}
export function roundRobin(quantum:number){
  const names=['A','B','C']
  const remaining=[5,3,2]
  const completed:Record<string,number>={}
  const timeline:{name:string;start:number;end:number}[]=[]
  let elapsed=0
  for(let n=0;n<30&&remaining.some(x=>x>0);n++){
    const index=n%remaining.length
    if(remaining[index]===0)continue
    const length=Math.min(quantum,remaining[index])
    timeline.push({name:names[index],start:elapsed,end:elapsed+length})
    elapsed+=length
    remaining[index]-=length
    if(remaining[index]===0)completed[names[index]]=elapsed
  }
  return {timeline,waiting:{A:completed.A-5,B:completed.B-3,C:completed.C-2},elapsed}
}
export function lruCache(sequence:readonly string[],capacity:number){
  const cache:string[]=[]
  const records:{value:string;hit:boolean;cache:string[]}[]=[]
  for(const value of sequence){
    const hit=cache.includes(value)
    if(hit)cache.splice(cache.indexOf(value),1)
    if(!hit&&cache.length>=capacity)cache.shift()
    cache.push(value)
    records.push({value,hit,cache:[...cache]})
  }
  return records
}
export function raidResult(level:'0'|'1'|'5',diskCount=3,terabytes=1){
  if(level==='0')return {usable:diskCount*terabytes,tolerated:0}
  if(level==='1')return {usable:terabytes,tolerated:diskCount-1} // demo: every disk mirrors the same content
  return {usable:(diskCount-1)*terabytes,tolerated:1}
}
