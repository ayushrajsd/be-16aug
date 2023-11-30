const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name should be unique"],
      maxLength: [40, "Product name should be less than 40 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      validate:{
        validator:function(){
            return this.price > 0
        },
        message: "Price should be greater than 0"
      }
    },
    categories:{
        required:true,
        type: [String]
    },
    images:{
        type:[String]
    },
    averageRating:Number,
    discount:{
        type:Number,
        validate:{
            validator:function(){
                return this.discount < this.price
            },
            message:"Discount should be less than price"
        }
    },
    description:{
        type:String,
        required:[true,'Please provide description'],
        maxLength:[200,'Description should be less than 200 characters']

    },
    stock:{
        type:Number,
        required:[true,'Please provide stock'],
        validate:{
            validator:function(){
                return this.stock >= 0
            },
            message:"Stock should be greater than 0"
        }
    },
    brand:{
        type:String,
        required:[true,'Please provide brand']
    },
    }
)

const validCategories = ['electronics', 'clothes','stationery','furniture']

productSchema.pre("save",function(next){
    const invalidCategories = this.categories.filter((category)=>{
        return !validCategories.includes(category)
    })
    if(invalidCategories.length){
        return next(new Error(`Invalid categories ${invalidCategories.join(",")}`))
    } else {
        next()
    
    }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;