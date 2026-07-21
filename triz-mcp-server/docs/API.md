# API Contract

## GET `/health`

Проверка доступности сервиса.

## GET `/api/v1/triz/principles`

Возвращает локальный каталог 40 приемов ТРИЗ.

Опционально поддерживается query-параметр `q` для простого поиска.

## GET `/api/v1/triz/principles/:id`

Возвращает один принцип по его числовому идентификатору.

## POST `/api/v1/triz/analyze`

Принимает задачу и контекст, затем возвращает структуру, совместимую с PRD `NEXUS_IDE_TZ.md`.

### Request

```json
{
  "request_metadata": {
    "session_id": "nexus-session-2026",
    "target_repository": "git@github.com:user/project.git"
  },
  "task": {
    "summary": "Optimize cache behavior for lower latency",
    "desired_outcome": "Fast reads without persistent RAM-heavy cache"
  },
  "code_context": {
    "language": "typescript",
    "files": ["src/cache.ts"],
    "architectural_notes": "Cache improves speed but increases memory usage"
  }
}
```

## POST `/api/v1/triz/approve`

Подтверждает инженерный паспорт по `session_id` и переводит состояние в `READY_FOR_GENERATION`.

### Request

```json
{
  "session_id": "nexus-session-2026",
  "user_approved": true
}
```

### Response

```json
{
  "request_metadata": {
    "session_id": "nexus-session-2026",
    "target_repository": "git@github.com:user/project.git"
  },
  "pipeline_state": {
    "current_ariz_step": "PART_3_IKR_FORMULATION",
    "technical_contradiction": {
      "parameter_to_optimize": "execution_speed (latency)",
      "parameter_that_degrades": "memory_footprint (ram)"
    },
    "physical_contradiction": {
      "element": "data_cache_layer",
      "required_properties": [
        "must_be_present_for_instant_read",
        "must_be_absent_to_free_ram"
      ]
    },
    "ikr_formulation": "Data is read instantly by using an on-demand mechanism without allocating a permanent RAM cache.",
    "applied_altshuller_principles": [2, 15]
  },
  "validation": {
    "user_approved": false,
    "system_verdict": "READY_FOR_REVIEW"
  }
}
```
