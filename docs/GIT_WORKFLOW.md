# Git and GitHub workflow cheat sheet

## One-time setup (Member 1)
```bash
git init
git branch -M main
git remote add origin <repo-url>
git add .
git commit -m "chore: initialize project structure"
git push -u origin main
```
On GitHub: Settings → Collaborators → add Members 2 and 3 and the instructor.
Settings → Branches → add a rule for `main` requiring a pull request with 1 approval.
Projects → New project → Board → columns BACKLOG, TODO, IN PROGRESS, REVIEW, DONE.

## Everyone else
```bash
git clone <repo-url>
cd cafeteria-preorder
npm install
cp .env.example .env
```

## For every feature
```bash
git checkout main
git pull
git checkout -b feature/login          # one branch per feature
# ...write code...
git add .
git commit -m "feat: implement user login"     # small, frequent commits
git push -u origin feature/login
```
Then on GitHub:
1. Open a Pull Request (the template fills in automatically).
2. Link the issue with `Closes #6`.
3. A **different** teammate reviews: read the changes, run the branch locally, and leave specific comments (at least one real observation per PR).
4. Author fixes comments, reviewer approves, then Merge.
5. Move the issue card to DONE.

## Tips
- Commit as you go; do not upload everything in one commit.
- Every member must have commits, PRs, and reviews.
- Never commit `.env`. If you do, change the secrets and remove it from history.
- Write review comments like: "In `placeOrder`, notes length is validated, but quantity from the form is not rechecked server-side. Please add it."
