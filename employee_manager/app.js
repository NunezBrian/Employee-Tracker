const inquirer = require('inquirer');
const db = require('./db');
const consoleTable = require('console.table');

async function main() {
    await mainMenu();
}

async function mainMenu() {
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
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            break;
    }

    if (action !== 'Exit') {
        await mainMenu();
    }
}

async function viewDepartments() {
    const departments = await db.getDepartments();
    console.table(departments);
}

async function viewRoles() {
    const roles = await db.getRoles();
    console.table(roles);
}

async function viewEmployees() {
    const employees = await db.getEmployees();
    console.table(employees);
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    });

    await db.addDepartment(name);
    console.log(`Added ${name} to departments`);
}

async function addRole() {
    const departments = await db.getDepartments();
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

    await db.addRole(answers.title, answers.salary, answers.department_id);
    console.log(`Added ${answers.title} role to the database`);
}

async function addEmployee() {
    const roles = await db.getRoles();
    const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
    }));

    const employees = await db.getEmployees();
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

    await db.addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
    console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
}

async function updateEmployeeRole() {
    const employees = await db.getEmployees();
    const employeeChoices = employees.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));

    const roles = await db.getRoles();
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

    await db.updateEmployeeRole(answers.employee_id, answers.role_id);
    console.log(`Updated employee's role in the database`);
}

main().catch(err => console.error(err));
