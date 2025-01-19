/////////////////////////////////////////////////////////////////////////////////
/// Crafting menu
/////////////////////////////////////////////////////////////////////////////////

class CraftingMenu
{
    constructor(gridWidth, gridHeight)
    {
        this.grid = [];
        for(let i = 0; i < gridHeight; i++)
            for(let ii = 0; ii < gridHeight; ii++)
                this.grid[i][ii] = null; //how to store slots. Numbers with item IDs? Strings perhaps, for readability. An array of type (base, ingredient, catalyst) + current item? Maybe keep that in a separate array
    }
}


/////////////////////////////////////////////////////////////////////////////////
/// Recipes
/////////////////////////////////////////////////////////////////////////////////

class RecipeBook
{
    constructor()
    {
        //Perhaps a more sensible way to store this might be as a recipe book class, storing arrays with 0 index item being the output
        //That way, we can have several sets of recipe list for different stages of the game
        //Also, reuse the recipe lists for other stuff, like the quest menu
    }
}