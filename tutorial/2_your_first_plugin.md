# Your First Plugin

### Creating the Header
Create a new file called **MyFirstPlugin.js** in your plugins folder. Open it in a plaintext editor, then add this comment header to your js file:

	/*:
	@target MZ
	@author
	@plugindesc
	@url
	@help
	*/

At this point, you can load your plugin into the Plugin Manager in RPG Maker, but you won't see anything.

We can change that by completing our header. Aside from telling the engine what version of RPG Maker we're using (`@target MZ`), it also provides the author name, a description of the plugin, a url to a website, and a help text. Each of these corresponds to one of the four text boxes in the Plugin Settings.

Fill in the rest of the header by adding your info directly after each tag. Now when you save and reopen the Plugin Settings, you should see the header text.


### Adding Code

Now let's write our first plugin. Type the following line of code below the header.

	console.log("Hello World");

Save the file, then run your game.
To see the console in game, press F8 or F12 while your game is running, then open the console tab. You should see "Hello World" in the console.