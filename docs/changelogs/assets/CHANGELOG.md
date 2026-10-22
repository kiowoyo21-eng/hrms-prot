# Assets & Devices changelog

## 2026-10-22 — Batch 05 correction

The AssetWorkspace device inventory rows can open a portaled detail/history dialog by click or Enter/Space. Existing View, Assign, Request Return, Receive Return, Inspect/Reinspect and Add Device actions now display dialogs above the inventory instead of inline forms far below. Escape and backdrop dismiss where applicable. No asset status logic, history schema, signature storage, or branch checks were replaced.

Source: `components/AssetWorkspace.tsx`, `app/globals.css`. **Browser verification pending.**
