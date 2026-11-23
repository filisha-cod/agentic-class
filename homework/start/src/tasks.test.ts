import { describe, expect, it } from "vitest"
import { createTask, visibleTasks, seedTasks, renameTask, openCount } from "./tasks"

// Два теста, с которыми поставляется стартер. Они проходят и не покрывают
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, " \u200B Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("Не переименует в пустую задачу", () => {
        const task = renameTask(seedTasks,1, " \t\u00A0  ")
        const res = task.find((t) => t.id === 1)
        expect(res?.title).toBe("Сдать лабораторную")
    })

    it("Переименовывает задачу и обрезает название", () => {
        const task = renameTask(seedTasks,1, " \u00A0 Покормить кота \t ")
        const res = task.find((t) => t.id === 1)
        expect(res?.title).toBe("Покормить кота")
    })

    it("Не показывает пустые строки в списке задач", () => {
        const ids = visibleTasks(seedTasks, "all").map((task) => task.id)
        expect(ids).toEqual([1, 2])
    })

    it("Счётчик считает только непустые задачи", () => {
        expect(openCount(seedTasks)).toBe(1)
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })
})
