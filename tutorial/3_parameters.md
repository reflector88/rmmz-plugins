
##  Parameters
Say that we want the user to be able to input their own text, instead of always seeing "Hello World". A parameter allows your plugin to take input from the user.


### a.) Basic Parameter Syntax

Parameters are defined in the header of your JS file, directly beneath the help section. Let's create our first parameter. Add this to the header of MyFirstPlugin.js:

	@param Text
	@type string
	@default Hello World
	
After you save and reopen the Plugin Manager in RPG Maker, you should see a new parameter called "Text" that prompts the user to enter a string. By default, the string is "Hello World".

The parameter now exists in the "plugins.js" file . To obtain a reference to the parameter's value, we call the `parameters` method of `PluginManager`, passing in the name of our plugin:

	const params = PluginManager.parameters("MyFirstPlugin");
	
The `parameters` function returns an object which contains all of our parameters. The variable `params` is currently referencing the object `{"Text" : "Hello World"}`. Thus, if we write,

	const params = PluginManager.parameters("MyFirstPlugin");
	console.log(params["Text"]);

The plugin will now output whatever the user put in the "Text" parameter.




### c.) Arrays
You can use the array type to allow the user to enter an arbitrary number of values for a single parameter:

	@type string[]



### d.) Structs

Structs are objects that contain their own set of parameters. You can use structs to group related parameters together. In order to create a struct, you must add a separate comment below your header.



You can create arrays of arrays, arrays of structs, structs that contain arrays as parameters, and structs that contain structs as parameters.

### e.) JSON.parse()
All parameter values are strings, including numbers, booleans, arrays, and objects. Take the following parameter:

	@param x
	@type number
	@default 3

When you retrieve the value of the parameter using PluginManager.parameters, the value is not the number `3`, but rather the character `"3"`:


	params['x'] === 3; // FALSE
	params['x'] === "3"; // TRUE


The reason all parameters are strings is because they are stored in JavaScript Object Notation (JSON). In order to transform a JSON string to code, use the function `JSON.parse()`.

	JSON.parse(params['x']) === 3; // TRUE

The same can be done with stringified arrays and objects:

	const x = "[9, 9, 3]"
	const y = "{month: "Feb", date: 27}"

	JSON.parse(x) === [0 ,9 ,3]; // TRUE
	JSON.parse(y) === {month: "Feb", date: 27}; // TRUE

You have to be especially careful with Structs. Both the Struct itself and all of its parameters are stringified, so you will have to parse both the Struct and any non-string value that you retrieve from the Struct object.