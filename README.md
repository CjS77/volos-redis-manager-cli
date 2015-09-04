[![build status](https://ci.gitlab.com/projects/6937/status.png?ref=master)](https://ci.gitlab.com/projects/6937?ref=master)

# Volos-Redis-Manager-CLI

A command-line interface to the Volos Redis Management tool.

The Volos tools provide a redis implementation to handle token authorisation, quotas etc. To use it, one must create
developer and application accounts in the keystore. This had to be done programmatically.. until now. 

Now you can create Volos credentials from the command line using this handy little tool.

## Installation

    npm install volos-redis-manager-cli
    
## Run the tests

**WARNING** The tests clear out the redis database so that each test batch starts with a fresh database.

Redis must be running. If it is listening on the default port,
     
     npm test
     
will run the tests. Otherwise specify the redis in the `config/default.yaml` file:
     
     apiEncryptionKey: abcdefg123456
     redis-host: 127.0.0.1
     redis-port: 30876
     redis-db: 8

**WARNING** The tests clear out the redis database so that each test batch starts with a fresh database. To protect existing
data specify the redis DB to use with the `REDIS_TESTDB` variable, or set the corresponsind value in the `config/default.yaml` file.

You can also test against a different a127 app by specifying `A127_APPROOT`, but this shouldn't make any difference -- the 
specific app data is irrelevant for the tests.

## Usage

Usage: [node-env options] node manage.js [options] [command]

Commands:

| Command | Parameters | Description |
|---------|------------|-------------|
|addDev   |            |  Add a new developer account |
|getDev   | [id]       |  Get developer account info
|delDev   | [id]       |  Delete developer account info |
|addApp   |            |  Add a new Application |
|getDevApp| [email] [appName]|  Get an application based on user email and Application name |

Options:

| Short | Long     | Description |
|-------|----------|-------------|
|    -h | --help   |  output usage information |
|   -V  | --version |  output the version number |

All parameters following the commands are optional. If they are omitted, the user will be prompted to supply the data.
If you are not running the module from your swagger app's root directory, you can specify it with the `A127_ROOT` environment
variable.

