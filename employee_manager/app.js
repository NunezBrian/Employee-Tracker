const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    });

    await mainMenu(connection);
};

async function mainMenu(connection) {
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all departments':
            await viewDepartments(connection);
            break;
        case 'View all roles':
            await viewRoles(connection);
            break;
        case 'View all employees':
            await viewEmployees(connection);
            break;
        case 'Add a department':
            await addDepartment(connection);
            break;
        case 'Add a role':
            await addRole(connection);
            break;
        case 'Add an employee':
            await addEmployee(connection);
            break;
        case 'Update an employee role':
            await updateEmployeeRole(connection);
            break;
        case 'Exit':
            await connection.end();
            break;
    }

    if (action !== 'Exit') {
        await mainMenu(connection);
    }
};

async function addEmployee(connection) {
    const [roles] = await connection.query(`SELECT * FROM role`);
    const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
    }));

    const [employees] = await connection.query(`SELECT * FROM employee`);
    const managerChoices = employees.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:"
        },
        {
            name: 'role_id',
            type: 'list',
            message: "Select the employee's role:",
            choices: roleChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: "Select the employee's manager:",
            choices: managerChoices
        }
    ]);

    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    await connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
}


async function viewDepartments(connection) {
    const query = `SELECT * FROM department`;
    const [departments] = await connection.query(query);
    console.table(departments);
};

async function addDepartment(connection) {
    const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    });

    const query = `INSERT INTO department (name) VALUES (?)`;
    await connection.query(query, [name]);
    console.log(`Added ${name} to departments`);
};

async function viewRoles(connection) {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON role.department_id = department.id`;
    const [roles] = await connection.query(query);
    console.table(roles);
};

async function viewEmployees(connection) {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    const [employees] = await connection.query(query);
    console.table(employees);
};

async function addRole(connection) {
    const [departments] = await connection.query(`SELECT * FROM department`);
    const departmentChoices = departments.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const answers = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the name of the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role:'
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departmentChoices
        }
    ]);

    const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    await connection.query(query, [answers.title, answers.salary, answers.department_id]);
    console.log(`Added ${answers.title} role to the database`);
};

async function updateEmployeeRole(connection) {
    const [employees] = await connection.query(`SELECT * FROM employee`);
    const employeeChoices = employees.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));

    const [roles] = await connection.query(`SELECT * FROM role`);
    const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
    }));

    const answers = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the new role:',
            choices: roleChoices
        }
    ]);

    const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
    await connection.query(query, [answers.role_id, answers.employee_id]);
    console.log(`Updated employee's role in the database`);
}

main().catch(err => console.error(err));
