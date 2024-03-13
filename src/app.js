import express from 'express';
import { PORT } from './config/config.js'; 

import productRouter from './routes/products-router.js';
import cartRouter from './routes/carts-router.js';

const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter)

// Inicia el serivor
app.listen(PORT, () => {
    console.log(`Server active on http://localhost:${PORT}`);
});