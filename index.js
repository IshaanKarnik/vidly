const helmet            = require('helmet');
const morgan            = require('morgan');
const express           = require('express');
const config            = require('config');
const mongoose          = require('mongoose');
const argv              = require('yargs').argv;
const auth_router       = require('./routes/auth');
const users_router      = require('./routes/users');
const genres_router     = require('./routes/genres');
const movies_router     = require('./routes/movies');
const rentals_router    = require('./routes/rentals');
const customers_router  = require('./routes/customers');

require('express-async-errors');
//require('config')();
//Enter UserName : --username (or -u) and Password : --password (or -p) --database (or -d)
//eg : node index.js --username=xyz --password=abc --database=123 --jwtPrivateKey=PrivateKey
//eg : node index.js -u xyz -p abc -d 123 -j PrivateKey
//Username and Password are URL encoded in code

const app           = express();

app.use(express.json());
app.use(helmet());
if(app.get('env') === 'development')    app.use(morgan('short'));
app.use('/api/auth', auth_router);
app.use('/api/users', users_router);
app.use('/api/genres', genres_router);
app.use('/api/movies', movies_router);
app.use('/api/rentals', rentals_router);
app.use('/api/customers', customers_router);

const port_no = process.env.PORT || 3001;
app.listen(port_no, () => console.log(`Listening on port number ${port_no}`));

/*if(argv.username || argv.u)
    globalConfig.username = argv.username || argv.u;
if(argv.password || argv.p)
    globalConfig.password = argv.password || argv.p;  
if(argv.database || argv.d)
    globalConfig.database = argv.database || argv.d;
if(argv.jwtPrivateKey || argv.j)
    globalConfig.jwtPrivateKey = argv.database || argv.d;*/


const connection_string = `mongodb+srv://${config.get('dbUser')}:${config.get('dbPassword')}@cluster0-waqja.mongodb.net/test?retryWrites=true`;
mongoose.connect(connection_string, {
    useNewUrlParser     : true,
    autoReconnect       : true,
    reconnectTries      : Number.MAX_VALUE,
    reconnectInterval   : 500,
    dbName              : config.get('dbName')
})
.then(() => {console.log('Connected to Mongo Atlas');})
.catch((err) => {console.log('Unable to connect to Mongo Atlas.\n' + err);});

//console.log(database);