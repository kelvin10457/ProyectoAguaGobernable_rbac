# Plataforma JAAP El Limón–Havoline

Real implementation of the `Plataforma JAAP.dc.html` design (see `../README.md`, `../chats/chat1.md`, and `../project/`) — a platform for the JAAP El Limón–Havoline water board: general info, capacity-building videos, monthly water-quality/quantity parameters, and a tariff calculator.

Stack: React 19 + TypeScript + Tailwind CSS v4 (Vite). This is a frontend-only build: there is no backend, admin login accepts any credentials, and edits (parameter values, tariff charges) only persist in memory for the current session — this matches the approved mockup's behavior.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/state/JaapContext.tsx` — the app's mock state and business logic (role, parámetros edit/publish, tarifa calculator), mirroring the logic embedded in the original `.dc.html` mockup.
- `src/pages/` — one component per route (Inicio, Información general, Fortalecimiento, Parámetros, Tarifa, Ingreso).
- `src/components/` — shared chrome (`Header`, `Footer`) and the `Blueprint` frame (the design system's hairline-border + corner-mark wrapper).
- `src/index.css` — the "Industry" design system's tokens and component classes (buttons, cards, tags, tables, inputs), ported from `../project/industry-styles.css`.

## Known placeholders

Per the mockup: no real photo/map/video assets, and "Costeo del servicio" is intentionally out of scope (shown as "en construcción").
