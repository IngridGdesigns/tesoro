import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

const PORT = 3030

dotenv.config();
const app = express();

app.use(express.json());
app.set('json spaces', 2);
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.json({ info: "Hello, you're in my express app" });
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} from the port`)
})

