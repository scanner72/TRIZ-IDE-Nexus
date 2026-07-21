# Void Patch Plan

Этот документ фиксирует план интеграции `TRIZ MCP Server` в будущий исходный код форка Void.

## Целевая точка интеграции

- `src/vs/workbench/contrib/void-ai/`

## Ключевые модули для будущего патча

- `triz/common/trizTypes.ts`
- `triz/config/trizConfiguration.ts`
- `triz/context/trizContextCollector.ts`
- `triz/transport/trizClient.ts`
- `triz/adapter/voidPromptToTrizAdapter.ts`
- `triz/middleware/trizRequestInterceptor.ts`
- `triz/state/trizSessionState.ts`
- `triz/ui/trizLogPanel/*`
- `triz/commands/trizCommands.ts`

## Стратегия встраивания

1. Перехватить центральный AI request dispatch path.
2. Собрать типизированный payload для локального `TRIZ MCP Server`.
3. Показать инженерный паспорт в отдельной панели.
4. Блокировать кодогенерацию до явного `Approve & Code`.
5. Добавить финальный guard перед применением diff/edit.

## Режимы rollout

- `observe`
- `soft enforce`
- `hard enforce`

## Ограничение

Пока в рабочем дереве отсутствует исходный код Void, поэтому здесь сохранен только исполнимый план интеграции, без реального патча к `src/vs/workbench/contrib/void-ai/`.
