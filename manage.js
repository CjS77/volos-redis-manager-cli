/* Copyright 2015 Nimbus Technologies Pty. Ltd. 
 
   Licensed under the Apache License, Version 2.0 (the "License"); 
   you may not use this file except in compliance with the License. 
   You may obtain a copy of the License at 
 
       http://www.apache.org/licenses/LICENSE-2.0 

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/* global require, module, process */
'use strict';

var program = require('commander');
var inq = require('inquirer');
var manager = require('./lib/userManager');

program.version('0.0.1', null);

program.command('addDev')
    .description('Add a new developer account')
    .action(createDeveloperCommand);

program.command('getDev [id]')
    .description('Get developer account info')
    .action(fetchDeveloperCommand);

program.command('delDev [id]')
    .description('Delete developer account info')
    .action(deleteDeveloperCommand);

program.command('addApp')
    .description('Add a new Application')
    .action(createApplicationCommand);

program.command('getDevApp [email] [appName]')
    .description('Get an application based on user email and Application name')
    .action(getDeveloperAppCommand);

program.parse(process.argv);

function printDeveloper(developer) {
    console.log("Name: ", developer.firstName, developer.lastName);
    console.log("id: ", developer.id);
    console.log("uuid: ", developer.uuid);
    console.log("email: ", developer.email);
    console.log("userName: ", developer.userName);
    console.log("status: ", developer.status);
    console.log("Attributes: ", developer.attributes);
}

function createDeveloperCommand() {
    var questions = [
        { name: 'firstName', message: 'Enter first name:' },
        { name: 'lastName', message: 'Enter last name:' },
        { name: 'email', message: 'Enter email:' },
        { name: 'userName', message: 'Enter user name:' }
    ];
    inq.prompt(questions, function(answers) {
        manager.createDeveloper(answers).then(function(developer) {
            console.log("Developer created.");
            printDeveloper(developer);
            process.exit(0);
        }).fail(function(err) {
            console.log("Error creating developer account.");
            console.log("Reason: ", err);
            process.exit(1);
        });
    });
}

function resolveDeveloper(promise) {
    promise.then(function (developer) {
        console.log("Developer details:");
        printDeveloper(developer);
        process.exit(0);
    }).fail(function (err) {
        console.log("Error fetching developer account.");
        console.log("Reason: ", err);
        process.exit(1);
    });
}

function fetchDeveloperCommand(id) {
    if (id) {
        resolveDeveloper(manager.getDeveloper(id));
    } else {
        var questions = [
            {name: 'uuid', message: 'Enter user email or uuid:'}
        ];
        inq.prompt(questions, function (answers) {
            resolveDeveloper(manager.getDeveloper(answers.uuid));
        });
    }
}

function getDeveloperAppCommand(email, appName) {
    if (email && appName) {
        resolveDeveloperApp(manager.getDeveloperApp(email, appName));
    } else {
        var questions = [
            {name: 'email', message: 'Enter user email:', default: email},
            {name: 'appName', message: 'Enter application name:', default: appName}
        ];
        inq.prompt(questions, function (answers) {
            resolveDeveloperApp(manager.getDeveloperApp(answers.email, answers.appName));
        });
    }
}

function resolveDeveloperApp(promise) {
    promise.then(function (app) {
        console.log("Application details:");
        printApplication(app);
        process.exit(0);
    }).fail(function (err) {
        console.log("Error fetching application.");
        console.log("Reason: ", err);
        process.exit(1);
    });
}

function resolveDeletion(promise) {
    promise.then(function() {
        console.log('Developer account has been deleted');
        process.exit(0);
    }).fail(function(err) {
        console.log('Error deleting developer: ',err);
        process.exit(1);
    })
}

function deleteDeveloperCommand(id) {
    if (id) {
        resolveDeletion(manager.deleteDeveloper(id));
    } else {
        var questions = [
            {name: 'uuid', message: 'Enter user email or uuid:'}
        ];
        inq.prompt(questions, function (answers) {
            resolveDeletion(manager.deleteDeveloper(answers.uuid));
        });
    }
}

function printApplication(app) {
    console.log("Name: ", app.name);
    console.log("id: ", app.id);
    console.log("status: ", app.status);
    console.log("callbackUrl: ", app.callbackUrl);
    console.log("developerId: ", app.developerId);
    console.log("attributes: ", app.attributes);
    console.log("credentials: ", app.credentials);
    console.log("defaultScope: ", app.defaultScope);
    console.log("scopes: ", app.scopes);
}

function createApplicationCommand() {
    var questions = [
        { name: 'name', message: 'Enter application name:' },
        { name: 'scopes', message: 'Enter scopes:' },
        { name: 'developerId', message: 'Enter developerId:' }
    ];
    inq.prompt(questions, function(answers) {
        manager.createApplication(answers).then(function(app) {
            console.log("Application created.");
            printApplication(app);
            process.exit(0);
        }).fail(function(err) {
            console.log("Error creating Application.");
            console.log("Reason: ", err);
            process.exit(1);
        });
    });
}
