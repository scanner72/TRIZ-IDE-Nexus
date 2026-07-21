# 📘 Comprehensive Project Summary: TRIZ-IDE Nexus

---

## 1. Executive Summary

**TRIZ-IDE Nexus** is a sovereign, specialized engineering IDE built on top of a customized fork of **Void** (based on Code-OSS / VS Code).

### Key Differentiator
Standard AI IDEs (Cursor, Copilot, Windsurf) focus on instantaneous stream generation of code directly from natural language prompts. This frequently leads to code bloat, duplicated logic, and rapid technical debt growth.

**Nexus enforces a TRIZ (Theory of Inventive Problem Solving) engineering filter prior to code execution.** The editor requires the AI agent and the engineer to resolve architectural conflicts and formulate the **IKR (Ideal Final Result)**. Only after an "Engineering Passport" is approved does the editor unlock LLM code generation.

---

## 2. TRIZ Methodology & ARIZ-85-V in Software Engineering

Originating from Soviet engineer and inventor Genrich Altshuller, TRIZ principles in Nexus are adapted specifically for software architecture:

### Core Concepts

1. **Technical Contradiction**
   A state where improving one system parameter (e.g., execution speed) inadmissibly degrades another (e.g., RAM footprint or maintainability).
   - *Software Example:* Improving API response latency via persistent In-Memory caching causes critical RAM consumption.

2. **Physical Contradiction**
   The requirement for a specific system component to exist in opposite physical states simultaneously.
   - *Software Example:* The caching layer **must be present** to serve sub-millisecond reads, and **must be absent** to avoid RAM overhead.

3. **Ideal Final Result (IKR / ИКР)**
   An ideal system state where **the component itself does NOT exist, yet its function is fully executed**.
   - *Software Formulation:* "Data is read in sub-millisecond time using OS virtual address space mapping without allocating a persistent RAM cache layer in the application."

---

### Software Engineering Applications of Altshuller's 40 Principles

The `triz-mcp-server` includes a local knowledge base mapping Altshuller's 40 principles to IT patterns:
- **Principle #1 (Segmentation):** Microservices, Micro-frontends, Lazy Loading, Modularization.
- **Principle #2 (Taking Out / Extraction):** Offloading Auth to OAuth2/OIDC, separating logic into standalone MCP servers.
- **Principle #10 (Prior Action / Pre-action):** Server-Side Rendering (SSR), Database Indexing, Scheduled Pre-computation.
- **Principle #13 (Inversion / "Do It In Reverse"):** Inversion of Control (IoC), Dependency Injection (DI), Event-Driven Push models.
- **Principle #15 (Dynamism):** Container Autoscaling, Dynamic Plugin Loading at runtime.
- **Principle #24 (Mediator):** API Gateways, Message Brokers (RabbitMQ/Kafka), Interceptor Middleware.

---

### ARIZ-85-V State Machine

The `triz-mcp-server` houses an internal state machine guiding the engineering workflow:
- `PART_1_PROBLEM_ANALYSIS` — Initial task & objective definition.
- `PART_2_CONTRADICTION_IDENTIFICATION` — Technical & Physical contradiction mapping.
- `PART_3_IKR_FORMULATION` — Formulation of the Ideal Final Result.
- `PART_4_PRINCIPLE_SELECTION` — Automated rule-based TRIZ principle matching.
- `READY_FOR_GENERATION` — Session approved, code generation unlocked.

---

## 3. Architecture & Project Layout

The repository is structured into three layers (`d:\TRIZ`):

```
d:\TRIZ\
├── triz-mcp-server/      # Local MCP Server (TypeScript + Fastify + Zod)
└── void/                 # Modified Code-OSS / Void Editor
```

### 1. `triz-mcp-server` (Logic Layer / TRIZ Orchestrator)
- **Port:** `8787` (`http://127.0.0.1:8787`)
- **Knowledge Base:** `data/knowledge/triz-principles.json` (40 Altshuller principles with software tags and examples).
- **Endpoints:**
  - `POST /api/v1/triz/analyze` — Complete TRIZ pipeline analysis.
  - `POST /api/v1/triz/approve` — Engineering passport approval.
  - `POST /mcp/tool` — MCP tools (`analyze_architectural_conflict`, `evaluate_ikr`, `suggest_triz_principles`, `run_full_ariz_pipeline`).

### 2. `void` (Client Layer / UI)
- Modified Void workbench in `d:\TRIZ\void\src\vs\workbench\contrib\void\`.
- **`trizGatewayService.ts`**: Intercepts requests prior to `sendLLMMessage()`. When `enforce` mode is active, generation is blocked until `approveSession()` is confirmed.
- **`SidebarChat.tsx` / `TrizStatusBanner`**: Displays active ARIZ step, technical contradiction, IKR, and the **"Approve & Code"** action.

---

## 4. Engineering Passport Specification (JSON Schema)

```json
{
  "request_metadata": {
    "session_id": "nexus-session-2026",
    "thread_id": "chat-thread-12"
  },
  "pipeline_state": {
    "current_ariz_step": "READY_FOR_GENERATION",
    "technical_contradiction": {
      "parameter_to_optimize": "execution_speed",
      "parameter_that_degrades": "memory_footprint"
    },
    "ikr_formulation": "Data is read in 1ms using OS virtual address space mapping without persistent RAM allocation.",
    "applied_altshuller_principles": [15, 2]
  },
  "validation": {
    "user_approved": true,
    "system_verdict": "READY_FOR_GENERATION"
  }
}
```

---

## 5. TRIZ Gate Modes

In **Settings → TRIZ Engineering Gate**, three operational modes are available:
1. **`off`**: Standard Void AI chat behavior (TRIZ disabled).
2. **`observe`**: TRIZ analysis runs in parallel and presents recommendations without blocking code execution.
3. **`enforce`**: **Strict mode**. Code generation is locked until the engineer confirms the IKR and clicks **Approve & Code**.
