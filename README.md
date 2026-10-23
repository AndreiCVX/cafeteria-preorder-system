# Cafeteria Pre-order System: Stage 1 of 4 (Foundation and Authentication)

Midterm Project, Campus System Round 1 (Node.js + Express + EJS + MySQL/XAMPP).
This folder is a complete, runnable snapshot of the project at the end of stage 1.

## What works in this stage
- Register (always a customer), log in, log out, sessions
- Role-based access middleware (`requireLogin`, `requireRole`)
- Layout, navbar, flash messages, 404/403/500 pages
- After login every role lands on a simple welcome page

## Not built yet (arrives in the next stages)
- Menu, cart and orders (stage 2)
- Staff pages (stage 3)
- Admin pages, final docs (stage 4)

## Run it
1. Start **MySQL** in the XAMPP Control Panel.
2. Import `schema.sql` in phpMyAdmin (Import tab). Import it once. (Importing twice duplicates the sample menu rows once stage 2 is installed; to start over, drop the `cafeteria_preorder` database first.)
3. In this folder:
   ```bash
   npm install
   copy .env.example .env      # macOS/Linux: cp .env.example .env
   npm run seed
   npm start
   ```
4. Open http://localhost:3000

## Test accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@cafeteria.test | Admin123! |
| Staff | staff@cafeteria.test | Staff123! |
| Customer | customer@cafeteria.test | Customer123! |
