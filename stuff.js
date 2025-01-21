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
        this.font = font;
    }

    draw(canvas)
    {
        for (let i = 0; i < this.items.length; i++)
            textout_centre(canvas, this.font, this.items[i], windowWidth * 0.5, 140 + (i*40), 36, makecol(200, 200, 200), makecol(40, i == this.selection? 150 : 40, 40), 1);

        for (let i = 0; i < this.items.length; i++)
            if (this.secondaryItems[i])
            {
                textout_centre(canvas, this.font, this.secondaryItems[i], windowWidth * 0.7, 140 + (i*40), 36, makecol(200, 200, 200), makecol(40, i == this.selection? 150 : 40, 40), 1);
            }
    }

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

class CraftingMenu
{
    constructor(gridWidth, gridHeight)
    {
        this.grid = [];
        for(let i = 0; i < gridHeight; i++)
            for(let ii = 0; ii < gridHeight; ii++)
                this.grid[i][ii] = undefined; //how to store slots. Numbers with item IDs? Strings perhaps, for readability. An array of type (base, ingredient, catalyst) + current item? Maybe keep that in a separate array
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
        this.text = [];
        this.setText(this.rawText);
    }

    setText(text)
    {
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
                font, //font
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
                font, //font
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