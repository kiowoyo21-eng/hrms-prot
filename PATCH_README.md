# HRMS Demo Accounts UI Patch

Included files:
- app/page.tsx
- app/globals.css

What changed:
- Replaced the plain-text demo credentials box on the login page with clickable role cards.
- Cards are generated from the existing `demoAccounts` array, so every configured demo role appears automatically.
- Clicking a card auto-fills the username and password fields.
- Kept the normal sign-in flow unchanged.

Installation:
1. Extract this patch into your HRMS project root.
2. Overwrite the matching files.
3. Run `npm run dev` or `npm run build`.
