const genres_router = require('./routes/genres');
const mongoose      = require('mongoose');
const express       = require('express');
const helmet        = require('helmet');
const morgan        = require('morgan');
const app           = express();

app.use(express.json());
app.use(helmet());
if(app.get('env') === 'development')    app.use(morgan('short'));
app.use('/api/genres', genres_router);

const port_no = process.env.PORT || 3000;
app.listen(port_no, () => console.log(`Listening on port number ${port_no}`));

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