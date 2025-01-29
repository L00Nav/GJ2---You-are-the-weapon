//Global variables
const windowWidth = 640;
const windowHeight = 360;

const mainFont = load_font("./fonts/Bookinsanity Bold.otf");

/////////////////////////////////////////////////////////////////////////////////
/// Cutscene
/////////////////////////////////////////////////////////////////////////////////

class ListMenu
{
    constructor(items, id, secItems = {})
    {
        this.items = items;
        this.secondaryItems = secItems;
        this.id = id;
        this.selection = 0;
        this.font = mainFont;
        this.subtitle = "";
    }

    draw(canvas)
    {
        for (let i = 0; i < this.items.length; i++)
            textout_centre(canvas, this.font, this.items[i], windowWidth * 0.5, 110 + (i*50), 36, makecol(200, 200, 200), makecol(40, i == this.selection? 150 : 40, 40), 1);

        for (let i = 0; i < this.items.length; i++)
            if (this.secondaryItems[i])
            {
                textout_centre(canvas, this.font, this.secondaryItems[i], windowWidth * 0.7, 110 + (i*50), 36, makecol(200, 200, 200), makecol(40, i == this.selection? 150 : 40, 40), 1);
            }

        if (this.subtitle)
            textout_centre(canvas, this.font, this.subtitle, windowWidth * 0.5, windowHeight - 30, 20, makecol(200, 200, 200));
    }

    setSubtitle(sub) {this.subtitle = sub;}

    up()
    {
        this.selection--;
        if(this.selection < 0)
            this.selection = this.items.length - 1;
    }

    down()
    {
        this.selection++;
        if(this.selection > this.items.length - 1)
            this.selection = 0;
    }

    getSelection()
    {
        return this.selection | this.id;
    }
}


/////////////////////////////////////////////////////////////////////////////////
/// Crafting menu
/////////////////////////////////////////////////////////////////////////////////

let itemLibrary;

class CraftingMenu
{
    constructor(gridWidth = 1, cells = [])
    {
        this.grid = [];
        for (let i = 0; i < cells.length; i += gridWidth)
        {
            this.grid = this.grid.concat( [cells.slice(i, i + gridWidth)] );
        }
        this.recipeBook = new RecipeBook();
        this.inventory = [];
        this.visibleInventory = [];
        this.x = 0;
        this.y = 0;
        this.iy = 0;
        this.gridVelocity = 1;
        this.listVelocity = 0;

        this.gridDispBaseX = 220;
        this.gridDispBaseY = 80;
        this.gridDispMultX = 160;
        this.gridDispMultY = 80;
        this.cellW = 50;
        this.cellH = 50;

        this.updateVisibleInventory();
    }

    setInventory(items) {this.inventory = items;}
    addToInventory(items) {this.inventory = this.inventory.concat(items);}
    clearInventory() {this.inventory = [];}

    selectionUp()
    {
        this.y -= this.gridVelocity;
        if(this.y < 0)
            this.y += this.grid.length;
        this.updateVisibleInventory();

        this.iy -= this.listVelocity;
        if(this.iy < 0)
            this.iy += this.inventory.length;
    }
    selectionDown()
    {
        this.y += this.gridVelocity;
        if(this.y >= this.grid.length)
            this.y -= this.grid.length;
        this.updateVisibleInventory();

        this.iy += this.listVelocity;
        if(this.iy >= this.inventory.length)
            this.iy -= this.inventory.length;
    }
    selectionLeft()
    {
        this.x -= this.gridVelocity;
        if(this.x < 0)
            this.x += this.grid[0].length;
        this.updateVisibleInventory();
    }
    selectionRight()
    {
        this.x += this.gridVelocity;
        if(this.x >= this.grid[0].length)
            this.x -= this.grid[0].length;
        this.updateVisibleInventory();
    }

    updateVisibleInventory()
    {
        //determine which items are displayed atm
        //call on init, selection movement and during crafting
    }

    recalculateViableItems()
    {
        for(let y = 0; y < this.grid.length; y++)
        {
            for(let x = 0; x < this.grid[y].length; x++)
            {
                //skip over gaps
                if(!grid[y][x])
                    continue;

                //sumfin sumfin call the recipe method 
            }
        }
    }

    clearSlot(x,y)
    {
        // if(this.grid[y][x])

    }

    select()
    {
        if(this.grid[this.y][this.x])
        {
            let temp = this.gridVelocity;
            this.gridVelocity = this.listVelocity;
            this.listVelocity = temp;
        }

        // if(this.listVelocity)
    }

    draw(canvas)
    {
        //inventory
        rectfill(canvas, 0, 0, windowWidth * 0.3, windowHeight, makecol(30, 20, 10));

        if(this.listVelocity)
            rectfill(canvas, 0, 7 + this.iy*54, windowWidth * 0.3, 54, makecol(128,128,255));

        for (let i = 0; i < this.inventory.length; i++)
        {
            if(itemLibrary[this.inventory[i]])
                draw_sprite(canvas, itemLibrary[this.inventory[i]], 36, 34 + (i*54));

            textout(canvas, mainFont, this.inventory[i],
             70, 34 + (i*54), 20, makecol(200, 200, 200));
        }

        //crafting slots
        for(let y = 0; y < this.grid.length; y++)
        {
            for(let x = 0; x < this.grid[0].length; x++)
            {
                if(this.grid[y][x])
                {
                    let colour = (this.x == x && this.y == y) ? makecol(128,128,255) : makecol(200,160,130);

                    rectfill(canvas,
                    x * this.gridDispMultX + this.gridDispBaseX,
                    y * this.gridDispMultY + this.gridDispBaseY,
                    this.cellW,
                    this.cellH,
                    makecol(0, 0, 0, 120));

                    if(this.grid[y][x][0])
                        draw_sprite(canvas, itemLibrary[this.grid[y][x][0]], x * this.gridDispMultX + this.gridDispBaseX + 25, y * this.gridDispMultY + this.gridDispBaseY + 25);

                    rect(canvas,
                    x * this.gridDispMultX + this.gridDispBaseX,
                    y * this.gridDispMultY + this.gridDispBaseY,
                    this.cellW,
                    this.cellH,
                    colour, 3);
                }
            }
        }

        //
        if(!this.grid[this.y][this.x])
        {
            circlefill(canvas,
            this.x * this.gridDispMultX +
             this.gridDispBaseX + (this.cellW/2),
            this.y * this.gridDispMultY +
             this.gridDispBaseY + (this.cellH/2),
            5, makecol(128, 128, 255))
        }
    }
}


