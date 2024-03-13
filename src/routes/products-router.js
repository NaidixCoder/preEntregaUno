import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
import { uploader } from '../utils.js';
import { productDB } from "../config/config.js";

const router = Router();
const pm = new ProductManager(productDB);

// Traemos todos los productos o la cantidad especifica que limitemos.
router.get('/', async (req, res) => {
    try{
        let limit = req.query.limit;
        
        // Validamos si limit es un numero 
        if (limit !== undefined && isNaN(limit)) {
            return res.status(400).send('El parámetro limit debe ser un número válido.');            
        } 

        const products = await pm.getProducts(limit);
        res.status(200).json(products);

    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//Busqueda segun ID.
router.get('/:pid', async (req, res) => {
    try{
        let productId = parseInt(req.params.pid);

        const products = await pm.getProductById(productId);
        res.status(200).json(products);

    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//  Agregar nuevo producto: 
router.post("/", uploader.single('file'), async (req, res) => {
    const newProduct = req.body;
    newProduct.thumbnail = req.file.path;
    
    try {
        const result = await pm.addProduct(newProduct);
        if (result.error) {
            res.status(409).json({
                error: result.error
            });
        } else {
            res.status(201).json({
                message: "Producto agregado exitosamente"
            });
        }
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


// Actualizar por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        const result = await pm.updateProduct(parseInt(id), productoActualizado);
        if (result.error) {
            res.status(409).json({
                error: result.error
            })
        } else {
            res.status(202).json({
                message: "Producto actualizado exitosamente"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Eliminar producto:
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const result = await pm.deleteProduct(parseInt(id));
        if (result.error) {
            res.status(404).json({ error: result.error }); 
        } else {
            res.status(202).json({ message: "Producto eliminado exitosamente" });
        }
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router