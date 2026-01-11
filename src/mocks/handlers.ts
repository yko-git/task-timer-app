import { http, HttpResponse } from 'msw'
import { type Task, getTasks, saveTasks, generateId } from './data'

const API_URL = '/api/tasks'

export const handlers = [
  // タスク一覧取得 GET /api/tasks
  http.get(API_URL, () => {
    const tasks = getTasks()
    return HttpResponse.json(tasks)
  }),

  // タスク取得 GET /api/tasks/:id
  http.get(`${API_URL}/:id`, ({ params }) => {
    const { id } = params
    const tasks = getTasks()
    const task = tasks.find((t) => t.id === id)

    if (!task) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(task)
  }),

  // タスク作成 POST /api/tasks
  http.post(API_URL, async ({ request }) => {
    const body = (await request.json()) as Omit<Task, 'id' | 'createdAt'>
    const tasks = getTasks()

    const newTask: Task = {
      id: generateId(),
      title: body.title,
      completed: body.completed || false,
      createdAt: new Date().toISOString(),
      priority: body.priority,
    }

    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)

    return HttpResponse.json(newTask, { status: 201 })
  }),

  // タスク更新 PUT /api/tasks/:id
  http.put(`${API_URL}/:id`, async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<Task>
    const tasks = getTasks()

    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedTask = { ...tasks[index], ...body }
    tasks[index] = updatedTask
    saveTasks(tasks)

    return HttpResponse.json(updatedTask)
  }),

  // タスク削除 DELETE /api/tasks/:id
  http.delete(`${API_URL}/:id`, ({ params }) => {
    const { id } = params
    const tasks = getTasks()

    const filteredTasks = tasks.filter((t) => t.id !== id)
    if (filteredTasks.length === tasks.length) {
      return new HttpResponse(null, { status: 404 })
    }

    saveTasks(filteredTasks)
    return new HttpResponse(null, { status: 204 })
  }),
]
