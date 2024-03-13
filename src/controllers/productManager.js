import fs from 'fs';

export default class ProductManager {
    
    constructor(path) {
        this.products = [];
        this.path = path;
        this.loadProducts();    
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar los productos: ", error);
            this.products = [];
        }
    }
    
    async addProduct({title, description, code, price, status = true, stock, category, thumbnail}) {
        const validationError = this.validateInputs(title, description, code, price, status, stock, category);
        if (validationError) {
            return { error: validationError };
        }
    
        const existingProduct = this.products.find(prod => prod.code === code);
        if (existingProduct) {
            console.error(`Error: Ya existe un producto con el código: "${code}"`);
            return { error: `Ya existe un producto con el código: "${code}"` };
        }
    
        const product = {
            id: this.#getID(),
            code: code,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail || [],
            stock: stock,
            status: status,
            category: category,
        };
    
        this.products.push(product);
        await this.writeProductsJson(product);
        return {}; // Producto agregado sin errores
    }
    
    // Validacion de campos obligatorias al agregar producto.
    validateInputs(title, description, code, price, status, stock, category) {
        if (!title || !description || !code || !price || !status || !stock || !category) {
            console.error('Error: Todos los campos son obligatorios'); 
            return 'Todos los campos son obligatorios'; 
        }
    
        return null;  // null indica que no hay errores de validación
    }
    

    #getID() {
        if (this.products.length === 0) return 1;
        return this.products[this.products.length - 1].id + 1;
    }

    async getProducts(limit) {
        try {
            const readFile = await fs.promises.readFile(this.path , "utf-8");
            
            let productsObj = JSON.parse(readFile)

            if (limit)  {
                console.log(`Se limito la cantidad de productos a mostrar (${limit})`)
                productsObj = productsObj.slice(0, limit)
            };

            return productsObj;
        }catch (error){

            console.error("Error al obtener productos" , error);
            return;
        }
    }

    async getProductById(productId) {
        try {
            let myFile = await fs.promises.readFile(this.path, 'utf8');
            
            let productsObj = JSON.parse(myFile);

            const myProduct = productsObj.find((product) => product.id === productId);

            if (myProduct) {
                return myProduct;
            }else{
                return `Error: Producto con "ID: ${productId}" no encontrado`;
            }

        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async updateProduct(productId, updatedData) {
        try {
            const readFile = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(readFile);
    
            const index = this.products.findIndex(product => product.id === productId);
    
            if (index !== -1) {
                const { code: newCode } = updatedData;
                
                // Validación del nuevo código
                if (this.products.some(prod => prod.code === newCode && prod.code !== this.products[index].code)) {
                    console.error(`Error: Ya existe un producto con el código: "${newCode}"`);
                    return { error: `Ya existe un producto con el código: "${newCode}"` };
                }
                
                // Validacion de inputs del producto a actualizar -> Evitando que borren algun campo requerido.
                const validationError = this.validateInputs(updatedData.title, updatedData.description, newCode, updatedData.price, updatedData.status, updatedData.stock, updatedData.category);
                if (validationError) {
                    return { error: validationError };
                }
    
                this.products[index] = {
                    ...this.products[index],
                    ...updatedData,
                };
    
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
    
                console.log(`Producto actualizado: ${JSON.stringify(this.products[index])}`);
                return {}; // Producto actualizado sin errores
            } else {
                console.error(`Error: Producto con ID ${productId} no encontrado para actualizar`);
                return { error: `Producto con ID ${productId} no encontrado para actualizar` };
            }
        } catch (error) {
            console.error("Error al actualizar el producto: ", error);
            return { error: "Error interno del servidor" };
        }
    }
    
    
    
    async writeProductsJson(product) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log(`Producto agregado: ${JSON.stringify(product)}`);
        } catch (error) {
            console.error("Error al guardar los productos: ", error);
        }
    }

    async deleteProduct(productId) {
        const index = this.products.findIndex(prod => prod.id === productId);
    
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
                console.log(`Producto eliminado: ${JSON.stringify(deletedProduct)}`);
                return { success: true };
            } catch (error) {
                return { error: "Error al escribir en el archivo" };
            }
        } else {
            console.error(`Error: ID ${productId} no encontrado para eliminar`);
            return { error: `Error: Producto no encontrado para eliminar` };
        }
    }
}

