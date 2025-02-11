"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, Copy } from "lucide-react"
import { TypewriterEffect } from "@/components/TypewriterEffect"
import { useState, useEffect, useCallback, useRef } from "react"
import { SessionProvider } from "next-auth/react"

const examples = [
  {
    option: "Deploy e Rollback",
    devSaid:
      "No deploy de ontem, tivemos que realizar um rollback devido a uma regressão que afetou o ambiente de produção.",
    learn: {
      explanation:
        "Deploy, rollback e regressão: Quando se fala 'deploy', significa a publicação do novo código em produção. Se algo não funciona como esperado (regressão – quando um recurso que antes funcionava deixa de funcionar), é feito um 'rollback', ou seja, um retorno para a versão anterior que estava estável.",
      examples: [
        "Exemplo 1: Uma empresa lança uma atualização do sistema de pagamento, mas os clientes começam a reportar erros. A equipe realiza um rollback para a versão anterior enquanto corrige o problema.",
        "Exemplo 2: Durante um deploy de nova interface, os botões de navegação param de funcionar (regressão). A equipe decide voltar para a versão anterior (rollback) e investigar o problema.",
        "Exemplo 3: Um deploy adiciona novo recurso de login social, mas causa problemas no login tradicional. É feito rollback e a equipe implementa testes adicionais para prevenir regressões futuras.",
      ],
    },
    alternative:
      "Entendi que o rollback foi necessário para reverter as alterações que causaram a regressão. Mas será que poderíamos revisar os testes de pré-deploy ou implementar um processo de validação mais robusto para evitar esse tipo de problema no futuro?",
  },
  {
    option: "Refatoração de Código",
    devSaid: "Precisamos refatorar esse módulo para reduzir a dívida técnica e melhorar a manutenibilidade do código.",
    learn: {
      explanation:
        "Refatoração e dívida técnica: Refatoração é o processo de reestruturar o código existente sem alterar seu comportamento externo. Dívida técnica refere-se ao custo implícito de trabalho adicional causado por escolher uma solução fácil agora em vez de usar uma abordagem melhor que levaria mais tempo.",
      examples: [
        "Exemplo 1: Uma função de 200 linhas é dividida em várias funções menores e mais específicas, tornando o código mais legível e fácil de manter.",
        "Exemplo 2: Um sistema antigo usando jQuery é gradualmente modernizado para React, melhorando a manutenibilidade sem interromper o funcionamento.",
        "Exemplo 3: Variáveis com nomes pouco descritivos são renomeadas para melhor refletir seu propósito, facilitando o entendimento do código.",
      ],
    },
    alternative:
      "Concordo que a refatoração é importante. Podemos começar identificando as áreas mais críticas e criar um plano de refatoração gradual? Isso nos permitiria melhorar o código sem interromper o desenvolvimento de novos recursos.",
  },
  {
    option: "Otimização de Performance",
    devSaid:
      "Os tempos de carregamento da página estão muito altos. Precisamos otimizar as consultas ao banco de dados e implementar lazy loading nos componentes.",
    learn: {
      explanation:
        "Otimização de performance e lazy loading: Otimização de performance envolve melhorar a velocidade e eficiência de um aplicativo. Lazy loading é uma técnica que adia a inicialização de um objeto até o ponto em que ele é necessário, o que pode melhorar significativamente o tempo de carregamento inicial de uma página.",
      examples: [
        "Exemplo 1: Uma página de produtos carrega apenas as imagens que estão visíveis na tela, carregando mais conforme o usuário rola a página.",
        "Exemplo 2: Um dashboard pesado tem seus gráficos carregados sob demanda, melhorando o tempo de carregamento inicial em 70%.",
        "Exemplo 3: Uma consulta ao banco que levava 3 segundos é otimizada com índices e cache, passando a levar 200ms.",
      ],
    },
    alternative:
      "Ótima ideia! Além de otimizar as consultas e implementar lazy loading, poderíamos considerar o uso de caching para dados frequentemente acessados e a compressão de assets? Isso poderia trazer benefícios adicionais de performance.",
  },
  {
    option: "Merge e Rebase",
    devSaid: "Estou resolvendo os conflitos do merge na feature branch usando um rebase para alinhar com a master.",
    learn: {
      explanation: "Desenvolvedores costumam separar o trabalho em \"branches\" (ramificações) específicas, como a \"feature branch\" para uma nova funcionalidade. Durante o processo de união (merge) dessas alterações com a branch principal (\"master\"), podem surgir conflitos se as mesmas partes do código foram modificadas. O \"rebase\" é uma técnica para reorganizar os commits da sua branch, deixando-os em sequência após os da master, facilitando a integração.",
      examples: [
        "Exemplo 1: Dois desenvolvedores modificam o mesmo arquivo em branches diferentes, gerando conflitos durante o merge.",
        "Exemplo 2: Uma feature branch foi criada há semanas e divergiu significativamente da master, exigindo rebase para sincronizar.",
        "Exemplo 3: Commits desnecessários na feature branch (e.g., \"WIP\" ou \"fix typo\") precisam ser reorganizados para um histórico mais limpo antes do merge.",
      ],
    },
    alternative: "Faz sentido usar o rebase para alinhar a feature branch com a master, mas será que isso não pode complicar o histórico de commits? Talvez um merge direto seja mais simples em alguns casos. O que acham?",
  },
  {
    option: "Caching Layer",
    devSaid: "Vamos integrar um caching layer para reduzir a latência e melhorar a escalabilidade do sistema.",
    learn: {
      explanation: "Um \"caching layer\" armazena dados temporariamente para respostas rápidas, reduzindo a \"latência\" (tempo de resposta). Isso melhora a \"escalabilidade\", permitindo que o sistema atenda mais usuários sem perda de desempenho.",
      examples: [
        "Exemplo 1: Picos de tráfego sobrecarregam o banco de dados com consultas repetidas.",
        "Exemplo 2: Integração com API externa lenta (e.g., geolocalização) exige cache para evitar gargalos.",
        "Exemplo 3: Relatórios complexos são gerados frequentemente com os mesmos parâmetros.",
      ],
    },
    alternative: "Integrar um caching layer parece eficaz, mas será que otimizar as consultas ao banco de dados não resolveria parte do problema sem adicionar complexidade?",
  },
  {
    option: "CI/CD Pipeline",
    devSaid: "O pipeline de CI/CD falhou no build dos testes automatizados; estou verificando os logs para identificar o problema.",
    learn: {
      explanation: "Um pipeline de CI/CD (Integração Contínua/Entrega Contínua) automatiza compilação, testes e deploy. O \"build\" é o processo de transformar código em artefatos executáveis.",
      examples: [
        "Exemplo 1: Atualização de dependências quebra compatibilidade com versões anteriores.",
        "Exemplo 2: Testes flaky falham aleatoriamente devido a condições de corrida.",
        "Exemplo 3: Configurações específicas de ambiente (e.g., variáveis de ambiente) não replicadas no pipeline.",
      ],
    },
    alternative: "Verificar os logs é um bom começo, mas talvez possamos implementar testes mais robustos e melhorar o monitoramento do pipeline para identificar problemas mais rapidamente.",
  },
  {
    option: "Microserviços",
    devSaid: "A arquitetura atual está muito acoplada, então vamos migrar para microserviços a fim de obter uma estrutura mais desacoplada.",
    learn: {
      explanation: "Sistemas acoplados têm componentes interdependentes, dificultando mudanças. Microserviços dividem o sistema em serviços independentes.",
      examples: [
        "Exemplo 1: Alterações no módulo de pagamento quebram funcionalidades do módulo de pedidos.",
        "Exemplo 2: Escalabilidade seletiva é impossível porque o monólito é implantado como uma única unidade.",
        "Exemplo 3: Atualizações frequentes causam downtime em todo o sistema.",
      ],
    },
    alternative: "Migrar para microserviços é uma solução, mas será que modularizar o monólito primeiro não reduziria os riscos?",
  },
  {
    option: "Liberação de Endpoint",
    devSaid: "Precisamos liberar esse endpoint para que o time de front-end possa integrar a nova funcionalidade no app.",
    learn: {
      explanation: "Um \"endpoint\" é um ponto de acesso específico de uma API, geralmente uma URL, que permite a comunicação entre sistemas. \"Liberar\" um endpoint significa disponibilizá-lo para uso, seja para outros times, sistemas externos ou ambientes específicos (como staging ou produção).",
      examples: [
        "Exemplo 1: Um endpoint /api/payment/process precisa ser liberado para que o front-end envie dados de transações ao provedor de pagamento.",
        "Exemplo 2: O endpoint /api/search/suggestions está bloqueado por questões de segurança, mas precisa ser liberado para testes no ambiente de homologação.",
        "Exemplo 3: Um parceiro externo requer acesso ao endpoint /api/webhook/notifications para receber atualizações em tempo real, mas ele ainda está restrito ao ambiente interno.",
      ],
    },
    alternative: "Liberar o endpoint é essencial para a integração, mas será que podemos disponibilizá-lo apenas para IPs específicos ou com autenticação temporária para reduzir riscos de segurança?",
  },
]

