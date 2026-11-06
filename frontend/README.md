# Frontend: Plataforma JAAP El Limón–Havoline

Aplicación React de la plataforma. Requiere el [backend](../backend) para obtener sus datos.

**Stack:** React 19, TypeScript, React Router 7, Tailwind CSS 4 y Vite.

## Desarrollo

```bash
npm install
npm run dev
```

Por defecto usa la API de `http://localhost:4000`. Para cambiarla, define `VITE_API_URL` en `frontend/.env`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Verifica los tipos y genera `dist/` |
| `npm run lint` | Ejecuta oxlint |
| `npm run preview` | Sirve localmente la versión compilada |

## Más información

- [Puesta en marcha completa](../README.md#puesta-en-marcha-local)
- [Arquitectura del frontend](../docs/arquitectura.md#frontend)
- [Funcionalidades y permisos](../docs/funcionalidades.md)
