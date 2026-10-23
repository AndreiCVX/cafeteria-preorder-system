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

-- Create the admin and staff accounts through a seed script (seed.js) that uses
-- bcrypt, so no plain-text passwords are stored in this file.