# TRIZ MCP Server

Локальный сервер оркестрации для `TRIZ-IDE Nexus`.

## Назначение

Сервер принимает строго типизированные JSON-запросы от UI-слоя Nexus, выполняет первичный TRIZ/АРИЗ-анализ и возвращает инженерный паспорт, пригодный для последующей генерации кода.

## Текущий состав

- `analyze_architectural_conflict` — выделение технического и физического противоречия.
- `evaluate_ikr` — формулировка ИКР.
- `suggest_triz_principles` — подбор приемов ТРИЗ из локальной базы знаний.
- `GET /health` — проверка доступности.
- `GET /api/v1/triz/principles` — список 40 принципов ТРИЗ.
- `GET /api/v1/triz/principles/:id` — получение принципа по ID.
- `POST /api/v1/triz/analyze` — основной endpoint оркестрации.
- `POST /api/v1/triz/approve` — подтверждение инженерного паспорта.
- `POST /mcp/tool` — MCP-совместимый tool endpoint.
- ARIZ state machine scaffold.
- In-memory session storage scaffold.
- Nexus/Void integration scaffold.

## Запуск

```bash
npm install
npm run dev
```

По умолчанию сервер слушает `http://127.0.0.1:8787`.

## Структура

- `src/models` — Zod-схемы и типы пайплайна.
- `src/core` — логика анализа.
- `src/memory` — knowledge layer и session storage.
- `src/mcp` — MCP tool protocol scaffold.
- `src/state` — автомат стадий АРИЗ.
- `src/integration` — адаптеры для Nexus/Void middleware.
- `src/routes` — HTTP-маршруты.
- `data/knowledge` — локальный каталог 40 приемов ТРИЗ.

## Ограничения текущего каркаса

Это scaffold, а не полноценная реализация FastMCP/LLM-анализа. Сейчас эвристики локальные и детерминированные, чтобы зафиксировать контракт API и архитектурный каркас. Session storage пока in-memory. Интеграция с Void описана как patch plan, так как исходное дерево Void в проекте пока отсутствует.
