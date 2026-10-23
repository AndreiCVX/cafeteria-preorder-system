# Cafeteria Pre-order System: Stage 2 of 4 (Customer Ordering)

Midterm Project, Campus System Round 1 (Node.js + Express + EJS + MySQL/XAMPP).
This folder is a complete, runnable snapshot of the project at the end of stage 2.

## What works in this stage
- Everything from stage 1
- Customer: browse and search the menu, add to cart, choose a pickup time, place an order, order history, cancel a pending order
- Customers land on `/menu` after login

## Not built yet (arrives in the next stages)
- Staff menu management and order queue (stage 3). Staff and admin still see the welcome page.
- Admin pages (stage 4)

## Run it
1. Start **MySQL** in the XAMPP Control Panel.
2. Import `schema.sql` in phpMyAdmin (Import tab). If you already imported the stage 1 schema, import this one again: existing tables are kept and the new tables and sample menu are added. Importing it a second time would duplicate the sample menu rows, so import it only once.
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
