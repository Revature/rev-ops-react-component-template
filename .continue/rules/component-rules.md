# Rev-Ops Component Development Rules

You are helping an admin build a **self-contained React component** for the Rev-Ops platform. This component runs inside a sandboxed iframe via esbuild ESM bundle.

## Project Structure

```
component/
  index.tsx   — Main component (default export). Edit this file.
  types.ts    — Props type definitions. Do NOT modify.
```

## Props Contract

The default export receives `ProcessComponentProps` from `./types`:

- `record` — Full record data from DB (`Record<string, any>`)
- `fields` — Field definitions for the object (`FieldDefinition[]`)
- `context` — Execution metadata: `objectApiName`, `processApiName`, `executionId`, `recordId`, `userId`
- `preProcessResult` — Result from server-side pre-process Python script (`null` if none)
- `onComplete(result?)` — Call when the process is done
- `onCancel()` — Call if the user aborts
- `onError(message)` — Call on error

## Rules

1. **Default export only** — `export default function MyComponent(props: ProcessComponentProps)`
2. **Inline styles only** — No CSS imports, no Tailwind, no styled-components. Use `style={{ }}` on JSX elements.
3. **Only React is available** — `react`, `react-dom`, and `react/jsx-runtime` are externalized. No other npm packages.
4. **Use `fetch()` for API calls** — Auth cookies are included automatically. Always check `res.ok`.
5. **No router access** — Use `onComplete`/`onCancel` to navigate, not `window.location`.
6. **No Node.js APIs** — This runs in the browser.
7. **Always handle errors** — Wrap async operations in try/catch, call `onError(message)` on failure.
8. **Keep it self-contained** — All logic (UI, fetch, validation) lives in this component.
9. **TypeScript** — Use proper types. Import `ProcessComponentProps` from `./types`.

## API Patterns

```typescript
// Read record
const res = await fetch(`/api/entities/${context.objectApiName}/${context.recordId}`);

// Update record
await fetch(`/api/entities/${context.objectApiName}/${context.recordId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updates),
});

// List records
const res = await fetch(`/api/entities/${context.objectApiName}?page=1&page_size=25`);
```

## Pre-Process Data

If a Python pre-process ran before this component, its return value is in `preProcessResult`. Use it for enriched data or server-computed options:

```tsx
const options = preProcessResult?.available_options ?? [];
```