interface Example {
  option?: string;
  devSaid: string;
  learn: {
    explanation: string;
    examples: string[];
  };
  alternative: string;
}

interface ExampleContentProps {
  initialOption?: string | Example;
}

export function ExampleContent({ initialOption = "" }: ExampleContentProps) {
  const [example, setExample] = useState<Example | null>(null);
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    if (typeof initialOption === 'string') {
      const foundExample = examples.find((ex: Example) => ex.option === initialOption) || examples[0];
      setExample(foundExample);
    } else {
      setExample(initialOption);
    }
  }, [initialOption]);

  const [currentSection, setCurrentSection] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  const pageRef = useRef<HTMLDivElement>(null)

  const startNextSection = useCallback(() => {
    setCurrentSection((prev) => prev + 1)
  }, [])

  const startNextExample = useCallback(() => {
    setCurrentExample((prev) => prev + 1)
  }, [])

  const handleCopy = useCallback(() => {
    const content = `${example?.devSaid}\n\n${example?.learn.explanation}\n\nExemplos:\n${example?.learn.examples.join('\n')}\n\nAlternativa:\n${example?.alternative}`
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [example])

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTop = pageRef.current.scrollHeight
    }
  }, [])

  if (!example) return null;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 overflow-y-auto"
    >
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{example.option}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 gap-2 self-start sm:self-auto ml-14 sm:ml-0"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar conteúdo</span>
              </>
            )}
          </Button>
        </div>

        <Card className="bg-[#141414] border-gray-800 shadow-lg shadow-blue-900/5">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">O que meu dev falou:</h2>
            <TypewriterEffect text={example.devSaid} speed={20} onComplete={startNextSection} />
          </div>
        </Card>

        {currentSection >= 1 && (
          <Card className="bg-[#141414] border-gray-800 shadow-lg shadow-emerald-900/5">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-400">Aprenda:</h2>
                
              </div>
              <div className="space-y-6">
                <TypewriterEffect text={example.learn.explanation} speed={20} onComplete={startNextSection} />
                {currentSection >= 2 && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-emerald-400/80">Exemplos práticos:</h3>
                    {example.learn.examples.map((ex, index) => (
                      <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                        {currentExample >= index && (
                          <TypewriterEffect
                            text={ex}
                            speed={20}
                            onComplete={
                              index === example.learn.examples.length - 1 ? startNextSection : startNextExample
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {currentSection >= 3 && (
          <Card className="bg-[#141414] border-gray-800 shadow-lg shadow-purple-900/5">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">Alternativas:</h2>
              <TypewriterEffect text={example.alternative} speed={20} />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ExamplePage() {
  return (
    <SessionProvider>
      <ExampleContent />
    </SessionProvider>
  )
}

