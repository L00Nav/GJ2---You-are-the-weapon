//Global variables
var windowScale = 1;
const canvasId = "game_canvas";
let htmlCanvas;

let canvasBuffer;

let yellowSprite;
let greenSprite;
let blueSprite;


/////////////////////////////////////////////////////////////////////////////////
/// Scenes
/////////////////////////////////////////////////////////////////////////////////

let currentScene;

///////////////////////////////////////////////////////////////////////////////// Main menu

const mainMenuScene = {
    mainId: 1 << 6,
    optionsId: 1 << 7,
    activeMenu: null,
    mainMenu: null,
    options: {
        0: 1, //scale
    },
    optionsMenu: null,
    selection: 0,
    bgColour: makecol(20, 20, 20),
    font: null,

    init: function() {
        this.mainMenu = new ListMenu([
            "What is this?",
            "Crafting",
            "Options",
        ], this.mainId);
        this.mainMenu.setSubtitle("Controls - WASD F Q (or equivalent)");

        this.optionsMenu = new ListMenu([
            "Scale",
            "Back",
        ], this.optionsId, this.options);

        this.font = mainFont;

        this.activeMenu = this.mainMenu;
    },

    draw: function() {
        clear_to_color(canvasBuffer, this.bgColour);

        this.activeMenu.draw(canvasBuffer);
    },

    update: function() {
        let selection = this.activeMenu.getSelection();

        //navigation
        if(pressed[KEY_W])
            this.activeMenu.up();

        if(pressed[KEY_S])
            this.activeMenu.down();

        //selection
        if(pressed[KEY_F])
        {
            switch(selection)
            {
            case 0 | this.mainId:
                currentScene = cutScene;
                break;
            case 1 | this.mainId:
                currentScene = craftingScene;
                break;
            case 2 | this.mainId:
                this.activeMenu = this.optionsMenu;
                break;
            case 1 | this.optionsId:
                this.activeMenu = this.mainMenu;
                break;
            default:
                break;
            }
        }

        //adjustment
        if (pressed[KEY_A] && selection & this.optionsId)
        {
            let index = selection & ~this.optionsId;
            if (this.options[index])
                this.options[index]--;
            
            if (!this.options[0])
                this.options[0]++;

            if (index == 0)
            {
                windowScale = this.options[0];
                set_gfx_mode(canvasId, windowWidth * windowScale, windowHeight * windowScale);
                htmlCanvas.getContext("2d").imageSmoothingEnabled = false;
            }
        }

        if (pressed[KEY_D] && selection & this.optionsId)
        {
            let index = selection & ~this.optionsId;
            if (this.options[index])
                this.options[index]++;

            if (index == 0 && this.options[0] > 5)
                this.options[0]--;

            if (index == 0)
            {
                windowScale = this.options[0];
                set_gfx_mode(canvasId, windowWidth * windowScale, windowHeight * windowScale);
                htmlCanvas.getContext("2d").imageSmoothingEnabled = false;
            }
            //there's gotta be a more elegant way to do this...
        }
    },
};

///////////////////////////////////////////////////////////////////////////////// Game

const gameScene = {
    field: ["ttttt",
            "t***t",
            "t***t",
            "t***t",
            "ttttt"],
    fieldImg: null,
    scale: 25,
    bgColour: null,

    init: function() {
        this.fieldImg = create_bitmap(this.scale * this.field[0].length, this.scale * this.field.length);
        this.bgColour = makecol(0, 50, 0);
    },

    initField: function() {
        for(let i = 0; i < this.field.length; i++)
        {
            for(let ii = 0; ii < this.field[i].length; ii++)
            {
                if(this.field[i][ii] == 't')
                    rectfill(this.fieldImg, ii * this.scale, i * this.scale, this.scale, this.scale, makecol(0, 120, 0));
                else
                    rectfill(this.fieldImg, ii * this.scale, i * this.scale, this.scale, this.scale, makecol(0, 200, 0));
            }
        }
    },

    draw: function() {
        clear_to_color(canvasBuffer, this.bgColour);
        draw_sprite(canvasBuffer, this.fieldImg, 100.5, 100.5);
    },

    update: function() {
        if(pressed[KEY_Q])
            currentScene = mainMenuScene;
    },
};

