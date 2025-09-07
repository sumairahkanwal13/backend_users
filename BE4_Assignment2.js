const express = require("express");
const app = express();

const Recipe = require("./models/recipe.models")
const { initializeDatabase } = require("./models/DB/DB.Connection")

app.use(express.json());
initializeDatabase();

// API with route "/recipes" to create a new recipe in the recipes database.
async function creatNewRecipe(newRecipe) {
    try{
      const recipe = new Recipe(newRecipe)
      const saveRecipe = await recipe.save()
      return saveRecipe;
    }catch(error){
        console.log(error)
    }
};

app.post("/recipes", async(req, res) => {
    try{
      const saveRecipe = await creatNewRecipe(req.body);
      res.status(201).json({message: "Recipe added successfully.", recipe: saveRecipe})
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to get all the recipes in the database as a response.
async function readAllRecipes(){
    try{
     const allRecipes = await Recipe.find();
     return allRecipes;
    }catch(error){
        console.log(error)
    }
};

app.get("/recipes", async(req,res) => {
    try{
     const recipe = await readAllRecipes()
     if(recipe){
        res.json(recipe)
     }else{
        res.status(404).json({error: "Recipe not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to get a recipe's details by its title.
async function readRecipeByTitle(recipeTitle){
    try{
      const recipeByTitle = await Recipe.findOne({title: recipeTitle});
      return recipeByTitle
    }catch(error){
        console.log(error)
    }
}

app.get("/recipes/:recipeTitle", async(req,res) => {
    try{
     const recipe = await readRecipeByTitle(req.params.recipeTitle);
     if(recipe){
        res.json(recipe)
     }else{
        res.status(404).json({error: "Recipe not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to get details of all the recipes by an author.
async function readRecipeByAuthor(authorName){
    try{
     const recipeByAuthor = await Recipe.findOne({author: authorName})
     return recipeByAuthor
    }catch(error){
        console.log(error)
    }
}

app.get("/recipes/author/:authorName", async(req,res) =>{
    try{
      const recipe = await readRecipeByAuthor(req.params.authorName);
      if(recipe){
        res.json(recipe)
      }else {
        res.status(404).json({error: "Recipe not found."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to get all the recipes that are of "Easy" difficulty level.
async function readRecipeByLevel(recipeLevel){
    try{
     const recipeByLevel = await Recipe.find({difficulty: recipeLevel});
     return recipeByLevel
    }catch(error){
        console.log(error)
    }
};

app.get("/recipes/difficulty/:recipeLevel", async(req, res) => {
    try{
     const recipe = await readRecipeByLevel(req.params.recipeLevel)
     if(recipe.length != 0){
        res.json(recipe)
     }else{
        res.status(404).json({error: "Recipe not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to update a recipe's difficulty level with the help of its id.
async function updateRecipeLevel(recipeId, dataToUpdate){
    try{
     const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true});
     return updatedRecipe;
    }catch(error){
        console.log(error)
    }
};

app.post("/recipes/:recipeId", async(req, res) => {
    try{
      const recipeUpdated = await updateRecipeLevel(req.params.recipeId, req.body);
      if(recipeUpdated){
        res.status(201).json({message: "Recipe updated successfully.", recipe: recipeUpdated})
      }else{
        res.status(404).json({error: "Recipe not found."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to update a recipe's prep time and cook time with the help of its title.
async function updateRecipeByTitle(recipeTitle, prepTime, cookTime, ){
    try{
     const recipeUpdatedTitle = await Recipe.findOneAndUpdate({title:recipeTitle}, {prepTime: prepTime, cookTime: cookTime }, {new: true});
     return recipeUpdatedTitle
    }catch(error){
        console.log(error)
    }
};
app.post("/recipes/title/:recipeTitle", async(req, res) => {
    try{
        const { prepTime, cookTime} = req.body
     const recipe = await updateRecipeByTitle(req.params.recipeTitle,prepTime, cookTime)
     if(recipe){
        res.status(201).json({message: "Recipe updated successfully.", recipe: recipe})
     }else {
        res.status(404).json({error: "Recipe not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

//API to delete a recipe with the help of a recipe id.
async function deleteRecipe(recipeId) {
    try{
     const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
     return deletedRecipe
    }catch(error){
        console.log(error)
    }
};

app.delete("/recipes/:recipeId", async(req, res) => {
    try{
       const recipe = await deleteRecipe(req.params.recipeId);
      
         res.status(200).json({message: "Recipe deleted successfully,", recipe: recipe})   
    }catch(error){
        res.status(500).json({error: "Failed to fetch recipe's details."})
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is ruuning on port ${PORT}`)
})