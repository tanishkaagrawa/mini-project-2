const express=require("express");
const app=express();
const path=require("path");
// const login=require("./mongodb");
// const addrecipe=require("./mongodb");
const{login, addrecipe, Review}=require("./mongodb.js");
const multer=require("multer");
// const fileUpload=require("express-fileupload");
// const cloudinary=require('cloudinary').v2;
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads/"); // Destination directory on your server
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "-" + file.originalname); // Unique filename for uploaded file
//     },
//   });
// const upload=multer({storage:storage});
const methodOverride= require('method-override');
const session= require('express-session');
const passport= require('passport');
const LocalStrategy= require('passport-local');
const flash= require('connect-flash');

// cloudinary.config({
//     cloud_name:"dc3aiyprg",
//     api_key:"626173381344477",
//     api_secret:"-ya5WvR0BLYY5EV3jp6usKWprSc"
// })

app.use(session({
    secret: 'keyboard-cat',
    resave: false,
    saveUnintialized: true,
    cookie:{
        httpOnly: true,
        maxAge: 90000
    }
}))
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})
passport.use(new LocalStrategy(login.authenticate()));
passport.use(passport.authenticate("session"));
passport.serializeUser(login.serializeUser());
passport.deserializeUser(login.deserializeUser());

app.use('/public/',express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','./views');
// app.use(fileUpload({
//     useTempFiles:true
// }))
app.use(methodOverride('_method'));

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
    // let data = await login({
    //     username:req.body.username,
    //     password:req.body.password
    // });
    // await data.save();
    // res.render("home")
    const {username, password} = req.body;

    const user = new login({username});

    await login.register(user, password);

    res.redirect('/recipe');

})
app.post("/login",passport.authenticate('local', { failureRedirect: '/'}),async (req,res)=>{
    
    res.redirect('/recipe');
})
app.get('/addrecipe', (req,res)=>{
    res.render('addrecipe');
})
app.get("/recipe", async(req,res)=>{
    const allRecipe = await addrecipe.find({})
    res.render('home', {allRecipe});
})
app.post("/recipe",async(req,res)=>{
    
    try {
        const {recipeName, imageUrl, servings, prepTime, cookTime,ingredients, instructions, notes} = req.body;

        const d3 = new addrecipe({recipeName, imageUrl, servings, prepTime, cookTime,ingredients, instructions, notes});
        // console.log(d3);
        await d3.save();
        // req.flash('success', "product created successfully")
        // req.flash('info', 'Flash is back!')
        res.redirect('/recipe');
      } catch (error) {
        //  req.flash("error", "something is going wrong")
        res.status(500).json({error:error.message});
      }
})

app.get("/recipe/:id", async(req, res)=>{
    const id = req.params.id;
    const singleRecipe = await addrecipe.findById(id).populate('review');
    console.log(singleRecipe);
    res.render("singlerecipe", {singleRecipe});
})
app.post("/review/:id", async(req,res) => {
    const {id} = req.params;
    const recipe = await addrecipe.findById(id);


    const {rating, comment}= req.body;
    const review = await Review.create({rating, comment});


   recipe.review.push(review);

   await recipe.save();

   res.redirect(`/recipe/${id}`);


})

app.delete('/review/:reviewId/:recipeId',async(req, res)=>{
    const {reviewId} = req.params;
    const {recipeId} = req.params;
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/recipe/${recipeId}`);
})


app.listen(9999, ()=>{
   console.log('server is running at 9999'); 
})