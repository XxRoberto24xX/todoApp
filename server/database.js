// Description: This file contains the database connection and functions to interact with the database.

import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();



/* DATABASE CONECTION */
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();



/* FUNTIONS TO MAKE REQUESTS TO THE DATABASE */

//Gets a todo using the id
export async function getTodoById(id) {
    const [row] = await pool.query(                 
        `SELECT * FROM todos WHERE user_id = ?`,
        [id]);

    return row;
}

//Gets all the todos a user has
export async function getUserTodos(user_id){
    const [rows] = await pool.query(
        `
        SELECT todos .* , shared_todos. shared_with_id 
        FROM todos 
        LEFT JOIN shared_todos ON todos. id = shared_todos.todo_id 
        WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
        `,
        [user_id, user_id]
    );

    return rows;
}

//Gets an specific todo from the shared todos list
export async function getShareTodoById(id){
    const [row] = await pool.query(                 
        `SELECT * FROM shared_todos WHERE todo_id = ?`,
        [id]);

    return row;
}

//Gets a user information using his id
export async function getUserByid(user_id) {
    const [row] = await pool.query(                 
        `SELECT * FROM users WHERE id = ?`,
        [user_id]);

    return row;
}

//Gets a user information using his email
export async function getUserByEmail(email) {
    const [row] = await pool.query(                 
        `SELECT * FROM users WHERE email = ?`,
        [email]);

    return row;
}

//Creates a todo using the user id and the title of the todo
export async function createTodo(user_id, title) {
    const [result] = await pool.query(                 
        `
        INSERT INTO todos (user_id, title)
        VALUES (?, ?)
        `,
        [user_id, title]);
    
    const todoId = result.insertId;
    return getTodoById(todoId);
}

//Deletes a todo using the id of the todo
export async function deleteTodo(id) {
    const [result] = await pool.query(                 
        `
        DELETE FROM todos WHERE id = ?
        `,
        [id]);

    return result;
}

//Changes de todo completion status using the id of the todo and setting the contrary value to the current one
export async function toggleComplete(id, value) {
    const newValue = value === true ? "TRUE" : "FALSE";
    const [result] = await pool.query(                 
        `
        UPDATE todos 
        SET completed = ${newValue} 
        WHERE id = ?
        `,
        [id]);

    return result;
}

//Shares a todo with another user using the todo id, the user id and the shared with user id
export async function shareTodo(todo_id, user_id, shared_with_id) {
    const [result] = await pool.query(                 
        `
        INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
        VALUES (?, ?, ?)
        `,
        [todo_id, user_id, shared_with_id]);

    return result.insertId;
}