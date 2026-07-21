# TRIZ-IDE Nexus — Прогресс проекта

Дата последнего обновления: 2026-07-20

Этот файл — краткий срез состояния проекта для быстрого восстановления контекста в новом чате/треде. При старте нового треда просто дайте агенту ссылку на этот файл.

---

## 1. Структура проекта

```
D:\TRIZ\
├── NEXUS_IDE_TZ.md              # исходное ТЗ (PRD) на TRIZ-IDE Nexus
├── PROGRESS.md                  # этот файл
├── triz-mcp-server\             # локальный TRIZ MCP сервер (готов и работает)
└── void\                        # клон github.com/voideditor/void с внесёнными правками
```

---

## 2. `triz-mcp-server` — статус: ✅ рабочий, протестирован

Стек: TypeScript + Fastify + Zod, Node >= 20.

### Реализовано
- `GET /health`
- `GET /api/v1/triz/principles` (+ query `q` для поиска)
- `GET /api/v1/triz/principles/:id`
- `POST /api/v1/triz/analyze` — основной анализ (технич./физич. противоречие, ИКР, принципы)
- `POST /api/v1/triz/approve` — подтверждение инженерного паспорта, переводит сессию в `READY_FOR_GENERATION`
- `POST /mcp/tool` — MCP-совместимый endpoint с tools:
  - `analyze_architectural_conflict`
  - `evaluate_ikr`
  - `suggest_triz_principles`
  - `run_full_ariz_pipeline`
  - `list_triz_principles`
  - `get_triz_principle`
- Полный локальный каталог всех **40 приемов ТРИЗ** (`data/knowledge/triz-principles.json`) с полями `aliases`, `guidance`, `software_examples`, `tags`
- Индексированный `KnowledgeBase` (`getById`, `findByIds`, `searchPrinciples`)
- `SessionStore` — in-memory хранение сессий, `upsert`/`approve`
- ARIZ state machine (`src/state/ariz-machine.ts`) с шагами от `PART_1_PROBLEM_ANALYSIS` до `READY_FOR_GENERATION`
- Rule-based подбор принципов в `triz-engine.ts` (таблица правил вместо if-цепочки)

### Ключевые файлы
- `src/index.ts`, `src/api/server.ts` — точка входа
- `src/routes/triz.ts`, `src/routes/mcp.ts` — HTTP роуты
- `src/core/triz-engine.ts` — бизнес-логика анализа
- `src/memory/knowledge-base.ts`, `src/memory/session-store.ts`
- `src/models/*.ts` — Zod-схемы
- `docs/API.md`, `docs/MCP.md`, `docs/ARIZ_STATE_MACHINE.md`, `docs/VOID_INTEGRATION.md`, `docs/VOID_PATCH_PLAN.md`

### Валидация
```bash
cd D:\TRIZ\triz-mcp-server
npm install
npm run check   # tsc --noEmit — OK
npm run build   # tsc — OK
npm test        # node --test — 9/9 passed
```

---

## 3. `void` — статус: 🔶 в процессе интеграции

Клонирован из `https://github.com/voideditor/void` (репозиторий архивный/deprecated, но это нормальная база для форка).

**Важное уточнение по архитектуре**: реальный AI-код живёт не в `src/vs/workbench/contrib/void-ai/` (как было в первоначальном ТЗ), а в:
```
D:\TRIZ\void\src\vs\workbench\contrib\void\
├── common\      # sendLLMMessageService, voidSettingsService, sendLLMMessageTypes...
├── browser\     # chatThreadService, editCodeService, sidebar-tsx (React UI)...
└── electron-main\
```

### Реализовано (сервисный слой)

**Новые файлы:**
- `common/triz/trizTypes.ts` — контракт (`TrizAnalyzeRequest/Response`, `TrizSessionRecord`, `TrizMode`)
- `common/triz/trizGatewayService.ts` — `ITrizGatewayService`:
  - `shouldIntercept()`, `analyzeOutgoingRequest()`, `approveSession()`
  - `getSessionForThread(threadId)`, `hasApprovedSession({threadId})`, `resetApproval({threadId})` — **thread-aware**
  - HTTP клиент к `http://127.0.0.1:8787` (адрес берётся из настроек)
