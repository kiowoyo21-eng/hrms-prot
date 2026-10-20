# Install via GitHub website (no terminal required)

This ZIP contains only the two missing source files and documentation. Do **not** upload the ZIP itself to GitHub.

1. Extract the ZIP to your computer.
2. Open https://github.com/kiowoyo21-eng/hrms-prot on branch `main`.
3. Open the `components` directory and click **Add file → Upload files**.
4. Upload `IncidentWorkspace.tsx` and `DocumentWorkspace.tsx` from the ZIP's `components` folder. Ensure both appear at `components/<filename>.tsx` (not at the repository root and not nested inside another folder).
5. Choose **Commit changes** directly to `main`.
6. Wait for Vercel's new deployment and verify that the Source Commit changed from `2acbf6a`.

If one or both files already exist in GitHub at the exact case-sensitive path, compare the latest commit and do not blindly overwrite newer work. Ask for a fresh deployment log instead.

The patch does not add dependencies. Next.js build success still needs confirmation.
