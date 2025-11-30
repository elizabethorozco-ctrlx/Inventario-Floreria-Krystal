
-- MySQL schema for Floreria Krystal inventory
CREATE DATABASE IF NOT EXISTS floreria_krystal;
USE floreria_krystal;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255),
  categoria VARCHAR(120),
  precio DECIMAL(10,2),
  stock INT,
  codigo_barras VARCHAR(120),
  localidad VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS salidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productoId BIGINT,
  cantidad INT,
  fecha DATETIME
);
