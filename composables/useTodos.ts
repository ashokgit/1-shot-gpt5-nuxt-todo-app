import { computed, onMounted, ref, watch } from 'vue'

export interface TodoItem {
    id: string
    title: string
    completed: boolean
    editing?: boolean
}

type Visibility = 'all' | 'active' | 'completed'

function generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const STORAGE_KEY = 'nuxt-todo-demo::todos'

export function useTodos() {
    const todos = ref<TodoItem[]>([])
    const visibility = ref<Visibility>('all')
    const newTodoTitle = ref('')

    onMounted(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) todos.value = JSON.parse(raw)
        } catch { }
    })

    watch(todos, (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch { }
    }, { deep: true })

    const allTodos = computed(() => todos.value)
    const activeTodos = computed(() => todos.value.filter(t => !t.completed))
    const completedTodos = computed(() => todos.value.filter(t => t.completed))

    const visibleTodos = computed(() => {
        if (visibility.value === 'active') return activeTodos.value
        if (visibility.value === 'completed') return completedTodos.value
        return allTodos.value
    })

    function addTodo() {
        const title = newTodoTitle.value.trim()
        if (!title) return
        todos.value.unshift({ id: generateId(), title, completed: false })
        newTodoTitle.value = ''
    }

    function removeTodo(id: string) {
        todos.value = todos.value.filter(t => t.id !== id)
    }

    function toggleTodo(id: string, completed: boolean) {
        const todo = todos.value.find(t => t.id === id)
        if (todo) todo.completed = completed
    }

    function toggleAll(toCompleted: boolean) {
        todos.value = todos.value.map(t => ({ ...t, completed: toCompleted }))
    }

    function clearCompleted() {
        todos.value = todos.value.filter(t => !t.completed)
    }

    function editTodo(id: string) {
        todos.value = todos.value.map(t => t.id === id ? { ...t, editing: true } : { ...t, editing: false })
    }

    function saveEdit(id: string, nextTitle: string) {
        const title = (nextTitle ?? '').trim()
        if (!title) {
            removeTodo(id)
            return
        }
        todos.value = todos.value.map(t => t.id === id ? { ...t, title, editing: false } : t)
    }

    function cancelEdit(id: string) {
        todos.value = todos.value.map(t => t.id === id ? { ...t, editing: false } : t)
    }

    return {
        // state
        visibility,
        newTodoTitle,
        // derived
        allTodos,
        activeTodos,
        completedTodos,
        visibleTodos,
        // actions
        addTodo,
        removeTodo,
        toggleTodo,
        clearCompleted,
        toggleAll,
        editTodo,
        saveEdit,
        cancelEdit
    }
}
