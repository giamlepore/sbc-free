import { Calendar, MapPin, Download, X, Home } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import html2canvas from 'html2canvas'
import { useRef } from 'react'

interface CertificateProps {
  moduleName: string
  userName: string
  completionDate: Date
  onClose?: () => void
}

const getModuleSummary = (moduleName: string): string => {
  switch (moduleName) {
    case 'Módulo 01: Como a Internet Funciona?':
      return 'Adquiriu conhecimentos fundamentais sobre o funcionamento da Internet, incluindo conceitos de DNS, banda e latência, tecnologias web e sua aplicação prática no desenvolvimento de produtos.';
    
    case 'Módulo 02: Construindo Software':
      return 'Dominou o ciclo de desenvolvimento de software, ambiente de desenvolvimento, controle de versão com Git, testes automatizados e práticas de integração e implantação contínua.';
    
    case 'Módulo 03: Conceitos de básicos de programação para se tornar um "PM full-stack"':
      return 'Desenvolveu competências em HTML, CSS e JavaScript, compreendendo a estrutura do front-end e suas aplicações práticas no desenvolvimento web.';
    
    case 'Módulo 04: Bancos de Dados':
      return 'Compreendeu os fundamentos de bancos de dados, diferentes tipos de DBMS, modelagem de dados e SQL, além de aplicações práticas em produtos digitais.';
    
    case 'Módulo 05: APIs':
      return 'Aprofundou-se no entendimento de APIs, sua importância nas organizações modernas, diferentes tipos de APIs e tecnologias relevantes para integração de sistemas.';
    
    default:
      return 'Demonstrou excelência na compreensão e aplicação dos conceitos apresentados neste módulo.';
  }
};

export function Certificate({ moduleName, userName, completionDate, onClose }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const qrCodeUrl = "https://sbc-free.vercel.app"

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      // Create a canvas from the certificate div
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Aumentar a qualidade
        backgroundColor: null,
        logging: false,
        useCORS: true, // Permitir carregar recursos cross-origin
        allowTaint: true // Permitir elementos externos
      })

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/png', 1.0)
      })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificado-${moduleName.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-3xl">
        {/* Botão de fechar flutuante */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute -top-10 right-0 z-50 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-gray-200" />
          </button>
        )}
        
        {/* Certificado */}
        <div 
          ref={certificateRef}
          className="w-full bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700"
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 border-b border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                  <img 
                    src="/logo-sbc.png" 
                    alt="SBC Logo" 
                    className="h-6 w-auto"
                  />
                </span>
                <h1 className="text-2xl font-bold mb-2">Certificado de Conclusão</h1>
                <p className="text-gray-400">{moduleName}</p>
                <p className="text-gray-400">SBC SCHOOL</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-white p-2 rounded">
                  <QRCodeSVG value={qrCodeUrl} size={64} />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right max-w-[100px]">
                  Verifique a autenticidade
                </p>
              </div>
            </div>
            <p className="text-xl font-semibold mt-6 text-gray-200">{userName}</p>
          </div>
          
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-200">Detalhes do Módulo</h2>
              <p className="text-gray-400">
                {getModuleSummary(moduleName)}
              </p>
            </div>
            
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-300">
                Concluído em {completionDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-300">Technical Product Manager Training</span>
            </div>
          </div>

          
          
          <div className="bg-gray-800/50 px-8 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  A autenticidade deste documento pode ser verificada através do QR Code.
                </p>
              </div>
              <Button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}