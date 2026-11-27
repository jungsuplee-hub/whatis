import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, ChevronRight, Search, Share2 } from 'lucide-react'
import { useState } from 'react'
import { categories, generalTopics, topicById } from './data'
import type { Category, Topic } from './data'
import { examplesForTopic } from './serviceExamples'
import './ai-beginner.css'

type Intro = [question:string, answer:string, example:string]
export const aiIntros: Record<string,Intro> = {
  'ai':['AI는 정확히 무엇인가요?','인공지능(AI)은 컴퓨터가 글을 이해하고, 사진을 구별하거나, 결과를 예측하는 등의 일을 수행하게 만드는 기술입니다. 모든 AI가 대화를 하거나 새로운 글을 만드는 것은 아닙니다.','휴대전화에서 사진 속 글자를 읽거나 이메일의 스팸을 구별하는 기능도 AI를 활용할 수 있습니다.'],
  'machine-learning':['AI는 어떻게 배우나요?','머신러닝은 컴퓨터가 여러 데이터를 이용해 일정한 패턴을 배우는 방법입니다. 배운 패턴을 새로운 데이터에 적용해 결과를 예측합니다.','과거 판매 기록으로 다음 달 판매량을 예측하도록 학습시킬 수 있습니다.'],
  'deep-learning':['딥러닝은 무엇인가요?','딥러닝은 여러 층으로 이루어진 신경망이라는 계산 구조를 학습시키는 방법입니다. 복잡한 사진, 음성, 글을 처리하는 데 자주 쓰입니다.','사진에 자동차가 있는지 찾아내거나 음성을 글로 바꾸는 모델에 사용됩니다.'],
  'neural-networks':['신경망은 어떻게 작동하나요?','신경망은 입력된 숫자를 여러 단계에서 계산하여 결과를 만드는 구조입니다. 학습할 때는 결과가 좋아지도록 계산에 쓰이는 숫자들을 조정합니다.','사진의 정보를 숫자로 입력하면 신경망이 계산하여 사진에 어떤 물체가 있는지 예측합니다.'],
  'supervised-learning':['정답을 알려주면서 AI를 학습시킬 수 있나요?','지도학습은 입력 자료와 그에 해당하는 정답을 함께 사용해 AI를 학습시키는 방법입니다. 학습이 끝나면 처음 보는 입력의 답을 예측합니다.','정상 제품과 불량 제품의 사진에 각각 정답을 표시해 불량품을 구별하는 AI를 학습시킵니다.'],
  'generative-ai':['글이나 그림을 만드는 AI는 무엇인가요?','생성형 AI는 사용자가 요청한 내용에 맞춰 새 글, 그림, 음성 등을 만드는 기술입니다. 이전에 학습한 자료의 특징을 이용합니다. 결과가 사실인지 확인하는 일은 별도로 필요할 수 있습니다.','회의 내용을 입력하고 요약문을 작성하거나 원하는 장면을 설명해 이미지를 만들 수 있습니다.'],
  'llm':['ChatGPT 같은 AI는 어떻게 답변하나요?','대규모 언어 모델(LLM)은 많은 글을 학습해 문맥에 맞는 글을 만드는 AI 모델입니다. 일반적인 텍스트 생성 모델은 다음에 이어질 글의 조각을 차례로 예측해 답변을 완성합니다.','긴 안내문을 입력하고 핵심 내용만 세 문장으로 정리해 달라고 요청할 수 있습니다.'],
  'transformer':['AI는 문장의 앞뒤 내용을 어떻게 처리하나요?','트랜스포머는 글의 여러 부분 사이에서 어떤 정보가 중요한지 계산하는 구조입니다. 많은 언어 모델이 이 구조를 사용해 문맥에 맞는 출력을 만듭니다.','문장에서 앞에 나온 사람의 이름과 뒤에 나오는 대명사의 관계를 계산에 반영할 수 있습니다.'],
  'tokens':['토큰이란 무엇인가요?','AI가 글을 처리할 때 문장을 작은 단위로 나눕니다. 이 단위를 토큰이라고 하며, 단어 전체나 일부 또는 기호일 수 있습니다.','긴 문서를 입력할 때 서비스가 처리할 수 있는 최대 토큰 수를 넘으면 문서를 나누어야 할 수 있습니다.'],
  'prompt-engineering':['AI에게 어떻게 요청해야 하나요?','프롬프트는 AI에 전달하는 질문이나 지시입니다. 원하는 결과, 조건, 필요한 자료를 구체적으로 적으면 의도에 더 잘 맞는 답을 받을 수 있습니다.','회의록을 정리할 때 결정사항과 담당자, 마감일을 표로 만들어 달라고 요청합니다.'],
  'multimodal':['AI가 사진이나 음성도 이해할 수 있나요?','멀티모달 AI는 글뿐 아니라 이미지, 음성 등 여러 형태의 정보를 처리하는 AI입니다. 어떤 정보를 입력하고 출력할 수 있는지는 모델마다 다릅니다.','제품 설명서의 사진을 첨부하고 화면에 표시된 오류 메시지의 의미를 물어볼 수 있습니다.'],
  'embeddings':['AI는 뜻이 비슷한 글을 어떻게 찾나요?','임베딩은 글이나 이미지의 특징을 여러 숫자로 표현하는 방법입니다. 이 숫자들을 비교하면 내용이 얼마나 비슷한지 계산할 수 있습니다.','휴가 규정이라는 질문과 연차 사용 안내라는 문서가 관련 있는지 찾는 데 활용할 수 있습니다.'],
  'vector-database':['벡터 데이터베이스는 왜 필요한가요?','문서나 이미지의 특징을 숫자로 바꾼 결과를 저장하고, 비슷한 숫자 표현을 빠르게 찾을 수 있도록 하는 데이터베이스입니다.','회사 문서가 많을 때 질문과 내용이 비슷한 문서를 찾아 AI에 전달하는 데 사용합니다.'],
  'semantic-search':['같은 단어가 없어도 검색할 수 있나요?','시맨틱 검색은 입력한 단어 자체뿐 아니라 의미가 비슷한 내용을 찾으려는 검색 방법입니다. 검색 결과가 모두 정확한 것은 아닙니다.','비밀번호를 잊었다고 검색하면 계정 암호 재설정이라는 제목의 문서를 찾아줄 수 있습니다.'],
  'chunking':['왜 긴 문서를 나누어 저장하나요?','문서 청킹은 긴 문서를 여러 부분으로 나누는 작업입니다. 질문에 관련된 부분만 찾거나 AI에 전달하기 쉽도록 하기 위해 사용합니다.','100페이지짜리 제품 설명서에서 설치 방법이 적힌 부분만 찾아 답변에 사용할 수 있습니다.'],
  'rag':['AI가 내 문서를 읽고 답할 수 있나요?','RAG는 AI가 질문에 답하기 전에 필요한 문서나 정보를 찾아 참고하게 하는 기술입니다. AI를 다시 학습시키지 않고도 새 자료를 답변에 사용할 수 있습니다.','회사 휴가 규정을 검색해 사용 가능한 휴가 일수에 관한 답변을 만들고 관련 문서를 안내할 수 있습니다.'],
  'ai-agent':['AI Agent는 일반 AI와 무엇이 다른가요?','AI Agent는 사용자가 요청한 일을 여러 단계에 걸쳐 처리하는 AI 시스템입니다. 필요한 프로그램을 사용하고, 실행 결과를 확인해 다음에 할 일을 정할 수 있습니다.','공유 가능한 회의 일정을 찾아 달라고 하면 달력을 조회하고, 가능한 시간대를 정리할 수 있습니다. 일정 등록 기능과 권한이 있다면 확인을 받은 뒤 등록할 수도 있습니다.'],
  'function-calling':['AI가 다른 프로그램에 일을 시킬 수 있나요?','툴 호출은 AI가 필요한 도구와 전달할 정보를 선택하고, 연결된 프로그램이 그 요청을 실행하도록 하는 기능입니다. AI는 실행 결과를 받아 답변이나 다음 작업에 활용할 수 있습니다.','날씨 정보를 묻는 경우 AI 서비스가 날씨 조회 기능을 호출하고 받은 결과를 설명할 수 있습니다.'],
  'mcp':['MCP는 무엇을 연결하나요?','MCP는 AI 앱이 다른 프로그램의 자료나 기능을 사용할 수 있도록 정한 공통 연결 규칙입니다. 연결만으로 모든 자료나 기능에 접근할 수 있는 것은 아닙니다.','MCP를 지원하는 AI 앱이 연결된 문서 검색 서버에서 회사 문서를 찾는 기능을 이용할 수 있습니다.'],
  'orchestration':['여러 AI와 프로그램은 어떻게 함께 일하나요?','오케스트레이션은 여러 처리 단계와 도구를 어떤 순서로 실행할지 관리하는 방식입니다. 한 단계의 결과에 따라 다음 단계를 정하거나 오류를 처리합니다.','문서를 가져오고, 요약하고, 결과를 검사한 뒤 파일로 저장하는 과정을 순서대로 실행할 수 있습니다.'],
  'context-memory':['AI는 이전 대화를 기억하나요?','컨텍스트는 현재 답변을 만들 때 AI에 제공되는 정보입니다. 메모리는 나중에도 사용할 정보를 저장했다가 다시 제공하는 기능이며, 서비스 설정에 따라 동작합니다.','대화 중 앞에서 정한 보고서 형식을 다음 요청에 적용할 수 있습니다. 새로운 대화에서도 적용되는지는 서비스 기능에 따라 다릅니다.'],
  'fine-tuning':['이미 만들어진 AI를 특정 업무에 맞출 수 있나요?','파인튜닝은 학습이 끝난 모델을 추가 데이터로 더 훈련시키는 방법입니다. 특정 답변 형식이나 분류 작업에 더 잘 맞게 모델을 개선할 때 사용합니다.','제품 문의에 대해 정해진 답변 형식으로 응답하도록 예시 데이터를 이용해 추가 학습할 수 있습니다.'],
  'rlhf':['사람의 평가로 AI를 개선할 수 있나요?','인간 피드백 기반 강화학습(RLHF)은 사람이 답변을 평가하거나 선호하는 결과를 표시한 정보를 활용해 모델의 응답을 개선하는 학습 방법입니다.','여러 답변 중 지시를 잘 따르고 유용한 답변을 사람들이 평가한 데이터를 학습에 활용합니다.'],
  'quantization':['AI 모델을 더 적은 메모리로 사용할 수 있나요?','양자화는 AI가 사용하는 숫자를 더 적은 저장 공간으로 표현하는 방법입니다. 메모리 사용량을 줄일 수 있지만 결과의 정확성이 달라질 수 있습니다.','서버 메모리가 부족할 때 양자화된 모델을 사용해 실행 가능한 크기로 줄일 수 있습니다.'],
  'distillation':['큰 AI의 능력을 작은 AI에도 적용할 수 있나요?','지식 증류는 큰 모델의 출력 등을 참고해 작은 모델을 학습시키는 방법입니다. 실행 비용을 줄이면서 필요한 성능을 유지하는 것이 목적입니다.','큰 모델의 분류 결과를 활용해 더 작은 문서 분류 모델을 학습시킬 수 있습니다.'],
  'training-vs-inference':['AI가 배우는 것과 답변하는 것은 어떻게 다른가요?','학습은 데이터를 이용해 모델의 계산에 쓰이는 값을 조정하는 과정입니다. 추론은 학습된 모델을 이용해 실제 입력의 결과를 만드는 과정입니다.','이미 학습된 AI에 사진을 넣어 무엇이 찍혔는지 확인하는 것은 추론입니다. 질문할 때마다 모델 자체를 다시 학습시키는 것은 아닙니다.'],
  'model-serving':['AI를 앱에서 사용할 수 있게 하려면 무엇이 필요한가요?','모델 서빙은 학습된 모델을 실행할 환경을 준비하고, 앱의 요청을 받아 결과를 보내는 과정입니다. 요청이 많을 때의 처리 속도와 안정성도 관리합니다.','여러 사용자가 문서 요약 기능을 동시에 이용할 수 있도록 서버에서 모델을 실행합니다.'],
  'model-evaluation':['AI가 얼마나 잘하는지 어떻게 확인하나요?','AI 평가는 실제 사용할 작업을 기준으로 모델의 답변이나 결과를 검사하는 과정입니다. 정확성뿐 아니라 응답 시간, 오류, 안전성 등도 평가할 수 있습니다.','제품 설명서에 관한 질문과 확인된 답을 준비해 AI가 정확히 응답하는지 시험합니다.'],
  'ai-safety':['AI가 허락되지 않은 일을 하지 않게 할 수 있나요?','AI 보안과 안전은 민감한 정보가 노출되거나 허용되지 않은 작업이 실행되는 위험을 줄이는 기술과 운영 절차입니다. 접근 권한과 실행 조건을 따로 검사하는 것이 중요합니다.','회사 AI가 로그인한 직원에게 허용된 문서만 검색하도록 접근 권한을 확인합니다.'],
  'observability':['AI가 왜 느리거나 실패했는지 알 수 있나요?','관측성은 AI 서비스가 요청을 어떻게 처리했는지, 시간이 얼마나 걸렸고 어디에서 오류가 났는지 기록하고 확인하는 방법입니다.','답변이 늦을 때 문서 검색이 늦었는지, 모델 계산이 늦었는지 구분하여 개선할 수 있습니다.'],
  'hallucination':['AI는 왜 자신 있게 틀린 답을 하나요?','생성형 AI는 문맥에 맞는 결과를 만들지만 모든 내용을 실제 자료와 대조하지는 않습니다. 사실과 다른 내용이나 근거 없는 정보를 만들어 내는 현상을 환각이라고 부릅니다.','AI가 실제로 존재하지 않는 문서 제목이나 잘못된 날짜를 말할 수 있으므로 원문에서 확인해야 합니다.'],
  'image-generation':['AI는 어떻게 그림을 만들어 주나요?','이미지 생성 AI는 입력한 글이나 참고 이미지의 조건에 맞추어 새로운 이미지를 계산해 만듭니다. 결과는 실제 촬영된 사진이 아닐 수 있습니다.','원하는 색상과 배치, 문구를 입력해 포스터의 시안을 만들어 볼 수 있습니다.'],
  'speech-to-text':['말한 내용을 AI가 글자로 바꿀 수 있나요?','음성 인식 AI는 녹음된 소리에서 말한 내용을 추정해 텍스트로 변환합니다. 소음, 발음, 이름 등에 따라 인식 오류가 생길 수 있습니다.','회의 녹음을 글자로 변환한 뒤 이름과 중요한 발언을 원본과 대조합니다.'],
  'search-vs-ai':['인터넷 검색과 AI 답변은 무엇이 다른가요?','검색은 질문과 관련된 자료나 링크를 찾아줍니다. 생성형 AI는 주어진 정보로 답변을 작성합니다. 검색 도구가 연결된 AI는 두 작업을 함께 할 수 있습니다.','공식 안내문을 검색해 원문을 찾은 뒤 AI로 주요 내용을 정리할 수 있습니다.'],
  'personal-data':['AI에 아무 정보나 입력해도 되나요?','AI 서비스마다 입력 자료를 보관하거나 사용하는 방식이 다릅니다. 비밀번호나 불필요한 개인정보, 공개하면 안 되는 자료는 입력하지 않는 것이 좋습니다.','회사 문서를 요약하기 전에 접근 권한과 이용 정책을 확인하고 불필요한 개인정보를 지웁니다.'],
  'ai-limitations':['AI 답변을 그대로 믿어도 되나요?','AI는 잘못된 정보를 제공하거나 질문을 오해할 수 있습니다. 중요한 내용은 신뢰할 수 있는 자료와 비교하고 필요한 경우 전문가의 확인을 받는 것이 중요합니다.','AI가 작성한 보고서에서 통계 수치와 출처, 날짜를 실제 자료와 대조합니다.']
}
// 짧은 실제 활용 상황: 제품 내부 구현을 단정하지 않고 사용자가 하는 일을 설명합니다.
const practicalUses:Record<string,string> = {
  ai:'사진 속 글자를 읽거나 질문에 답하기',
  'machine-learning':'사진을 분류하는 AI를 학습시키기',
  'deep-learning':'사진·음성을 처리하는 AI 모델 만들기',
  'neural-networks':'사진 속 물체를 구별하는 모델 학습하기',
  'supervised-learning':'정상·불량 사진을 알려주고 제품 분류하기',
  'generative-ai':'이메일 초안 작성, 포스터 이미지 만들기',
  llm:'긴 문서 요약, 번역, 질문에 답하기',
  transformer:'문장 번역이나 문서 분류 모델 실행하기',
  tokens:'입력한 글이 몇 개의 토큰인지 확인하기',
  'prompt-engineering':'보고서 분량과 형식을 지정해 답변 받기',
  multimodal:'사진을 첨부하고 내용이나 오류 메시지 물어보기',
  embeddings:'서로 다른 표현의 문서에서 비슷한 내용 찾기',
  'vector-database':'여러 회사 문서에서 관련 자료 빠르게 찾기',
  'semantic-search':'정확한 제목을 몰라도 관련 문서 찾기',
  chunking:'긴 설명서를 작은 부분으로 나누어 검색하기',
  rag:'PDF나 회사 규정을 참고해 출처와 함께 답변 받기',
  'ai-agent':'자료 조사부터 분석, 보고서 작성까지 맡기기',
  'function-calling':'AI가 연결된 날씨 조회 기능 사용하기',
  mcp:'AI에 문서 검색이나 외부 프로그램 기능 연결하기',
  orchestration:'자료 수집, 요약, 결과 저장을 순서대로 자동화하기',
  'context-memory':'이전에 지정한 답변 형식을 다음 대화에 활용하기',
  'fine-tuning':'고객 문의에 정해진 형식으로 답하도록 추가 학습하기',
  rlhf:'사람이 평가한 답변을 이용해 AI 개선하기',
  quantization:'메모리가 적은 컴퓨터에서 AI 모델 실행하기',
  distillation:'큰 모델의 결과를 이용해 작은 모델 학습시키기',
  'training-vs-inference':'사진 분류 모델을 학습시키고 새 사진으로 시험하기',
  'model-serving':'여러 사람이 동시에 사용하는 AI 서비스 운영하기',
  'model-evaluation':'준비된 질문으로 AI가 정확히 답하는지 시험하기',
  'ai-safety':'AI 서비스에 부적절한 내용이나 정보 노출이 있는지 점검하기',
  observability:'AI 답변이 늦거나 실패한 이유 확인하기',
  hallucination:'AI가 제시한 날짜·숫자·출처를 원문과 비교하기',
  'image-generation':'행사 포스터나 발표용 그림 제작하기',
  'speech-to-text':'회의 녹음에서 회의록 초안 만들기',
  'search-vs-ai':'원문을 검색하고 핵심 내용을 AI로 정리하기',
  'personal-data':'AI 서비스에서 대화 데이터 관련 설정 확인하기',
  'ai-limitations':'AI의 답변에 나온 주장을 믿을 수 있는 자료로 검증하기'
}
const plainCautions:Record<string,string> = {
 ai:'모든 AI가 글을 만들거나 사람처럼 대화할 수 있는 것은 아닙니다.',
 'machine-learning':'예전에 배운 자료에서는 잘 작동해도 새로운 자료에서는 틀릴 수 있습니다.',
 'deep-learning':'복잡한 AI가 항상 더 정확하거나 더 좋은 것은 아닙니다.',
 'neural-networks':'사람의 뇌와 같은 방식으로 생각하는 것은 아닙니다.',
 'supervised-learning':'학습에 사용한 정답이 틀리면 AI도 잘못 배울 수 있습니다.',
 'generative-ai':'AI가 만든 글이나 그림은 실제 사실과 다를 수 있습니다.',
 llm:'글을 자연스럽게 만들 수 있어도 모든 답이 사실인 것은 아닙니다.',
 transformer:'이 구조를 사용하는 모든 AI가 글을 만들어 내는 것은 아닙니다.',
 tokens:'같은 글이라도 AI 모델에 따라 토큰 수가 다를 수 있습니다.',
 'prompt-engineering':'질문을 잘 작성해도 답변이 항상 정확해지는 것은 아닙니다.',
 multimodal:'모든 AI가 사진, 음성, 동영상 등 모든 종류의 자료를 다룰 수 있는 것은 아닙니다.',
 embeddings:'숫자로 표현한 내용이 비슷하다고 해서 뜻이 완전히 같은 것은 아닙니다.',
 'vector-database':'비슷한 자료를 찾더라도 질문에 정확히 맞는 자료인지 확인해야 합니다.',
 'semantic-search':'뜻이 비슷한 결과가 반드시 필요한 정답은 아닙니다.',
 chunking:'문서를 너무 작게 나누면 중요한 앞뒤 내용이 빠질 수 있습니다.',
 rag:'검색된 자료가 틀리거나 빠져 있으면 답변도 틀릴 수 있습니다.',
 'ai-agent':'연결된 프로그램과 권한이 있어야 실제 작업을 할 수 있습니다. 중요한 실행은 사람이 확인해야 합니다.',
 'function-calling':'연결된 프로그램의 기능과 접근 권한이 있어야 요청을 실행할 수 있습니다.',
 mcp:'연결 규칙일 뿐, 모든 프로그램에 자동으로 연결되거나 권한을 얻는 것은 아닙니다.',
 orchestration:'한 작업이 실패하면 다른 작업에도 영향을 줄 수 있어 오류 처리 방법이 필요합니다.',
 'context-memory':'이전 대화 전체를 항상 기억하거나 모든 서비스가 같은 방식으로 정보를 저장하는 것은 아닙니다.',
 'fine-tuning':'새 정보를 알려주기 위해 반드시 AI를 다시 학습시킬 필요는 없습니다.',
 rlhf:'사람의 평가 기준이나 학습 자료에 따라 결과가 달라질 수 있습니다.',
 quantization:'저장 공간을 줄이면 답변의 정확성이 떨어지는 경우도 있습니다.',
 distillation:'작은 모델이 큰 모델과 모든 작업에서 같은 결과를 내는 것은 아닙니다.',
 'training-vs-inference':'AI에 질문한다고 해서 매번 모델 자체가 새로 학습되는 것은 아닙니다.',
 'model-serving':'사용자가 많아지면 응답이 늦어질 수 있어 처리 환경도 중요합니다.',
 'model-evaluation':'몇 가지 질문을 잘 해결했다고 모든 질문에 잘 답하는 것은 아닙니다.',
 'ai-safety':'AI에 조심하라는 지시만으로 모든 정보 유출이나 잘못된 실행을 막을 수는 없습니다.',
 observability:'문제 확인을 위해 기록을 남길 때 개인정보나 기밀을 함께 저장하지 않도록 주의해야 합니다.',
 hallucination:'자연스러운 말투와 정확한 사실은 별개의 문제입니다.',
 'image-generation':'AI가 만든 이미지는 실제로 일어난 사건의 증거가 아닙니다.',
 'speech-to-text':'사람 이름, 숫자, 잘 들리지 않는 말은 원래 녹음과 비교해야 합니다.',
 'search-vs-ai':'검색한 자료와 AI 답변이 일치하는지 확인해야 합니다.',
 'personal-data':'서비스마다 정보 보관과 사용 정책이 다릅니다.',
 'ai-limitations':'건강, 법률, 돈 등 중요한 문제는 신뢰할 수 있는 자료나 전문가에게 확인해야 합니다.'
}
const groups: Record<string,[string,string]> = {
  foundations:['AI는 무엇이고 어떻게 배우나요?','인공지능, 머신러닝, 딥러닝의 기본 개념'],
  models:['AI는 어떻게 글과 그림을 만드나요?','ChatGPT 같은 언어 모델, 이미지, 음성, 질문 방법'],
  retrieval:['AI는 필요한 자료를 어떻게 찾나요?','내 문서 검색, RAG, 문서 저장과 검색 방식'],
  agents:['AI가 실제 업무도 할 수 있나요?','AI Agent, 도구 연결, MCP, 기억 기능'],
  training:['AI는 어떻게 개선되나요?','추가 학습, 사람의 평가, 모델 크기 줄이기'],
  production:['AI를 어떻게 믿고 사용하나요?','사실 확인, 개인정보, 서비스 운영과 평가']
}
const primary = ['ai','machine-learning','generative-ai','llm','rag','ai-agent','mcp','hallucination']
const titleFor = (t:Topic) => t.id==='ai-agent'?'AI Agent (AI 에이전트)':t.id==='llm'?'LLM (대규모 언어 모델)':t.title
export function IntroCard({topic,onTopic}:{topic:Topic,onTopic:(t:Topic)=>void}){
  const intro=aiIntros[topic.id]
  const services=examplesForTopic(topic.id).slice(0,2)
  return <button className="ab-topic" onClick={()=>onTopic(topic)}>
    <span className="ab-term">{titleFor(topic)}</span><h3>{intro[0]}</h3><p>{intro[1]}</p>
    <div className="ab-use-preview"><span className="ab-use-label">실제 사용 사례</span><p>{practicalUses[topic.id]||intro[2]}</p>
      {services.length>0&&<div className="ab-service-tags">{services.map(s=><span key={s.name}>{s.name}</span>)}</div>}
    </div>
    <span className="ab-read">예시와 설명 보기 <ArrowRight size={17}/></span>
  </button>
}
export function BeginnerHome({onTopic,onCategory,onSearch,onDetail,onLab}:{onTopic:(t:Topic)=>void;onCategory:(c:Category)=>void;onSearch:()=>void;onDetail:()=>void;onLab:()=>void}){
  return <div className="ab-page">
    <section className="ab-hero">
      <div><span className="ab-kicker">처음 배우는 AI</span><h1>AI란 무엇일까요?<br/>처음부터 쉽게 배우기</h1><p>AI는 컴퓨터가 글이나 사진을 처리하고, 결과를 예측하거나, 새로운 내용을 만들 수 있도록 하는 기술입니다. 우리가 사용하는 AI가 어떤 일을 할 수 있는지부터 하나씩 알아봅니다.</p><div className="ab-actions"><button className="ab-primary" onClick={()=>onTopic(topicById('ai')!)}>AI란 무엇인가요? <ArrowRight size={18}/></button><button className="ab-secondary" onClick={onDetail}>기술 상세보기 <ArrowUpRight size={17}/></button></div></div>
      <div className="ab-hero-facts"><h2>AI로 할 수 있는 일</h2>{[['질문에 답하고 글을 작성하기','언어 모델 (LLM)','llm'],['사진이나 그림 만들기','이미지 생성','image-generation'],['음성을 글로 바꾸기','음성 인식','speech-to-text'],['필요한 자료 찾아 답하기','RAG','rag']].map(([label,term,id])=><button key={id} onClick={()=>onTopic(topicById(id)!)}><div><strong>{label}</strong><small>{term}</small></div><ChevronRight size={19}/></button>)}</div>
    </section>
    <section className="ab-section"><div className="ab-section-head"><div><span className="ab-kicker">먼저 알아두면 좋은 개념</span><h2>자주 듣는 AI 용어, 쉽게 이해하기</h2></div><button className="ab-secondary" onClick={onSearch}><Search size={17}/> 주제 검색</button></div><div className="ab-grid">{primary.map(id=><IntroCard key={id} topic={topicById(id)!} onTopic={onTopic}/>)}</div></section>
    <section className="ab-section"><div className="ab-section-head"><div><span className="ab-kicker">전체 학습 주제</span><h2>궁금한 것부터 골라보세요</h2></div></div><div className="ab-groups">{categories.filter(c=>c.area==='general').map(c=><button key={c.id} onClick={()=>onCategory(c)}><div><h3>{groups[c.id][0]}</h3><p>{groups[c.id][1]}</p><small>{generalTopics.filter(t=>t.category===c.id).length}개 주제</small></div><ArrowRight size={20}/></button>)}</div></section>
    <section className="ab-more ab-section"><div><h2>기술의 동작 방식까지 알고 싶다면</h2><p>기존의 시스템 구조, 단계별 애니메이션, 직접 따라 하는 실습도 이용할 수 있습니다.</p></div><div className="ab-actions"><button className="ab-secondary" onClick={onDetail}>기술 상세보기 <ArrowUpRight size={17}/></button><button className="ab-secondary" onClick={onLab}>AI 실습 연구실 <ArrowRight size={17}/></button></div></section>
  </div>
}
export function BeginnerCollection({category,onTopic,onHome,onLab,onDetail}:{category:Category;onTopic:(t:Topic)=>void;onHome:()=>void;onLab:()=>void;onDetail:()=>void}){
  return <div className="ab-page"><button className="ab-back" onClick={onHome}><ArrowLeft size={17}/> AI 첫 화면</button><header className="ab-collection-head"><span className="ab-kicker">AI 쉽게 배우기</span><h1>{groups[category.id][0]}</h1><p>{groups[category.id][1]}</p><div className="ab-actions"><button className="ab-secondary" onClick={onDetail}>이 분야 기술 상세보기 <ArrowUpRight size={17}/></button></div></header><div className="ab-grid">{generalTopics.filter(t=>t.category===category.id).map(t=><IntroCard key={t.id} topic={t} onTopic={onTopic}/>)}</div><div className="ab-more ab-section"><h2>직접 체험해 보고 싶다면</h2><button className="ab-secondary" onClick={onLab}>이 분야 실습하기 <ArrowRight size={17}/></button></div></div>
}
export function BeginnerTopic({topic,onHome,onCategory,onDetail,onTopic,bookmarked,onBookmark}:{topic:Topic;onHome:()=>void;onCategory:()=>void;onDetail:()=>void;onTopic:(t:Topic)=>void;bookmarked:boolean;onBookmark:()=>void}){
  const [copied,setCopied]=useState(false)
  const [question,answer,example]=aiIntros[topic.id]
  const services=examplesForTopic(topic.id)
  const related=topic.related.map(topicById).filter((t):t is Topic=>!!t)
  return <article className="ab-page ab-article">
    <div className="ab-topic-nav"><button className="ab-back" onClick={onHome}><ArrowLeft size={17}/> AI 첫 화면</button><button className="ab-back" onClick={onCategory}>같은 분야의 주제 <ChevronRight size={16}/></button><div className="ab-tools"><button className="ab-secondary" onClick={onBookmark}>{bookmarked?<BookmarkCheck size={18}/>:<Bookmark size={18}/>} {bookmarked?'저장됨':'저장'}</button><button className="ab-secondary" onClick={async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopied(true)}catch{setCopied(false)}}}><Share2 size={18}/> {copied?'복사됨':'공유'}</button></div></div>
    <header className="ab-collection-head"><span className="ab-kicker">{titleFor(topic)}</span><h1>{question}</h1></header>
    <section className="ab-answer"><h2>쉽게 설명하면</h2><p>{answer}</p></section>
    <section className="ab-example"><h2>실제로 이렇게 사용합니다</h2><p>{example}</p>
      {services.length>0&&<div className="ab-real-services"><h3>실제 서비스 · 도구</h3><div className="ab-service-grid">{services.map(s=><a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="ab-service-card"><span>{s.kind}</span><strong>{s.name} <ArrowUpRight size={16}/></strong><p>{s.description}</p><small>공식 자료 보기</small></a>)}</div><p className="ab-service-note">기술의 활용을 이해하기 위한 사례입니다. 제품마다 내부 구현, 제공 기능과 사용 권한은 다를 수 있습니다.</p></div>}
    </section>
    <div className="ab-note"><strong>알아둘 점</strong><p>{plainCautions[topic.id]||topic.caution}</p></div>
    <section className="ab-more ab-section"><div><h2>어떻게 작동하는지 더 알고 싶나요?</h2><p>단계별 애니메이션, 내부 기술 구조, 사용 사례와 기술 설명을 확인할 수 있습니다.</p></div><button className="ab-primary" onClick={onDetail}>상세보기 <ArrowRight size={18}/></button></section>
    <section className="ab-sources"><h2>참고 자료</h2>{topic.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.name} <ArrowUpRight size={15}/></a>)}</section>
    {related.length>0&&<section className="ab-section"><h2>다음으로 알아볼 내용</h2><div className="ab-grid">{related.map(t=><IntroCard key={t.id} topic={t} onTopic={onTopic}/>)}</div></section>}
  </article>
}
