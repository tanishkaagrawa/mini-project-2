const express=require("express");
const app=express();
const path=require("path");
// const login=require("./mongodb");
// const addrecipe=require("./mongodb");
const{login, addrecipe, recipe}=require("./mongodb.js");
const multer=require("multer");
const fileUpload=require("express-fileupload");
const cloudinary=require('cloudinary').v2;
const upload=multer({storage:cloudinary.storage});

cloudinary.config({
    cloud_name:"dc3aiyprg",
    api_key:"626173381344477",
    api_secret:"-ya5WvR0BLYY5EV3jp6usKWprSc"
})

app.use('/public/',express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','./views');
app.use(fileUpload({
    useTempFiles:true
}))

app.get("/",(req,res)=>{
   res.render("login"); 
})
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.post("/signup",async (req,res)=>{
     
    console.log(req.body);
    // const d1 ={
    //     username:req.body.username,
    //     password:req.body.password
    // }
    // console.log(d1)
    let data = await login({
        username:req.body.username,
        password:req.body.password
    });
    await data.save();
    res.render("home")

})
app.post("/login",async (req,res)=>{
    try{
        const d2=await login.findOne({username:req.body.username,password:req.body.password})
        // console.log()
        if(d2){
            res.render("home");
        }
        else{
            res.send("incorrect password");
        }
    }
    catch{
        res.send("incorrect username and password");
    }
})
app.get("/addrecipe",(req,res)=>{
    res.render("addrecipe");
})
app.post("/addrecipe", upload.single('image'),async(req,res)=>{
    try{
        cloudinary.uploader.upload(req.file.path);
        res.status(200).json({message:'File uploaded'});
        const d3={
        recipeName:req.body.recipeName,
        servings:req.body.servings,
        prep_time:req.body.prep_time,
        cook_time:req.body.cook_time,
        ingredients:req.body.ingredients,
        instructions:req.body.instructions,
        notes:req.body.instructions
        }
        await addrecipe.insertOne([d3]);
        res.render("home");
    }catch(error){
        res.status(500).json({error:error.message});
    }
})
app.get("/home", (req,res)=>{
    res.render("home");
})


app.listen(9999, ()=>{
   console.log('server is running at 9999'); 
})