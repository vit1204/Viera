'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { generateTaskFromPrompt, GeneratedTaskData } from "@/lib/actions/generate-taskAI"
import { createTask } from "@/lib/actions/task.action"
import { Sparkles, Loader, Copy, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedTask extends GeneratedTaskData {
  id: string
  timestamp: Date
}

export function AITaskGeneratorTab() {
  const params = useParams()
  const projectId = params?.id as string

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [selectedTask, setSelectedTask] = useState<GeneratedTask | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe the task you want to create')
      return
    }

    setLoading(true)
    try {
      const generated = await generateTaskFromPrompt(prompt)
      
      const newTask: GeneratedTask = {
        ...generated,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      
      setGeneratedTasks([newTask, ...generatedTasks])
      setSelectedTask(newTask)
      setPrompt('')
      toast.success('Task generated successfully!')
    } catch (error) {
      console.error('[v0] Error generating task:', error)
      toast.error('Failed to generate task. Make sure AI API key is configured.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied to clipboard')
  }

  const deleteTask = (id: string) => {
    setGeneratedTasks(generatedTasks.filter(t => t.id !== id))
    if (selectedTask?.id === id) {
      setSelectedTask(null)
    }
    toast.success('Task removed')
  }

  const handleSaveTaskToDB = async (task: GeneratedTask) => {
    setIsCreating(true)
    try {
      // Gom subtasks vào description để lưu trữ đầy đủ
      const fullDescription = task.subtasks && task.subtasks.length > 0
        ? `${task.description}\n\n**Subtasks:**\n${task.subtasks.map((st, i) => `${i + 1}. ${st}`).join('\n')}`
        : task.description;

      const response = await createTask({
        title: task.title,
        description: fullDescription,
        priority: task.priority,
        projectId: projectId,
        status: "todo" as any,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined, // Set dueDate mặc định là ngày hôm nay
      });

      if (response?.success) {
        toast.success(response.message || 'Đã thêm Task vào dự án thành công!')
        // Xóa task khỏi danh sách gợi ý sau khi tạo thành công
        deleteTask(task.id)
      } else {
        toast.error(response?.message || 'Không thể tạo task vào dự án.')
      }
    } catch (error) {
      console.error('Lỗi khi lưu task:', error)
      toast.error('Có lỗi xảy ra khi tạo task.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
       <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">AI Task Generator</h2>
        </div>
        <p className="text-muted-foreground">
          Describe your task in natural language, and AI will generate structured task details you can review and refine.
        </p>
      </div>

      {/* Main Input Section */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Create New Task
          </CardTitle>
          <CardDescription>
            Example: "Implement Google OAuth login with social sign-up and add email verification"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Describe what task you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 resize-none"
            disabled={loading}
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Task
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Tasks Grid */}
      {generatedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Generated Tasks ({generatedTasks.length})
          </h3>
          <div className="grid gap-3">
            {generatedTasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTask?.id === task.id
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(
                              `${task.title}\n${task.description}`,
                              task.id
                            )
                          }}
                        >
                          {copiedId === task.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        task.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                          : task.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="text-muted-foreground">
                          {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Task Details */}
      {selectedTask && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>{selectedTask.title}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  selectedTask.priority === 'HIGH'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                    : selectedTask.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                }`}>
                  {selectedTask.priority}
                </span>
                
                {/* Nút Tạo Task tự động */}
                <Button 
                  onClick={() => handleSaveTaskToDB(selectedTask)}
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  size="sm"
                >
                  {isCreating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Tạo Task
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Description</h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedTask.description}
              </p>
            </div>

            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Suggested Subtasks</h4>
                <ul className="space-y-2">
                  {selectedTask.subtasks.map((subtask, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="text-blue-500 font-medium min-w-fit">
                        {idx + 1}.
                      </span>
                      <span className="text-foreground">{subtask}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>💡 Tip:</strong> Nhấn "Tạo Task" để thêm công việc này trực tiếp vào dự án với trạng thái TODO và hạn chót là ngày hôm nay.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {generatedTasks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">No tasks generated yet</p>
            <p className="text-sm text-muted-foreground">
              Describe what you want to create above, and AI will help you structure it into a task.
            </p>
          </CardContent>
        </Card>
      )}
      </>
  )
}