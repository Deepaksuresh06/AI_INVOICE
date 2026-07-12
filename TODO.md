# TODO - Premium SaaS Branding + Complete Invoice Editing UI/UX

- [x] Complete invoice editing in `client/src/components/InvoiceEditorModal.tsx`
  - [x] Editable invoice header fields
  - [x] Editable subtotal/tax/total
  - [x] Editable item name/quantity/price
  - [x] Validation + loading states + toast notifications + unsaved changes warning
  - [x] Uses existing PUT API

- [x] Dark mode implemented (Tailwind `dark` class) with persisted theme toggle in `PremiumAppShell`

- [x] Design system foundation (Phase 1)
  - [x] Shared theme tokens (Light + Dark) in `index.css` + `tailwind.config.js`
  - [x] `ThemeProvider` + `useTheme` hook for reusable theme architecture
  - [x] Shared UI primitives in `components/ui/` (Button, Input, Select, Card, Table, Dialog, Badge, Field, Spinner)
  - [x] Motion presets in `theme/motion.ts`
  - [x] `darkMode: 'class'` enabled in Tailwind

## Authenticated navbar (hidden on Landing page)
- [x] Replace minimal header in `PremiumAppShell.tsx` with a sticky Premium navbar
- [x] Navbar: left InvoiceIQ branding, right animated Light/Dark theme toggle

## Dashboard
- [ ] Remove "Backend Ready" badge from `client/src/pages/DashBoard.tsx`
- [ ] Remove decorative icons from stats cards
- [ ] Show only latest 4 invoices in Recent Invoices

## Global design system
- [x] Create shared UI tokens / reusable components for:
  - [x] colors, typography, radii, shadows
  - [x] buttons, inputs, cards, tables
  - [x] modal/dialog styling, hover, focus states
- [ ] Apply design system to all authenticated pages (Phase 2+)

## Apply design system everywhere authenticated
- [ ] Update `client/src/pages/Invoices.tsx`
- [ ] Update `client/src/components/InvoiceEditorModal.tsx`
- [ ] Update `client/src/pages/NotFound.tsx`

## Quality gates
- [ ] Responsive on mobile/tablet/desktop
- [ ] Theme consistency across every authenticated page
- [ ] No duplicated components / no unused CSS / no dead code

