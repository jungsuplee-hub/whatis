/**
 * 실제 제품·도구·공식 자료의 예시. 서비스가 특정 주제의 기술을
 * 반드시 독점적으로 사용하거나 같은 내부 구현을 갖는다는 뜻은 아니다.
 */
export type ExampleKind = '서비스' | '개발 도구' | '관련 자료'
export interface ServiceExample {
  name: string
  description: string
  url: string
  kind: ExampleKind
}
const item = (name: string, description: string, url: string, kind: ExampleKind = '서비스'): ServiceExample =>
  ({ name, description, url, kind })

export const serviceExamples: Record<string, ServiceExample[]> = {
  'ai': [
    item('ChatGPT', '질문에 답하거나 글·이미지를 만드는 생성형 AI 활용 예시', 'https://chatgpt.com/'),
    item('Google Lens', '카메라나 이미지 속 물체·글자를 인식해 정보를 찾는 시각 AI', 'https://lens.google/'),
  ],
  'machine-learning': [
    item('Teachable Machine', '사진이나 소리의 예시를 보여주고 새로운 입력을 구별하는 AI를 만들어 볼 수 있음', 'https://teachablemachine.withgoogle.com/', '개발 도구'),
    item('Google Vertex AI', '판매량 예측이나 제품 분류에 필요한 모델을 학습시키는 플랫폼', 'https://cloud.google.com/vertex-ai', '개발 도구'),
    item('Amazon SageMaker AI', '머신러닝 모델의 학습과 추론을 위한 AWS 플랫폼', 'https://aws.amazon.com/sagemaker/ai/', '개발 도구'),
  ],
  'deep-learning': [
    item('TensorFlow Playground', '신경망의 층과 데이터에 따라 학습 결과가 달라지는 모습을 체험', 'https://playground.tensorflow.org/', '개발 도구'),
    item('Hugging Face Models', '딥러닝 기반 언어·이미지·음성 모델을 살펴보고 활용', 'https://huggingface.co/models', '개발 도구'),
  ],
  'neural-networks': [
    item('TensorFlow Playground', '뉴런·은닉층·학습률을 바꾸며 신경망이 배우는 모습을 시각화', 'https://playground.tensorflow.org/', '개발 도구'),
    item('Teachable Machine', '예시 이미지나 소리를 사용해 간단한 인식 모델을 학습', 'https://teachablemachine.withgoogle.com/', '개발 도구'),
  ],
  'supervised-learning': [
    item('Teachable Machine', '직접 지정한 클래스의 예시로 분류 모델을 학습', 'https://teachablemachine.withgoogle.com/', '개발 도구'),
    item('Google Vertex AI', '레이블이 있는 데이터로 분류·예측 모델을 학습하는 플랫폼', 'https://cloud.google.com/vertex-ai', '개발 도구'),
  ],
  'generative-ai': [
    item('ChatGPT', '질문이나 지시를 받아 새로운 텍스트·이미지 등을 생성', 'https://chatgpt.com/'),
    item('Adobe Firefly', '글이나 참조 자료를 사용해 이미지를 생성·편집', 'https://firefly.adobe.com/'),
    item('Claude', '글쓰기·분석·코딩을 돕는 생성형 AI 서비스', 'https://claude.ai/'),
  ],
  'llm': [
    item('ChatGPT', '대규모 언어 모델을 활용해 대화·요약·글쓰기 지원', 'https://chatgpt.com/'),
    item('Claude', '언어 모델 기반 질문응답·문서 분석·코딩 지원', 'https://claude.ai/'),
  ],
  'transformer': [
    item('Hugging Face Transformers', 'Transformer 계열 모델을 불러와 추론·학습하는 라이브러리', 'https://huggingface.co/docs/transformers/index', '개발 도구'),
    item('Transformers.js', '웹 브라우저에서 사전학습된 모델을 실행하는 라이브러리', 'https://huggingface.co/docs/transformers.js/index', '개발 도구'),
  ],
  'tokens': [
    item('OpenAI Tokenizer', '문장을 토큰으로 나누는 방식과 토큰 개수를 직접 확인', 'https://platform.openai.com/tokenizer', '개발 도구'),
    item('tiktoken', 'OpenAI 모델의 토큰 계산을 위한 오픈소스 라이브러리', 'https://github.com/openai/tiktoken', '개발 도구'),
  ],
  'prompt-engineering': [
    item('OpenAI Playground', '프롬프트·설정을 바꾸며 모델 응답을 시험하는 개발 환경', 'https://platform.openai.com/playground', '개발 도구'),
    item('Google AI Studio', 'Gemini 모델에 다양한 프롬프트를 입력해 결과를 비교', 'https://aistudio.google.com/', '개발 도구'),
  ],
  'multimodal': [
    item('Google Gemini', '텍스트와 이미지 등 여러 형태의 입력을 다루는 AI', 'https://gemini.google.com/'),
    item('ChatGPT', '이미지나 음성 등의 입력과 텍스트를 함께 활용하는 대화형 AI', 'https://chatgpt.com/'),
  ],
  'embeddings': [
    item('OpenAI Embeddings API', '글을 의미를 비교할 수 있는 숫자 벡터로 변환', 'https://platform.openai.com/docs/guides/embeddings', '개발 도구'),
    item('Cohere Embed', '문서와 질의의 임베딩을 생성해 의미 기반 탐색에 활용', 'https://docs.cohere.com/docs/embeddings', '개발 도구'),
  ],
  'vector-database': [
    item('Pinecone', '임베딩 벡터를 저장하고 유사한 항목을 검색하는 데이터베이스', 'https://www.pinecone.io/', '개발 도구'),
    item('Weaviate', '벡터 및 키워드 검색을 제공하는 데이터베이스', 'https://weaviate.io/', '개발 도구'),
  ],
  'semantic-search': [
    item('Elasticsearch', '문서의 단어뿐 아니라 의미를 바탕으로 검색하는 기능 제공', 'https://www.elastic.co/elasticsearch', '개발 도구'),
    item('Algolia', '검색·발견 경험에 키워드와 AI 기반 검색을 결합', 'https://www.algolia.com/', '개발 도구'),
  ],
  'chunking': [
    item('LangChain Text Splitters', '긴 문서를 작은 검색·처리 단위로 나누는 라이브러리', 'https://reference.langchain.com/python/langchain-text-splitters', '개발 도구'),
    item('LlamaIndex', '문서를 노드·청크로 구성해 검색 및 AI 앱에 연결', 'https://docs.llamaindex.ai/', '개발 도구'),
  ],
  'rag': [
    item('NotebookLM (Gemini Notebook)', '등록한 자료를 근거로 질문에 답하고 출처를 표시하는 사용자 경험의 사례. 세부 내부 구현을 특정하는 것은 아님', 'https://support.google.com/gemininotebook/answer/16269187?hl=ko'),
    item('Azure AI Search', '검색한 기업 문서를 생성형 AI 답변의 근거로 연결', 'https://azure.microsoft.com/products/ai-services/ai-search', '개발 도구'),
    item('Amazon Bedrock Knowledge Bases', '자료 검색과 생성형 모델을 결합한 RAG 기능', 'https://aws.amazon.com/bedrock/knowledge-bases/', '개발 도구'),
  ],
  'ai-agent': [
    item('ChatGPT Work 모드', '여러 자료를 조사하고 비교·분석한 뒤 보고서나 스프레드시트 같은 결과물을 만드는 여러 단계의 작업을 맡길 수 있음. 연결된 앱과 권한에 따라 가능한 작업이 달라짐', 'https://help.openai.com/ko-kr/articles/20001275-chatgpt-work-and-codex'),
    item('Microsoft Copilot Studio', '업무용 AI 에이전트와 자동화를 구성하는 플랫폼', 'https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio', '개발 도구'),
  ],
  'function-calling': [
    item('OpenAI Function Calling', '모델이 외부 함수의 이름과 인자를 지정하도록 연결', 'https://platform.openai.com/docs/guides/function-calling', '개발 도구'),
    item('Gemini Function Calling', 'Gemini 모델의 출력을 외부 애플리케이션 함수와 연동', 'https://ai.google.dev/gemini-api/docs/function-calling', '개발 도구'),
  ],
  'mcp': [
    item('Claude Desktop + MCP', '연결한 MCP 서버가 제공하는 자료나 기능을 AI 대화에서 사용할 수 있음', 'https://apps.extensions.modelcontextprotocol.io/api/documents/quickstart.html'),
    item('MCP 공식 서버 예시', 'MCP로 파일·도구 등 외부 시스템을 연결하는 서버 구현 예시', 'https://github.com/modelcontextprotocol/servers', '개발 도구'),
    item('MCP 공식 안내', '도구와 AI 애플리케이션을 연결하는 프로토콜을 설명', 'https://modelcontextprotocol.io/introduction', '관련 자료'),
  ],
  'orchestration': [
    item('LangGraph', 'AI 에이전트의 단계·상태·분기를 그래프로 구성', 'https://www.langchain.com/langgraph', '개발 도구'),
    item('n8n', '앱·API·AI 단계를 연결해 자동화 워크플로를 제작', 'https://n8n.io/', '개발 도구'),
  ],
  'context-memory': [
    item('ChatGPT Memory', '대화에서 관련 정보를 기억하고 이후 응답에 활용하는 기능', 'https://help.openai.com/en/articles/8590148-memory-faq'),
    item('LangGraph Persistence', '에이전트 실행 상태를 저장·복원하는 체크포인트 기능', 'https://docs.langchain.com/oss/python/langgraph/persistence', '개발 도구'),
  ],
  'fine-tuning': [
    item('Hugging Face AutoTrain', '자체 데이터로 모델을 미세조정하는 도구', 'https://huggingface.co/autotrain', '개발 도구'),
    item('Google Vertex AI', '지원 모델을 특정 작업과 데이터에 맞춰 조정하는 플랫폼', 'https://cloud.google.com/vertex-ai', '개발 도구'),
  ],
  'rlhf': [
    item('Hugging Face TRL', '사람의 선호·보상 신호 등을 이용한 언어 모델 후속 학습 도구', 'https://huggingface.co/docs/trl/index', '개발 도구'),
    item('NVIDIA NeMo RL', '강화학습 기반 언어 모델 후속 학습 프레임워크', 'https://github.com/NVIDIA/NeMo-RL', '개발 도구'),
  ],
  'quantization': [
    item('llama.cpp', '양자화 모델의 로컬 추론을 지원하는 오픈소스 프로젝트', 'https://github.com/ggml-org/llama.cpp', '개발 도구'),
    item('Hugging Face Quantization', '모델을 더 적은 비트로 표현하는 방법과 도구 안내', 'https://huggingface.co/docs/transformers/quantization/overview', '개발 도구'),
  ],
  'distillation': [
    item('Amazon Bedrock Model Distillation', '큰 교사 모델의 응답을 활용해 작은 모델을 맞춤화', 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-distillation.html', '개발 도구'),
    item('DistilBERT', '지식 증류를 활용해 만든 소형 언어 모델의 사례', 'https://huggingface.co/distilbert/distilbert-base-uncased', '관련 자료'),
  ],
  'training-vs-inference': [
    item('Google Colab', '코드 환경에서 모델 학습과 예측을 각각 실행해 볼 수 있음', 'https://colab.research.google.com/', '개발 도구'),
    item('Hugging Face Inference Providers', '이미 학습된 AI 모델을 API로 실행하는 추론 서비스', 'https://huggingface.co/docs/inference-providers/index', '개발 도구'),
  ],
  'model-serving': [
    item('vLLM', '언어 모델에 대한 빠른 추론과 API 서빙을 제공', 'https://docs.vllm.ai/', '개발 도구'),
    item('NVIDIA Triton Inference Server', '다양한 AI 모델의 추론을 서버에서 제공하는 소프트웨어', 'https://github.com/triton-inference-server/server', '개발 도구'),
  ],
  'model-evaluation': [
    item('OpenAI Evals', 'AI 시스템의 동작과 품질을 반복해서 평가하는 도구', 'https://github.com/openai/evals', '개발 도구'),
    item('LangSmith', 'LLM 앱의 테스트·평가·추적을 지원하는 플랫폼', 'https://www.langchain.com/langsmith', '개발 도구'),
  ],
  'ai-safety': [
    item('Azure AI Content Safety', '텍스트와 이미지의 유해 콘텐츠를 탐지하도록 지원', 'https://azure.microsoft.com/products/ai-services/ai-content-safety', '개발 도구'),
    item('NIST AI Risk Management Framework', 'AI 위험을 체계적으로 관리하기 위한 공식 프레임워크', 'https://www.nist.gov/itl/ai-risk-management-framework', '관련 자료'),
  ],
  'observability': [
    item('LangSmith', '모델 호출과 에이전트 흐름을 추적·평가', 'https://www.langchain.com/langsmith', '개발 도구'),
    item('Arize Phoenix', 'AI 애플리케이션의 트레이스와 평가 결과를 관찰', 'https://phoenix.arize.com/', '개발 도구'),
  ],
  'hallucination': [
    item('Perplexity', '답변과 함께 관련 웹 자료를 제시해 원문 확인을 도움', 'https://www.perplexity.ai/'),
    item('NotebookLM (Gemini Notebook)', '등록한 자료에 근거해 답하고 출처를 표시하므로 원문 확인에 도움. 오류를 완전히 막는 것은 아님', 'https://support.google.com/gemininotebook/answer/16269187?hl=ko'),
  ],
  'image-generation': [
    item('ChatGPT 이미지 생성', '자연어 요청으로 이미지를 만들거나 수정', 'https://chatgpt.com/'),
    item('Adobe Firefly', '텍스트 입력과 이미지 편집을 지원하는 생성형 AI', 'https://firefly.adobe.com/'),
    item('Midjourney', '프롬프트를 바탕으로 이미지를 생성하는 서비스', 'https://www.midjourney.com/'),
  ],
  'speech-to-text': [
    item('OpenAI Speech to Text', '음성 파일을 글자로 전사하는 API', 'https://platform.openai.com/docs/guides/speech-to-text', '개발 도구'),
    item('Google Cloud Speech-to-Text', '음성을 텍스트로 변환하는 클라우드 서비스', 'https://cloud.google.com/speech-to-text'),
  ],
  'search-vs-ai': [
    item('Google 검색', '웹페이지와 자료를 탐색하는 전통적인 검색 경험', 'https://www.google.com/'),
    item('Perplexity', '웹 검색과 AI 요약 답변을 결합하고 출처를 표시', 'https://www.perplexity.ai/'),
    item('ChatGPT Search', '검색한 웹 자료를 대화형 답변에 결합하는 기능', 'https://chatgpt.com/'),
  ],
  'personal-data': [
    item('ChatGPT 데이터 제어', '대화의 데이터 관련 설정과 관리 기능을 안내', 'https://help.openai.com/en/articles/7730893-data-controls-faq', '관련 자료'),
    item('Microsoft Purview', '조직의 데이터 보호·분류·규정 준수를 지원', 'https://www.microsoft.com/security/business/microsoft-purview'),
  ],
  'ai-limitations': [
    item('Google Fact Check Explorer', '공개된 팩트체크 결과를 찾아 주장 검증에 참고', 'https://toolbox.google.com/factcheck/explorer'),
    item('NIST AI Risk Management Framework', 'AI 오류·편향·위험을 점검하는 관리 기준', 'https://www.nist.gov/itl/ai-risk-management-framework', '관련 자료'),
  ],
}

export const examplesForTopic = (topicId: string): ServiceExample[] =>
  serviceExamples[topicId] ?? []
