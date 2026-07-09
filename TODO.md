# TODO

## Upload 500 fix
- [ ] Update `server/src/controllers/invoiceController.ts` to return better status codes/messages (422 for validation-like failures; include useful debug info).
- [ ] Add Express error handler in `server/src/app.ts` for Multer errors (invalid file type/size, etc.).
- [ ] Update `client/src/pages/DashBoard.tsx` to surface backend error messages in the alert/log.
- [x] Rewrote server upload error handling to return backend message + better status codes.
- [x] Added Express error handler for Multer errors (invalid file type/size).
- [x] Updated client to show backend error message.
- [ ] Re-run upload from Dashboard using a known-good PNG/JPG under 5MB.
- [ ] If still failing, inspect server console logs from `Gemini Service Error` to pinpoint the exact Gemini/Mongo parsing issue.


