export interface Question {
  id: number;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP";
  direction: "positive" | "negative";
}

export const SCALE_OPTIONS = [
  { value: 1, text: "Discordo totalmente" },
  { value: 2, text: "Discordo" },
  { value: 3, text: "Levemente discordo" },
  { value: 4, text: "Neutro" },
  { value: 5, text: "Levemente concordo" },
  { value: 6, text: "Concordo" },
  { value: 7, text: "Concordo totalmente" },
] as const;

export const questions: Question[] = [
  {
    id: 1,
    text: "Prefiro observar e analisar antes de compartilhar minhas opiniões em reuniões.",
    dimension: "EI",
    direction: "positive",
  },
  {
    id: 2,
    text: "Me sinto mais energizado após interagir com muitas pessoas.",
    dimension: "EI",
    direction: "negative",
  },
  {
    id: 3,
    text: "Prefiro trabalhar em um ambiente tranquilo e com poucas interrupções.",
    dimension: "EI",
    direction: "positive",
  },
  {
    id: 4,
    text: "Confio mais em dados concretos e experiências passadas do que em possibilidades futuras.",
    dimension: "SN",
    direction: "positive",
  },
  {
    id: 5,
    text: "Gosto de explorar diferentes cenários e possibilidades, mesmo que pareçam improváveis.",
    dimension: "SN",
    direction: "negative",
  },
  {
    id: 6,
    text: "Prefiro focar em detalhes específicos do que em padrões gerais.",
    dimension: "SN",
    direction: "positive",
  },
  {
    id: 7,
    text: "Tomo decisões baseadas principalmente em análise lógica e objetiva.",
    dimension: "TF",
    direction: "positive",
  },
  {
    id: 8,
    text: "Considero importante levar em conta os sentimentos das pessoas ao tomar decisões.",
    dimension: "TF",
    direction: "negative",
  },
  {
    id: 9,
    text: "Prefiro dar feedback direto e objetivo, mesmo que possa ser desconfortável.",
    dimension: "TF",
    direction: "positive",
  },
  {
    id: 10,
    text: "Gosto de ter um cronograma bem definido e me ater a ele.",
    dimension: "JP",
    direction: "positive",
  },
  {
    id: 11,
    text: "Prefiro manter opções em aberto e ser flexível com mudanças de planos.",
    dimension: "JP",
    direction: "negative",
  },
  {
    id: 12,
    text: "Me sinto mais confortável quando as coisas estão bem organizadas e decididas.",
    dimension: "JP",
    direction: "positive",
  },
];

export const personalityDescriptions: { [key: string]: string } = {
  ENTJ: "O Comandante: Líder natural, foco em objetivos e resultados. Perfeito para PMs que lideram times grandes e lidam com alta pressão.",
  INTJ: "O Arquiteto: Visionário estratégico, ideal para criar roadmaps de longo prazo. Forte em análise de riscos e visão de produto.",
  ENFP: "O Ativista: Muito criativo e otimista. Conecta-se bem com o time e stakeholders, ideal para PMs que precisam de empatia e adaptabilidade.",
  INFP: "O Mediador: Foco em empatia e valores. Ideal para PMs que lidam com produtos voltados para o bem-estar do usuário.",
  ESTJ: "O Executivo: Organizado e prático, perfeito para PMs que gerenciam cronogramas apertados e operam de forma disciplinada.",
  ISTJ: "O Logístico: Prefere métodos comprovados e foco na eficiência. Ideal para produtos que exigem estabilidade e previsibilidade.",
  ENTP: 'O Inovador: Sempre explorando novas soluções e pensando "fora da caixa". Ideal para PMs de startups que buscam inovação constante.',
  INTP: "O Lógico: Pensador analítico, ideal para criar soluções técnicas inovadoras e resolver problemas complexos.",
  ESFJ: "O Provedor: Conector de pessoas. Ideal para PMs que precisam criar alinhamento entre times e stakeholders.",
  ISFJ: "O Defensor: Focado em estabilidade e harmonia. Perfeito para PMs que trabalham com produtos de longo ciclo de vida.",
  ESFP: "O Animador: Enérgico e comunicativo. Ideal para PMs que precisam motivar a equipe e manter o ambiente leve.",
  ISFP: "O Aventureiro: Focado na experiência sensorial e no bem-estar dos usuários. Perfeito para produtos de lifestyle e design centrado no usuário.",
  ESTP: "O Empreendedor: Rápido para tomar decisões sob pressão. Ideal para PMs que lidam com mudanças constantes.",
  ISTP: "O Virtuoso: Prefere soluções práticas e diretas. Ideal para produtos técnicos ou de engenharia.",
  ENFJ: "O Protagonista: Foco na liderança inspiradora. Excelente para PMs que conduzem times diversos.",
  INFJ: "O Advogado: Idealista e focado no bem maior. Perfeito para PMs que lidam com produtos de impacto social.",
};

