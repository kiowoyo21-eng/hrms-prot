# HRMS UI components — Batch 08 (source-level implementation)

This file documents the reusable components in `components/ui/HrmsPrimitives.tsx`, backed by `app/hrms-components.css` and tokens in `app/tokens.css`.

| Component | Intended use | Implemented / adopted |
|---|---|---|
| `HrmsButton` | Primary, secondary, ghost, danger actions; 32/40px sizes | Implemented; help dialog migrated; existing legacy button classes adapted through CSS |
| `HrmsBadge` | Semantic status and filtered chips | Implemented; existing badges adapted by compatibility CSS, not completely migrated |
| `HrmsCard` | Compact 1px border container | Implemented for future use; legacy cards retain data handlers |
| `HrmsField` / `HrmsInput` | Label+control pairing, accessible focus | Implemented; legacy form controls receive common CSS rules |
| `HrmsPageHeader` | Single page title and right-aligned actions | Implemented for future migration |
| `HrmsStatCard` | Consistent icon/number/card anatomy with optional drill-down | Implemented for future migration; existing dashboard metrics preserved |
| `HrmsEmptyState` | Content-sized empty state (no forced giant height) | Implemented; leave empty state aligned via CSS |
| `HrmsDataTable` | Overflow-safe compact table wrapper | Implemented for future migration; legacy table styles adapted |
| `HrmsTabs` | Underline/segmented controlled tabs, Arrow/Home/End keys | Implemented; grouped modules, HR Forms, Reports and Recruitment hiring stage tabs migrated |
| `HrmsDialog` | Portal dialog, focus trap, Esc, restore focus, sticky footer | Implemented; help guides migrated across modules |
| `HrmsToast` | Accessible status/alert notices | Implemented for future migration; existing toasts preserved |
| `useManagedDialog` | Accessibility adapter for legacy portal dialogs | Wired to Government Deductions, Leave details/editor, Asset dialogs |

## Implementation rules

- Preserve original submit/edit/approval handlers when migrating a screen; do not replace stored data or permissions.
- Use `HrmsDialog` for new dialogs. Its header/footer stay visible, only body scrolls, and the topmost dialog handles Escape.
- Don't wrap complex existing editor chrome in broad styles indiscriminately. `app/hrms-migration.css` is limited to identified HRMS containers and legacy dialog selectors.
- Keep the custom compact Government Deductions modal: narrow header metadata, scrollable bracket table, fixed footer actions; it is *not* replaced by the generic large dialog.
- Shared tokens/radius/focus guide new components. Legacy arbitrary CSS values and `!important` declarations persist until audited per module.
- Screen-level runtime verification is **not completed**. Test keyboard navigation, focus restoration, exports, workflows, and responsive behavior at 1920, 1440, 1024, 768, and 390px.