class RecipeBook
{
    constructor()
    {
        //set recipes
        this.recipes = [];
    }

    setRecipes(recipes) {this.recipes = recipes;}
    addRecipes(recipes) {this.recipes = this.recipes.concat(recipes);}
    clearRecipes() {this.recipes = [];}

    getItemsBySlotType(slotType)
    {

    }
}


class Recipe
{
    constructor(input, output)
    {
        this.input = input;
        this.output = output;
    }

    uses(item)
    {
        for (let i = 0; i < this.input.length; i++)
            if (item.name == this.input[i].itemName)
                return true;

        return false;
    }
    
    usesAny(items) 
    {
        for (let i = 0; i < items.length; i++)
            if (uses(items[i]))
                return true;

        return false;
    }

    usesAll(items)
    {
        for (let i = 0; i < items.length; i++)
            if(!uses(items[i]))
                return false;

        return true;
    }
}



/////////////////////////////////////////////////////////////////////////////////
/// Cutscene
/////////////////////////////////////////////////////////////////////////////////

class Cutscene
{
    constructor(text = ["(Text missing)"])
    {
        this.rawText = text;
        this.text = [];
        this.fadingIndex = 0;
        this.revealedIndex = 0;
        this.lineLinks = 0;
        this.fade = 0;
        this.fontSize = 24;
        this.setText(text);
    }

    resetIndexes()
    {
        this.fadingIndex = 0;
        this.revealedIndex = 0;
        this.lineLinks = 0;
        this.fade = 0;
    }

    resetText()
    {
        this.setText(this.rawText);
    }

    setText(text)
    {
        this.text = [];
        this.resetIndexes();
        let bitIndex = 1;

        for (let i = 0; i < text.length; i++)
        {
            if(text[i].length < this.fontSize*2)
                this.text.push(text[i]);
            else //if line's too long, break it up. Assumes standard sentences
            {
                let tempString = "";
                let words = text[i].split(" ");
                for (let ii = 0; ii < words.length; ii++)
                {
                    tempString += words[ii] + " ";
                    if(words[ii+1]) //are there any more words in the array?
                    {
                        let testString = tempString + words[ii+1];
                        if(testString.length > this.fontSize*2) //would the next word fit?
                        {
                            this.text.push(tempString);
                            tempString = "";
                            this.lineLinks |= bitIndex;
                            bitIndex = bitIndex << 1;
                        }
                    }
                    else
                        this.text.push(tempString);
                }
            }
            bitIndex = bitIndex << 1;
        }
    }

    draw(canvas)
    {
        clear_to_color(canvas, makecol(20, 20, 20));

        let i;
        for (i = 0; i < this.revealedIndex; i++) //render revealed
        {            
            textout_centre(canvas, //target
                mainFont, //font
                this.text[i], //text
                windowWidth * 0.5, //x
                60 + ((i)*this.fontSize*2), //y
                this.fontSize,
                makecol(200, 200, 200), //text colour
                makecol(40, 40, 150), //outline colour
                1); //outline thickness
        }

        while (i < this.fadingIndex) //render fade-ins, if any
        {
            textout_centre(canvas, //target
                mainFont, //font
                this.text[i], //text
                windowWidth * 0.5, //x
                60 + ((i)*this.fontSize*2), //y
                this.fontSize,
                makecol(200, 200, 200, this.fade), //text colour
                makecol(40, 40, 150, this.fade), //outline colour
                1); //outline thickness

            this.fade += 8;
            if(this.fade > 255)
            {
                this.revealedIndex = this.fadingIndex;
                this.fade = 0;
            }
            i++;
        }
    }

    update()
    {
        //if there's something still fading in
        if (this.fadingIndex > this.revealedIndex)
        {
            this.revealedIndex = this.fadingIndex;
            this.fade = 0;
        }
        this.fadingIndex++;

        //if there's nothing else to fade in
        if(this.fadingIndex > this.text.length)
        {
            this.fadingIndex--;
            this.revealedIndex++;
        }

        //if there's nothing else to reveal
        if(this.revealedIndex > this.text.length)
        {
            this.resetIndexes();
            this.resetText();
            return 1;
        }

        //if multiple lines belong to the same message, fade them in together
        let bitIndex = 1 << this.revealedIndex;
        while(true)
        {
            if(this.lineLinks & bitIndex)
            {
                this.fadingIndex++;
                bitIndex = bitIndex << 1;
            }
            else
                break;
        }

        //if there's no more room, move on to the next messages
        if(60 + this.fontSize * this.fadingIndex * 2 > windowHeight)
        {
            let text = this.text.slice(this.revealedIndex);
            let lineLinks = this.lineLinks >> this.revealedIndex;

            this.resetIndexes();

            this.text = text;
            this.lineLinks = lineLinks;
        }

        return 0;
    }
}