/*    Copyright 2015 Nimbus Technologies Pty. Ltd. 
 
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

/* jshint node:true */
/* global require, module, process */
'use strict';

var ManagementProvider = require('volos-management-redis');
var a127 = require('a127-magic');
var Q = require('q');
var debug = process.env.DEBUG === true;

function init() {
    var deferred = Q.defer();
    a127.config.load(null, function(swagger) {
        if (debug) { console.log("Loaded config file"); }
        var config = {
            encryptionKey : swagger.apiEncryptionKey,
            host: swagger['redis-host'],
            port: swagger['redis-port'],
            db: swagger['redis-db']
        };
        return deferred.resolve(config);
    });
    return deferred.promise;
}

function modAccount(modFunc, arg) {
    var deferred = Q.defer();
    init().then(function(config) {
        var management = ManagementProvider.create(config);
        var func;
        //console.log("Calling", modFunc, 'with args: ', arg);
        //console.log("Function: ", func);
        if (arg instanceof Array) {
            func = management[modFunc].bind(management, arg[0], arg[1]);
        } else  {
            func = management[modFunc].bind(management, arg);
        }
        func(function (err, result) {
            //console.log('Callback: \nErr: ',err,'\n Result: ', result);
            if (err) {
                return deferred.reject(err);
            }
            return result? deferred.resolve(result) : deferred.resolve();
        });
    });
    return deferred.promise;
}

function createDeveloper(devDetails) {
    return modAccount('createDeveloper', devDetails);
}

function updateDeveloper(devDetails) {
    return modAccount('updateDeveloper', devDetails);
}

function getDeveloper(uuid) {
    return modAccount('getDeveloper', uuid);
}

function deleteDeveloper(uuid) {
    return modAccount('deleteDeveloper', uuid);
}

function createApplication(appDetails) {
    return modAccount('createApp', appDetails);
}

function updateApplication(appDetails) {
    return modAccount('updateApp', appDetails);
}

function getApplication(uuid) {
    return modAccount('getApp', uuid);
}

function deleteApplication(uuid) {
    return modAccount('deleteApp', uuid);
}

function getDeveloperApp(email, appName) {
    return modAccount('getDeveloperApp', [email, appName]);
}

module.exports = {
    createDeveloper: createDeveloper,
    updateDeveloper: updateDeveloper,
    deleteDeveloper: deleteDeveloper,
    getDeveloper: getDeveloper,
    createApplication: createApplication,
    updateApplication: updateApplication,
    getApplication: getApplication,
    deleteApplication: deleteApplication,
    getDeveloperApp: getDeveloperApp
};





