# Employee-Tracker

## Description

A command-line application to manage a company's employee database using Node.js, Inquirer, and MySQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository_url>
    ```

2. Navigate to the project directory:
    ```bash
    cd employee_manager
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Set up the MySQL database:

    - Ensure you have MySQL installed and running.
    - Create a database named `company_db`.
    - Run the schema and seed files to create and populate the tables:
        ```bash
        mysql -u root -p < db/schema.sql
        mysql -u root -p < db/seeds.sql
        ```

5. Update the database connection settings in `db/index.js` to match your MySQL configuration.

## Usage

1. Start the application:
    ```bash
    npm start
    ```

2. Follow the prompts to manage the employee database. The application supports the following operations:
    - View all departments
    - View all roles
    - View all employees
    - Add a department
    - Add a role
    - Add an employee
    - Update an employee role

## Database Schema

The database schema consists of the following tables:

- `department`
    - `id`: INT PRIMARY KEY AUTO_INCREMENT
    - `name`: VARCHAR(30) NOT NULL

- `role`
    - `id`: INT PRIMARY KEY AUTO_INCREMENT
    - `title`: VARCHAR(30) NOT NULL
    - `salary`: DECIMAL NOT NULL
    - `department_id`: INT,
    FOREIGN KEY (department_id) REFERENCES department(id)

- `employee`
    - `id`: INT PRIMARY KEY AUTO_INCREMENT
    - `first_name`: VARCHAR(30) NOT NULL
    - `last_name`: VARCHAR(30) NOT NULL
    - `role_id`: INT,
    FOREIGN KEY (role_id) REFERENCES role(id)
    - `manager_id`: INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id)

## License

This project is licensed under the ISC License. See the LICENSE file for details.