///////////////////////////////////////////////////////////////////////////////// Crafting

const craftingScene = {
    bgColour: makecol(60, 40, 30),
    menu: null,

    init: function(gridWidth, cells) {
        this.menu = new CraftingMenu(gridWidth, cells);
        let test = new Recipe(
            [
                {itemName: "yellow", type: "base"},
                {itemName: "green", type: "ingredient"},
            ],
            [
                "blue",
            ]);
        this.menu.recipeBook.setRecipes([test]);

        //rearrange for recipe book
    },

    secondInit: function() {
        itemLibrary = {yellow: yellowSprite,
                green: greenSprite,
                blue: blueSprite};
        this.menu.setInventory(["yellow", "green", ""]);
    },

    draw: function() {
        clear_to_color(canvasBuffer, this.bgColour);

        this.menu.draw(canvasBuffer);
    },

    update: function() {
        if(pressed[KEY_Q])
            currentScene = mainMenuScene;

        if(pressed[KEY_W])
            this.menu.selectionUp();

        if(pressed[KEY_S])
            this.menu.selectionDown();

        if(pressed[KEY_A])
            this.menu.selectionLeft();

        if(pressed[KEY_D])
            this.menu.selectionRight();

        if(pressed[KEY_F])
            this.menu.select();
    },
};

///////////////////////////////////////////////////////////////////////////////// Cutscene

const cutScene = {
    sm: null,

    init: function(text) { //takes an array of strings
        this.sm = new Cutscene(text);
    },

    reinit: function(text) { //takes an array of strings
        this.sm.setText(text)
    },

    draw: function() {
        this.sm.draw(canvasBuffer);
    },

    update: function() {
        if(pressed[KEY_F])
        {
            if(this.sm.update())
            {
                currentScene = mainMenuScene;    
            }
        }

        if(pressed[KEY_Q])
        {
            this.sm.resetIndexes();
            this.sm.resetText();
            currentScene = mainMenuScene;
        }
    },
};




/////////////////////////////////////////////////////////////////////////////////
/// Main
/////////////////////////////////////////////////////////////////////////////////

//add 'menuFont'

function init()
{
    allegro_init_all(canvasId, (windowWidth * windowScale), (windowHeight * windowScale));

    htmlCanvas = document.getElementById(canvasId);
    htmlCanvas.getContext("2d").imageSmoothingEnabled = false;

    mainMenuScene.init();
    gameScene.init();
    craftingScene.init(3, [
        false,
        ["", "catalyst"],
        false,
        ["", "forge"],
        ["", "ingredient"],
        ["", "tanning-rack"],
        false,
        ["", "base"],
    ]);
    cutScene.init([
        "There's no actual game",
        "This is just a collection of menu mechanics that I worked on",
        "Things came up and I realised I'm not finishing this game in time",
        "It was also a bit of an ambitious project to solo without an engine",
        "Oh well, fun was had, things were learned",
        "So that's the important part",
        "Have fun with the other games. Cheerio!"
    ]);

    canvasBuffer = create_bitmap(windowWidth, windowHeight);
    
    currentScene = mainMenuScene;
}

function main()
{
    init();
    yellowSprite = create_bitmap(48, 48);
    greenSprite = create_bitmap(48, 48);
    blueSprite = create_bitmap(48, 48);

    ready( function(){
        gameScene.initField();

        rectfill(yellowSprite, 0, 0, 48, 48, makecol(230, 230, 80));
        rectfill(greenSprite, 0, 0, 48, 48, makecol(80, 230, 80));
        rectfill(blueSprite, 0, 0, 48, 48, makecol(80, 80, 230));

        craftingScene.secondInit();

        loop(function(){
            currentScene.update();
            currentScene.draw(); //get the stuff on a buffer
            scaled_sprite(canvas, canvasBuffer, (windowWidth * windowScale) / 2, (windowHeight * windowScale) / 2, windowScale, windowScale); //final draw
        }, BPS_TO_TIMER(60));
    })
}
END_OF_MAIN();