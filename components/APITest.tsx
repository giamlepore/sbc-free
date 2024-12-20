import { useState } from 'react'
import { ChevronRight, Flag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

type APITestProps = {
  level: 'basic' | 'intermediate' | 'advanced'
}

const basicQuestions = [
  {
    id: 1,
    question: "O que é uma API (Application Programming Interface)?",
    options: [
      "Uma interface gráfica para editar aplicações",
      "Um conjunto de regras que permite a comunicação entre sistemas",
      "Um banco de dados para armazenar informações de usuários",
      "Uma linguagem de programação específica"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Qual é o principal objetivo de uma API REST?",
    options: [
      "Garantir comunicação em tempo real entre sistemas",
      "Facilitar a integração entre sistemas por meio de padrões bem definidos",
      "Substituir o backend por uma interface mais simples",
      "Criar páginas web responsivas"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "O que é JSON, frequentemente utilizado em APIs?",
    options: [
      "Um tipo de banco de dados relacional",
      "Um protocolo de comunicação em tempo real",
      "Um formato para troca de dados estruturados",
      "Um método de autenticação seguro"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Imagine que sua equipe precisa integrar uma API de pagamento ao produto. O que você deve validar antes de iniciar a integração?",
    options: [
      "A disponibilidade de documentação clara e completa da API",
      "O custo por transação e limitações de uso",
      "Os métodos de autenticação necessários (como tokens)",
      "Todas as opções acima"
    ],
    correctAnswer: 3
  },
  {
    id: 5,
    question: "Ao revisar a documentação de uma API, você encontra as seguintes informações: GET /users/{id}. O que significa essa chamada?",
    options: [
      "Criar um novo usuário no sistema",
      "Atualizar os dados de um usuário específico",
      "Obter informações de um usuário identificado pelo ID",
      "Excluir um usuário identificado pelo ID"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "Seu time reporta que a integração com uma API está retornando erros 404. O que você deveria questionar primeiro?",
    options: [
      "Se o endpoint foi configurado corretamente",
      "Se o sistema está fora do ar",
      "Se as credenciais de autenticação são válidas",
      "Se a API suporta requisições em JSON"
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    question: "O que significa a limitação rate limiting em APIs?",
    options: [
      "A quantidade máxima de dados que uma API pode armazenar",
      "O número de requisições que podem ser feitas em um intervalo de tempo",
      "O tempo de resposta médio de uma API",
      "A capacidade da API de processar múltiplas requisições ao mesmo tempo"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Como você pode monitorar a eficiência de uma integração com uma API?",
    options: [
      "Acompanhando a taxa de erros de requisições (ex.: 4xx e 5xx)",
      "Verificando o tempo médio de resposta das chamadas",
      "Avaliando a experiência do usuário no fluxo que utiliza a API",
      "Todas as opções acima"
    ],
    correctAnswer: 3
  },
  {
    id: 9,
    question: "Uma API solicita autenticação via OAuth 2.0. Qual é o papel do access token nesse processo?",
    options: [
      "Garantir que o servidor API esteja disponível",
      "Autorizar o acesso de um cliente às funcionalidades da API",
      "Monitorar as métricas de uso da API",
      "Reduzir o número de chamadas feitas ao servidor"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Por que é importante utilizar HTTPS ao acessar APIs?",
    options: [
      "Para reduzir o tempo de resposta das chamadas",
      "Para garantir que os dados transmitidos estejam seguros contra interceptações",
      "Para evitar limitações de rate limiting",
      "Para garantir compatibilidade com mais linguagens de programação"
    ],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "Um cliente reporta que os dados de um relatório no produto estão desatualizados. Após investigação, você descobre que eles dependem de uma API externa. Como você lidaria com isso?",
    options: [
      "Pedir à equipe técnica para revisar o cronograma de chamadas à API",
      "Entrar em contato com o fornecedor da API para verificar a frequência de atualização dos dados",
      "Validar se houve alterações no contrato ou documentação da API",
      "Todas as opções acima"
    ],
    correctAnswer: 3
  },
  {
    id: 12,
    question: "Sua equipe propõe criar uma API para um parceiro comercial. Como PM, qual seria sua principal responsabilidade nesse projeto?",
    options: [
      "Definir os requisitos e os casos de uso da API com base nas necessidades do parceiro",
      "Escrever o código da API",
      "Configurar o ambiente de testes da API",
      "Monitorar os logs de erros da API após o lançamento"
    ],
    correctAnswer: 0
  }
]

const intermediateQuestions = [
  {
    id: 1,
    question: "O que diferencia uma API REST de uma API SOAP?",
    options: [
      "O REST utiliza apenas o método GET, enquanto o SOAP utiliza POST",
      "O SOAP usa XML para a comunicação, enquanto o REST aceita múltiplos formatos como JSON e XML",
      "O REST é mais seguro que o SOAP",
      "O SOAP permite comunicação em tempo real, enquanto o REST não"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Quais são as características fundamentais que definem uma API RESTful?",
    options: [
      "Estado mantido no servidor, JSON obrigatório e endpoints dinâmicos",
      "Stateless (sem estado), separação de cliente/servidor, cacheabilidade e uso de métodos HTTP padrão",
      "Comunicação orientada a eventos e resposta em tempo real",
      "Conexões WebSocket obrigatórias e suporte a longa duração de conexões"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "O que significa o termo \"payload\" em uma requisição de API?",
    options: [
      "O nome do endpoint que está sendo chamado",
      "O corpo (body) de dados enviados em uma requisição ou resposta de API",
      "O tempo total necessário para a resposta de uma requisição",
      "O tipo de autenticação utilizada para acessar a API"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Sua equipe está consumindo uma API que retorna o seguinte erro: 401 Unauthorized. O que isso significa?",
    options: [
      "O endpoint que está sendo acessado não existe",
      "O cliente não tem as credenciais corretas ou não está autenticado",
      "O servidor está sobrecarregado e não consegue atender à requisição",
      "O cliente enviou um formato de dados inválido na requisição"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Durante a análise de uma nova API de parceiros, você percebe que ela tem uma limitação de 100 requisições por minuto. Qual seria uma solução prática para contornar esse problema?",
    options: [
      "Utilizar paralelismo para fazer múltiplas requisições ao mesmo tempo",
      "Implementar filas de requisições (request queue) para evitar exceder o limite",
      "Pedir ao parceiro para aumentar o limite de requisições",
      "Mudar a API para uma alternativa que não tenha limite de requisições"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Ao revisar a documentação de uma API, você vê a seguinte chamada: PUT /orders/{orderId}. O que esse endpoint faz?",
    options: [
      "Cria uma nova ordem no sistema",
      "Atualiza uma ordem existente, identificada pelo \"orderId\"",
      "Remove uma ordem específica",
      "Retorna os detalhes de uma ordem específica"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "O que é a latência de uma API?",
    options: [
      "O número de requisições permitidas por segundo",
      "O tempo entre a solicitação e a resposta de uma requisição de API",
      "O tamanho máximo do payload que a API aceita",
      "O número de conexões simultâneas permitidas pela API"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Qual das opções abaixo não é uma métrica relevante para o desempenho de uma API?",
    options: [
      "Taxa de erro (4xx, 5xx)",
      "Tempo de resposta (response time)",
      "Disponibilidade (uptime)",
      "O número de linguagens de programação compatíveis"
    ],
    correctAnswer: 3
  },
  {
    id: 9,
    question: "O que diferencia autenticação de autorização em APIs?",
    options: [
      "Autenticação é para identificar \"quem é o usuário\", enquanto autorização define \"o que o usuário pode fazer\"",
      "Autorização ocorre antes da autenticação",
      "Autenticação e autorização são sinônimos",
      "A autorização é feita via tokens, enquanto a autenticação é via cookies"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Se uma API expõe informações sensíveis, qual das alternativas abaixo é a prática de segurança mais recomendada?",
    options: [
      "Usar HTTPS para criptografar a comunicação",
      "Utilizar métodos GET para enviar informações sensíveis no URL",
      "Evitar o uso de autenticação via tokens",
      "Enviar as credenciais de autenticação via parâmetros de URL"
    ],
    correctAnswer: 0
  },
  {
    id: 11,
    question: "Sua equipe precisa decidir se vai usar uma API interna ou construir uma API própria. Como Product Manager, o que você deve considerar antes de tomar essa decisão?",
    options: [
      "O custo de desenvolvimento de uma API interna",
      "O tempo de implementação e a equipe necessária",
      "A flexibilidade para personalizar a API conforme as demandas do parceiro",
      "Todas as opções acima"
    ],
    correctAnswer: 3
  },
  {
    id: 12,
    question: "Durante a integração com uma nova API, o cliente final solicita que as atualizações de dados sejam quase em tempo real. Qual estratégia de integração você recomendaria?",
    options: [
      "Utilizar uma abordagem de \"polling\" (requisições periódicas)",
      "Solicitar ao fornecedor da API que implemente WebSockets ou eventos push",
      "Aumentar o limite de requisições por minuto",
      "Armazenar os dados localmente para evitar o consumo de API"
    ],
    correctAnswer: 1
  }
]

const advancedQuestions = [
  {
    id: 1,
    question: "Em relação a APIs REST, qual das seguintes opções está incorreta?",
    options: [
      "O método POST geralmente é usado para criar novos recursos",
      "O método GET deve ser idempotente",
      "O método DELETE deve retornar sempre o código de status 204",
      "O método PUT pode substituir completamente o recurso existente"
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "O que caracteriza uma \"API idempotente\"?",
    options: [
      "Uma API que garante a resposta mais rápida possível",
      "Uma API que não altera o estado do sistema se a mesma requisição for feita múltiplas vezes",
      "Uma API que processa múltiplas requisições de forma simultânea",
      "Uma API que aumenta seu tempo de resposta proporcionalmente ao número de chamadas"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Durante a integração com uma API de terceiros, o fornecedor comunica que o contrato da API será alterado e o campo \"status\" (que era um boolean) agora será uma \"string\". O que você deve fazer?",
    options: [
      "Atualizar o contrato imediatamente e notificar os desenvolvedores",
      "Solicitar uma versão separada da API para manter a retrocompatibilidade",
      "Adicionar lógica no seu produto para lidar com ambos os tipos de resposta",
      "Documentar a mudança e solicitar ao fornecedor a manutenção do campo boolean"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Sua equipe está consumindo uma API de clima e os dados de temperatura estão inconsistentes. Algumas requisições retornam 200 OK, mas os dados estão desatualizados. O que você investigaria primeiro?",
    options: [
      "Verificar se a API está usando cache e qual é o tempo de expiração do cache",
      "Solicitar ao fornecedor uma garantia de \"freshness\" (atualização) dos dados",
      "Verificar se a autenticação OAuth 2.0 está expirando antes da requisição",
      "Configurar o sistema para solicitar uma atualização forçada dos dados em cada requisição"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "O que é \"Rate Limiting\" em APIs?",
    options: [
      "Um método de controle de acesso para bloquear usuários não autorizados",
      "O número máximo de requisições que podem ser feitas em um intervalo de tempo",
      "O tempo médio de resposta de uma API",
      "A limitação de usuários simultâneos na API"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Sua equipe está usando chaves de API para autenticar usuários, mas o time de segurança está sugerindo mudar para OAuth 2.0. Quais são as vantagens de OAuth 2.0?",
    options: [
      "Controle de acesso por escopo, ciclo de vida dos tokens e uso de refresh tokens",
      "Controle de acesso global e maior velocidade nas requisições",
      "Permite apenas requisições seguras via POST",
      "Autenticação baseada em HTTP Basic Auth"
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    question: "Sua API de pagamento parou de funcionar e o fornecedor afirma que a API foi \"deprecated\" sem aviso prévio. Qual é a melhor forma de minimizar o impacto no curto prazo?",
    options: [
      "Procurar urgentemente um novo fornecedor e mudar a integração",
      "Solicitar ao fornecedor uma reativação temporária da API antiga enquanto a nova integração é feita",
      "Implementar uma funcionalidade que permite aos usuários finalizar a compra manualmente",
      "Publicar um comunicado de erro para todos os clientes e usuários explicando o problema"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Sua equipe precisa expor uma API pública, mas a segurança é uma preocupação. Quais práticas você recomendaria para garantir que a API seja segura?",
    options: [
      "Implementar rate limiting, tokens de acesso de curta duração e autenticação OAuth 2.0",
      "Evitar autenticação e manter a API pública",
      "Usar chaves de API estáticas sem expiração para facilitar a integração",
      "Usar CORS para permitir acesso de qualquer origem para maior flexibilidade"
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    question: "O fornecedor de uma API crítica aumentou os preços em 75%. Como você apresentaria uma proposta de renegociação?",
    options: [
      "Propor a migração para um fornecedor mais barato e mostrar as alternativas",
      "Solicitar um desconto escalonado, oferecendo um contrato de longo prazo",
      "Propor o pagamento em ciclos trimestrais, em vez de mensal",
      "Negociar um limite maior de requisições por minuto, mantendo o preço original"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Sua equipe identificou que 40% dos custos operacionais vêm da dependência de uma API de terceiros. Quais ações você sugeriria para reduzir os custos?",
    options: [
      "Criar uma API interna para substituir a API de terceiros",
      "Reavaliar o uso da API e remover chamadas desnecessárias",
      "Negociar com o fornecedor por preços mais competitivos",
      "Aplicar caching para reduzir o número de chamadas feitas para a API"
    ],
    correctAnswer: 3
  }
]

interface FeedbackInfo {
  whyImportant: string[];
  studyRecommendation: string[];
}

const feedbackDatabase: { [key: string]: { [key: number]: FeedbackInfo } } = {
  basic: {
    1: {
      whyImportant: [
        "Como PM, você precisará explicar conceitos técnicos para stakeholders não-técnicos",
        "Em discussões sobre integrações com parceiros, você precisa entender o papel fundamental das APIs"
      ],
      studyRecommendation: [
        "Curso 'API Fundamentals' no Coursera ou edX",
        "Documentação de APIs populares como Stripe ou Twitter para ver exemplos práticos"
      ]
    },
    2: {
      whyImportant: [
        "Ao planejar novas integrações, você precisa entender as vantagens do REST",
        "Em discussões técnicas sobre arquitetura, você precisa justificar escolhas de design"
      ],
      studyRecommendation: [
        "Artigo 'RESTful API Design - Best Practices'",
        "Estudo de caso sobre como grandes empresas estruturam suas APIs"
      ]
    },
    3: {
      whyImportant: [
        "JSON é o formato mais comum em APIs modernas, você precisa entendê-lo para ler documentações",
        "Em discussões sobre integração de dados, você precisa entender como as informações são estruturadas"
      ],
      studyRecommendation: [
        "Tutorial prático sobre JSON em json.org",
        "Ferramentas como JSONLint para validar e entender estruturas JSON"
      ]
    },
    4: {
      whyImportant: [
        "Integrações de pagamento são críticas para o negócio e exigem validação cuidadosa",
        "Você precisa garantir que todos os requisitos técnicos e de negócio sejam considerados antes da integração"
      ],
      studyRecommendation: [
        "Documentação de APIs de pagamento populares (Stripe, PayPal)",
        "Checklist de segurança para integrações de pagamento"
      ]
    },
    5: {
      whyImportant: [
        "Você precisa entender os métodos HTTP para discutir funcionalidades com desenvolvedores",
        "Em análises de logs ou debugs, você precisa entender o que cada chamada significa"
      ],
      studyRecommendation: [
        "Guia completo sobre métodos HTTP",
        "Prática com ferramentas como Postman para testar diferentes tipos de chamadas"
      ]
    },
    6: {
      whyImportant: [
        "Erros 404 são comuns e você precisa saber diagnosticar problemas básicos",
        "Como PM, você precisa priorizar correções e entender o impacto no usuário"
      ],
      studyRecommendation: [
        "Lista completa de códigos de status HTTP e seus significados",
        "Ferramentas de monitoramento de API e como interpretar erros comuns"
      ]
    },
    7: {
      whyImportant: [
        "Rate limiting afeta diretamente a experiência do usuário e os custos",
        "Você precisa planejar a escalabilidade do produto considerando estas limitações"
      ],
      studyRecommendation: [
        "Estratégias de rate limiting e seus impactos",
        "Cases de como grandes aplicações lidam com limitações de API"
      ]
    },
    8: {
      whyImportant: [
        "Monitoramento é crucial para a qualidade do serviço",
        "Você precisa definir KPIs técnicos e entender métricas de performance"
      ],
      studyRecommendation: [
        "Ferramentas de monitoramento como DataDog ou New Relic",
        "Métricas importantes para APIs e como interpretá-las"
      ]
    },
    9: {
      whyImportant: [
        "OAuth 2.0 é o padrão de autenticação mais usado em APIs modernas",
        "Segurança é um requisito crítico em qualquer produto digital"
      ],
      studyRecommendation: [
        "Guia simplificado sobre OAuth 2.0",
        "Exemplos práticos de implementação de autenticação em APIs"
      ]
    },
    10: {
      whyImportant: [
        "Segurança de dados é uma responsabilidade crítica do PM",
        "Vazamentos de dados podem causar grandes prejuízos à empresa"
      ],
      studyRecommendation: [
        "Fundamentos de segurança em APIs",
        "Boas práticas de HTTPS e criptografia"
      ]
    },
    11: {
      whyImportant: [
        "Problemas com dados desatualizados são comuns e afetam a confiança no produto",
        "Você precisa ter um plano de contingência para falhas em integrações"
      ],
      studyRecommendation: [
        "Estratégias de cache e sincronização de dados",
        "Padrões de design para lidar com dados externos"
      ]
    },
    12: {
      whyImportant: [
        "Como PM, você é responsável por definir os requisitos das APIs do produto",
        "Você precisa alinhar necessidades técnicas e de negócio"
      ],
      studyRecommendation: [
        "Design de APIs orientado ao consumidor",
        "Metodologias de levantamento de requisitos para APIs"
      ]
    }
  },
  intermediate: {
    1: {
      whyImportant: [
        "Como PM, você precisará escolher entre diferentes tipos de APIs ao planejar novas integrações",
        "O entendimento das diferenças técnicas ajuda a tomar decisões mais embasadas sobre custos e complexidade"
      ],
      studyRecommendation: [
        "Comparativo detalhado entre REST, SOAP, GraphQL e gRPC",
        "Cases de empresas que migraram entre diferentes tipos de APIs"
      ]
    },
    2: {
      whyImportant: [
        "Arquitetura RESTful é o padrão mais comum em APIs modernas",
        "Você precisa garantir que sua API segue boas práticas para facilitar integrações futuras"
      ],
      studyRecommendation: [
        "Livro 'REST API Design Rulebook'",
        "Análise das APIs RESTful de empresas como Stripe e GitHub"
      ]
    },
    3: {
      whyImportant: [
        "Payloads mal estruturados são fonte comum de problemas em integrações",
        "Você precisa validar se os dados trocados atendem às necessidades do negócio"
      ],
      studyRecommendation: [
        "Padrões de design para estruturação de dados em APIs",
        "Ferramentas de validação de payload como Swagger"
      ]
    },
    4: {
      whyImportant: [
        "Erros de autenticação são problemas críticos que afetam diretamente os usuários",
        "Como PM, você precisa garantir que o sistema lida adequadamente com falhas de autenticação"
      ],
      studyRecommendation: [
        "Guia completo sobre códigos de erro HTTP",
        "Estratégias de retry e fallback em integrações"
      ]
    },
    5: {
      whyImportant: [
        "Rate limiting pode impactar significativamente a escalabilidade do produto",
        "Você precisa planejar a arquitetura considerando limites de APIs de terceiros"
      ],
      studyRecommendation: [
        "Padrões de design para lidar com rate limiting",
        "Implementação de filas e sistemas de cache"
      ]
    },
    6: {
      whyImportant: [
        "Entender métodos HTTP é crucial para discutir design de APIs com o time técnico",
        "Você precisa garantir que as operações CRUD estão corretamente mapeadas"
      ],
      studyRecommendation: [
        "Especificação HTTP/1.1 e métodos",
        "Melhores práticas de design de URLs em APIs REST"
      ]
    },
    7: {
      whyImportant: [
        "Latência afeta diretamente a experiência do usuário",
        "Você precisa definir SLAs e monitorar a performance das integrações"
      ],
      studyRecommendation: [
        "Ferramentas de monitoramento de performance de APIs",
        "Estratégias para redução de latência em integrações"
      ]
    },
    8: {
      whyImportant: [
        "Métricas corretas são essenciais para monitorar a saúde das integrações",
        "Você precisa identificar problemas antes que afetem os usuários"
      ],
      studyRecommendation: [
        "KPIs essenciais para monitoramento de APIs",
        "Implementação de dashboards de monitoramento"
      ]
    },
    9: {
      whyImportant: [
        "Confusão entre autenticação e autorização pode levar a falhas de segurança",
        "Você precisa garantir que o controle de acesso está adequado às necessidades do negócio"
      ],
      studyRecommendation: [
        "Padrões de autenticação e autorização em APIs",
        "Implementação de RBAC (Role-Based Access Control)"
      ]
    },
    10: {
      whyImportant: [
        "Segurança é um requisito não-funcional crítico",
        "Vazamentos de dados podem causar danos irreparáveis à reputação da empresa"
      ],
      studyRecommendation: [
        "OWASP API Security Top 10",
        "Práticas de criptografia e segurança em APIs"
      ]
    },
    11: {
      whyImportant: [
        "Build vs Buy é uma decisão estratégica que impacta custos e time-to-market",
        "Você precisa avaliar trade-offs técnicos e de negócio"
      ],
      studyRecommendation: [
        "Frameworks para decisão Build vs Buy",
        "Análise de TCO (Total Cost of Ownership) em APIs"
      ]
    },
    12: {
      whyImportant: [
        "Atualizações em tempo real são cada vez mais importantes para UX",
        "Você precisa entender diferentes estratégias de integração para escolher a mais adequada"
      ],
      studyRecommendation: [
        "Comparativo entre WebSockets, Server-Sent Events e Long Polling",
        "Cases de implementação de real-time em produtos populares"
      ]
    }
  },
  advanced: {
    1: {
      whyImportant: [
        "Como PM sênior, você precisa tomar decisões arquiteturais que afetam todo o produto",
        "Entender os detalhes dos métodos HTTP ajuda a projetar APIs mais eficientes e consistentes"
      ],
      studyRecommendation: [
        "RFC 7231 - HTTP/1.1 Semantics and Content",
        "Análise de APIs bem projetadas como Stripe e Twilio"
      ]
    },
    2: {
      whyImportant: [
        "Idempotência é crucial para garantir a consistência em sistemas distribuídos",
        "Problemas de duplicação de operações podem causar prejuízos significativos (ex: cobranças duplicadas)"
      ],
      studyRecommendation: [
        "Padrões de design para sistemas distribuídos",
        "Implementação de idempotência em diferentes cenários de negócio"
      ]
    },
    3: {
      whyImportant: [
        "Mudanças em contratos de API podem quebrar integrações e afetar parceiros",
        "Você precisa gerenciar a evolução das APIs mantendo compatibilidade"
      ],
      studyRecommendation: [
        "Estratégias de versionamento de APIs",
        "Padrões para evolução de contratos sem quebrar compatibilidade"
      ]
    },
    4: {
      whyImportant: [
        "Problemas de cache podem afetar a confiabilidade dos dados",
        "Como PM, você precisa balancear performance e consistência dos dados"
      ],
      studyRecommendation: [
        "Estratégias avançadas de caching",
        "Padrões de invalidação de cache e consistency patterns"
      ]
    },
    5: {
      whyImportant: [
        "Rate limiting é crucial para proteger recursos e garantir fair use",
        "Você precisa definir políticas que equilibrem uso e disponibilidade"
      ],
      studyRecommendation: [
        "Algoritmos de rate limiting (Token Bucket, Leaky Bucket)",
        "Implementações de rate limiting em diferentes escalas"
      ]
    },
    6: {
      whyImportant: [
        "OAuth 2.0 é complexo e sua implementação incorreta pode criar vulnerabilidades",
        "Decisões de autenticação afetam segurança e experiência do usuário"
      ],
      studyRecommendation: [
        "Especificação completa do OAuth 2.0",
        "Cases de implementação em sistemas de larga escala"
      ]
    },
    7: {
      whyImportant: [
        "APIs deprecated sem aviso prévio são um risco significativo para o negócio",
        "Você precisa ter estratégias de contingência para dependências críticas"
      ],
      studyRecommendation: [
        "Estratégias de gestão de dependências",
        "Padrões de circuit breaker e fallback"
      ]
    },
    8: {
      whyImportant: [
        "Segurança em APIs públicas é um desafio complexo e crítico",
        "Vulnerabilidades podem expor dados sensíveis e comprometer o negócio"
      ],
      studyRecommendation: [
        "OWASP API Security Top 10 (em profundidade)",
        "Implementação de security headers e práticas avançadas de segurança"
      ]
    },
    9: {
      whyImportant: [
        "Negociações de contratos de API podem impactar significativamente os custos",
        "Você precisa entender o valor gerado para negociar adequadamente"
      ],
      studyRecommendation: [
        "Modelos de precificação de APIs",
        "Estratégias de negociação de contratos de SaaS"
      ]
    },
    10: {
      whyImportant: [
        "Otimização de custos em APIs é crucial para a saúde financeira do produto",
        "Você precisa balancear performance, custos e experiência do usuário"
      ],
      studyRecommendation: [
        "Estratégias avançadas de caching e otimização",
        "Análise de custos em arquiteturas distribuídas"
      ]
    }
  }
};

export function APITest({ level }: APITestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedValue, setSelectedValue] = useState<string>("")
  const [showResults, setShowResults] = useState(false)

  const questions = level === 'basic' ? basicQuestions : 
                   level === 'intermediate' ? intermediateQuestions : 
                   level === 'advanced' ? advancedQuestions : []

  const handleAnswer = (value: string) => {
    setSelectedValue(value)
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestion] = parseInt(value)
      return newAnswers
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedValue("")
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const score = calculateScore();
    const wrongAnswers = answers.map((answer, index) => ({
      questionIndex: index,
      isWrong: answer !== questions[index].correctAnswer
    })).filter(item => item.isWrong);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-1 h-[600px]"
      >
        <Card className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700 h-full overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-l font-bold mb-4 text-indigo-400">
                Resultado do Teste de APIs - {level}
              </h2>
              <p className="text-xl font-bold text-gray-200 mb-6">
                Você acertou {score} de {questions.length} questões!
              </p>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-l font-semibold text-gray-200 border-b border-gray-700 pb-2">
                  Sugestões de como você pode melhorar:
                </h3>
                
                {wrongAnswers.map(({ questionIndex }) => {
                  const question = questions[questionIndex];
                  const feedback = feedbackDatabase[level][questionIndex + 1];
                  
                  return (
                    <div key={questionIndex} className="bg-gray-700/50 p-6 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-medium text-white">
                          {question.question}
                        </h4>
                        <div className="flex gap-2 text-sm">
                          <span className="text-red-400">Sua resposta:</span>
                          <span className="text-gray-300">
                            {question.options[answers[questionIndex]]}
                          </span>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="text-green-400">Resposta correta:</span>
                          <span className="text-gray-300">
                            {question.options[question.correctAnswer]}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div>
                          <h5 className="text-indigo-400 font-medium mb-2">
                            Por que é importante saber?
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.whyImportant.map((item, i) => (
                              <li key={i} className="text-gray-300 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-indigo-400 font-medium mb-2">
                            O que estudar para melhorar?
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.studyRecommendation.map((item, i) => (
                              <li key={i} className="text-gray-300 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Button 
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers([])
                setShowResults(false)
                setSelectedValue("")
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                       py-6 text-lg font-medium shadow-lg hover:shadow-indigo-500/20"
            >
              Fazer o teste novamente
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-1"
    >
      <Card className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="bg-green-500/50 h-2 rounded-full"
          />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-indigo-400 mb-3">
            <span className="text-sm font-medium bg-indigo-400/10 px-2 py-1 rounded-md">
              {currentQuestion + 1}/{questions.length}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/50" />
            <span className="text-sm font-medium text-indigo-400/50">Questão</span>
          </div>
          <p className="text-gray-200 text-base leading-relaxed">
            {questions[currentQuestion].question}
          </p>
        </motion.div>

        <RadioGroup
          value={selectedValue}
          onValueChange={handleAnswer}
          className="space-y-1 mb-4"
        >
          {questions[currentQuestion].options.map((option, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={index}
              className="relative"
            >
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 border ${
                selectedValue === index.toString()
                  ? 'bg-green-700/20 border-green-500/50' 
                  : 'hover:bg-gray-700/50 border-gray-700/50 hover:border-indigo-500/50'
              }`}>
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className={`text-gray-200 cursor-pointer flex-1 text-sm leading-relaxed ${
                    selectedValue === index.toString() ? 'text-green-100' : ''
                  }`}
                >
                  {option}
                </Label>
              </div>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleNext}
            disabled={!selectedValue}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-medium
                     shadow-lg hover:shadow-indigo-500/20"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Próxima pergunta
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Ver resultado
                <Flag className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  )
}