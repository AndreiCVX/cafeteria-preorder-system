# Cafeteria Pre-order System

Midterm Project – Campus System, Round 1 (Node.js + Express)

## Project Description
The Cafeteria Pre-order System lets students and staff browse the campus cafeteria menu, place food orders ahead of time, and pick them up at a chosen time. Cafeteria staff manage the menu and process the order queue, and an administrator manages user accounts and views sales summaries. It reduces long queues during breaks and gives the cafeteria advance knowledge of demand.

## Team Members
| Member | Primary responsibility |
|---|---|
| Jon Andrei | Stage 1: project setup, database users table, registration, login, logout, roles |
| Martina | Stage 2: customer menu, cart, placing orders, order history |
| Alhea | Stage 3: staff menu management and order queue |
| Kiara | Stage 4: admin users, sales report, documentation |

## Assigned System
Cafeteria Pre-order System (paired with: [Other team's name])

## Features
- Registration, login, logout, and session management
- Role-based access control (Customer, Staff, Admin)
- Customer: browse and search the menu, build an order, choose a pickup time, view order history, cancel pending orders
- Staff: add, edit, delete, and toggle availability of menu items; view the orders queue; update order status (pending → preparing → ready → completed)
- Admin: manage users (change role, activate/deactivate) and view the sales summary report
- Input validation on every form with clear error messages
- Passwords hashed with bcrypt; all data stored in MySQL

## Technologies
Node.js, Express.js, EJS, MySQL (XAMPP), mysql2, express-session, bcrypt, express-validator, dotenv, Bootstrap 5, Git/GitHub

## Installation
1. Install [Node.js LTS](https://nodejs.org), [Git](https://git-scm.com), and [XAMPP](https://www.apachefriends.org).
2. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd cafeteria-preorder
   npm install
   ```

## Configuration
Copy `.env.example` to `.env` and edit the values:
```bash
cp .env.example .env      # on Windows: copy .env.example .env
```
| Variable | Description |
|---|---|
| `PORT` | Port for the web server (default 3000) |
| `DB_HOST`, `DB_PORT` | MySQL host and port (XAMPP default: localhost, 3306) |
| `DB_USER`, `DB_PASSWORD` | MySQL credentials (XAMPP default: `root`, empty password) |
| `DB_NAME` | Database name (`cafeteria_preorder`) |
| `SESSION_SECRET` | Long random string used to sign session cookies |
| `OPEN_HOUR`, `CLOSE_HOUR` | Cafeteria pickup hours (24h clock) |

> `.env` is listed in `.gitignore` and must never be committed.

## Database Setup
1. Open the XAMPP Control Panel and **start MySQL** (Apache is not needed).
2. Open `http://localhost/phpmyadmin`, go to the **Import** tab, choose `schema.sql`, and click **Go**. This creates the `cafeteria_preorder` database, its tables, and sample menu items.
3. Create the test accounts (passwords are hashed with bcrypt):
   ```bash
   npm run seed
   ```

## How to Run
```bash
npm start          # production
npm run dev        # auto-restart on file changes (nodemon)
```
Open `http://localhost:3000`.

## User Accounts (for testing)
| Role | Email | Password |
|---|---|---|
| Admin | admin@cafeteria.test | Admin123! |
| Staff | staff@cafeteria.test | Staff123! |
| Customer | customer@cafeteria.test | Customer123! |

New users who register are always created as **Customer**. Only an admin can change roles.

## Project Structure
```
cafeteria-preorder/
├── config/          # database connection
├── controllers/     # request handling and business logic
├── middleware/      # login check, role check, validation rules
├── models/          # database queries
├── routes/          # URL → controller mapping
├── views/           # EJS templates (auth, customer, staff, admin, partials)
├── public/          # CSS and client-side assets
├── scripts/seed.js  # creates test accounts
├── docs/            # requirements document and test checklist
├── schema.sql       # database schema + sample menu data
├── app.js           # application entry point
├── .env.example
└── LICENSE
```

## Known Limitations
- Payment is made at pickup; there is no online payment.
- No CSRF tokens on forms (a possible future improvement: `csurf`-style protection).
- No email notifications or password reset.
- Sessions are stored in memory, so users are logged out when the server restarts.
- Single cafeteria only.
- Bootstrap is loaded from a CDN, so the pages need an internet connection for styling.

## AI Assistance Disclosure
This project used **Claude (Anthropic)** as an AI assistant for [describe exactly what: e.g., drafting the requirements document template, generating starter code for the routes/controllers/views, suggesting the database schema]. The team reviewed, tested, and modified the generated code, and every member can explain how it works. [Edit this section to honestly reflect what your team actually used, including any other tools such as GitHub Copilot or ChatGPT.]

## License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file.
