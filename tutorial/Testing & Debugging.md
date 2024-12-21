JavaScript is somewhat infamous for being an error-prone language. If you write JavaScript, you'll spend a lot of time debugging. 

## Open your game without RPG Maker
Instead of opening RPG Maker every time you want to test your project, you can open your game directly from VS Code through a web browser.

Simply download either the Live Server or Live Preview extension for VS Code and open the root directory of your project in VS Code. In Chrome-based browsers, you can open the DevTools console by pressing F12.

You might notice that if you refresh the page, some of your textures might not reload. This happens because the browser is caching your assets. To solve this, simply go into DevTools > Network and check "Disable Cache".


## Console logging
You're surely aware of the `console.log()` method, which prints messages to the console. You can use console logging

or even to see if your program ever reaches the log message.

Another useful method is `console.assert()`, which accepts a boolean and only displays a message if the boolean is false.


## Debugger
Another good reason to use Live Server/Live Preview is that it allows you to attach your  game to VS Code's debugger. A debugger allows you to set breakpoints

You can view the values of all variables in the sidebar.

## TypeScript & JSDoc
The reason JavaScript is so bug-prone is that it lacks static type-checking. This is why you see the infernal message `"any"` whenever you mouse over a variable. This is also why you can add strings to numbers and call functions that don't exist.

With TypeScript and/or JSDoc, the compiler will tell you about the type error before you even run your game. It also makes it easier to read your code

and the correct parameters to add to each function.


Unfortunately, RPG Maker does not include type definitions

meaning that, if you use JSDoc or TypeScript, you'll see a ton of errors.


You'll have to add the type definitions.

RPG Maker does not support TypeScript, but since TypeScript transpiles to JavaScript, you can still use it.

Just use the shell command `tsc --watch` to transpile to JS every time you save your project.