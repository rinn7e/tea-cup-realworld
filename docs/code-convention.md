# Code Conventions

## Table of Contents

- [Task Scope and Refactoring](#task-scope-and-refactoring)
- [Import Organization](#import-organization)
- [Control Flow](#control-flow)
- [Functional Programming (fp-ts)](#functional-programming-fp-ts)
- [Mutable Variables (let)](#mutable-variables-let)
- [Algebraic Data Types (ADTs)](#algebraic-data-types-adts)
- [TEA Child Msg Interception](#tea-child-msg-interception)
- [File Structure and Splitting](#file-structure-and-splitting)
  - [Tea Cup Components](#tea-cup-components)
  - [Dependency Order and Hierarchy](#dependency-order-and-hierarchy)
  - [React Components](#react-components)
  - [Props Ordering](#props-ordering)
  - [API Data and Endpoints](#api-data-and-endpoints)
- [TypeScript Type Assertions](#typescript-type-assertions)
- [UI Styling Guidelines](#ui-styling-guidelines)

## TypeScript Type Assertions

Prefer to use `satisfies Type` instead of `as Type` for TypeSript code, unless there is absolutely no other choice besides using `as Type`. This ensures that the object matches the type while still retaining its specific implementation layout for better type inference.

## Task Scope and Refactoring

Prefer not to update or refactor code outside of the specific task or feature that is assigned to you. Keep your changes focused on the current objective to prevent unintended side effects and scope creep.

---

## Import Organization

All imports should be grouped into three sections for clarity and consistency:

1. **External libraries** – third-party dependencies.
2. **Path aliases** – files imported via `@/`.
3. **Relative imports** – files imported via `./` or `../`.

Each section is then sorted alphabetically.

Example:

```ts
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import * as RT from 'react-tooltip'
import { Cmd, map } from 'tea-cup-fp'

import { MyPG } from '@/cache/db'
import { mkTooltipClass } from '@/components/shared/dumb-tooltip'
import * as Form from '@/hook/form-tea'

import { Msg } from './type'
...
```

---

## Control Flow

Avoid early returns. Always express branching as a full `if / else if / else` tree so that every code path is explicit.

```ts
// ❌ early return
const foo = (x: number) => {
  if (x === 0) return 'zero'
  return 'non-zero'
}

// ✅ if-else tree
const foo = (x: number) => {
  if (x === 0) {
    return 'zero'
  } else {
    return 'non-zero'
  }
}
```

---

## Functional Programming (fp-ts)

Prefer `fp-ts` over plain JavaScript array/object methods. Always use `pipe` with the appropriate `fp-ts` module (e.g. `A` for `Array`, `O` for `Option`, `M` for `Map`) rather than calling methods directly on values.

```ts
// ❌ plain JS
return list.map((ps) =>
  getNameFromProfileSelection(ps) === getNameFromProfileSelection(newProfile)
    ? newProfile
    : ps,
)

// ✅ fp-ts
return pipe(
  list,
  A.map((ps) =>
    getNameFromProfileSelection(ps) === getNameFromProfileSelection(newProfile)
      ? newProfile
      : ps,
  ),
)
```

This applies to all array operations (`.map`, `.filter`, `.find`, `.some`, `.every`, etc.) as well as `Option`, `Either`, `Map`, and other `fp-ts` data types.

---

## Mutable Variables (`let`)

Avoid using mutable variables (`let` bindings) to ensure predictable and declarative code.

- **Do not** use mutable variables within TEA-style components (`init`, `update`, `view`).
- **Allowed** in the `process/` directory, where imperative side effects or stream listeners are managed.
- **Allowed** in standard React components (e.g., within hooks or local component logic), though still use with caution.

---

## Algebraic Data Types (ADTs)

When dealing with Algebraic Data Types (ADTs), prefer to use a `switch` statement on the discriminator field (e.g. `_tag`) rather than using `if-else` chains.

```ts
// ❌ if-else
if (x._tag === 'ExactProfilesDialog') {
  ...
} else if (x._tag === 'SubsetContactsDialog') {
  ...
} else if (x._tag === 'CompoundBundlesDialog') {
  ...
}

// ✅ switch
switch (x._tag) {
  case 'ExactProfilesDialog':
    ...
  case 'SubsetContactsDialog':
    ...
  case 'CompoundBundlesDialog':
    ...
}
```

---

## TEA Child Msg Interception

When a parent component needs to intercept or respond to specific messages from its child components, use the `updateAndCmd` (or `updateAndCmdExtra`) pattern within a `pipe`. This keeps the child message handling clean and modular by avoiding nested `switch` or `if-else` blocks for simple interception logic.

```ts
case 'ChildMsg': {
  const [newChildModel, childCmd] = Child.update(
    msg.subMsg,
    model.childModel,
  )

  return pipe(
    [
      { ...model, child: newChildModel },
      childCmd.map(
        (m) =>
          ({
            _tag: 'ChildMsg' as const,
            subMsg: m,
          }) as Msg,
      ),
    ],
    updateAndCmd((m) => {
      if (msg.subMsg._tag === 'MsgToIntercept') {
        return [
          { ...m, someParentField: true }, // Update parent model
          Cmd.none(), // Add parent commands
        ]
      } else {
        return [m, Cmd.none()]
      }
    }),
  )
}
```

---

## File Structure and Splitting

### Tea Cup Components

Each component should follow a clear, modular structure to promote maintainability and avoid circular dependencies.

#### Naming Rules

- **File names** must be **singular**.
- **Folder names** must also be **singular** (folders act as logical _tags_).
  - Asset files and folders do not have to follow this convention since they are not code.
- File and folder names must be in kebab-case.
- Use the prefix **`list`** or **`array`** to indicate a collection of items.
  - Example: `component/bundle-list.tsx`

- Component names should be `<SomeComponent>` or `<SomeComponent>View` for the component and `<SomeComponent>Memo` for its memoized version.
  - Example:

```ts
export const AccountSettingMemo = memo(AccountSetting, mkPropEq().equals) as <
  pmsg,
>(
  props: Props<pmsg>,
) => JSX.Element
```

#### Recommended File Breakdown

**1. `index.tsx`**

- Serves as the **main entry point** of the component.
- Defines the primary **View** component.
- Smaller helper views can be defined in `view.tsx`.
- If a helper view is a reusable React component, place it under `component/<component-name>.tsx`.
- Must only export 1 component, e.g., `AccountSettingMemo`.

**2. `update/`**

- Contains the `init` and `update` functions.
- If the file grows too large, separate logic into submodules such as:
  - `handler.ts`
  - `cmd.ts`
  - `helper.ts`

- Re-export all helper files here, since we can't export them
  in `index.tsx` due to React Refresh.

**3. `type/`**

- Defines all types and related helpers.
- May be further divided into smaller files, for example:
  - `type/bundle.ts`
  - `type/message.ts`

---

### Dependency Order and Hierarchy

To minimize circular dependencies, follow this recommended import hierarchy:

1. `type.ts`
2. `handler.ts`, `cmd.ts`, `helper.ts` (if they exist)
3. `update.ts`, `view.tsx`
4. Child components
5. `index.tsx`

### React Components

- All components should have `<MyComponent>` and `<MyComponentMemo>`.
- Only export the memo version, unless the component cannot be memoized.
- Must define proper `Eq` instance for memoization.
- Only use `EqAlways` if you are certain the value will not change. Avoid using it for model data that can be updated.
- Use TEA state management unless it is impossible to do so.

#### Props Ordering

When defining props for a React component, order the fields logically to improve readability and distinguish between component-specific data and generic data passed from parents:

1.  **Component-specific fields** – Props unique to the component's logic
2.  **Parent-passed** – Props passed from high-level parentProps

Example:

```ts
export type ParticipantSelectionProps = {
  // Specific fields
  label: string
  profileSelectionType: RecipientField
  calculatedField: number

  // Fields passed from parent
  isMaximized: boolean
  header: Header
  auth: ProfileFromApi
  dispatch: Dispatcher<Msg>
}

<ParticipantSelectionMemo
  label='bcc'
  profileSelectionType='BCC'
  calculatedField={calculateSth()}

  isMaximized={parentProps.isMaximized}
  header={parentProps.header}
  auth={parentProps.auth}
  dispatch={parentProps.dispatch}
/>
```

### API Data and Endpoints

- API data and endpoints are located in the `api` directory.

- API data and types are stored in the `api/type` directory.
  - Each data entity has its own file, e.g., `api/type/message.ts`, `api/type/bundle.ts`.
  - Commonly shared types are in `api/type/common.ts`.
  - Re-export everything in `api/type/index.ts`.

- API handlers are stored in the `api/handler` directory.
- All handlers are grouped based on the endpoint they are calling.
  - e.g., `api/handler/message.ts`: All endpoint handlers related to the `message` resource.
  - e.g., `api/handler/bundle.ts`: All endpoint handlers related to the `bundle` resource.
  - Re-export everything in `api/index.ts`.

- `api/type` file hierarchy (to avoid circular imports):
  1. `common.ts`
  2. `<each-type-name>.ts`
  3. `helper.tsx`

- `api/handler` file hierarchy (to avoid circular imports):
  1. `common.ts`
  2. `<each-endpoint-name>.ts`
  3. `helper.tsx` (if exists)

---

## UI Styling Guidelines

The project mainly uses Tailwind CSS; use custom CSS only when necessary.

- **Do not** use margin classes. Use a parent element with padding instead.

- **Prefer** explicit pixel values (`px`) using square brackets over Tailwind's default numeric scale for dimensions and spacing (e.g., use `w-[304px]` instead of `w-76`). This ensures precision and better alignment with design specifications.

- **Do not** use `h-screen`, as this doesn't play well with mobile browsers due to the varying appearance of the URL bar.
  - Use `h-full` instead (or `h-dvh` after further experimentation).
- **Should** use `createPortal` with `absolute` (or `fixed` position, requiring more experimentation) to display a UI stack on top of another.
  - The `body` element has the class `relative`, so we can display a dialog with just `absolute` instead of `fixed`. This allows us to use `h-full` instead of `h-screen` to make the dialog fill the screen.
- **Must** use mobile-first conventions:
  - **Do not** use `max-lg:` or any `max-*` breakpoints. Always define mobile styles first, then override them for desktop using `lg:`.
  - Use `w-full lg:w-[400px]` instead of `w-[400px] max-lg:w-full`.
  - Use `hidden lg:block` instead of `max-lg:hidden`.
- **Should** use multi-line classes for complex layouts:
  - Organize classes into `shared`, `mobile`, and `desktop` groups for readability.

```ts
// Example of a mobile-first, multi-line className
className={cn(
  // shared class
  'h-full flex flex-col overflow-y-auto scrollbar scrollbar-w-[8px] scrollbar-thumb-cf-dark-30',
  // mobile class
  'fixed inset-0 w-full bg-white px-[24px] z-10 pb-[16px]',
  // desktop class
  'lg:static lg:shrink-0 lg:bg-cf-light-400 lg:gap-[16px] lg:w-[386px] lg:px-[20px] lg:pb-0',
)}
```
