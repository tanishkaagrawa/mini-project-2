const searchBox= document.querySelector('.srch');
const searchBtn= document.querySelector('.searchBtn');
const recipeContainer= document.querySelector('.recipe-container');
const recipeDetails= document.querySelector('.recipe-details');
const closeBtn= document.querySelector('.closeBtn');
const content= document.querySelector('.content');

const fetchRecipes= async (q)=> {
    try{
        recipeContainer.innerHTML= "<h2> Fetching Recipes....</h2>"
        const data= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
        const response= await data.json();
        console.log(response);
        if (response.meals && response.meals.length > 0) {
            recipeContainer.innerHTML= "";
            response.meals.forEach(meal =>{
                const recipeDiv= document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML=`
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea} Dish</p>
                <p>${meal.strCategory} Category</p>  `
                const button= document.createElement('button');
                button.textContent= "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', ()=>{
                    openRecipe(meal);
                })
                recipeContainer.appendChild(recipeDiv);
            });
        }
        else{
            console.log("No meals found for the given search query");
        }
    } catch (error) {3333
        console.error(error);
      }
    } 
const openRecipe= (meal) =>{
    content.innerHTML=`
    <h2 class="recipeName"> ${meal.strMeal} </h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="instructions">
        <h3>Instructions:</h3>
        <p >${meal.strInstructions}</p>
    </div>`
    
    content.parentElement.style.display="block";
}
const fetchIngredients=(meal)=>{
    // console.log(meal);
    let ingredientList= "";
    for(let i=1; i<=20; i++){
        const ingredient= meal[`strIngredient${i}`];
        if(ingredient){
            const measure= meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientList;
}
searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput= document.querySelector(".searchBox").value.trim();
    fetchRecipes(searchInput);
    console.log("button clicked");
})
closeBtn.addEventListener('click',()=>{
    content.parentElement.style.display ="none";
})