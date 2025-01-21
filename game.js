//Global variables
const windowWidth = 640;
const windowHeight = 360;
var windowScale = 1;
const canvasId = "game_canvas";
let htmlCanvas;

let canvasBuffer;

let sentrySprite;


/////////////////////////////////////////////////////////////////////////////////
/// Scenes
/////////////////////////////////////////////////////////////////////////////////

let currentScene;

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
            "New Game",
            "Options",
            "Crafting",
            "Cutscene",
        ], this.mainId);

        this.optionsMenu = new ListMenu([
            "Scale",
            "Back",
        ], this.optionsId, this.options);

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
                currentScene = gameScene;
                break;
            case 1 | this.mainId:
                this.activeMenu = this.optionsMenu;
                break;
            case 2 | this.mainId:
                currentScene = craftingScene;
                break;
            case 3 | this.mainId:
                currentScene = cutScene;
                break;
            case 1 | this.optionsId:
                this.activeMenu = this.mainMenu;
                break;
            default:
                break;
            }

            // if(this.selection == 2)
            // {
            //     windowScale = 1;
            //     set_gfx_mode(canvasId, windowWidth * windowScale, windowHeight * windowScale);
            //     htmlCanvas.getContext("2d").imageSmoothingEnabled = false;
            // }
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
        draw_sprite(canvasBuffer, sentrySprite, 100.5, 100.5);
    },

    update: function() {
        if(pressed[KEY_ESC])
            currentScene = mainMenuScene;
    },
};

const craftingScene = {

};

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
        if(pressed[KEY_E] || pressed[KEY_SPACE])
        {
            if(this.sm.update())
            {
                currentScene = mainMenuScene;    
            }
        }
    },
}




/////////////////////////////////////////////////////////////////////////////////
/// Main
/////////////////////////////////////////////////////////////////////////////////

//add 'menuFont'

function init()
{
    htmlCanvas = document.getElementById(canvasId);

    allegro_init_all(canvasId, (windowWidth * windowScale), (windowHeight * windowScale));

    mainMenuScene.init();
    gameScene.init();
    cutScene.init([
        "This is a test",
        "Loren ipsum and all that",
    ]);

    canvasBuffer = create_bitmap(windowWidth, windowHeight);
    htmlCanvas.getContext("2d").imageSmoothingEnabled = false;
    
    currentScene = mainMenuScene;
}

function main()
{
    init();
    sentrySprite = load_bmp('./sentry.png');

    ready( function(){
        gameScene.initField();

        loop(function(){
            currentScene.update();
            currentScene.draw(); //get the stuff on a buffer
            scaled_sprite(canvas, canvasBuffer, (windowWidth * windowScale) / 2, (windowHeight * windowScale) / 2, windowScale, windowScale); //final draw
        }, BPS_TO_TIMER(60));
    })
}
END_OF_MAIN();