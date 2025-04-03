CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- delete all todos if user is deleted
);

CREATE TABLE shared_todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE, -- delete all shared_todos if todo is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- delete all shared_todos if user is deleted
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE -- delete all shared_todos if user is deleted 
);

INSERT INTO users (name, email, password) VALUES ('Roberto', 'roberto@example.com', 'password1');
INSERT INTO users (name, email, password) VALUES ('Juan', 'juan@example.com', 'password2');
INSERT INTO users (name, email, password) VALUES ('Pedro', 'pedro@example.com', 'password3');

INSERT INTO todos (title, user_id)
VALUES
("Attend team meeting", 1),
("Read 30 pages of book", 1),
("Ride bike to the park", 1),
("Cook dinner for family", 1),
("Practice yoga", 1),
("Listen to a podcast", 1),
("Clean the house", 2),
("Get 8 hours of sleep", 2),
("Go for a morning run", 2),
("Go grocery shopping", 2);