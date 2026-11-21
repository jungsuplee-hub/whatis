/**
 * WHATIS — educational workflow maps. These are logical learning models,
 * never production network blueprints or a claim that a component is mandatory.
 */
import { flowGuides } from './systemsFlowGuides'
import beginnerGuides from './systemsFlowBeginner'

export type FlowDomain='ai'|'computer'|'teamcenter'|'polarion'
export type FlowLayout='pipeline'|'fork'|'cycle'|'ladder'|'split'|'reverse'
export type FlowNode={id:string;title:string;subtitle:string;detail:string;more?:string;beginner?:string}
export type FlowDiagram={
 id:string;domain:FlowDomain;title:string;subtitle:string;layout:FlowLayout;
 nodes:FlowNode[];links:[number,number][];keyPoint:string;warning?:string;tag:string
 overview?:string;scenario?:string;scenarioLabel?:string;takeaways?:string[]
 beginnerLead?:string;beginnerAnalogy?:string;beginnerTerms?:{name:string;meaning:string}[]
}
type Def=[string,FlowDomain,string,string,FlowLayout,string,string,string?,string?]
const relations:Record<FlowLayout,[number,number][]>={
 pipeline:[[0,1],[1,2],[2,3],[3,4],[4,5]],
 fork:[[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]],
 cycle:[[0,1],[1,2],[2,3],[3,4],[4,1],[4,5]],
 ladder:[[0,1],[1,2],[0,3],[3,4],[4,5],[2,5]],
 split:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
 reverse:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]]
}
const diagrams:Def[]=[
['rag-pipeline','ai','RAG Pipeline','문서 검색으로 근거를 보강하는 답변','ladder',
'문서|Docs|허용된 문서와 데이터를 수집합니다.;청크|Chunk|문서를 검색에 적합한 단위로 분할합니다.;임베딩|Embedding|검색할 의미 벡터를 생성합니다.;질문|Query|사용자의 질문을 받아 검색 조건을 구성합니다.;벡터 검색|Retrieve|질문과 관련된 청크를 조회합니다.;답변|LLM + Context|찾은 문맥과 질문을 모델에 함께 전달합니다.',
'원문 보관과 검색 인덱스는 별개입니다. 검색된 내용의 권한과 최신성을 확인해야 합니다.','RAG'],
['agentic-rag','ai','Agentic RAG','검색 결과를 확인하고 재탐색하는 에이전트','fork',
'사용자 질문|Request|질문 목표와 필요한 자료 범위를 파악합니다.;에이전트|Planner|검색·검증 단계를 결정합니다.;벡터 검색|Vector DB|내부 문서에서 관련 자료를 가져옵니다.;웹 검색|External Search|허용된 외부 자료를 검색합니다.;결과 검증|Evaluate|적합성과 누락 여부를 검토합니다.;근거 답변|Answer|충분한 결과를 바탕으로 답변합니다.',
'일반 RAG와 달리 검색 소스나 검색어를 재선택할 수 있습니다. 모든 시스템에 웹 검색이 필수인 것은 아닙니다.','AGENT'],
['react-agent','ai','ReAct Agent','판단·도구 호출·결과 관찰의 반복','cycle',
'요청|Question|할 일을 해석하고 가능한 작업을 식별합니다.;다음 행동|Reason|외부 도구가 필요한지 판단합니다.;도구 실행|Action|허용된 API나 기능을 호출합니다.;결과 수신|Observation|도구의 반환 데이터와 오류를 확인합니다.;재판단|Reflect|부족하면 다음 행동을 결정합니다.;최종 답변|Finish|작업 결과를 사용자에게 전달합니다.',
'반복 실행에는 호출 횟수 제한, 작업 승인, 권한 통제가 필요합니다.','ReAct'],
['plan-execute','ai','Plan and Execute','계획을 세운 뒤 단계별 작업 수행','cycle',
'목표|Goal|사용자가 원하는 최종 산출물을 정의합니다.;계획|Plan|작업을 실행 가능한 순서로 나눕니다.;우선순위|Queue|의존성과 필요한 도구를 정리합니다.;실행|Executor|각 단계의 도구와 서비스를 호출합니다.;검토|Check|결과를 검증하고 필요하면 재계획합니다.;완료|Result|최종 산출물과 수행 내용을 반환합니다.',
'계획은 고정된 답안이 아니라 실행 결과에 따라 조정될 수 있습니다.','PLAN'],
['multi-agent','ai','Multi-Agent Supervisor','전문 작업자를 조정하는 관리 에이전트','fork',
'요청|Task|하나의 복합적인 업무가 들어옵니다.;Supervisor|Dispatch|관리자가 하위 작업을 분배합니다.;Researcher|Research|자료 검색과 근거 수집을 수행합니다.;Coder|Implementation|코드나 자동화 작업을 처리합니다.;Reviewer|Review|출력과 제약조건을 검토합니다.;통합 결과|Merge|각 작업 결과를 결합하고 최종 확인합니다.',
'에이전트 수가 많아질수록 비용과 조정 복잡성이 늘 수 있습니다.','AGENTS'],
['mcp-tools','ai','Tool Calling via MCP','모델과 외부 도구 사이의 표준 접점','ladder',
'AI 앱|Host|사용자의 요청을 받는 클라이언트입니다.;MCP 클라이언트|Client|접근 가능한 서버와 기능을 연결합니다.;도구 목록|Discovery|도구의 설명과 입력 스키마를 확인합니다.;MCP 서버|Server|도구 호출을 받고 해당 동작을 수행합니다.;외부 리소스|Data/API|승인된 API나 데이터 소스를 이용합니다.;도구 결과|Return|결과를 AI 앱에 반환하여 답변을 이어갑니다.',
'MCP는 도구 연결 프로토콜이며, 원격 작업 실행의 안전성과 권한을 자동 보장하지 않습니다.','MCP'],
['llm-router','ai','LLM Router','요청 종류에 따라 모델 선택','fork',
'요청 수신|Input|입력의 길이·유형·보안 조건을 파악합니다.;라우터|Classifier|요청을 적합한 모델 경로로 분류합니다.;경량 모델|Small Model|간단한 분류·요약 등을 처리합니다.;대형 모델|Large Model|복잡한 추론이나 장문 작성을 맡습니다.;코드 모델|Code Model|개발 관련 작업을 처리합니다.;결과 통합|Output|선택한 모델의 결과를 정리합니다.',
'모델 선택은 비용뿐 아니라 정확도·지연·데이터 정책을 함께 검토해야 합니다.','ROUTING'],
['semantic-cache','ai','Semantic Cache','의미가 비슷한 질문의 결과 재사용','split',
'질문|Query|새 요청을 받습니다.;의미 변환|Embed|질문을 벡터 표현으로 변환합니다.;유사도 검사|Similarity|캐시에 유사한 요청이 있는지 확인합니다.;기존 답변|Cache Hit|적절하고 유효한 캐시를 재사용합니다.;모델 호출|Cache Miss|유효한 캐시가 없으면 모델을 호출합니다.;최종 결과|Response|답변과 캐시 정책을 적용합니다.',
'사용자별 권한·민감정보·시간에 따라 달라지는 답변은 무분별하게 재사용하면 안 됩니다.','CACHE'],
['agent-memory','ai','Agent Memory','대화 문맥과 장기 기억을 나누어 관리','reverse',
'사용자 메시지|Message|현재 메시지를 입력받습니다.;단기 문맥|Context|현재 대화에 필요한 내용을 전달합니다.;에이전트|Agent|요청을 분석하고 기억을 조회합니다.;장기 기억|Memory|허용된 이전 정보를 검색합니다.;기억 갱신|Update|정책에 따라 필요한 정보만 유지합니다.;답변|Reply|현재 질문과 적절한 기억으로 응답합니다.',
'기억 저장은 사용자 동의·삭제·접근 통제와 연결되는 별도 설계 항목입니다.','MEMORY'],
['guardrails','ai','AI Guardrails','입력부터 출력까지 위험을 점검','ladder',
'요청|Input|사용자 입력과 상황을 받습니다.;입력 검사|Filter|금지된 요청·민감정보를 검토합니다.;권한 확인|Policy|사용자·도구별 허용 범위를 확인합니다.;모델 처리|Inference|허용된 요청만 처리합니다.;출력 검사|Validation|유출·오류 가능성 및 형식을 점검합니다.;응답|Release|검증한 답변을 제공합니다.',
'가드레일은 오류를 완전히 차단하지 못하므로 실제 운영 테스트가 필요합니다.','SAFETY'],
['multimodal','ai','Multimodal AI','텍스트·음성·이미지 입력을 함께 처리','split',
'사용자 입력|Input|텍스트·이미지·음성이 들어옵니다.;텍스트 처리|Text|문장과 토큰을 표현합니다.;음성 처리|Audio|음성 신호를 특징이나 텍스트로 변환합니다.;이미지 처리|Vision|시각 정보를 특징으로 표현합니다.;정보 결합|Fusion|모델이 여러 표현을 통합합니다.;결과 생성|Output|요청에 맞는 텍스트 등 결과를 생성합니다.',
'모델마다 지원 입력·출력 형식이 다릅니다.','MULTIMODAL'],
['model-serving','ai','Model Serving','학습된 모델을 실제 요청에 제공','pipeline',
'요청|API|클라이언트 요청을 받습니다.;인증·라우팅|Gateway|접근 권한과 실행 경로를 결정합니다.;전처리|Tokenizer|모델에 맞는 입력으로 변환합니다.;추론|Inference|모델이 출력 토큰을 계산합니다.;스트리밍|Streaming|생성 결과를 순서대로 전송합니다.;관측|Metrics|지연·오류·자원 사용량을 기록합니다.',
'스트리밍은 완료 시각을 앞당기기보다 첫 결과가 보이는 시간을 줄일 수 있습니다.','SERVING'],
['cpu-execution','computer','CPU Instruction Cycle','명령어 인출부터 결과 반영까지','pipeline',
'프로그램 카운터|PC|다음 명령어의 주소를 가리킵니다.;인출|Fetch|명령어를 캐시·메모리 계층에서 읽습니다.;해독|Decode|동작과 필요한 피연산자를 파악합니다.;실행|Execute|ALU와 실행 장치가 연산합니다.;메모리 접근|Load/Store|필요할 때 데이터를 읽거나 씁니다.;결과 반영|Retire|결과와 아키텍처 상태를 갱신합니다.',
'현대 CPU에서 모든 명령이 동일한 6단계를 순차적으로 완료하는 것은 아닙니다.','CPU'],
['cpu-pipeline','computer','Pipeline and Parallelism','명령어 단계를 겹쳐 처리','ladder',
'명령 A|Instruction A|첫 번째 명령을 인출합니다.;해독 A|Decode A|A를 해석하는 동안 다음 명령을 인출합니다.;실행 A|Execute A|A의 연산을 진행합니다.;명령 B|Instruction B|두 번째 명령도 파이프라인에 들어갑니다.;의존성 검사|Hazard|데이터 의존성·분기 충돌을 확인합니다.;처리 완료|Throughput|겹쳐 실행된 명령들의 결과를 반영합니다.',
'파이프라인은 처리량을 높이지만 모든 명령의 지연 시간을 줄이지는 않습니다.','PARALLEL'],
['cache-memory','computer','Memory Hierarchy','캐시 적중과 실패의 서로 다른 경로','split',
'CPU 요청|Load|CPU가 주소의 데이터를 요청합니다.;L1 캐시|L1 Cache|가장 가까운 캐시부터 탐색합니다.;캐시 판단|Hit/Miss|요청 데이터 존재 여부를 검사합니다.;캐시 적중|Hit|있다면 빠른 경로로 응답합니다.;RAM 접근|Miss|없다면 하위 캐시·RAM에서 가져옵니다.;데이터 전달|Return|CPU로 값을 전달하고 필요 시 캐시를 채웁니다.',
'캐시 계층은 제품별 구성이 달라질 수 있습니다.','CACHE'],
['process-thread','computer','Process and Thread','운영체제의 실행 단위와 자원 공유','fork',
'실행 파일|Program|저장된 코드를 실행합니다.;프로세스|Process|주소 공간과 자원이 준비됩니다.;스레드 A|Thread A|하나의 실행 흐름이 시작됩니다.;스레드 B|Thread B|다른 실행 흐름이 시작됩니다.;공유 자원|Shared Memory|동일 프로세스의 데이터를 사용합니다.;작업 완료|Join|작업 결과를 통합합니다.',
'공유 메모리에 동시 접근할 때는 동기화가 필요할 수 있습니다.','OS'],
['scheduler','computer','CPU Scheduler','실행 대기와 문맥 전환','cycle',
'대기열|Ready Queue|실행 가능한 스레드가 대기합니다.;스케줄러|Scheduler|정책에 따라 스레드를 선택합니다.;상태 저장|Context Save|기존 실행 상태를 저장합니다.;상태 복원|Context Load|다음 스레드의 실행 문맥을 복원합니다.;CPU 실행|Running|정해진 시간 동안 작업합니다.;대기/완료|Yield|I/O 대기 또는 작업 완료로 상태가 변합니다.',
'스케줄링 알고리즘과 타임슬라이스는 운영체제에 따라 다릅니다.','SCHEDULING'],
['virtual-memory','computer','Virtual Memory and TLB','가상 주소가 물리 주소로 바뀌는 과정','split',
'가상 주소|Virtual Address|프로세스가 가상 주소를 사용합니다.;TLB 조회|TLB|최근 주소 변환을 찾습니다.;페이지 테이블|Page Table|필요 시 테이블을 탐색합니다.;변환 적중|Translation|물리 프레임 정보를 얻습니다.;페이지 부재|Page Fault|RAM에 없으면 커널이 처리합니다.;물리 메모리|RAM|변환한 주소로 데이터를 읽습니다.',
'TLB miss와 Page Fault는 다른 사건입니다.','MEMORY'],
['dma-storage','computer','DMA and Storage I/O','CPU에서 장치와 메모리로 이어지는 데이터','ladder',
'앱 요청|Read/Write|프로그램이 파일 입출력을 요청합니다.;시스템 호출|Kernel|운영체제가 장치 접근을 중재합니다.;드라이버|Driver|장치 작업을 설정합니다.;DMA|Transfer|장치와 RAM 사이 데이터 전송을 수행합니다.;인터럽트|Interrupt|전송 완료 등을 커널에 알립니다.;결과 반환|Return|완료 여부를 애플리케이션에 전달합니다.',
'실제 장치·드라이버별로 DMA와 완료 통지 방식은 다를 수 있습니다.','I/O'],
['raid-data','computer','RAID and Storage','분산·복제·패리티와 복구 경로','fork',
'파일 요청|Write|데이터를 저장하려 합니다.;RAID 계층|Controller|배치·장애 허용 정책을 적용합니다.;Disk A|Data|데이터 블록 일부를 보관합니다.;Disk B|Mirror|정책에 따라 복제 또는 분산합니다.;Disk C|Parity|패리티 방식이라면 복구 정보를 저장합니다.;검증|Read/Recover|데이터 읽기·복구 동작을 검증합니다.',
'RAID 유형에 따라 미러링/패리티가 다르며 백업을 대체하지 않습니다.','STORAGE'],
['cluster-ha','computer','Cluster and Failover','장애 감지와 대체 서비스 전환','split',
'사용자 요청|Client|요청이 서비스로 들어옵니다.;로드밸런서|LB|정상 노드를 고릅니다.;헬스 체크|Probe|노드 상태를 확인합니다.;Node A|Primary|정상 노드가 업무를 수행합니다.;Node B|Failover|장애 시 다른 노드가 요청을 처리합니다.;공유 데이터|Consistency|전환 후 데이터와 세션을 검증합니다.',
'고가용성은 자동으로 무중단을 보장하지 않습니다.','HA'],
['cloud-virtual','computer','Virtualization and Cloud','자원 추상화부터 서비스 제공','pipeline',
'물리 서버|Physical|계산·메모리·스토리지 자원을 제공합니다.;하이퍼바이저|Hypervisor|가상 머신 실행 자원을 관리합니다.;가상 머신|VM|격리된 실행 환경을 사용합니다.;오케스트레이션|Control|요청에 따라 자원을 배치합니다.;서비스|IaaS/PaaS|인프라 또는 플랫폼 기능을 제공합니다.;운영 계측|Metrics|사용량·확장·장애를 관찰합니다.',
'클라우드에는 가상 머신 외에도 컨테이너·관리형 서비스가 있습니다.','CLOUD'],
['teamcenter-bom','teamcenter','BOM 조회 흐름','Active Workspace에서 제품구조를 읽는 과정','pipeline',
'AWC / Browser|Client|사용자가 BOM 조회를 요청합니다.;AW Gateway|Gateway|웹 요청을 접수하고 전달합니다.;Web Tier|Web|요청과 세션을 업무 계층으로 연결합니다.;Server Manager|Pool|TcServer 프로세스 이용을 조율합니다.;TcServer|Business|BOM과 접근 권한을 평가합니다.;RDBMS|Data|제품 구조 메타데이터를 반환합니다.',
'포트와 제품별 서버 배치는 설치 버전에 따라 다릅니다.','TEAMCENTER'],
['teamcenter-file','teamcenter','Dataset 파일 다운로드','메타데이터와 실제 파일을 분리하는 경로','ladder',
'Rich Client|TCCS|사용자가 Dataset 파일을 요청합니다.;TcServer|Object|업무 객체와 접근 권한을 확인합니다.;파일 요청|FMS Ticket|허용된 파일 접근 경로를 결정합니다.;FCC|Client Cache|클라이언트 캐시에서 파일을 확인합니다.;FSC|Server Cache|서버 캐시와 저장소를 통해 파일을 제공합니다.;File Volume|Storage|원본 파일 바이트를 보관합니다.',
'파일 전송과 DB 메타데이터 조회는 서로 다른 성능 경로입니다.','FMS'],
['teamcenter-identity','teamcenter','Teamcenter 로그인/인증','사용자 인증과 객체 접근 권한을 구분','split',
'사용자|Browser|PLM 서비스에 접속합니다.;Reverse Proxy|HTTPS|보안 접속을 처리합니다.;SSO / TcSS|Identity|인증 흐름을 처리합니다.;IdP|Directory|사용자 인증·계정을 확인합니다.;TcServer|Authorization|업무 객체 권한을 평가합니다.;업무 화면|Authorized|허용된 데이터만 표시합니다.',
'사용 가능한 SSO 프로토콜과 배치는 선택 구성에 따라 달라집니다.','SECURITY'],
['teamcenter-search','teamcenter','Teamcenter 검색 색인','업무 원본과 검색 인덱스를 연결','ladder',
'Teamcenter Data|Source|제품 객체의 원본 데이터를 저장합니다.;Indexer|Extract|색인용 변경 데이터를 수집합니다.;Search Index|Solr|검색에 적합한 표현을 유지합니다.;AWC Search|Query|사용자가 검색 요청을 보냅니다.;Search Service|Search|인덱스를 질의하고 결과를 연결합니다.;Result + ACL|Access|업무 객체 권한을 확인하며 반환합니다.',
'검색 원본과 색인 간 반영 지연이 발생할 수 있습니다.','SEARCH'],
['teamcenter-ai','teamcenter','Copilot + AI Microservices','PLM 문맥 검색과 모델 호출을 분리','split',
'Copilot UI|Request|PLM 맥락의 사용자 질문을 받습니다.;Data Vectorizing|Index|허용된 데이터를 사전에 벡터화합니다.;Vector DB|Retrieve|관련 내용을 검색합니다.;Model Invocation|LLM|선택된 모델 제공자에게 요청을 전달합니다.;Domain Service|BOM/Quality|도메인별 AI 기능을 연결합니다.;Answer|Response|권한에 맞는 결과를 사용자에게 제공합니다.',
'여기 있는 기능은 선택형이며 모든 2606 설치의 필수 서비스가 아닙니다.','AI'],
['teamcenter-agent','teamcenter','Teamcenter Agent / MCP','Agent에서 승인된 Teamcenter 도구 호출','cycle',
'Agentic Chat|Agent|사용자 요청과 작업 계획을 관리합니다.;Threads Manager|State|대화 상태를 관리할 수 있습니다.;Teamcenter MCP|Tools|승인된 작업 도구를 제공합니다.;REST Services|API|PLM 업무 API를 호출합니다.;결과 검증|Review|권한과 결과를 다시 확인합니다.;응답|Output|사용자에게 작업 결과를 반환합니다.',
'Agentic Chat·Threads Manager·Teamcenter MCP는 확장 구성 예시이며 포트는 배포 설정에 따릅니다.','MCP'],
['polarion-workitem','polarion','Work Item 편집','웹 요청과 원본 저장소의 역할','pipeline',
'사용자|Browser|요구사항이나 Work Item을 수정합니다.;Load Balancer|Entry|정상 노드에 요청을 전달합니다.;Apache HTTPD|Proxy|Polarion 앱의 웹 계층으로 라우팅합니다.;Polarion Node|App|권한과 업무 규칙을 검사합니다.;SVN Repository|Source|변경 이력을 포함한 원본 정보를 유지합니다.;화면 갱신|Response|사용자에게 처리 결과를 표시합니다.',
'클러스터 각 노드는 동일한 논리 SVN 원본을 사용합니다.','POLARION'],
['polarion-cluster','polarion','Polarion 클러스터 제어','두 앱 노드의 조정과 공용 서비스','fork',
'웹 요청|HTTPS|클러스터 진입점에 들어옵니다.;Load Balancer|Routing|정상 애플리케이션 노드를 선택합니다.;Node A|App|하나의 업무 노드가 요청을 처리합니다.;Node B|App|다른 업무 노드가 요청을 처리합니다.;Coordinator|ZooKeeper|노드 상태와 조정 경로를 관리합니다.;Shared Services|Common|공용 데이터와 서비스에 접근합니다.',
'Coordinator와 ZooKeeper는 별도 서버 두 대가 필수라는 의미가 아닙니다.','CLUSTER'],
['polarion-data','polarion','Polarion 데이터와 색인','SVN 원본과 검색/DB 저장소를 구분','split',
'Work Item|Update|업무 데이터가 변경됩니다.;SVN|History|변경 이력을 포함한 원본 저장소입니다.;PostgreSQL|Node Data|애플리케이션 DB 자원을 사용합니다.;Lucene Index|Search|검색용 색인을 갱신합니다.;조회 요청|Query|사용자가 검색/리포트를 요청합니다.;결과|Response|원본·인덱스·권한을 반영한 결과를 제공합니다.',
'노드별 PostgreSQL·색인 배치는 지원 구성과 버전에 따라 다릅니다.','STORAGE'],
['polarion-rest','polarion','REST API / 통합','외부 요청에서 ALM 업무 처리까지','pipeline',
'외부 시스템|CI/CD|서비스 계정이 API를 호출합니다.;HTTPS|TLS|보안 엔드포인트에 접속합니다.;Load Balancer|LB|정상 노드로 라우팅합니다.;Polarion Node|REST|API 권한과 데이터를 처리합니다.;원본 데이터|SVN / DB|요청에 해당하는 정보를 조회하거나 변경합니다.;API 응답|JSON|상태 코드와 결과를 반환합니다.',
'API 범위와 인증 방식은 버전에 따라 확인이 필요합니다.','API'],
['polarion-security','polarion','Polarion 인증과 접근','로그인과 프로젝트별 권한을 분리','split',
'사용자|Login|사용자가 접속을 요청합니다.;HTTPS Proxy|Web|보안 접속을 처리합니다.;SSO / LDAP|Identity|선택된 기업 인증 경로를 이용합니다.;Polarion App|AuthZ|프로젝트·역할별 권한을 평가합니다.;Audit|Logs|접근과 변경 기록을 남깁니다.;허용 결과|Response|권한에 맞는 화면과 API 응답을 제공합니다.',
'SSO와 LDAP의 구체적인 조합은 배포 설정에 따라 다릅니다.','SECURITY'],
['polarion-recovery','polarion','Polarion 장애 복구','앱 장애에서 데이터 정합성 확인까지','cycle',
'장애|Failure|앱 노드 또는 저장 서비스 장애가 발생합니다.;감지|Health|서비스 상태를 확인합니다.;대체 노드|Failover|정상 노드로 요청을 전환합니다.;Shared SVN|Source|공통 원본 데이터 접근을 확인합니다.;DB·색인|Rebuild|필요한 데이터와 검색 상태를 검증합니다.;업무 확인|Verify|Work Item과 검색·추적성을 재시험합니다.',
'HA/DR 계획에는 백업과 복구훈련이 함께 필요합니다.','DR']
]
/**
 * Explicit causal relationships override illustrative layout defaults.
 * In particular, offline indexing and online query paths must not be mistaken
 * for one synchronous sequence.
 */
