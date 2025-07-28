const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/url');
const { requestLogger } = require('../loggingMiddleware/middleware');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/url', urlRoutes);
app.get('/', (req, res)=>{
    res.send('hello')
})
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
