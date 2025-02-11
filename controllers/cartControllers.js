import { Cart } from "../models/cartModel.js";  
import { Product } from "../models/productModel.js";  

 

export const getCart = async (req, res) => {  
    try {  
        const userId = req.user.id;  

        // Fetch cart and populate product details  
        const cart = await Cart.findOne({ userId })
        
        if (!cart) {  
            return res.status(404).json({ message: "Cart not found" });  
        }  
//
        // Log the cart structure for debugging
  //      console.log("Fetched cart:", JSON.stringify(cart, null, 2));

        // Calculate total price dynamically
        const calculatedTotalPrice = cart.products.reduce((total, item) => {
            // Check if productId is populated
            if (item.productId) {
                return total + (item.price * item.quantity);
            }
            return total; // Skip if productId is null
        }, 0);

        res.status(200).json({ 
            data: { 
                ...cart.toObject(), 
                totalPrice: calculatedTotalPrice // Update totalPrice with calculated value
            }, 
            message: "Cart fetched successfully" 
        });  
    } catch (error) {  
        console.error("Error fetching cart:", error);  
        res.status(500).json({ message: "Internal server error", error });  
    }  
};

export const addProductToCart = async (req, res) => {  
    try {  
        const userId = req.user.id;  
        const { productId } = req.body;  

        // Validate productId  
        if (!productId) {  
            return res.status(400).json({ message: "Product ID is required" });  
        }  
      ////  if (!quantity || quantity < 1) {
          //  return res.status(400).json({ message: "Quantity must be at least 1" });
        //}

        // Find the product to ensure it exists  
        const product = await Product.findById(productId);  
        if (!product) {  
            return res.status(404).json({ message: "Product not found" });  
        }  

        // Find the user's cart or create a new one if it doesn't exist  
        let cart = await Cart.findOne({ userId });  
        
        if (!cart) {  
            // Create a new cart with the product and its quantity
            cart = new Cart({ 
                userId, 
                products: [{ 
                    productId, 
                    price: product.price, 
                  //  quantity // Set quantity directly from the request
                }],   
                //totalPrice: product.price * quantity // Initial total price
            }); 
        } else {
            // Check if the product is already in the cart  
            const productIndex = cart.products.findIndex((item) => item.productId.equals(productId));  
            
            if (productIndex !== -1) {  
                // If product exists, update the quantity without resetting it to 1  
               // cart.products[productIndex].quantity += quantity;  // Update with the incoming quantity
            } else {  
                // Add the product to the cart with the incoming quantity  
                const cartItem = {  
                    productId,  
                    price: product.price,  
                   // quantity // Set quantity directly from the request
                };  
                cart.products.push(cartItem);  
            }
        }

        // Recalculate the total price  
        //cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);  

        // Save the cart  
        await cart.save();  

        // Respond with the cart data excluding any extra quantity field
        const responseCart = {
            _id: cart._id,
            userId: cart.userId,
            products: cart.products,
           // totalPrice: cart.totalPrice
        };

        res.status(200).json({ data: responseCart, message: "Product added to cart" });  
    } catch (error) {  
        console.error("Error adding product to cart:", error);  
        res.status(500).json({ message: "Internal server error", error: error.message });  
    }  
};


export const removeProductFromCart = async (req, res) => {  
    try {  
        const userId = req.user.id;  
        const { productId } = req.body;  

        // Validate productId  
        if (!productId) {  
            return res.status(400).json({ message: "Product ID is required" });  
        }  

        // Find the user's cart  
        let cart = await Cart.findOne({ userId });  
        if (!cart) {  
            return res.status(404).json({ message: "Cart not found" });  
        }  

        // Remove the product from the cart  
        cart.products = cart.products.filter((item) => !item.productId.equals(productId));  

        // Recalculate the total price  
        cart.calculateTotalPrice();  

        // Save the cart  
        await cart.save();  

        res.status(200).json({ data: cart, message: "Product removed from cart" });  
    } catch (error) {  
        console.error("Error removing product from cart:", error);  
        res.status(500).json({ message: "Internal server error", error });  
    }  
};