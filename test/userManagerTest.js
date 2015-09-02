/* global describe, it, before, beforeEach, after, afterEach*/
/* global require, module, process */
'use strict';

var a127 = require('a127-magic');
var manager = require('../lib/userManager');
var debug = process.env.DEBUG === true;
var expect = require('expect');

describe("Volos-Redis account manager", function() {
    var redis = require('redis');
    var client;

    before("Setup database", function(done) {
        a127.config.load(null, function(swagger) {
            if (debug) {
                console.log("Loaded config file");
            }
            var host = swagger['redis-host'];
            var port = swagger['redis-port'];
            var db = swagger['redis-db'];
            if (debug) {
                console.log('Deleting data from Redis DB %d on %s:%d', db, host, port);
            }
            client = redis.createClient(port, host);
            //Make sure we're connected before proceeding
            client.on('connect', function () {
                client.select(db, function (err, result) {
                    if (!result) {
                        throw new Error("Could not select TestDB");
                    }
                    //Wipe the DB!
                    client.flushdb();
                    client.quit();
                    console.log('Database %d deleted.', db);
                    done();
                });
            });
        });
    });

    it("creates a new developer", function() {
        var dev = {
            firstName: "Cayle",
            lastName: "Sharrock",
            email: "cayle@nimbustech.biz"
        };
        return manager.createDeveloper(dev).then(function(details) {
            expect(details.firstName).toEqual("Cayle");
            expect(details.lastName).toEqual("Sharrock");
            expect(details.email).toEqual("cayle@nimbustech.biz");
            expect(details.id).toBeDefined;
            expect(details.uuid).toBeDefined;
        });
    });

    it("fails when Creating an existing developer", function() {
        var dev = {
            firstName: "Cayle",
            lastName: "Sharrock",
            email: "cayle@nimbustech.biz"
        };
        return manager.createDeveloper(dev).then(function(result) {
            console.log(result);
            throw new Error('False positive');
        }).catch(function(err) {
            expect(err.statusCode).toEqual(409);
        });
    });

    var devID, appID;

    it("fetches an existing developer", function() {
        return manager.getDeveloper('cayle@nimbustech.biz').then(function (details) {
            expect(details.firstName).toEqual("Cayle");
            expect(details.lastName).toEqual("Sharrock");
            expect(details.email).toEqual("cayle@nimbustech.biz");
            expect(details.id).toBeDefined;
            expect(details.uuid).toBeDefined;
            devID = details.id;
        });
    });

    it("creates an application", function() {
        //console.log('devID:', devID);
        var appDetails = {
            name: 'TestApplication',
            developerId: devID.toString('binary')
        };
        return manager.createApplication(appDetails).then(function (details) {
            expect(details.name).toEqual('TestApplication');
            expect(details.developerId).toEqual(devID);
            appID = details.id;
        });
    });

    it("fetches an application", function() {
        //console.log('devID:', devID);
        return manager.getApplication(appID).then(function (details) {
            expect(details.name).toEqual('TestApplication');
            expect(details.developerId).toEqual(devID);
            expect(details.id).toEqual(appID);
        });
    });

    it("fetches a developer application", function() {
        return manager.getDeveloperApp('cayle@nimbustech.biz','TestApplication').then(function (details) {
            expect(details.name).toEqual('TestApplication');
            expect(details.developerId).toEqual(devID);
            expect(details.id).toEqual(appID);
        });
    });

    it("deletes an existing developer", function() {
        return manager.deleteDeveloper('cayle@nimbustech.biz').then(function (result) {
            expect(result).toNotBe(null);
        });
    });

    it("fails when trying to fetch a non-existent developer", function() {
        return manager.getDeveloper('cayle@nimbustech.biz').then(function(result) {
            console.log(result);
            throw new Error('False positive');
        }).catch(function(err) {
            expect(err.statusCode).toEqual(404);
        });
    });

    it("deletes applications when a user is deleted", function() {
        return manager.getApplication(appID).then(function(result) {
            console.log(result);
            throw new Error('False positive');
        }).catch(function(err) {
            expect(err.statusCode).toEqual(404);
        });
    });

});
