# GitHub Issues (copy each into GitHub)

Suggested labels: `backend`, `frontend`, `database`, `auth`, `testing`, `docs`
Board columns: BACKLOG · TODO · IN PROGRESS · REVIEW · DONE
Each issue: title, description, assignee, expected result.
Use `Closes #N` in your PR so commits/PRs link to issues.

| # | Title | Assignee | Branch | Description / Expected result |
|---|---|---|---|---|
| 1 | docs: write requirements document | All | `docs/requirements` | Users, stakeholders, functional/non-functional requirements, use cases are documented in `docs/`. |
| 2 | chore: initialize repo, .gitignore, .env.example, LICENSE | Member 1 | `chore/project-setup` | Repo has structure, MIT license, `.env` ignored, `.env.example` provided. |
| 3 | feat: database schema | Member 3 | `feature/database` | `schema.sql` creates users, menu_items, orders, order_items with foreign keys; connection pool works. |
| 4 | feat: seed script for test accounts | Member 3 | `feature/database` | `npm run seed` creates admin, staff, customer with hashed passwords. |
| 5 | feat: user registration with validation | Member 3 | `feature/login` | Validates name, email, password; rejects duplicate email; stores bcrypt hash. |
| 6 | feat: login, session, logout | Member 3 | `feature/login` | Correct login creates session; wrong/empty credentials show errors; logout destroys session. |
| 7 | feat: role-based access control middleware | Member 3 | `feature/access-control` | `requireLogin` and `requireRole` block unauthorized users; typing admin/staff URLs as customer returns 403. |
| 8 | feat: base layout, navbar, flash messages | Member 2 | `feature/ui-layout` | Header/footer partials, role-aware navbar, responsive Bootstrap layout. |
| 9 | feat: login and register pages | Member 2 | `feature/ui-layout` | Forms render, show validation errors, keep entered values. |
| 10 | feat: customer menu page with search/filter | Member 2 | `feature/customer-pages` | Lists available items; search by name and filter by category. |
| 11 | feat: cart (session) | Member 1 | `feature/order-processing` | Add/remove items with quantity validation (1–20). |
| 12 | feat: place pre-order with pickup time | Member 1 | `feature/order-processing` | Validates pickup time (future, within hours); stores order + items in a transaction. |
| 13 | feat: customer order history and cancel | Member 2 | `feature/customer-pages` | Customer sees own orders; can cancel only own pending orders. |
| 14 | feat: staff menu management (CRUD + availability) | Member 1 | `feature/menu-management` | Add, edit, delete, toggle sold out; validation; deleting an ordered item shows a friendly error. |
| 15 | feat: staff orders queue and status updates | Member 1 | `feature/order-processing` | Orders sorted by pickup time; only valid status transitions allowed. |
| 16 | feat: staff pages UI | Member 2 | `feature/staff-pages` | Menu management and queue pages usable and consistent. |
| 17 | feat: admin user management | Member 3 | `feature/admin-users` | Admin lists users, changes roles, activates/deactivates; cannot modify own account. |
| 18 | feat: admin sales report | Member 1 | `feature/reports` | Total orders, total sales, top items for a date range; invalid range rejected. |
| 19 | test: authentication tests | Member 3 | `test/auth` | Run section 21 checklist for login, logout, unauthorized access; record results. |
| 20 | test: forms, CRUD, and role bypass tests | Member 3 | `test/validation` | Valid/empty/invalid/duplicate input tested for every form; each role tested. |
| 21 | docs: README with setup, accounts, AI disclosure | Member 2 | `docs/readme` | README includes every section required by the project spec. |
| 22 | chore: prepare showcase and counterpart critique | All | — | Demo script done; critique with observation, evidence, impact, recommendation. |

## Suggested conventional commit messages
```
chore: initialize project structure and gitignore
docs: add requirements document
feat: add database schema and connection pool
feat: implement user registration with validation
feat: implement login and logout with sessions
feat: add role-based access middleware
feat: add customer menu page with search
feat: add cart and pre-order placement
fix: prevent ordering unavailable menu items
feat: add staff order queue with status transitions
feat: add admin user management
test: add login and role access test cases
docs: complete README and AI disclosure
refactor: move order queries into orderModel
```
