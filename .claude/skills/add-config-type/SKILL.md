---
name: add-config-type
description: Scaffold a new configuration value type (type_of_value) end-to-end in pec-configurator-ui. Use when asked to add a new config type, a new field type for the configurator, or a new config value type.
---

# Add a new config type

A config `type_of_value` (e.g. `text`, `boolean`, `image`) touches five places. Add them in this order:

1. **Discriminated union entry** — `src/schemas/config/configSchema.ts`. Add a new branch to `configItemSchema`'s `z.discriminatedUnion("type_of_value", [...])`, extending `baseConfigSchema` with: `type_of_value: z.literal("your_type")`, `options`, `default_value`, `values_as_per_locale: valuesAsPerLocaleSchema`.

2. **Options schema** — `src/schemas/config/configOptionSchema.ts`. Add the matching options schema (see `booleanOptionsSchema`, `imageOptionsSchema`, etc. as templates) describing what config-level options this type accepts.

3. **Element value/file schema** — `src/schemas/config/element/`. Add a schema (+ its `.test.ts`) validating an individual draft value for this type, following `textValueSchema.ts`/`textValueSchema.test.ts` or `imageFileSchema.ts` as the closest template.

4. **Editor/Preview component pair** — `src/components/config/editors/XEditor.tsx` (+ `.test.tsx`). A single file exports **both** `XEditor` and `XPreview` — the standalone files under `src/components/config/previews/` are dead/unused, don't add to them. Copy the shape from `BooleanEditor.tsx` or `ImageEditor.tsx`:
   - `XEditor` props: `{ config: XConfig }` where `XConfig = Extract<ConfigItem, { type_of_value: "your_type" }>`.
   - `XPreview` props: `{ config: XConfig, showDefault?: boolean }`.
   - Editor checks `is_configurable_from_ui` and `selectIsEditing` to decide whether to render the interactive control or fall back to `<XPreview config={config} />`.
   - Local `useState` for the in-progress value + `error` (`$ZodIssue[] | null`); Redux `selectIsDirty(config.keyId)` for dirty state.
   - Build a zod schema from `config.options` (e.g. `booleanValueSchema(allOptions)`) and `.safeParseAsync` on change; on failure dispatch `setConfigError({[keyId]: true})`, on success dispatch `setDirty` + `bindDrafts({[keyId]: {...}})` (all from `src/feature/config/configSlice`).
   - `useEffect` resets local state/error when `isEditing`/`isDirty` change.
   - Render validation errors as `<ul className="list-disc list-inside">{error?.map(e => <li>{e.message}</li>)}</ul>`.

5. **Wire into the switch statements** — add the new `case "your_type":` to both `src/components/config/ConfigEditor.tsx` and `src/components/config/ConfigPreview.tsx`.

After scaffolding, run the `verify` skill.
