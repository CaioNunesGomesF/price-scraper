# UI & Component Architectural Rules

1. **Design System & Styling**:
   - Primary Dark Green: `#213D30`
   - Accent / Focus: `#A4C4B5`
   - Font Family: `'Poppins', sans-serif` (loaded via Google Fonts)
   - Use `rounded-xl` / `rounded-2xl` strictly following project UI component tokens.
   - NEVER use native emojis in buttons, badges, or labels. Use `lucide-react` SVG icons instead.
   - NEVER duplicate icon symbols in text (e.g., NEVER write `+` in text next to a `<Plus />` icon).
   - Use `<FloatingInput />` for form input fields and `<SearchInput />` for search controls.

2. **Mandatory Custom Table Standard (`@/components/ui/Table`)**:
   - ALL tabular data MUST strictly use the project's custom Table component from `@/components/ui/Table`.
   - NEVER use native HTML `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements or raw `div` grids for data tables.
   - Standard Table Structure:
     ```tsx
     import { Table } from "@/components/ui/Table";

     <Table variant="secondary">
       <Table.ScrollContainer className="flex-1 flex flex-col min-h-0">
         <Table.Content aria-label="Nome da Tabela">
           <Table.Header>
             <Table.Row>
               <Table.Column onClick={header.column.getToggleSortingHandler()}>
                 Nome da Coluna
               </Table.Column>
             </Table.Row>
           </Table.Header>
           <Table.Body className="align-middle">
             <Table.Row>
               <Table.Cell className="align-middle">Valor</Table.Cell>
             </Table.Row>
           </Table.Body>
         </Table.Content>
       </Table.ScrollContainer>
     </Table>
     ```

3. **Fluid Layout Height Rules (`h-full min-h-0`)**:
   - Pages containing data management tables must occupy 100% of the viewport height.
   - Page Root Container: `flex-1 flex flex-col space-y-4 h-full min-h-0`
   - Main Card Container: `w-full flex-1 flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-4 shadow-2xs h-full min-h-0`
   - Scroll Container: `<Table.ScrollContainer className="flex-1 flex flex-col min-h-0">`

4. **Feeds vs. Tables Strategy**:
   - **Activity Feeds / Timelines (Notifications, Audit Logs)**: Must use continuous scroll feeds with sticky timeframe headers (`Hoje`, `Ontem`, `Esta Semana`) via `<AnimatedList />` or `<FadingScrollList />`. DO NOT use pagination controls on activity feeds.
   - **Dense Data Management Tables (Resellers, Condominiums, Billing, Users, Earnings)**: Must use TanStack Table sorting + `<Pagination />` component with page numbers and per-page limits with `@/components/ui/Table`.
