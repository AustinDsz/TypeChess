# ♟️ TypeChess

> A modern, reactive Chess application built with pure TypeScript, Angular Standalone Components, Signals, Google Gemini AI, and Tailwind CSS.

![TypeChess Version](https://img.shields.io/badge/version-1.2.0-amber)
![Angular](https://img.shields.io/badge/Angular-20+-dd0031.svg?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6.svg?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38bdf8.svg?logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285f4.svg)
![chess.js](https://img.shields.io/badge/Engine-chess.js-emerald)

---

## Features

- **Play vs Gemini AI ("Carl" Persona)**: Single-player mode powered by Google Gemini with selectable difficulty tiers (Casual, Club, Master) and concise 3–6 word Grandmaster reactions.
- **Local Pass-and-Play Mode**: Seamless two-player offline gameplay on the same device.
- **AMOLED Dark & Clean Light Theme**: Deep black AMOLED background with custom midnight slate squares as default, with instantaneous toggle to warm tournament wood light mode.
- **Reactive Angular Signals**: Zero-boilerplate reactive game state syncing board cells, legal moves, check indicators, and move history.
- **Zero-Latency Web Audio API SFX**: Synthesized in-browser sound effects for standard moves, captures, check alerts, illegal moves, and game-over fanfare.
- **Interactive Pawn Promotion**: Visual modal dialog to promote pawns to Queen, Rook, Bishop, or Knight.
- **Material Advantage & Captured Pieces Tracker**: Dynamic real-time point advantage display (+1, +3, +5, etc.) and captured piece tray.
- **Algebraic Move History**: Scrollable ledger recording turns and moves in Standard Algebraic Notation (SAN).
- **Board Manipulation**: Flip board perspective, smart multi-turn Undo, and restart with confirmation protection.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Angular](https://angular.dev/)** (v20+) | Standalone Components, Signal-based reactivity, modern build pipeline |
| **[TypeScript](https://www.typescriptlang.org/)** (v5.9+) | Strict typing and clean domain models |
| **[Google Gemini AI](https://ai.google.dev/)** | Serverless AI opponent intelligence and real-time game commentary |
| **[Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)** | Secure serverless edge proxy protecting the `GEMINI_API_KEY` secret |
| **[Tailwind CSS](https://tailwindcss.com/)** (v4+) | Responsive, AMOLED dark & clean light styling |
| **[chess.js](https://github.com/jhlywa/chess.js)** | Move validation, check/checkmate rules, FEN & PGN parsing |
| **Web Audio API** | Native low-latency sound synthesis without external audio files |

---

## Project Structure

```text
TypeChess/
├── functions/
│   └── api/
│       └── ai-move.ts                   # Cloudflare Pages Serverless Edge Proxy for Gemini AI
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── chess.models.ts      # Game types, Square, Move, Piece, GameMode
│   │   │   │   ├── ai.models.ts         # AI request/response & difficulty types
│   │   │   │   └── auth.models.ts       # User profile and auth interfaces
│   │   │   └── services/
│   │   │       ├── chess-engine.service.ts # chess.js wrapper with Angular Signals
│   │   │       ├── ai.service.ts        # AI Client service & difficulty management
│   │   │       ├── audio.service.ts     # Web Audio API sound synthesis
│   │   │       ├── theme.service.ts     # AMOLED Dark & Clean Light theme manager
│   │   │       └── auth.service.ts      # Auth service stub & login hook
│   │   ├── features/
│   │   │   ├── chess-board/
│   │   │   │   ├── chess-board.component.ts # 8x8 grid & pawn promotion modal
│   │   │   │   ├── piece/piece.component.ts # Vector SVG chess pieces
│   │   │   │   └── square/square.component.ts # Square highlights, move dots, capture rings
│   │   │   ├── game-controls/
│   │   │   │   ├── game-actions.component.ts # Flip, Undo, Reset controls
│   │   │   │   ├── game-status.component.ts  # Turn banner, check alert, captured tray
│   │   │   │   ├── move-history.component.ts # Move notation history table
│   │   │   │   └── ai-commentary.component.ts # Carl persona speech bubble
│   │   │   └── mode-selector/
│   │   │       └── mode-selector.component.ts # Mode & Difficulty picker
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── navbar/navbar.component.ts # Header, Theme toggle, Mute toggle
│   │   ├── app.ts                       # Root standalone component
│   │   ├── app.html                     # Master layout template
│   │   └── app.css
│   ├── index.html
│   ├── styles.css
│   └── main.ts
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AustinDsz/TypeChess.git
   cd TypeChess
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm start
   # or
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200/`.

---

## Roadmap

- [x] **v1.0.0**: Local 2-Player Pass-and-Play, Web Audio SFX, Move History, Signals-driven Chess Engine.
- [x] **v1.1.0**: AMOLED Dark & Clean Light Design System with persistent theme toggling.
- [x] **v1.2.0**: Google Gemini AI opponent integration ("Carl" persona), secure Cloudflare Edge proxy, difficulty tiers.
- [ ] **v1.3.0**: Custom Time Controls & Chess Clocks (Blitz 3+2, Rapid 10+0, Bullet).
- [ ] **v1.4.0**: User Authentication, Elo Rating System, Game Save/Load, and Cloud Database integration.
- [ ] **v2.0.0**: Real-time Online Multiplayer via WebSockets / WebRTC.

---

## Versioning

This project follows [Semantic Versioning (SemVer)](https://semver.org/). See the [CHANGELOG.md](CHANGELOG.md) for release notes.

---

## License

Distributed under the MIT License.
