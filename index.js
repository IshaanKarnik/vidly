const helmet            = require('helmet');
const morgan            = require('morgan');
const express           = require('express');
const mongoose          = require('mongoose');
const argv              = require('yargs').argv;
const users_router     = require('./routes/users');
const genres_router     = require('./routes/genres');
const movies_router     = require('./routes/movies');
const customers_router  = require('./routes/customers');

//Enter UserName : --username (or -u) and Password : --password (or -p) --database (or -d)
//eg : node index.js --username=xyz --password=abc --database=123
//eg : node index.js -u xyz -p abc -d 123
//Username and Password are URL encoded in code

const app           = express();

app.use(express.json());
app.use(helmet());
if(app.get('env') === 'development')    app.use(morgan('short'));
app.use('/api/users', users_router);
app.use('/api/genres', genres_router);
app.use('/api/movies', movies_router);
app.use('/api/customers', customers_router);

const port_no = process.env.PORT || 3001;
app.listen(port_no, () => console.log(`Listening on port number ${port_no}`));

let username = '';
let password = '';
let database = 'vidly';

if(argv.username || argv.u)
    username = argv.username || argv.u;
if(argv.password || argv.p)
    password = argv.password || argv.p;  
if(argv.database || argv.d)
database = argv.database || argv.d; 
const connection_string = `mongodb+srv://${username}:${password}@cluster0-waqja.mongodb.net/test?retryWrites=true`;
mongoose.connect(connection_string, {
    useNewUrlParser     : true,
    autoReconnect       : true,
    reconnectTries      : Number.MAX_VALUE,
    reconnectInterval   : 500,
    dbName              : database
})
.then(() => {console.log('Connected to Mongo Atlas');})
.catch((err) => {console.log('Unable to connect to Mongo Atlas.\n' + err);});

console.log(database);
