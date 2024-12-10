import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Adicione esta importação para o componente de imagem do Next.js
import Image from 'next/image'


export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const articlePath = path.join(process.cwd(), 'articles', `${slug}.md`)

  if (!fs.existsSync(articlePath)) {
    notFound()
  }

  const content = fs.readFileSync(articlePath, 'utf8')

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-gray-400 hover:text-gray-200">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow py-12">
        <article className="max-w-3xl mx-auto px-4">
          <ReactMarkdown 
            className="prose prose-lg prose-invert max-w-none"
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4 mt-8 text-gray-200" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3 mt-6 text-gray-300" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2 mt-4 text-gray-300" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-4 text-gray-300" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 pl-4 text-gray-300" {...props} />,
              img: ({node, ...props}) => (
                <Image
                  src={props.src || ''}
                  alt={props.alt || ''}
                  width={700}
                  height={400}
                  className="rounded-lg my-8"
                />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4 text-gray-400" {...props} />
              ),
              code: ({node, ...props}) => (
                <code className="bg-gray-800 rounded px-1 py-0.5 text-gray-300" {...props} />
              ),
              pre: ({node, ...props}) => (
                <pre className="bg-gray-800 rounded p-4 overflow-x-auto my-4 text-gray-300" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
      <footer className="bg-gray-800 py-8 mt-12 border-t border-gray-700">
        <div className="max-w-3xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 SBC SCHOOL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}