const explicitLinks:Record<string,[number,number][]>={
 'rag-pipeline':[[0,1],[1,2],[2,4],[3,4],[4,5]],
 'agentic-rag':[[0,1],[1,2],[1,3],[2,4],[3,4],[4,5],[4,1]],
 'mcp-tools':[[0,1],[1,2],[2,3],[3,4],[4,5]],
 'semantic-cache':[[0,1],[1,2],[2,3],[2,4],[3,5],[4,5]],
 'agent-memory':[[0,1],[1,2],[2,3],[3,4],[4,5],[2,5]],
 'guardrails':[[0,1],[1,2],[2,3],[3,4],[4,5]],
 'multimodal':[[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[4,5]],
 'cache-memory':[[0,1],[1,2],[2,3],[2,4],[3,5],[4,5]],
 'virtual-memory':[[0,1],[1,3],[1,2],[2,3],[2,4],[3,5],[4,5]],
 'dma-storage':[[0,1],[1,2],[2,3],[3,4],[4,5]],
 'cluster-ha':[[0,1],[1,2],[2,1],[1,3],[1,4],[3,5],[4,5]],
 'teamcenter-file':[[0,1],[1,2],[2,3],[3,4],[4,5]],
 'teamcenter-identity':[[0,1],[1,2],[2,3],[3,4],[4,5],[1,4]],
 'teamcenter-search':[[0,1],[1,2],[2,4],[3,4],[4,5]],
 'teamcenter-ai':[[1,2],[0,2],[2,3],[0,4],[3,5],[4,5]],
 'polarion-cluster':[[0,1],[1,2],[1,3],[2,4],[3,4],[2,5],[3,5]],
 'polarion-data':[[0,1],[0,2],[1,3],[4,3],[3,5],[2,5]],
 'polarion-security':[[0,1],[1,2],[1,3],[2,3],[3,4],[4,5]]
}
function parse(def:Def):FlowDiagram {
 const [id,domain,title,subtitle,layout,raw,keyPoint,tag='FLOW',warning]=def
 const guide=flowGuides[id]
 const easy=beginnerGuides[id]
 if(!guide||guide.steps.length!==6)throw Error('Missing detailed guide for '+id)
 if(!easy||easy.steps.length!==6)throw Error('Missing beginner guide for '+id)
 const nodes=raw.split(';').map((line,i)=>{
  const [name,sub,detail]=line.split('|')
  return {id:id+'-'+i,title:name,subtitle:sub,detail,more:guide.steps[i],beginner:easy.steps[i]}
 })
 if(nodes.length!==6)throw Error('Expected six nodes: '+id)
 return {id,domain,title,subtitle,layout,nodes,links:explicitLinks[id]??relations[layout],
  keyPoint,warning,tag,overview:guide.overview,scenario:guide.scenario,scenarioLabel:'구체적인 사용 사례',
  beginnerLead:easy.lead,beginnerAnalogy:easy.analogy,beginnerTerms:easy.terms}
}
export const flowDiagrams=diagrams.map(parse)
export const flowByDomain=(domain:FlowDomain)=>flowDiagrams.filter(d=>d.domain===domain)
export const flowById=(id:string)=>flowDiagrams.find(d=>d.id===id)