export type SituationDetail = {
  title: string;
  action: string;
  result: string;
  challenge: string;
};

export type PersonalityDetail = {
  situations: SituationDetail[];
  tips: string[];
  strengths: string[];
};

export const personalityDetails: { [key: string]: PersonalityDetail } = {
  ENTJ: {
    situations: [
      {
        title: "Liderança de Produto",
        action: "Define visão clara e mobiliza o time com objetivos ambiciosos",
        result: "Time alinhado e motivado com metas claras",
        challenge: "Pode ser visto como muito direto ou dominante",
      },
      {
        title: "Tomada de Decisão",
        action: "Analisa dados rapidamente e toma decisões com confiança",
        result: "Agilidade na execução e progresso constante",
        challenge: "Pode negligenciar impactos emocionais nas decisões",
      },
      {
        title: "Gestão de Conflitos",
        action: "Aborda conflitos de frente com soluções práticas",
        result: "Resolução rápida de problemas e clareza nas expectativas",
        challenge: "Pode parecer insensível a questões pessoais",
      },
    ],
    tips: [
      "Desenvolva escuta ativa e empatia",
      "Pratique paciência com processos mais lentos",
      "Considere aspectos emocionais nas decisões",
      "Delegue mais e permita que outros liderem",
      "Balance assertividade com diplomacia",
    ],
    strengths: [
      "Excelente em definir e executar estratégias",
      "Forte capacidade de liderança e motivação",
      "Tomada de decisão rápida e eficaz",
      "Foco em resultados e eficiência",
      "Habilidade natural para gestão de projetos complexos",
    ],
  },
  INTJ: {
    situations: [
      {
        title: "Planejamento Estratégico",
        action: "Desenvolve roadmaps detalhados com análise profunda",
        result: "Estratégias robustas e bem fundamentadas",
        challenge: "Pode ter dificuldade em comunicar visões complexas",
      },
      {
        title: "Análise de Dados",
        action: "Mergulha profundamente em dados para encontrar padrões",
        result: "Insights valiosos e decisões bem fundamentadas",
        challenge: "Pode demorar muito para tomar decisões",
      },
      {
        title: "Inovação de Produto",
        action: "Cria soluções sistêmicas e bem estruturadas",
        result: "Produtos robustos e escaláveis",
        challenge: "Pode resistir a soluções mais simples",
      },
    ],
    tips: [
      "Simplifique a comunicação de ideias complexas",
      "Desenvolva habilidades de networking",
      "Pratique tomada de decisão mais ágil",
      "Aceite que nem tudo precisa ser perfeito",
      "Dedique tempo para construir relacionamentos",
    ],
    strengths: [
      "Pensamento estratégico excepcional",
      "Capacidade de análise profunda",
      "Visão de longo prazo",
      "Habilidade para sistemas complexos",
      "Foco em melhoria contínua",
    ],
  },
  ENFP: {
    situations: [
      {
        title: "Discovery",
        action: "Explora possibilidades criativas e conecta ideias diferentes",
        result: "Soluções inovadoras e engajamento do time",
        challenge: "Pode se dispersar com muitas ideias",
      },
      {
        title: "Apresentações",
        action: "Comunica com entusiasmo e storytelling envolvente",
        result: "Stakeholders engajados e inspirados",
        challenge: "Pode negligenciar detalhes técnicos",
      },
      {
        title: "Design Sprint",
        action: "Facilita sessões criativas e energéticas",
        result: "Alto engajamento e ideias inovadoras",
        challenge: "Pode ter dificuldade em filtrar ideias",
      },
    ],
    tips: [
      "Desenvolva disciplina na execução",
      "Mantenha o foco em objetivos principais",
      "Equilibre criatividade com praticidade",
      "Organize ideias antes de compartilhar",
      "Aprimore habilidades de priorização",
    ],
    strengths: [
      "Excelente em inspirar e motivar equipes",
      "Criatividade e pensamento inovador",
      "Forte empatia com usuários",
      "Adaptabilidade a mudanças",
      "Habilidade natural para networking",
    ],
  },
  INFP: {
    situations: [
      {
        title: "Pesquisa com Usuários",
        action: "Cria conexão profunda e genuína com usuários entrevistados",
        result: "Insights valiosos sobre necessidades emocionais e motivações",
        challenge: "Pode ter dificuldade em manter distância profissional",
      },
      {
        title: "Definição de Features",
        action: "Prioriza impacto humano e bem-estar do usuário",
        result: "Produtos com forte apelo emocional e propósito",
        challenge: "Pode subestimar aspectos técnicos ou financeiros",
      },
      {
        title: "Feedback ao Time",
        action: "Oferece feedback personalizado e cuidadoso",
        result: "Time se sente compreendido e valorizado",
        challenge: "Pode evitar confrontos necessários",
      },
    ],
    tips: [
      "Desenvolva habilidades de análise quantitativa",
      "Pratique assertividade em situações de conflito",
      "Estabeleça limites claros em relacionamentos profissionais",
      "Balance empatia com objetividade nos processos",
      "Aprimore capacidade de priorização baseada em dados",
    ],
    strengths: [
      "Profunda compreensão das necessidades dos usuários",
      "Excelente em criar produtos com propósito",
      "Forte capacidade de mediação de conflitos",
      "Habilidade natural para construir confiança",
      "Criatividade na solução de problemas humanos",
    ],
  },
  ESTJ: {
    situations: [
      {
        title: "Gestão de Sprints",
        action: "Implementa processos claros e cobra consistentemente",
        result: "Alta previsibilidade e eficiência nas entregas",
        challenge: "Pode ser visto como muito rígido",
      },
      {
        title: "Reuniões de Status",
        action: "Conduz reuniões objetivas e focadas em resultados",
        result: "Tempo otimizado e ações claras definidas",
        challenge: "Pode limitar discussões criativas importantes",
      },
      {
        title: "Gestão de Riscos",
        action: "Identifica e mitiga riscos sistematicamente",
        result: "Projetos bem controlados e previsíveis",
        challenge: "Pode ser excessivamente cauteloso com inovações",
      },
    ],
    tips: [
      "Desenvolva flexibilidade em processos quando necessário",
      "Pratique escuta ativa sem julgar rapidamente",
      "Reserve espaço para ideias não convencionais",
      "Cultive paciência com diferentes estilos de trabalho",
      "Balance eficiência com experimentação",
    ],
    strengths: [
      "Excelente em estabelecer e manter processos",
      "Forte senso de responsabilidade e confiabilidade",
      "Habilidade natural para organização",
      "Tomada de decisão pragmática",
      "Foco consistente em resultados",
    ],
  },
  ISTJ: {
    situations: [
      {
        title: "Documentação Técnica",
        action: "Cria documentação detalhada e mantém consistentemente",
        result: "Base de conhecimento confiável e atualizada",
        challenge: "Pode dedicar tempo excessivo a documentação",
      },
      {
        title: "Análise de Requisitos",
        action: "Examina minuciosamente cada requisito e dependência",
        result: "Especificações precisas e completas",
        challenge: "Pode demorar mais que o necessário para avançar",
      },
      {
        title: "Quality Assurance",
        action: "Estabelece processos rigorosos de teste e validação",
        result: "Produtos estáveis e confiáveis",
        challenge: "Pode criar processos muito burocráticos",
      },
    ],
    tips: [
      "Desenvolva conforto com ambiguidade e mudanças",
      "Pratique comunicação mais expressiva e envolvente",
      "Equilibre perfeição com pragmatismo",
      "Cultive abertura para novas abordagens",
      "Aprimore habilidades de networking",
    ],
    strengths: [
      "Excelente atenção aos detalhes",
      "Alta confiabilidade e consistência",
      "Forte senso de responsabilidade",
      "Habilidade natural para organização",
      "Foco em qualidade e estabilidade",
    ],
  },
  ENTP: {
    situations: [
      {
        title: "Ideação de Produto",
        action: "Gera múltiplas soluções inovadoras rapidamente",
        result: "Abordagens criativas para problemas complexos",
        challenge: "Pode ter dificuldade em escolher uma direção",
      },
      {
        title: "Resolução de Problemas",
        action: "Encontra soluções não convencionais e eficazes",
        result: "Desbloqueio rápido de impedimentos",
        challenge: "Pode subestimar soluções mais simples",
      },
      {
        title: "Debates Estratégicos",
        action: "Estimula discussões profundas e desafiadoras",
        result: "Decisões bem debatidas e fundamentadas",
        challenge: "Pode criar conflitos desnecessários",
      },
    ],
    tips: [
      "Desenvolva foco na execução e finalização",
      "Pratique empatia em debates e discussões",
      "Equilibre inovação com praticidade",
      "Cultive persistência em projetos longos",
      "Aprimore habilidades de diplomacia",
    ],
    strengths: [
      "Excelente em resolver problemas complexos",
      "Pensamento inovador e criativo",
      "Adaptabilidade a novas situações",
      "Habilidade natural para debates estratégicos",
      "Forte capacidade analítica",
    ],
  },
  INTP: {
    situations: [
      {
        title: "Arquitetura de Sistema",
        action: "Desenvolve soluções elegantes e escaláveis",
        result: "Sistemas robustos e bem estruturados",
        challenge: "Pode buscar perfeição em excesso",
      },
      {
        title: "Análise de Dados",
        action: "Identifica padrões complexos e correlações",
        result: "Insights profundos e não óbvios",
        challenge: "Pode ter dificuldade em comunicar descobertas",
      },
      {
        title: "Avaliação Técnica",
        action: "Analisa profundamente viabilidade e trade-offs",
        result: "Decisões técnicas bem fundamentadas",
        challenge: "Pode demorar para concluir análises",
      },
    ],
    tips: [
      "Desenvolva habilidades de comunicação simplificada",
      "Pratique conclusão de projetos mesmo sem perfeição",
      "Equilibre análise com ação",
      "Cultive conexões pessoais com o time",
      "Aprimore gestão de expectativas",
    ],
    strengths: [
      "Excelente capacidade analítica",
      "Pensamento sistêmico aprofundado",
      "Habilidade natural para resolver problemas complexos",
      "Forte compreensão técnica",
      "Criatividade em soluções lógicas",
    ],
  },
  ESFJ: {
    situations: [
      {
        title: "Alinhamento com Stakeholders",
        action:
          "Mantém comunicação frequente e personalizada com cada stakeholder",
        result: "Alto nível de confiança e colaboração entre times",
        challenge: "Pode dedicar tempo excessivo a relações interpessoais",
      },
      {
        title: "Gestão de Equipe",
        action: "Cria ambiente harmonioso e suportivo para o time",
        result: "Alta retenção e satisfação da equipe",
        challenge: "Pode evitar decisões difíceis para manter harmonia",
      },
      {
        title: "Rituais de Produto",
        action: "Estabelece e mantém rituais que fortalecem a cultura do time",
        result: "Forte senso de pertencimento e colaboração",
        challenge: "Pode priorizar consenso sobre inovação",
      },
    ],
    tips: [
      "Desenvolva conforto com conflitos construtivos",
      "Pratique tomada de decisão baseada em dados",
      "Balance harmonia com necessidade de mudança",
      "Cultive assertividade em situações difíceis",
      "Aprimore capacidade de dizer não quando necessário",
    ],
    strengths: [
      "Excelente em construir e manter relacionamentos",
      "Forte habilidade de comunicação interpessoal",
      "Capacidade natural de criar consenso",
      "Atenção às necessidades do time",
      "Habilidade para manter ambiente positivo",
    ],
  },
  ISFJ: {
    situations: [
      {
        title: "Manutenção de Produto",
        action: "Monitora e resolve problemas de forma consistente e metódica",
        result: "Produto estável e confiável ao longo do tempo",
        challenge: "Pode resistir a mudanças necessárias",
      },
      {
        title: "Suporte ao Cliente",
        action: "Acompanha de perto feedback e problemas reportados",
        result: "Alta satisfação do cliente e resolução efetiva de problemas",
        challenge: "Pode se sobrecarregar com demandas individuais",
      },
      {
        title: "Documentação de Processos",
        action: "Cria e mantém documentação detalhada e acessível",
        result: "Processos bem documentados e fáceis de seguir",
        challenge: "Pode criar processos muito detalhados",
      },
    ],
    tips: [
      "Desenvolva abertura para mudanças e inovações",
      "Pratique delegação de responsabilidades",
      "Balance detalhismo com agilidade",
      "Cultive visão estratégica de longo prazo",
      "Aprimore capacidade de lidar com ambiguidade",
    ],
    strengths: [
      "Excelente em manter estabilidade e consistência",
      "Forte atenção aos detalhes e qualidade",
      "Dedicação ao suporte e satisfação do cliente",
      "Confiabilidade e comprometimento",
      "Habilidade para criar processos robustos",
    ],
  },
  ESFP: {
    situations: [
      {
        title: "Apresentações de Produto",
        action: "Cria demonstrações envolventes e energéticas",
        result: "Stakeholders engajados e entusiasmados",
        challenge: "Pode focar demais no show e menos no conteúdo",
      },
      {
        title: "Gestão de Crise",
        action: "Mantém o time motivado e focado durante desafios",
        result: "Moral elevado mesmo em situações difíceis",
        challenge: "Pode minimizar a gravidade de problemas",
      },
      {
        title: "Workshops de Inovação",
        action: "Facilita sessões dinâmicas e participativas",
        result: "Alto engajamento e criatividade do time",
        challenge: "Pode ter dificuldade com planejamento detalhado",
      },
    ],
    tips: [
      "Desenvolva disciplina no acompanhamento de métricas",
      "Pratique planejamento de longo prazo",
      "Balance entusiasmo com pragmatismo",
      "Cultive foco em detalhes importantes",
      "Aprimore habilidades de documentação",
    ],
    strengths: [
      "Excelente em motivar e energizar equipes",
      "Forte capacidade de adaptação a mudanças",
      "Habilidade natural para networking",
      "Criatividade em soluções imediatas",
      "Carisma na comunicação",
    ],
  },
  ISFP: {
    situations: [
      {
        title: "Design de Experiência",
        action: "Cria experiências únicas e significativas para usuários",
        result: "Produtos com forte apelo emocional e estético",
        challenge: "Pode priorizar estética sobre funcionalidade",
      },
      {
        title: "Pesquisa Qualitativa",
        action: "Observa e capta nuances sutis do comportamento do usuário",
        result: "Insights profundos sobre necessidades não verbalizadas",
        challenge: "Pode ter dificuldade em quantificar descobertas",
      },
      {
        title: "Prototipagem",
        action: "Desenvolve protótipos com foco na experiência sensorial",
        result: "Produtos com alta qualidade de interação",
        challenge: "Pode perfeccionismo em detalhes menos importantes",
      },
    ],
    tips: [
      "Desenvolva habilidades de análise quantitativa",
      "Pratique comunicação mais assertiva",
      "Balance perfeccionismo com prazos",
      "Cultive visão estratégica do negócio",
      "Aprimore capacidade de priorização",
    ],
    strengths: [
      "Excelente sensibilidade para experiência do usuário",
      "Forte senso estético e de design",
      "Autenticidade na comunicação",
      "Atenção a detalhes importantes",
      "Empatia com necessidades dos usuários",
    ],
  },
  ESTP: {
    situations: [
      {
        title: "Resolução de Crises",
        action: "Age rapidamente com soluções práticas em emergências",
        result: "Problemas resolvidos com agilidade e eficiência",
        challenge: "Pode negligenciar planejamento de longo prazo",
      },
      {
        title: "Negociação com Stakeholders",
        action: "Adapta-se rapidamente a diferentes interlocutores e situações",
        result: "Acordos efetivos e pragmáticos",
        challenge: "Pode priorizar ganhos rápidos sobre estratégia",
      },
      {
        title: "Lançamentos de Produto",
        action: "Gerencia múltiplas demandas com agilidade e pragmatismo",
        result:
          "Lançamentos executados no prazo com problemas resolvidos rapidamente",
        challenge: "Pode subestimar riscos em busca de velocidade",
      },
    ],
    tips: [
      "Desenvolva visão estratégica de longo prazo",
      "Pratique planejamento mais estruturado",
      "Balance ação imediata com análise",
      "Cultive paciência com processos necessários",
      "Aprimore documentação e registro de decisões",
    ],
    strengths: [
      "Excelente em resolver problemas imediatos",
      "Forte capacidade de adaptação",
      "Pragmatismo na tomada de decisão",
      "Energia para execução",
      "Habilidade de negociação",
    ],
  },
  ISTP: {
    situations: [
      {
        title: "Análise Técnica",
        action: "Desmembra problemas complexos em partes gerenciáveis",
        result: "Soluções eficientes e tecnicamente sólidas",
        challenge: "Pode ter dificuldade em explicar decisões técnicas",
      },
      {
        title: "Otimização de Produto",
        action: "Identifica e resolve ineficiências no sistema",
        result: "Melhorias significativas em performance",
        challenge: "Pode focar demais em otimizações técnicas",
      },
      {
        title: "Troubleshooting",
        action: "Resolve problemas técnicos com precisão e eficiência",
        result: "Problemas complexos resolvidos rapidamente",
        challenge: "Pode subestimar aspectos não técnicos",
      },
    ],
    tips: [
      "Desenvolva habilidades de comunicação não técnica",
      "Pratique empatia com usuários não técnicos",
      "Balance eficiência técnica com necessidades do usuário",
      "Cultive networking e relações interpessoais",
      "Aprimore documentação de decisões",
    ],
    strengths: [
      "Excelente capacidade de resolução técnica",
      "Forte pensamento lógico e analítico",
      "Eficiência na solução de problemas",
      "Pragmatismo nas decisões",
      "Habilidade para otimização de sistemas",
    ],
  },
  ENFJ: {
    situations: [
      {
        title: "Liderança de Time",
        action: "Inspira e guia o time com visão clara e empatia",
        result: "Time altamente engajado e alinhado com objetivos",
        challenge: "Pode se sobrecarregar com necessidades do time",
      },
      {
        title: "Gestão de Mudanças",
        action: "Conduz transformações com foco nas pessoas",
        result: "Mudanças implementadas com baixa resistência",
        challenge: "Pode demorar buscando consenso total",
      },
      {
        title: "Desenvolvimento de Talentos",
        action: "Identifica e desenvolve potenciais na equipe",
        result: "Crescimento consistente do time",
        challenge: "Pode ter dificuldade com feedback negativo",
      },
    ],
    tips: [
      "Desenvolva objetividade em decisões difíceis",
      "Pratique estabelecimento de limites",
      "Balance empatia com necessidades do negócio",
      "Cultive análise baseada em dados",
      "Aprimore gestão de conflitos",
    ],
    strengths: [
      "Excelente liderança inspiradora",
      "Forte capacidade de desenvolvimento de pessoas",
      "Habilidade natural para construir consenso",
      "Visão clara de objetivos",
      "Empatia com diferentes perspectivas",
    ],
  },
  INFJ: {
    situations: [
      {
        title: "Visão de Produto",
        action: "Desenvolve visão holística com foco em impacto social",
        result: "Produtos com propósito claro e significativo",
        challenge: "Pode ter expectativas muito idealistas",
      },
      {
        title: "Mediação de Conflitos",
        action: "Busca harmonizar diferentes perspectivas e necessidades",
        result: "Resolução de conflitos com satisfação mútua",
        challenge: "Pode internalizar tensões do time",
      },
      {
        title: "Planejamento Estratégico",
        action: "Considera impactos de longo prazo nas decisões",
        result: "Estratégias alinhadas com valores e sustentabilidade",
        challenge: "Pode ter dificuldade com pragmatismo imediato",
      },
    ],
    tips: [
      "Desenvolva pragmatismo em decisões cotidianas",
      "Pratique desapego de ideais perfeccionistas",
      "Balance visão de longo prazo com necessidades imediatas",
      "Cultive assertividade em situações de conflito",
      "Aprimore capacidade de delegar",
    ],
    strengths: [
      "Excelente visão estratégica de longo prazo",
      "Forte capacidade de entender complexidades humanas",
      "Habilidade para criar produtos com propósito",
      "Intuição aguçada para tendências futuras",
      "Dedicação a impacto positivo",
    ],
  },
};
