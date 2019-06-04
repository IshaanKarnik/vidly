let username        = '';
let password        = '';
let database        = '';
let jwtPrivateKey   = '';

username            = config.get('dbUser');
password            = config.get('dbPassword');
database            = config.get('dbName');
jwtPrivateKey       = config.get('jwtPrivateKey');


module.exports = {
    username: username,
    password: password,
    database: database,
    jwtPrivateKey: jwtPrivateKey
};