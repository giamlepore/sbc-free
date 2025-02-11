"use client"

import { useSession, SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Link2, Star, SendHorizontal, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingScreen } from "@/components/LoadingScreen"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { ExampleContent } from "../example"

function HomeContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false)
  
  const MAX_CHARS = 500; // Defina o limite máximo de caracteres

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, router])

  if (status === "loading") {
    return <LoadingScreen />
  }

  if (!session) {
    return null
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setIsBottomSheetOpen(true)
  }

  const handleSubmit = async () => {
    setShowFeedbackSheet(false);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ 
          message: encodeURIComponent(inputValue)  // Codifica o input
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      
      const data = await response.json();
      setSelectedOption(data);
      setIsBottomSheetOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setShowFeedbackSheet(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full space-y-4 text-center">
          <Button
            variant="outline"
            className="mb-8 bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
            onClick={() => router.push('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar para o curso
          </Button>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">O que meu dev falou?</h1>
          <p className="text-xl text-gray-400">Entenda, aprenda e então pense em alternativas.</p>

          <div className="relative mt-8 mb-12">
            <textarea
              value={inputValue}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= MAX_CHARS) {
                  setInputValue(text);
                }
              }}
              maxLength={MAX_CHARS}
              placeholder="O que seu dev falou? Qual conceito técnico não está claro?"
              className="w-full min-h-[200px] bg-[#141414] text-gray-300 placeholder:text-gray-500 p-6 rounded-xl border border-[#1d4ed8]/20 focus:border-[#1d4ed8]/40 focus:outline-none transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.1)] resize-none align-top"
            />
            <div className="absolute bottom-6 right-6 text-sm text-gray-400">
              {inputValue.length}/{MAX_CHARS}
            </div>
            <div className="absolute left-6 bottom-6 flex gap-3">
              <button 
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 scale-100 hover:scale-105"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendHorizontal className="w-5 h-5 text-white" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Link2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Star className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Deploy e Rollback")}
            >
              Deploy e Rollback
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Refatoração de Código")}
            >
              Refatoração de Código
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Otimização de Performance")}
            >
              Otimização de Performance
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Merge e Rebase")}
            >
              Merge e Rebase
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Caching Layer")}
            >
              Caching Layer
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("CI/CD Pipeline")}
            >
              CI/CD Pipeline
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Microserviços")}
            >
              Microserviços
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800"
              onClick={() => handleOptionClick("Liberação de Endpoint")}
            >
              Liberação de Endpoint
            </Button>
          </div>
        </div>
      </div>

      <BottomSheet 
        isOpen={isBottomSheetOpen && !isLoading} 
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <ExampleContent initialOption={selectedOption} />
      </BottomSheet>

      <BottomSheet
        isOpen={showFeedbackSheet}
        onClose={() => setShowFeedbackSheet(false)}
      >
        <div className="p-8 text-center gap-4">
          <h2 className="text-2xl font-bold text-white mb-4">Opa, esse agente está quase pronto!</h2>
          <p className="text-gray-400">
            Estamos criando essa funcionalidade de input aberto. Enquanto isso, use os exemplos que colocamos, e nos envie um feedback?
          </p>
          <p className="text-gray-400 mt-4">
            Isso acontece porque estamos testando o melhor prompt possível para esse agente.
          </p>

          <p className="text-gray-400 mt-4">
            Se não, bastaria você jogar no ChatGPT não é mesmo?
          </p>

          <Button
              variant="outline"
              className="bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-800 mt-6"
              onClick={() => {
                setShowFeedbackSheet(false)
                handleOptionClick("Liberação de Endpoint")
              }}
            >
              Teste esse: Liberação de Endpoint
            </Button>
        </div>
      </BottomSheet>
    </>
  )
}

export default function Page() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}

