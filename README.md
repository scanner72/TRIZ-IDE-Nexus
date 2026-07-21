# ⚙️ TRIZ-IDE Nexus

[English Version (README_EN.md)](./README_EN.md) | [Full Summary (EN)](./SUMMARY_EN.md)

**TRIZ-IDE Nexus** — это суверенная специализированная среда разработки (IDE) на базе форка **Void** (Code-OSS / VS Code), созданная для принудительного внедрения инженерных алгоритмов **ТРИЗ (Теория Решения Изобретательских Задач)** и **АРИЗ-85-В** на этапе архитектурного проектирования.

---

## 🎯 Назначение

В отличие от традиционных AI-ассистентов (Cursor, Copilot, Windsurf), генерирующих код напрямую по текстовому промпту, **Nexus блокирует прямую генерацию кода** до тех пор, пока разработчик и ИИ-агент не выполнят анализ противоречий и не утвердят **ИКР (Идеальный Конечный Результат)**.

---

## 🏗️ Архитектура проекта

Проект состоит из трех ключевых слоев:

```
d:\TRIZ\
├── triz-mcp-server/       # Локальный Fastify/TypeScript MCP-сервер ТРИЗ-оркестрации (порт 8787)
└── void/                  # Модифицированный редактор Code-OSS/Void со встроенным перехватчиком UI
```

1. **Клиентский слой (Void UI):** Модифицированный интерфейс со встроенным перехватчиком `trizGatewayService`, баннером состояния АРИЗ в чате и гибким выбором моделей LLM (LM Studio, Ollama, vLLM, Cloud).
2. **Логический слой (triz-mcp-server):** Локальный сервис на TypeScript/Fastify, реализующий конечный автомат АРИЗ-85-В (`ARIZ State Machine`), подбор приёмов ТРИЗ и управление сессиями.
3. **Слой знаний (Memory Layer):** База данных всех 40 изобретательских приёмов Г. С. Альтшуллера, адаптированная под контекст разработки ПО (`triz-principles.json`).

---

## 🚀 Быстрый запуск

### 1. Запуск `triz-mcp-server`:
```bash
cd triz-mcp-server
npm install
npm run build
npm start
```
Сервер запустится на `http://127.0.0.1:8787`.

### 2. Запуск `void` (TRIZ IDE):
```bash
cd void
npm run buildreact
.\scripts\code.bat
```

---

## 📄 Документация
- [NEXUS_IDE_TZ.md](./NEXUS_IDE_TZ.md) — Техническое задание (PRD).
- [PROGRESS.md](./PROGRESS.md) — Текущий статус разработки.
- [README_EN.md](./README_EN.md) — English Documentation.
- [SUMMARY_EN.md](./SUMMARY_EN.md) — English Project Summary.
