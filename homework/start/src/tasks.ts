export type Filter = "all" | "open" | "done"

export interface Task {
    id: number
    title: string
    done: boolean
}

/**
 * Доска в том виде, в каком она приходит из хранилища. Строку 3 сохранила старая
 * форма ещё до issue #7: это название из одних пробелов, и оно всё ещё здесь.
 */
export const seedTasks: Task[] = [
    { id: 1, title: "Сдать лабораторную", done: false },
    { id: 2, title: "Купить продукты", done: true },
    { id: 3, title: "   ", done: false },
]

/** Обрезает пробел, табуляцию, неразрывный пробел U+00A0 и пробел нулевой ширины U+200B по краям строки. */
function trimWhitespace(title: string): string {
    return title.replace(/^[ \t\u00A0\u200B]+|[ \t\u00A0\u200B]+$/g, "")
}

/** Доска считает название без непробельных символов отсутствующим названием. */
export function isBlankTitle(title: string): boolean {
    return trimWhitespace(title).length === 0
}

/**
 * Создание задачи. Обрезает пробельные символы по краям и отклоняет пустое название.
 */
export function createTask(id: number, title: string): Task | undefined {
    const trimmed = trimWhitespace(title)
    if (trimmed.length === 0) return undefined
    return { id, title: trimmed, done: false }
}

/** Переименование существующей задачи с обрезкой пробелов и отклонением пустых строк (issue #7). */
export function renameTask(tasks: Task[], id: number, title: string): Task[] {
    const trimmed = trimWhitespace(title)
    if (trimmed.length === 0) return tasks
    return tasks.map((task) => (task.id === id ? { ...task, title: trimmed } : task))
}

export function visibleTasks(tasks: Task[], filter: Filter): Task[] {
    const nonBlank = tasks.filter((task) => !isBlankTitle(task.title))
    if (filter === "open") return nonBlank.filter((task) => !task.done)
    if (filter === "done") return nonBlank.filter((task) => task.done)
    return nonBlank
}

/**
 * Счётчик в шапке. Считает только открытые задачи с непустым названием.
 */
export function openCount(tasks: Task[]): number {
    return tasks.filter((task) => !task.done && !isBlankTitle(task.title)).length
}