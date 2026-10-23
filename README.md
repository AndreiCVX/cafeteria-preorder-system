# Cafeteria Pre-order System: Stage 3 of 4 (Staff: Menu Management and Order Queue)

Midterm Project, Campus System Round 1 (Node.js + Express + EJS + MySQL/XAMPP).
This folder is a complete, runnable snapshot of the project at the end of stage 3.

## What works in this stage
- Everything from stage 2
- Staff: add, edit, delete, sold-out toggle for menu items; order queue; status steps pending > preparing > ready > completed
- Full customer-to-staff flow: place an order, staff prepares it, customer sees the new status
- Staff and admin land on `/staff/orders` after login

## Not built yet (arrives in the next stages)
- Admin user management and sales report (stage 4)

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
