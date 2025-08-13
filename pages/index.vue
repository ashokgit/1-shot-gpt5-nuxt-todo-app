<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodos } from '~/composables/useTodos'

const {
  allTodos,
  activeTodos,
  completedTodos,
  visibleTodos,
  visibility,
  newTodoTitle,
  addTodo,
  removeTodo,
  toggleTodo,
  clearCompleted,
  toggleAll,
  editTodo,
  saveEdit,
  cancelEdit
} = useTodos()

const stats = computed(() => ({
  total: allTodos.value.length,
  active: activeTodos.value.length,
  completed: completedTodos.value.length
}))

const isAdding = ref(false)
function onAdd() {
  if (!newTodoTitle.value.trim()) return
  addTodo()
  isAdding.value = false
}
</script>

<template>
  <main class="container">
    <section class="panel">
      <h1 class="title">Nuxt Todo</h1>

      <div class="add-row">
        <input
          v-model="newTodoTitle"
          @keydown.enter="onAdd"
          @focus="isAdding = true"
          @blur="isAdding = false"
          placeholder="What needs to be done?"
          class="input"
          autofocus
        />
        <button class="btn primary" @click="onAdd">Add</button>
      </div>

      <div class="toolbar">
        <div class="filters">
          <button :class="['chip', { active: visibility === 'all' }]" @click="visibility = 'all'">All</button>
          <button :class="['chip', { active: visibility === 'active' }]" @click="visibility = 'active'">Active</button>
          <button :class="['chip', { active: visibility === 'completed' }]" @click="visibility = 'completed'">Completed</button>
        </div>
        <div class="actions">
          <button class="btn subtle" @click="toggleAll(true)" :disabled="stats.active === 0">Mark all complete</button>
          <button class="btn subtle" @click="toggleAll(false)" :disabled="stats.completed === 0">Mark all active</button>
          <button class="btn danger" @click="clearCompleted" :disabled="stats.completed === 0">Clear completed</button>
        </div>
      </div>

      <ul class="list" v-if="visibleTodos.length">
        <li v-for="todo in visibleTodos" :key="todo.id" class="item">
          <label class="left">
            <input type="checkbox" v-model="todo.completed" @change="toggleTodo(todo.id, todo.completed)" />
            <span class="check"></span>
          </label>

          <div class="content" v-if="!todo.editing" @dblclick="editTodo(todo.id)">
            <span :class="{ done: todo.completed }">{{ todo.title }}</span>
          </div>
          <div class="content" v-else>
            <input
              :value="todo.title"
              @keydown.enter="saveEdit(todo.id, ($event.target as HTMLInputElement).value)"
              @keydown.esc="cancelEdit(todo.id)"
              @blur="saveEdit(todo.id, ($event.target as HTMLInputElement).value)"
              class="input inline"
              autofocus
            />
          </div>

          <button class="icon" @click="removeTodo(todo.id)" aria-label="delete">✕</button>
        </li>
      </ul>

      <div class="empty" v-else>
        <p>No todos yet. Add your first above.</p>
      </div>

      <div class="status">
        <span>{{ stats.active }} remaining</span>
        <span>•</span>
        <span>{{ stats.completed }} completed</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 16px 24px;
}

.panel {
  background: linear-gradient(180deg, var(--panel), var(--panel-2));
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  padding: 24px;
}

.title {
  margin: 0 0 12px;
  font-size: 32px;
  letter-spacing: 0.3px;
}

.add-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input {
  flex: 1 1 auto;
  background: #0d122a;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 12px 14px;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s ease;
}

.input:focus { border-color: var(--primary) }

.input.inline { width: 100% }

.btn {
  background: #1a2048;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.primary { background: var(--primary-2); border-color: transparent }
.btn.subtle { background: #141a3a }
.btn.danger { background: #3a1420; border-color: #6b172e; color: #ffb3c0 }
.btn:disabled { opacity: 0.5; cursor: not-allowed }

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 8px;
}

.filters { display: flex; gap: 8px }
.actions { display: flex; gap: 8px; flex-wrap: wrap }

.chip {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.chip.active { color: var(--text); border-color: var(--primary); background: #12183b }

.list { list-style: none; margin: 12px 0 0; padding: 0 }
.item {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 8px;
  border-radius: 8px;
}
.item:hover { background: rgba(255,255,255,0.03) }

.left { position: relative; width: 28px; height: 28px }
.left input { display: none }
.check {
  width: 18px; height: 18px; border-radius: 5px; display: inline-block;
  border: 1px solid var(--border); background: #0d122a; position: relative;
}
.left input:checked + .check { background: #173a2b; border-color: #234 }
.left input:checked + .check::after {
  content: '✓'; position: absolute; inset: 0; display: grid; place-items: center; color: var(--success);
  font-size: 14px;
}

.content { display: flex; align-items: center }
.content .done { color: var(--muted); text-decoration: line-through }

.icon {
  background: transparent; color: var(--muted); border: 0; cursor: pointer; font-size: 18px;
  padding: 6px 8px; border-radius: 8px;
}
.icon:hover { background: rgba(255,255,255,0.06); color: var(--danger) }

.empty { color: var(--muted); text-align: center; padding: 24px 0 8px }

.status { color: var(--muted); display: flex; gap: 8px; justify-content: center; margin-top: 16px }
</style>