- `browser/trizGatewayActions.ts` — команда `void.triz.approveLatestSession` ("TRIZ: Approve latest engineering passport")

**Изменённые файлы:**
- `common/voidSettingsTypes.ts` — добавлены глобальные настройки:
  - `trizMode: 'off' | 'observe' | 'enforce'` (default `'off'`)
  - `trizServerUrl: string` (default `'http://127.0.0.1:8787'`)
- `common/sendLLMMessageService.ts` — **основной перехватчик**. Перед `sendLLMMessage()`:
  - если `trizMode !== 'off'` и chat-сообщение → вызывает `analyzeOutgoingRequest()`
  - если `trizMode === 'enforce'` и нет approved-сессии для thread → блокирует запрос, возвращает ошибку с подсказкой про команду approve
- `common/sendLLMMessageTypes.ts` — добавлено поле `trizThreadId?: string` в `ServiceSendLLMMessageParams`
- `browser/chatThreadService.ts` — при `_addUserMessageAndStreamResponse()` вызывается `trizGatewayService.resetApproval({ threadId })` (новый юзер-месседж сбрасывает старое одобрение); `threadId` передаётся в logging/params
- `browser/editCodeServiceInterface.ts` + `browser/editCodeService.ts` — добавлен финальный guard:
  - `canPerformTrizControlledGeneration(): boolean`
  - используется в `startApplying()`, `instantlyApplySearchReplaceBlocks()`, `instantlyRewriteFile()` — бросают `Error` если `enforce` и нет approval
- `browser/void.contribution.ts` — подключены новые файлы (`trizGatewayService.js`, `trizGatewayActions.js`)
- `browser/react/src/void-settings-tsx/Settings.tsx` — добавлены React-компоненты `TrizModeDropdown`, `TrizServerUrlBox` (созданы, но **НЕ доведены до полного layout wiring** — не вставлены в итоговый JSX страницы настроек)

### Диагностика (проверено, без ошибок)
- `common/triz/trizTypes.ts`
- `common/triz/trizGatewayService.ts`
- `common/sendLLMMessageTypes.ts`
- `common/sendLLMMessageService.ts`
- `common/voidSettingsTypes.ts`
- `browser/chatThreadService.ts`
- `browser/void.contribution.ts`

### Известное ограничение (не наша правка)
В `browser/editCodeService.ts` есть старая ошибка, не связанная с TRIZ:
```
Cannot find module './react/out/quick-edit-tsx/index.js'
```
Это связано с тем, что React-выход (`out/`) в этом клоне не собран. Не трогали, чтобы не уехать в отдельную задачу.

---

## 4. Что НЕ доделано (следующий шаг)

Последняя активная задача — **пункт 2 из плана**: усилить UX до продуктового уровня:

1. **Thread-aware approve action** — ✅ ГОТОВО
   `void.triz.approveLatestSession` теперь берёт `IChatThreadService.state.currentThreadId` и ищет сессию через `getSessionForThread(threadId)`, с фолбэком на `getLatestSession()` для надёжности (если сессия ещё не привязана к треду).
   Файл: `browser/trizGatewayActions.ts`

