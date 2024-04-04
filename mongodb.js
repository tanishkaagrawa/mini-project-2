const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/tastehub")
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log(err);
})
const loginSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const login=new mongoose.model("login",loginSchema);

const recipeSchema=new mongoose.Schema({
    recipeName:{
        type:String,
        required:true
    },
    servings:{
        type:Number,
        required:true,
        min:2,
        max:10
    },
    prep_time:{
        type:Number,
        required:true
    },
    cook_time:{
        type:Number,
        required:true
    },
    ingredients:{
        type:String,
        required:true
    },
    instructions:{
        type: String,
        required:true
    },
    notes:{
        type:String
    }

});
const addrecipe=new mongoose.model("addrecipe",recipeSchema);




module.exports={login, addrecipe};
