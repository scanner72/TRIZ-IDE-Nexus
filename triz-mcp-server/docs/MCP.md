# MCP Scaffold

Этот каталог реализует минимальный MCP-совместимый каркас поверх HTTP.

## Эндпоинт

- `POST /mcp/tool`

## Поддерживаемые tool names

- `analyze_architectural_conflict`
- `evaluate_ikr`
- `suggest_triz_principles`
- `run_full_ariz_pipeline`

## Пример

См. `examples/mcp-tool-call.json`.

## Замечание

Это еще не полная реализация официального MCP transport/runtime. Сейчас это переходный совместимый слой для локальной интеграции Nexus UI -> TRIZ Core.
