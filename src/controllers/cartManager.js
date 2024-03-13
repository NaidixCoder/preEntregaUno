import { promises as fs } from 'fs';


class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            
            //Verifico si hay por lo menos un carrito creado. Map para crear un nuevo array que solo tenga los identificadores del carrito y con Math.max obtengo el mayor.
            if (this.carts.length > 0) {
                this.lastId = Math.max(...this.carts.map(cart => cart.id)); //  
            }

        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error);
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart  = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart );

        await this.saveCarts(); // Guarda el array en el archivo
        return newCart ;
    }

    async getCartById(cartId) {
        try {
            const carrito = this.carts.find(c => c.id === cartId);

            if (!carrito) {
                throw new Error(`Error: No existe un carrito con el id ${cartId}`);
            }

            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito segun ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carrito = await this.getCartById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);

        // Verificamos si existe el producto en el carrito
        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: parseInt(productId), quantity });
        }

        await this.saveCarts();
        return carrito;
    }
}

export default CartManager;