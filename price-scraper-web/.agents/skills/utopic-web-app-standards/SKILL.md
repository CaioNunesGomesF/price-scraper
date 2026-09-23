---
name: utopic-web-app-standards
description: >-
  Standards, design system guidelines, UI rules, RBAC conventions, and architecture
  patterns for utopic-web-app. Activate this skill whenever developing, refactoring,
  or adding features to utopic-web-app.
---

# Utopic Web App Development Standards & Runbook

This skill outlines the mandatory architecture, UI component guidelines, RBAC security rules, and design patterns established for the **utopic-web-app** SaaS application.

---

## 1. Design System & Aesthetics Guidelines

- **Color Palette**:
  - Deep Emerald primary (`#213D30`, `emerald-50`, `emerald-600`, `emerald-700`).
  - Zinc neutrals (`zinc-50`, `zinc-100`, `zinc-200`, `zinc-700`, `zinc-900`).
  - Subtle borders (`border-zinc-200/90`), rounded cards (`rounded-2xl`), subtle shadows (`shadow-2xs`, `shadow-xl`).
- **No Native Emojis**:
  - NEVER use native emojis (e.g., 🚀, ➕, 🟢, 📦, 💡) in source code, buttons, badges, logs, or chat responses.
  - ALWAYS use SVG icons from `lucide-react`.
- **No Duplicate Icons/Text**:
  - Avoid `<Button icon={<Plus />}>+ Add</Button>`. Correct: `<Button icon={<Plus />}>Add</Button>`.
- **Input Placeholders**:
  - Always specify clear, user-friendly `placeholder` attributes on inputs (e.g. `placeholder="Digite o nome completo..."`).

---

## 2. Table & Listing Standards

- **Forbidden**: Native HTML `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements or manual `div` lists.
- **Mandatory Table Abstraction**: Always use `@/components/ui/Table`:
  - `<Table>`, `<Table.ScrollContainer>`, `<Table.Content>`, `<Table.Header>`, `<Table.Column>`, `<Table.Body>`, `<Table.Row>`, `<Table.Cell>`.
- **Sorting**: Interactive column sorting via TanStack Table showing `↑`, `↓`, `↕`.
- **Pagination**: Include `<Pagination />` component at table footer with dynamic page sizes (5, 10, 20, 50).
- **Skeleton**: Use `<Skeleton.TableRows rows={5} cols={numCols} />` for loading states.

---

## 3. Viewport & Layout Bounds

- Main container: `flex-1 flex flex-col space-y-4 h-full min-h-0`
- Card container: `w-full flex-1 flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-4 shadow-2xs h-full min-h-0`
- Table scroll container: `<Table.ScrollContainer className="flex-1 flex flex-col min-h-0">`

---

## 4. RBAC & Multi-Tenant Rules

- **Roles**: `super_admin` (L4), `reseller` (L3), `company_admin` (L2), `condo_admin` (L1.5), `operator` (L1).
- **Mandatory Condo Allocation**: Porteiros (`operator`) and Síndicos (`condo_admin`) require explicit Condominium allocation (`id_condo`).
- **Dedicated Forms**: User forms are full-page dedicated routes (`/admin/users/new`, `/admin/users/:id/edit`).

---

## 5. Reseller License Management

- **Dual-Tab Architecture**:
  - Tab 1: **Minhas Licenças Ativas por Condomínio** (Grouped vertically by condo with full-width sections for active licenses, real-time gauges, and action footers).
  - Tab 2: **Comprar Novas Licenças / Catálogo Geral** (Catalog table with purchase modal and condominium selection).
- **License Details**: Every active license displays its ID (`LIC-2026-8F9B23C4`), serial key, assigned hardware target (`Dell PowerEdge #SRV-BARUERI-01`), usage status badge (`Em Uso Total`, `Uso Parcial`, `Disponível`), and triggers `<LicenseDetailModal>`.
