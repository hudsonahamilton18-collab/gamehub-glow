# Set up GitHub sync for GameHub

## Goal
Get a shareable GitHub repository link for the GameHub project.

## Current state
The project code is currently only stored in Lovable's internal git storage. There is no GitHub repository connected yet.

## How GitHub sync works for Lovable projects
Lovable has a built-in two-way GitHub sync, but the connection must be initiated from the Lovable editor UI (I cannot create the repo through code).

## Steps for you to follow
1. Open the Lovable editor for this project.
2. Click the **Plus (+)** menu in the chat input (bottom left).
3. Select **GitHub** → **Connect project**.
4. Authorize the Lovable GitHub App if prompted.
5. Choose the GitHub account/organization where the repo should live.
6. Click **Create Repository**.
7. Lovable will push the current codebase and show you the repo URL.

## What happens next
Once connected, every change made in Lovable will auto-push to GitHub, and the repo link will be available in the editor. You can then share that link freely.

## Notes
- Only one GitHub account can be linked to your Lovable account at a time.
- The project is already in a clean, buildable state, so there are no code changes needed before syncing.
