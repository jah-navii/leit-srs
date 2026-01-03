import * as dotenv from 'dotenv';
dotenv.config(); // Must be ABOVE any local imports like sessionRouter

import express from 'express';
import cors from 'cors';
import sessionRouter from './routes/session.js'; // Note the .js extension (required by NodeNext)


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Link the routes
app.use('/api', sessionRouter);

app.get('/', (req, res) => {
  res.send('Leetner API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});