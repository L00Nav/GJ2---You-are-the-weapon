//Global variables
const windowWidth = 640;
const windowHeight = 360;
const windowScale = 1;

let canvasBuffer;

let sentrySprite;


/////////////////////////////////////////////////////////////////////////////////
/// Scenes
/////////////////////////////////////////////////////////////////////////////////

let currentScene;

const mainMenuScene = {
    items: [
        "New Game",
        "Crafting",
        "Text cutscene",
    ],
    selection: 0,
    bgColour: makecol(20, 20, 20),
    font: null,

    draw: function() {
        clear_to_color(canvasBuffer, this.bgColour);

        for (i = 0; i < this.items.length; i++)
            textout_centre(canvasBuffer, font, this.items[i], windowWidth * 0.5, 140 + (i*40), 36, makecol(200, 200, 200), makecol(40, i == this.selection? 150 : 40, 40), 1);
    },

    update: function() {
        if(pressed[KEY_W])
        {
            this.selection--;
            if(this.selection < 0)
                this.selection = this.items.length - 1;
        }

        if(pressed[KEY_S])
        {
            this.selection++;
            if(this.selection > this.items.length - 1)
                this.selection = 0;
        }

        if(pressed[KEY_E])
        {
            if(this.selection == 0)
                currentScene = gameScene;
            if(this.selection == 1)
                currentScene = craftingScene;
            if(this.selection == 2)
                currentScene = cutScene;
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
    allegro_init_all("game_canvas", (windowWidth * windowScale), (windowHeight * windowScale));

    gameScene.init();
    cutScene.init([
        "This is a test",
        "Does that make you upset?",
        "Are you a weak little kitten who's afraid of going through a test? Well, I'm gonna extend the heck out of this message! What're you gonna do about that?",
        "'What's the test for~!? D;'",
        "That's what you sound like!",
    ]);

    canvasBuffer = create_bitmap(windowWidth, windowHeight);
    document.getElementById("game_canvas").getContext("2d").imageSmoothingEnabled = false;
    
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