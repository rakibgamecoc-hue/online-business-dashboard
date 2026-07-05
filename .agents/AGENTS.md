# Project Rules for BD Analytics Dashboard

## Windows PowerShell Script Execution Guardrail
When executing terminal commands (such as package installations or script runners) on this user's Windows system using PowerShell:
- Do not call script command aliases directly if they map to `.ps1` scripts (e.g., do not write `npm install`, `npx create-vite`, or `git-lfs`).
- Instead, always invoke the Command Prompt executable version explicitly by appending the `.cmd` extension (e.g., use `npm.cmd install`, `npx.cmd -y create-vite`).
