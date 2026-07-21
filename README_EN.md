# ⚙️ TRIZ-IDE Nexus

[Russian Version (README.md)](./README.md) | [Full Summary (EN)](./SUMMARY_EN.md)

**TRIZ-IDE Nexus** is a sovereign engineering Integrated Development Environment (IDE) built upon a modified fork of **Void** (Code-OSS / VS Code). It enforces the methodology of **TRIZ (Theory of Inventive Problem Solving)** and **ARIZ-85-V** during the architectural design phase *before* any code generation takes place.

---

## 🎯 Purpose

Unlike conventional AI code assistants (Cursor, Copilot, Windsurf) that generate code streams directly from prompt text, **Nexus blocks raw code generation** until the developer and the AI agent resolve architectural contradictions and formalize the **IKR (Ideal Final Result)**.

---

## 🏗️ Architecture Overview

The system implements separation of concerns across three layers:

```
d:\TRIZ\
├── triz-mcp-server/       # Local Fastify/TypeScript MCP orchestration server (Port 8787)
└── void/                  # Modified Code-OSS/Void editor with custom UI interceptors
```

1. **Client Layer (Void UI):** Modified editor workbench containing the `trizGatewayService` interceptor, an in-chat ARIZ state banner, and connectors for local LLMs (LM Studio, Ollama, vLLM) and cloud APIs.
2. **Logic Layer (triz-mcp-server):** Local TypeScript/Fastify service implementing the ARIZ-85-V state machine, a rule-based principle selection engine, and session state management.
3. **Knowledge Base Layer:** Formatted database of all 40 inventive principles of Genrich Altshuller tailored specifically for software development (`triz-principles.json`).

---

## 🚀 Quick Start

### 1. Launch `triz-mcp-server`:
```bash
cd triz-mcp-server
npm install
npm run build
npm start
```
The server will run at `http://127.0.0.1:8787`.

### 2. Launch `void` (TRIZ IDE):
```bash
cd void
npm run buildreact
.\scripts\code.bat
```

---

## 📄 Documentation
- [NEXUS_IDE_TZ.md](./NEXUS_IDE_TZ.md) — Product Requirements Document (PRD).
- [PROGRESS.md](./PROGRESS.md) — Project Development Status.
- [SUMMARY_EN.md](./SUMMARY_EN.md) — Comprehensive English Executive Summary.
