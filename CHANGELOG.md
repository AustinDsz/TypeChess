# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Stockfish AI Web Worker engine with configurable difficulty levels (Easy, Medium, Hard, Master).
- Chess timers / clocks with configurable time formats (Blitz, Rapid, Bullet, Classical).
- Full user authentication (OAuth / JWT / Firebase) with Elo rating tracking and personal stats.
- Online real-time multiplayer with WebSockets.

---

## [1.1.0] - 2026-09-14

### Added
- **AMOLED Dark & Clean Light Design System**:
  - Implemented `ThemeService` with Signal-based reactivity, DOM sync, and `localStorage` persistence (`typechess-theme`).
  - Added dedicated animated **Sun / Moon** theme switcher button in the top navigation bar.
  - **AMOLED Dark Mode (Default)**: Deep radial black background (`#000000`), carbon midnight board squares (`#10141c` / `#242b38`), and glowing golden highlights.
  - **Clean Light Mode**: Pure white cards, crisp slate backgrounds, and classic walnut wood chessboard squares (`#f0d9b5` / `#b58863`).
  - Adapted coordinate notations, captured piece trays, move ledger, and promotion dialogs for full contrast across both light and dark themes.

---

## [1.0.0] - 2026-09-13

### Added
- **Game Engine & Rules**:
  - Integrated `chess.js` engine wrapper (`ChessEngineService`) managing board state, turn switching, and chess rule validations.
  - Reactive game state using modern Angular Signals (`board`, `turn`, `isCheck`, `isCheckmate`, `isDraw`, `isStalemate`, `legalMoves`, `lastMove`).
  - Full support for standard chess mechanics: castling, en passant, and pawn promotion.
- **Audio Synthesis**:
  - Integrated Web Audio API sound service (`AudioService`) producing low-latency synthesized sounds for moves, captures, checks, game over, and illegal moves without external asset files.
  - Audio mute/unmute toggle in navbar with state indicator.
- **Interactive UI & Visuals**:
  - Responsive 8x8 chessboard with wood finish theme and coordinate notations (`ChessBoardComponent`).
  - Custom vector SVG chess piece set for White and Black (`PieceComponent`).
  - Dynamic square state highlights (`SquareComponent`): active selection, last move trail, legal move dots, capture rings, and red radial check halo on the King.
  - Interactive pawn promotion modal dialog allowing Queen, Rook, Bishop, or Knight selection.
  - Real-time captured pieces rack with live material score advantage computation (+1, +3, +5, etc.).
  - Move history ledger displaying turns and moves in Standard Algebraic Notation (SAN) with automatic scrolling (`MoveHistoryComponent`).
- **Game Controls**:
  - Mode selector supporting local 2-Player Pass-and-Play mode, with Play vs AI option disabled with a "Coming Soon" badge.
  - Toolbar controls for flipping board view, undoing previous moves, and restarting the game with a confirmation dialog (`GameActionsComponent`).
- **Authentication Readiness**:
  - Stubbed `AuthService` with user profile model, guest session defaults, and login preview dialog.
- **Design & Architecture**:
  - Scaffolding built with Angular Standalone Components and Tailwind CSS v4.
