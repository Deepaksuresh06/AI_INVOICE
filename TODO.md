# TODO - Complete Invoice Editing

- [ ] Update `client/src/components/InvoiceEditorModal.tsx` to support complete editing of all invoice fields (header + line items: name/qty/price) and also make subtotal/tax/total editable.
- [ ] Replace strict/incorrect validation with backend-aligned validation and clearer error display.
- [ ] Improve totals UX: show derived values but allow user to edit subtotal/tax/total; validate that they are consistent with items when saving.
- [ ] Add professional toast notifications (success/error) and better loading state during save.
- [ ] Add unsaved changes warning on browser unload (beforeunload) in addition to Cancel confirm.
- [ ] Ensure payload sent to existing PUT API matches backend schema (nullables vs undefined) and includes item totals computed from qty×price.
- [ ] Test manually: open modal, edit every field, close with unsaved changes, save valid/invalid invoices.

