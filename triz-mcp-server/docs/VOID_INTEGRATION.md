# Void / Nexus Integration Scaffold

Подготовлены адаптеры:

- `src/integration/nexus-middleware.ts`
- `src/integration/void-adapter.ts`

## Назначение

Эти модули показывают, как перехватывать AI-запрос UI-слоя и преобразовывать их в строго типизированный payload для локального `TRIZ MCP Server`.

## Предполагаемая точка встраивания в Void

Согласно вашему ТЗ, целевой участок находится в:

- `src/vs/workbench/contrib/void-ai/`

Текущий scaffold не изменяет код Void напрямую, а готовит контракт и переходный слой, который можно встроить в middleware редактора.
