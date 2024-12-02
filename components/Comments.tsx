import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/Textarea'

interface Comment {
  id: string
  content: string
  createdAt: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface CommentsProps {
  moduleId: number
  courseId: number
}

export function Comments({ moduleId, courseId }: CommentsProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [commentCount, setCommentCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCount, setIsLoadingCount] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, moduleId, courseId])

  const fetchComments = async () => {
    setIsLoadingCount(true)
    try {
      const response = await fetch(`/api/comments?moduleId=${moduleId}&courseId=${courseId}`)
      const data = await response.json()
      setComments(data.comments)
      setCommentCount(data.count)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoadingCount(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          moduleId,
          courseId,
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    })

    if (response.ok) {
      setEditingComment(null)
      fetchComments()
    }
  }

  const handleDelete = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchComments()
    }
  }

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-all duration-300"
      >
        Comentários {isLoadingCount ? (
          <span className="inline-block w-4 h-4 ml-1">
            <div className="w-4 h-4 border-2 border-t-transparent border-gray-200 rounded-full animate-spin" />
          </span>
        ) : (
          `(${commentCount})`
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {session && (
              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="bg-gray-700 text-gray-100"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative"
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Comentar</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      </div>
                    </>
                  ) : (
                    'Comentar'
                  )}
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                        className="bg-gray-600 text-gray-100"
                      />
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEdit(comment.id)}>Salvar</Button>
                        <Button variant="ghost" onClick={() => setEditingComment(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-200">{comment.user.name}</p>
                          <p className="text-gray-300">{comment.content}</p>
                          <p className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              locale: ptBR,
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {session?.user?.id === comment.userId && (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingComment(comment.id)
                                setEditContent(comment.content)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}