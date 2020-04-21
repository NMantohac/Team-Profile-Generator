const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const util = require("util");
const fs = require("fs");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

function buildHTML() {
    writeFileAsync(outputPath, render(employees), "utf-8")
        .then(response => {
            console.log("HTML succesfully rendered!")
        })
        .catch(err => {
            console.log(err);
        })
}

const createTeam = async () => {
    try {
        await inquirer.prompt([
            {
                message: "Enter Team Member's Name:",
                name: "name"
            },
            {
                type: "list",
                name: "role",
                message: "Select Team Member's Role:",
                choices: ["Manager", "Engineer", "Intern"]
            },
            {
                message: "Enter Team Member's ID:",
                name: "id"
            },
            {
                message: "Enter Team Member's Email Address:",
                name: "email"
            }])

        .then(({ name, role, id, email }) => {
            let roleInfo = "";
        
            if (role === "Manager") {
                roleInfo = "Office Number";
            } else if (role === "Engineer") {
                roleInfo = "GitHub Username";
            } else {
                roleInfo = "School Name";
            }
        
        inquirer.prompt([{
                message: `Enter Team Member's ${roleInfo}:`,
                name: "roleInfo"
            },
            {
                type: "list",
                name: "addMember",
                message: "Would you like to add more team members?",
                choices: ["Yes", "No"]
            }])
            
        .then(({ roleInfo, addMember }) => {
            let newMember;
        
            if (role === "Manager") {
                newMember = new Manager(name, id, email, roleInfo);
            } else if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else {
                newMember = new Intern(name, id, email, roleInfo);
            }
                
            employees.push(newMember);
        
            if (addMember === "Yes") {
                createTeam();
            } else {
                buildHTML();
            }   
            });
        });

    } catch(err) {
        console.log(err);
    }
}

createTeam();