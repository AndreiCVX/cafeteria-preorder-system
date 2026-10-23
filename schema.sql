-- Cafeteria Pre-order System: database schema (MySQL / XAMPP)
-- Import via phpMyAdmin (Import tab) or: mysql -u root < schema.sql

CREATE DATABASE IF NOT EXISTS cafeteria_preorder
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafeteria_preorder;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  description  VARCHAR(255),
  category     VARCHAR(50) NOT NULL,
  price        DECIMAL(8,2) NOT NULL CHECK (price >= 0),
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  pickup_time DATETIME NOT NULL,
  status      ENUM('pending','preparing','ready','completed','cancelled')
              NOT NULL DEFAULT 'pending',
  total       DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes       VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity     INT NOT NULL CHECK (quantity > 0),
  unit_price   DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Sample menu data
INSERT INTO menu_items (name, description, category, price) VALUES
  ('Chicken Adobo Rice Meal', 'Adobo with steamed rice', 'Meals', 75.00),
  ('Pork Sinigang', 'Sour tamarind soup with rice', 'Meals', 80.00),
  ('Cheeseburger', 'Beef patty with cheese', 'Snacks', 55.00),
  ('French Fries', 'Crispy fries', 'Snacks', 40.00),
  ('Iced Tea', '16oz', 'Drinks', 25.00),
  ('Bottled Water', '500ml', 'Drinks', 15.00);

-- Create the admin and staff accounts through a seed script (seed.js) that uses
-- bcrypt, so no plain-text passwords are stored in this file.