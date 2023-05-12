'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const { env: $env } = require('process');
const { getRemoteClientIp, blockIpsMiddleware } = require('./controllers/ip-ctrl');

app.use(helmet());
app.use(async (req, res, next) => {
    req.remoteAddress = getRemoteClientIp(req);
    return next();
});
app.use(cors({origin: `*`}));
app.options('https://localhost:4200', cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.set('trust proxy', true);

app.disable('etag');
app.set('etag', false);

app.disable('view cache');
app.set('view cache', false);

// App globally blocked ips
if ($env.APP_BLOCKED_IP_LIST) {
    app.use(blockIpsMiddleware);
}

module.exports = app;
  
app.use('/api/', authRoutes);

// Inicia o servidor na porta 3000
app.listen(3000, () => console.log('Servidor iniciado na porta 3000!'));

mongoose.connect('mongodb://localhost:27017/pedro', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar com o MongoDB:', err));