2. **Видимый статус TRIZ в sidebar/chat** — ✅ ГОТОВО
   Читал файл `browser/react/src/sidebar-tsx/SidebarChat.tsx` (большой, ~1600+ строк), искал место для вставки статус-баннера. Ещё не вносил изменений в этот файл. Логичные точки вставки:
   - рядом с `VoidChatArea` (компонент чат-инпута) — показать бейдж режима/статуса TRIZ
   - либо в `ButtonSubmit`/`VoidChatArea` — заблокировать/подсветить кнопку отправки, если `enforce` и нет approval

   Реализовано:
   - `common/triz/trizGatewayService.ts`: добавлено событие `onDidChangeState: Event<void>`, которое стреляет при `analyzeOutgoingRequest`, `approveSession`, `resetApproval`
   - `browser/react/src/util/services.tsx`: зарегистрирован `ITrizGatewayService` в `_registerServices`/`getReactAccessor`, добавлен реактивный хук `useTrizGatewayVersion()` (счётчик версии, форсирующий ре-рендер при изменении TRIZ-состояния)
   - `browser/react/src/sidebar-tsx/SidebarChat.tsx`: добавлен компонент `TrizStatusBanner` — вставлен в `threadPageInput` над полем ввода чата. Показывает:
     - если `trizMode === 'off'` — ничего (`null`)
     - если нет сессии для активного thread — нейтральный баннер "awaiting architectural analysis"
     - если есть сессия — текущий шаг ARIZ, текст противоречия, статус approve и кликабельную ссылку "Approve & Code" (вызывает команду `void.triz.approveLatestSession`)

   Компоненты `TrizModeDropdown`/`TrizServerUrlBox` в `Settings.tsx` встроены в раздел **General → TRIZ Engineering Gate**. Пользователь может выбрать режим `off` / `observe` / `enforce` и указать URL локального TRIZ-сервера.

3. **Сборка React-интерфейса** — ✅ ГОТОВО
   - зависимости JavaScript установлены через `npm ci --ignore-scripts` (нативные install-скрипты пропущены, поскольку локальной Visual Studio не хватает Spectre-mitigated libraries для `@vscode/deviceid`)
   - `npm run buildreact` — успешно
   - собраны `out/sidebar-tsx/index.js` и `out/void-settings-tsx/index.js`, включая TRIZ-баннер и настройки

4. **Проверка TypeScript-слоя Void** — ✅ ГОТОВО
   - `tsc -p src/tsconfig.json --noEmit` — успешно, ошибок нет
   - полная команда `npm run compile` проходит основную typecheck-фазу, но затем останавливается на отсутствующей зависимости штатного расширения `@vscode/markdown-it-katex`; это не связано с TRIZ-интеграцией

5. **Попытка сквозного запуска** — 🔶 СИСТЕМНЫЙ БЛОКЕР
   - `npm run gulp -- compile-client` — успешно, 0 ошибок
   - Electron runtime скачан успешно
   - исправлена команда запуска `triz-mcp-server`: фактическая точка входа — `dist/src/index.js`; `/health` отвечает `status: ok`
   - Void не может завершить запуск, потому что `npm ci --ignore-scripts` не собрал нативные модули `@vscode/policy-watcher`, `@vscode/spdlog`, `@vscode/deviceid`, `@vscode/windows-registry`
   - попытка собрать `@vscode/policy-watcher` подтверждает причину: в Visual Studio Build Tools отсутствуют **Spectre-mitigated libraries** (`MSB8040`)
   - следующий обязательный шаг: установить Spectre-библиотеки для используемого MSVC toolset через Visual Studio Installer, затем выполнить обычный `npm ci`, `npm run gulp -- compile-client` и повторить запуск

### Важное уточнение по диагностике `Settings.tsx` и `SidebarChat.tsx`
Ранее diagnostics выдавал большое количество несвязанных ошибок (`Cannot find module 'react'`, `JSX.IntrinsicElements` и т.д.) из-за неполных зависимостей. После установки JavaScript-зависимостей реальная React-сборка (`npm run buildreact`) проходит успешно.

---

## 5. Как продолжить в новом треде

В новом треде можно написать что-то вроде:

> Прочитай `D:\TRIZ\PROGRESS.md` и продолжи с раздела "Что НЕ доделано": проверь основной TypeScript-слой Void, затем проведи сквозной сценарий analyze → approve → generation в запущенном редакторе.

Этого будет достаточно, агенту не нужно заново читать весь старый тред.
