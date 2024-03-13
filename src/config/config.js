import { fileURLToPath } from "url";

export const PORT = 8080;
export const productDB = fileURLToPath(new URL('../models/products.json', import.meta.url));
export const cartDB = fileURLToPath(new URL('../models/carts.json', import.meta.url));


// German si ves esto, no me funciona __dirname y fileURLToPath es la solucion que econtre. Segun chatGPT viene por el lado de que estoy usando module y no commonJS. Pero en clase vi que no tienen drama con __dirname. Si tenes alguna respuesta te lo agradeceria.