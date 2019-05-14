const genres_router = require('./routes/genres');
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