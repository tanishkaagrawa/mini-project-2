const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tastehub"
// ,{
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }
)
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log(err);
})

const passportLocalMongoose= require("passport-local-mongoose");

const loginSchema=new mongoose.Schema({
})
loginSchema.plugin(passportLocalMongoose);
const login=new mongoose.model("login",loginSchema);

const recipeSchema=new mongoose.Schema({
    recipeName:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
        trim:true
    },
    servings:{
        type:Number,
        required:true,
        min:2,
        max:10
    },
    prepTime:{
        type:Number,
        required:true
    },
    cookTime:{
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
    },
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ]
},{timestamps:true});
const addrecipe=new mongoose.model("addrecipe",recipeSchema);

const reviewsSchema = new mongoose.Schema(
    {
        rating: Number,
        comment: String,
    },
    {
        timestamps: true
    }
)

const Review = mongoose.model("review", reviewsSchema);



module.exports={login, addrecipe, Review};
