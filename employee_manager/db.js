const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'password',
    database: 'company_db'
});

async function getDepartments() {
    const [rows] = await db.query('SELECT * FROM department');
    return rows;
}

async function getRoles() {
    const [rows] = await db.query(`
        SELECT role.id, role.title, role.salary, department.name AS department 
        FROM role 
        JOIN department ON role.department_id = department.id
    `);
    return rows;
}

async function getEmployees() {
    const [rows] = await db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    return rows;
}

async function addDepartment(name) {
    await db.query('INSERT INTO department (name) VALUES (?)', [name]);
}

async function addRole(title, salary, department_id) {
    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
}

async function addEmployee(first_name, last_name, role_id, manager_id) {
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
        [first_name, last_name, role_id, manager_id]);
}

async function updateEmployeeRole(employee_id, role_id) {
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee_id]);
}

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
