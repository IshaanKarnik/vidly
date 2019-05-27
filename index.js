const genres_router = require('./routes/genres');
const mongoose      = require('mongoose');
const express       = require('express');
const helmet        = require('helmet');
const morgan        = require('morgan');
const argv          = require('yargs').argv;

//Enter UserName : --username (or -u) and Password : --password (or -p) --database (or -d)
//eg : node index.js --username=xyz --password=abc --database=123
//eg : node index.js -u xyz -p abc -d 123
//Username and Password are URL encoded in code

const app           = express();

app.use(express.json());
app.use(helmet());
if(app.get('env') === 'development')    app.use(morgan('short'));
app.use('/api/genres', genres_router);

const port_no = process.env.PORT || 3000;
app.listen(port_no, () => console.log(`Listening on port number ${port_no}`));

<<<<<<< HEAD
async function connect() {
    try{
        await mongoose.connect(connection_string, { useNewUrlParser: true,
                                                    dbName: database });
        console.log("Collection : " + Course.collection.collectionName);
        const result = await Course .find({ isPublished : true,
                                            tags : 'backend' })
                                    .sort({name : 1})
                                    .select({name : 1, author : 1});
        console.log(result);
    }
    catch(ex){
        console.log(ex.message);
    }
}

connect();
=======
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
    //reconnectTries      : Number.MAX_VALUE,
    //reconnectInterval   : 500,
    dbName              : database
})
.then(() => {console.log('Connected to Mongo Atlas');})
.catch((err) => {console.log('Unable to connect to Mongo Atlas.\n' + err);});

console.log(database);
>>>>>>> 37945d3681ca6c186518a48fc11aad802bf3d386
