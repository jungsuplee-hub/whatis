import { lazy, Suspense, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import './ai-course.css'

const AiDeep = lazy(() => import('./AiDeep'))

export const COURSE = [
  { id: 'first', tag: '첫걸음', title: '다음 말 맞히기부터', sub: '문장 만들기 · 토큰 · 모를 때의 해결법' },
  { id: 'rag', tag: '심화 1', title: '자료를 찾아서 답하기', sub: 'RAG' },
  { id: 'agent', tag: '심화 2', title: '도구를 쓰는 AI', sub: '도구 사용 · 에이전트' },
  { id: 'safety', tag: '심화 3', title: '틀림과 안전장치', sub: '환각 · 가드레일' },
  { id: 'mcp', tag: '심화 4', title: '도구를 꽂는 공통 규격', sub: 'MCP' },
] as const

export type CourseId = (typeof COURSE)[number]['id']
export const courseIds: string[] = COURSE.map(c => c.id)

/* ---------------------------------------------------------------- shell */

export default function AiCourse({ view, onNavigate }: { view?: string; onNavigate: (id?: string) => void }) {
  const found = COURSE.find(c => c.id === view)
  const id: CourseId = found ? found.id : 'first'
  const idx = COURSE.findIndex(c => c.id === id)
  const prev = idx > 0 ? COURSE[idx - 1] : undefined
  const next = idx < COURSE.length - 1 ? COURSE[idx + 1] : undefined
  const go = (cid: string) => onNavigate(cid === 'first' ? undefined : cid)

  return (
    <div className="aic">
      <nav className="aic-nav" aria-label="AI 코스 단계">
        {COURSE.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={c.id === id ? 'on' : ''}
            aria-current={c.id === id ? 'step' : undefined}
            onClick={() => go(c.id)}
          >
            <b>{c.tag}</b>
            <span>{c.title}</span>
            <i aria-hidden="true">{i + 1}</i>
          </button>
        ))}
      </nav>

      <section key={id} className="aic-body">
        {id === 'first' ? (
          <FirstSteps onStartDeep={() => go('rag')} />
        ) : (
          <Suspense fallback={<div className="aic-loading" role="status">실습을 준비하고 있어요.</div>}>
            <AiDeep lesson={id} />
          </Suspense>
        )}
      </section>

      <footer className="aic-pager">
        {prev ? (
          <button type="button" onClick={() => go(prev.id)}>
            <ArrowLeft size={18} />
            <span><small>{prev.tag}</small>{prev.title}</span>
          </button>
        ) : <span />}
        {next ? (
          <button type="button" className="next" onClick={() => go(next.id)}>
            <span><small>다음 · {next.tag}</small>{next.title}</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" className="next" onClick={() => go('first')}>
            <span><small>처음으로</small>첫걸음 다시 보기</span>
            <ArrowRight size={18} />
          </button>
        )}
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------ 첫걸음 */

function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function FirstSteps({ onStartDeep }: { onStartDeep: () => void }) {
  return (
    <>
      <header className="aic-hero">
        <span className="aic-eyebrow">처음 만나는 인공지능</span>
        <h1>AI는 <mark>다음에 올 말</mark>을<br />맞히는 기계예요</h1>
        <p className="aic-lead">
          어려운 용어는 맨 뒤에 모았어요. 먼저 직접 눌러 보면서, AI가 어떻게 문장을 만들고 모르는 것을 어떻게 해결하는지 느껴 보세요.
        </p>
        <div className="aic-chips">
          <button type="button" onClick={() => jumpTo('aic-predict')}><b>1</b>다음 말 맞히기</button>
          <button type="button" onClick={() => jumpTo('aic-pieces')}><b>2</b>조각으로 읽기</button>
          <button type="button" onClick={() => jumpTo('aic-unknown')}><b>3</b>모를 때는</button>
          <button type="button" onClick={() => jumpTo('aic-words')}><b>4</b>용어 사전</button>
        </div>
      </header>

      <section className="aic-lesson" id="aic-predict">
        <span className="aic-eyebrow">1 / 4</span>
        <h2>문장은 한 조각씩 이어 붙여서 만들어져요</h2>
        <p>
          AI는 답 전체를 한꺼번에 떠올리지 않아요. 지금까지 쓴 글을 보고, 다음에 올 만한 조각마다 점수를 매겨요. 그중 하나를 골라 붙이고, 또 같은 일을 반복해요. 아래에서 직접 후보를 골라 보세요.
        </p>
        <NextWordDemo />
        <p className="aic-note">
          슬라이더를 엉뚱함 쪽으로 밀면 점수가 낮은 후보도 뽑힐 확률이 올라가요. 실제 서비스에서는 이 값을 조절해서 답변이 얼마나 창의적일지 정해요. 화면의 퍼센트는 이해를 돕는 예시 숫자이고, 실제 모델은 수만 개의 조각을 놓고 계산해요.
        </p>
      </section>

      <section className="aic-lesson" id="aic-pieces">
        <span className="aic-eyebrow">2 / 4</span>
        <h2>컴퓨터는 글자가 아니라 번호를 읽어요</h2>
        <p>
          AI는 문장을 작은 조각으로 나누고, 조각마다 번호표를 붙여요. 이 조각을 토큰이라고 불러요. AI가 계산하는 대상은 글자 모양이 아니라 이 번호예요. 아래 칸에 아무 문장이나 써 보세요.
        </p>
        <TokenDemo />
        <p className="aic-note">
          조각을 나누는 규칙과 번호는 설명용 예시예요. 실제 모델마다 나누는 방식과 번호가 달라요. 한 번에 읽을 수 있는 조각 수에는 한계가 있고, 이 한계를 컨텍스트 창이라고 불러요. 책상 위에 한꺼번에 펼칠 수 있는 종이의 양이라고 생각하면 쉬워요.
        </p>
      </section>

      <section className="aic-lesson" id="aic-unknown">
        <span className="aic-eyebrow">3 / 4</span>
        <h2>모르는 건 어떻게 해결할까요?</h2>
        <p>
          AI는 학습할 때 본 내용으로 답해요. 학습이 끝난 뒤에 생긴 일, 우리 회사 안에만 있는 문서, 컴퓨터에서 직접 해야 하는 일은 혼자서 알 수 없어요. 그래서 도움을 세 단계로 나눠 생각해요.
        </p>
        <ol className="aic-ladder">
          <li>
            <span className="n">1</span>
            <h3>혼자 답하기</h3>
            <p>시험장에서 외운 내용만으로 푸는 학생이에요. 널리 알려진 지식이나, 붙여 준 글을 다듬는 일은 이걸로 충분해요.</p>
          </li>
          <li>
            <span className="n">2</span>
            <h3>찾아서 답하기</h3>
            <p>책을 펴 놓고 보는 오픈북 시험이에요. 필요한 자료를 먼저 찾아 읽고, 그 내용으로 답해요.</p>
            <div className="term">용어로는 <span>검색, RAG</span></div>
          </li>
          <li>
            <span className="n">3</span>
            <h3>직접 해서 답하기</h3>
            <p>일을 맡은 비서예요. 계산기나 파일, 서버 같은 도구를 직접 쓰고, 결과를 확인하면서 다음 일을 이어 가요.</p>
            <div className="term">용어로는 <span>도구 사용, 에이전트</span></div>
          </li>
        </ol>
        <div className="aic-callout">
          <p>
            <b>AI가 틀리는 이유.</b> 모르는 질문을 받아도 "모른다"보다 그럴듯한 말을 이어 붙이는 경우가 있어요. 말이 자연스러워도 사실이 아닐 수 있어서, 중요한 내용은 출처를 꼭 확인해야 해요. 이런 현상을 환각이라고 불러요.
          </p>
        </div>
        <HelpQuiz />
      </section>

      <section className="aic-lesson" id="aic-words">
        <span className="aic-eyebrow">4 / 4</span>
        <h2>이제 용어를 만나도 낯설지 않아요</h2>
        <p>앞에서 해 본 일에 이름이 붙은 것뿐이에요. 눌러서 펼쳐 보세요.</p>
        <Glossary />
      </section>

      <section className="aic-next">
        <div>
          <span className="aic-eyebrow">다음 단계</span>
          <h2>이제 한 걸음 더 깊이 들어가 볼까요?</h2>
          <p>첫걸음에서 맛본 "찾기", "도구", "틀림"을 하나씩 직접 만져 보는 심화 과정이 이어져요.</p>
        </div>
        <button type="button" className="aic-btn" onClick={onStartDeep}>심화 1 · 자료 찾아 답하기 <ArrowRight size={17} /></button>
      </section>

      <p className="aic-foot">
        공개된 원리를 쉽게 단순화한 설명이에요. 특정 서비스의 비공개 내부 동작을 그대로 보여 주는 것이 아니에요. 화면의 확률과 조각 번호는 이해를 돕기 위한 예시예요.
      </p>
    </>
  )
}

/* ------------------------------------------------------- 1. 다음 말 맞히기 */

type Cand = { t: string; p: number; next?: Cand[] }

const PROMPTS: { label: string; prompt: string; options: Cand[] }[] = [
  {
    label: '비 오는 날',
    prompt: '비 오는 날에는',
    options: [
      { t: '파전이', p: 30, next: [{ t: '생각나요', p: 45 }, { t: '최고죠', p: 30 }, { t: '맛있어요', p: 15 }] },
      { t: '우산을', p: 25, next: [{ t: '꼭 챙기세요', p: 50 }, { t: '잃어버리기 쉬워요', p: 20 }, { t: '두 개 가져가요', p: 10 }] },
      { t: '커피가', p: 15, next: [{ t: '더 맛있어요', p: 40 }, { t: '마시고 싶어져요', p: 35 }, { t: '금방 식어요', p: 10 }] },
      { t: '집에서', p: 12, next: [{ t: '쉬고 싶어요', p: 50 }, { t: '영화를 봐요', p: 30 }, { t: '빨래가 안 말라요', p: 8 }] },
    ],
  },
  {
    label: '고양이',
    prompt: '고양이는 보통',
    options: [
      { t: '밤에', p: 26, next: [{ t: '활발해져요', p: 50 }, { t: '눈이 빛나요', p: 25 }, { t: '창밖을 봐요', p: 12 }] },
      { t: '하루에', p: 22, next: [{ t: '열두 시간 넘게 자요', p: 60 }, { t: '여러 번 털을 핥아요', p: 20 }, { t: '세 번 밥을 먹어요', p: 8 }] },
      { t: '높은 곳을', p: 18, next: [{ t: '좋아해요', p: 70 }, { t: '찾아 올라가요', p: 20 }, { t: '무서워해요', p: 4 }] },
      { t: '상자를', p: 10, next: [{ t: '보면 들어가요', p: 55 }, { t: '좋아하는 편이에요', p: 30 }, { t: '싫어해요', p: 3 }] },
    ],
  },
  {
    label: '코딩',
    prompt: '코드가 안 돌아갈 때는',
    options: [
      { t: '에러 메시지를', p: 34, next: [{ t: '먼저 읽어요', p: 55 }, { t: '그대로 검색해요', p: 25 }, { t: '복사해 둬요', p: 8 }] },
      { t: '최근에 바꾼 부분을', p: 24, next: [{ t: '되돌려 봐요', p: 45 }, { t: '의심해 봐요', p: 35 }, { t: '비교해 봐요', p: 12 }] },
      { t: '작은 예제로', p: 16, next: [{ t: '줄여서 확인해요', p: 55 }, { t: '다시 만들어 봐요', p: 25 }, { t: '나눠 봐요', p: 10 }] },
      { t: '잠깐', p: 8, next: [{ t: '쉬고 오세요', p: 60 }, { t: '산책하세요', p: 25 }, { t: '물을 마셔요', p: 6 }] },
    ],
  },
]
const TEMPS = [0.4, 1, 2.4]
const TLABEL = ['안정적', '보통', '엉뚱함']

function weights(opts: Cand[], ti: number): number[] {
  const w = opts.map(o => Math.pow(o.p, 1 / TEMPS[ti]))
  const s = w.reduce((a, b) => a + b, 0)
  return w.map(x => x / s)
}

function NextWordDemo() {
  const [pi, setPi] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [ti, setTi] = useState(1)

  const P = PROMPTS[pi]
  const done = picked.length >= 2
  const opts: Cand[] = picked.length === 0 ? P.options : P.options.find(o => o.t === picked[0])?.next ?? []
  const probs = weights(opts, ti)
  let top = 0
  probs.forEach((p, i) => { if (p > probs[top]) top = i })

  const choose = (t: string) => { if (!done) setPicked(old => [...old, t]) }
  const sample = () => {
    const r = Math.random()
    let acc = 0
    let k = probs.length - 1
    for (let i = 0; i < probs.length; i++) {
      acc += probs[i]
      if (r <= acc) { k = i; break }
    }
    if (opts[k]) choose(opts[k].t)
  }

  return (
    <div className="aic-panel">
      <div className="aic-tabs" role="group" aria-label="시작 문장 고르기">
        {PROMPTS.map((x, i) => (
          <button key={x.label} type="button" aria-pressed={i === pi} onClick={() => { setPi(i); setPicked([]) }}>{x.label}</button>
        ))}
      </div>
      <div className="aic-sentence" aria-live="polite">
        <span>{P.prompt}</span>
        {picked.map((t, i) => <span key={i}>{' '}<em>{t}</em></span>)}
        {done ? '.' : <span className="aic-caret" />}
      </div>
      {!done && (
        <div className="aic-cands">
          {opts.map((o, i) => (
            <button key={o.t} type="button" className={'aic-cand' + (i === top ? ' top' : '')} onClick={() => choose(o.t)}>
              <span className="bar" style={{ width: (probs[i] * 100).toFixed(1) + '%' }} />
              <span className="t">{o.t}{i === top && <span className="badge">가장 유력</span>}</span>
              <span className="pc">{Math.round(probs[i] * 100)}%</span>
            </button>
          ))}
        </div>
      )}
      {done && <div className="aic-donenote">이렇게 두 번 이어 붙이면 한 문장이 돼요. 긴 답변도 같은 일을 수백 번 반복해서 만들어져요.</div>}
      <div className="aic-controls">
        <div className="aic-slider">
          <label htmlFor="aic-temp"><span>AI의 성격</span><b>{TLABEL[ti]}</b></label>
          <input id="aic-temp" type="range" min={0} max={2} step={1} value={ti} onChange={e => setTi(Number(e.target.value))} />
          <div className="ticks"><span>안정적</span><span>보통</span><span>엉뚱함</span></div>
        </div>
        <div className="aic-row">
          {!done && <button type="button" className="aic-btn" onClick={sample}>AI가 대신 고르게 하기</button>}
          <button type="button" className="aic-btn ghost" onClick={() => setPicked([])}>처음부터</button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ 2. 토큰 */

type Tok = { t: string; first: boolean }

function tokenize(text: string): Tok[] {
  const out: Tok[] = []
  text.trim().split(/\s+/).filter(Boolean).forEach(w => {
    let first = true
    const push = (s: string) => { out.push({ t: s, first }); first = false }
    if (/^[\x00-\x7f]+$/.test(w)) {
      for (let i = 0; i < w.length; i += 4) push(w.slice(i, i + 4))
    } else {
      const chars = Array.from(w)
      if (chars.length <= 2) push(w)
      else for (let j = 0; j < chars.length; j += 2) push(chars.slice(j, j + 2).join(''))
    }
  })
  return out
}

function tokenId(s: string): number {
  let h = 5381
  for (const c of Array.from(s)) h = (((h << 5) + h) + (c.codePointAt(0) ?? 0)) >>> 0
  return (h % 49999) + 1
}

function TokenDemo() {
  const [text, setText] = useState('비 오는 날에는 파전이 생각나요')
  const toks = tokenize(text)
  const chars = Array.from(text.replace(/\s/g, '')).length
  return (
    <div className="aic-panel">
      <label htmlFor="aic-tok" className="aic-note small">문장 입력</label>
      <input id="aic-tok" className="aic-input" type="text" maxLength={60} value={text} autoComplete="off" onChange={e => setText(e.target.value)} />
      <div className="aic-tokens" aria-live="polite">
        {toks.map((k, i) => (
          <span key={i} className={'aic-token' + (k.first ? ' first' : '')}>
            <span className="w">{k.t}</span>
            <span className="id">{tokenId(k.t)}</span>
          </span>
        ))}
      </div>
      <div className="aic-stat">
        {toks.length === 0 ? '문장을 입력하면 조각이 나타나요.' : <>글자 <b>{chars}</b>개가 조각 <b>{toks.length}</b>개로 나뉘었어요.</>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ 3. 퀴즈 */

type Need = 'alone' | 'search' | 'act'
const QS: { q: string; a: Need; why: string }[] = [
  { q: '무지개는 왜 생겨?', a: 'alone', why: '널리 알려진 과학 지식은 학습한 내용만으로 설명할 수 있어요.' },
  { q: '오늘 서울 날씨 알려줘', a: 'search', why: '지금 이 순간의 정보는 학습 자료에 없어요. 실시간으로 조회해야 해요.' },
  { q: '우리 회사 휴가 규정이 어떻게 돼?', a: 'search', why: '회사 안에만 있는 문서라 AI가 본 적이 없어요. 문서를 찾아서 읽게 해야 하고, 이 방식이 RAG예요.' },
  { q: '이 이메일을 정중하게 다듬어 줘', a: 'alone', why: '붙여 준 글이 있으면 충분해요. 따로 찾을 것도, 실행할 것도 없어요.' },
  { q: '내 서버에 남은 디스크 용량 확인해 줘', a: 'act', why: '실제 서버에 명령을 실행해야 해요. 도구와 권한이 있어야 하고, 결과를 보고 판단해요.' },
  { q: '오늘 환율로 예산표를 고쳐 줘', a: 'act', why: '환율을 조회하고 파일까지 수정해야 해요. 이렇게 여러 단계를 이어 가는 일이 에이전트의 몫이에요.' },
]
const CHOICES: [Need, string][] = [['alone', '혼자 답해도 돼요'], ['search', '찾아봐야 해요'], ['act', '직접 실행해야 해요']]

function HelpQuiz() {
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState<Need | null>(null)

  if (qi >= QS.length) {
    const msg = score >= 5
      ? '아주 잘 구분했어요. 이제 AI가 왜 도구를 붙여 쓰는지 알고 있어요.'
      : score >= 3
        ? "절반 이상 맞혔어요. 틀린 문제는 '지금 이 순간의 정보인가, 직접 해야 하는 일인가'를 먼저 떠올려 보세요."
        : '괜찮아요. 위의 세 단계 그림을 한 번 보고 다시 도전해 보세요.'
    return (
      <div className="aic-panel" aria-live="polite">
        <div className="aic-qhead"><h3>이 질문에는 어떤 도움이 필요할까요?</h3><span>결과</span></div>
        <div className="aic-score">{score} / {QS.length}</div>
        <p>{msg}</p>
        <div className="aic-row"><button type="button" className="aic-btn" onClick={() => { setQi(0); setScore(0); setChosen(null) }}>다시 풀기</button></div>
      </div>
    )
  }

  const Q = QS[qi]
  const answered = chosen !== null
  const pick = (c: Need) => {
    if (answered) return
    setChosen(c)
    if (c === Q.a) setScore(s => s + 1)
  }
  return (
    <div className="aic-panel" aria-live="polite">
      <div className="aic-qhead"><h3>이 질문에는 어떤 도움이 필요할까요?</h3><span>{qi + 1} / {QS.length}</span></div>
      <div className="aic-q">“{Q.q}”</div>
      <div className="aic-opts">
        {CHOICES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            disabled={answered}
            className={'aic-opt' + (answered && id === Q.a ? ' right' : answered && id === chosen ? ' wrong' : '')}
            onClick={() => pick(id)}
          >{label}</button>
        ))}
      </div>
      <div className="aic-fb">
        {answered && <><b className={chosen === Q.a ? 'ok' : 'no'}>{chosen === Q.a ? '맞아요. ' : '아쉬워요. '}</b>{Q.why}</>}
      </div>
      {answered && (
        <div className="aic-row">
          <button type="button" className="aic-btn" onClick={() => { setQi(qi + 1); setChosen(null) }}>{qi === QS.length - 1 ? '결과 보기' : '다음 질문'}</button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ 4. 용어 */

const GLOSSARY: { term: string; one: string; body: string; real: string }[] = [
  { term: '토큰', one: '문장을 자른 작은 조각', body: 'AI가 글을 읽고 쓰는 가장 작은 단위예요. 글자 하나일 수도, 단어의 일부일 수도 있어요.', real: '보통 사용량이나 요금도 토큰 수로 계산해요.' },
  { term: '컨텍스트 창', one: '한 번에 펼칠 수 있는 책상', body: 'AI가 한 번에 볼 수 있는 대화와 자료의 양이에요. 책상이 가득 차면 앞쪽 내용부터 놓치게 돼요.', real: '모델마다 크기가 달라요.' },
  { term: '환각', one: '그럴듯하지만 사실이 아닌 답', body: '다음 말을 자연스럽게 이어 붙이는 데 집중하다 보면, 없는 사실을 만들어 낼 수 있어요.', real: '줄이는 방법으로는 자료를 찾아 근거를 붙이게 하는 것이 있어요. 심화 3에서 직접 해 봐요.' },
  { term: 'RAG', one: '자료를 찾아 보고 답하기', body: '오픈북 시험과 같아요. 질문과 관련된 문서를 먼저 찾아서 AI에게 보여 주고, 그 내용으로 답하게 해요.', real: '영어 Retrieval-Augmented Generation의 줄임말이에요. 심화 1에서 직접 해 봐요.' },
  { term: '에이전트', one: '여러 단계를 스스로 진행하는 AI', body: '목표를 받으면 할 일을 나누고, 도구를 쓰고, 결과를 확인하면서 다음 단계로 가요. 끝나면 한 일과 못 한 일을 구분해서 알려 줘야 믿을 수 있어요.', real: '파일을 고치거나 서버를 바꾸는 일은 사람의 승인 지점을 두는 경우가 많아요. 심화 2에서 직접 해 봐요.' },
  { term: 'MCP', one: '도구를 꽂는 공통 콘센트', body: 'AI 앱이 여러 도구와 데이터에 같은 방식으로 연결되게 해 주는 규칙이에요. 기기마다 충전기가 달랐던 시절에서 공통 규격으로 바뀐 것과 비슷해요.', real: '연결이 되더라도 AI가 무엇이든 할 수 있는 건 아니에요. 각 도구가 허락한 범위 안에서만 움직여요. 심화 4에서 직접 해 봐요.' },
  { term: '가드레일', one: '넘으면 안 되는 안전 울타리', body: '민감한 정보를 보여 주지 않고, 권한이 없는 일은 하지 못하게 막는 장치예요. 입력과 출력을 검사하고 도구 실행 권한을 따로 확인해요.', real: '부탁하는 문장 하나로 모든 보안을 대신할 수는 없어요. 심화 3에서 직접 해 봐요.' },
]

function Glossary() {
  return (
    <div className="aic-gloss">
      {GLOSSARY.map(g => (
        <details key={g.term}>
          <summary><span className="term">{g.term}</span><span className="one">{g.one}</span></summary>
          <div className="body">
            <p>{g.body}</p>
            <p className="real">{g.real}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
