# The MZ Framework

You might have noticed the files prefixed `"rmmz_"` in the `.js` folder. These files are identical for every RPG Maker project, and they make up the majority of your game's source code.

You can open these files in your code editor to read and better understand them, but you should never directly alter them.

# Global Variables
If you open `rmmz_managers`, you will find a list of global variables at the top of the file, each set to `null`. A global variable is simply a variable that can be accessed anywhere. They are prefixed with `$`. 

For example, `$gamePlayer` is a reference to the player object. If you wanted the tile x and y coordinates of the player, you could reference the `$gamePlayer.x` and `$gamePlayer.y` properties.

# Classes
The RMMZ framework is object-oriented. In other words, game components are organized into hierarchies where each child component inherits all of the members of its parent.

Open `rmmz_windows` and look through it. You'll notice that the file is split up by comments, each denoting a new window class. You'll also notice that the game components are organized into class hierarchies. For example, `Window_Menu` is a subclass of `Window_MenuBase`, which is a subclass of `Window_Base`, which is a subclass of `Window`.

### Class vs Prototype Syntax

There are two ways to create classes in JavaScript: `prototype` and `class`. If you look in the RMMZ codebase, you'll see it uses the older `prototype` syntax. This is because the MV/MZ was written prior to 2015, before the `class` keyword was introduced.

## Instantiation

You can create a new instance of `Window_Base` and use the `drawText()` method.

## Overriding
Say that I want to

## Extending

You can create a new Window class that inherits from `Window_Base`

### Using Class Syntax
New `class` syntax is fully compatible with the older `prototype` syntax, so you can use `class` to extend classes in the RMMZ codebase.

Here is an example of a custom menu class that inherits from `Scene_Menu`:

	class MyCustomMenu extends Scene_Menu {
		constructor(...args) {
			super(...args);
		}
		update(){
			Scene_Menu.update();
		}
	}

For an example of extensive use of class syntax, look at my Casino plugin.

Note that you cannot dynamically add methods using class syntax, so if you want to add a method to `Sprite_Clickable`, you need to use prototypes.


### Extending


### Overriding


## Common Methods
### initialize()

### create()
### update()
Many classes contain a method called `update()`. This update method is called every frame

, and essentially allows you to interact with the game loop. For example, 

This will be familiar to you if you've ever used another game engine like Unity or Unreal.

