import mongoose from 'mongoose';
  

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true, // Add index for faster lookups
    },
    
    
      totalPrice: { type: Number, required: false },

      paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
      },
  
      transactionId: { type: String, required: false }, // Useful for online payment tracking
  
      status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      },

  //  sessionId: {
    //    type: String,
      //  required: true,
  //  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Ensuring price is saved
    }
  ],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

export const Order = mongoose.model("Order", orderSchema);
export default Order;
