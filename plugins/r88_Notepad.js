/*:
@target MZ
@plugindesc Adds a text input notepad to your game.
@author reflector88
@url https://reflector88.itch.io/
@help 

"Notepad 1.1"
This plugin adds an in-game notepad scene for the player to write and save
notes.

Updates
-V1.1 Improved compatibility
____________________________________________________________________________
CONFIGURATION
For simplicity's sake, the plugin uses only monospaced fonts (fonts whose
glyph are all the same width). Common monospaced fonts include Courier,
Consolas, and Lucida Console.

The contents of the notepad are autosaved to the "save" folder when the
scene is closed.

Shift + Backspace and Shift + Delete will erase 5 characters at once.
____________________________________________________________________________

TERMS OF USE
This plugin is free to use in both commercial and non-commercial projects,
though please credit me.


@param Enable Menu Access
@type boolean
@desc Adds a menu option to launch the notepad.
@default true

@param Menu Name
@type string
@parent Enable Menu Access
@desc The name to display in the menu.
@default Notepad

@param Show Clear Button
@type boolean
@parent Enable Menu Access
@default true

@param Show Back Button
@type boolean
@parent Enable Menu Access
@default true

@param Hotkey
@type select
@parent Enable Menu Access
@option tab @option capslock @option ctrl @option alt @option none
@default tab

@param Text Font
@type string
@default Consolas, Courier, rmmz-mainfont
@desc You can use any monospaced typeface. It will choose the first font in the list that exists.

@param Text Size
@text Size
@type number
@parent Text Font
@default 22

@param Text Bold
@text Bold
@type boolean
@parent Text Font
@default false

@param Text Italics
@text Italics
@type boolean
@parent Text Font
@default false

@param Text Color
@text Color
@type string
@parent Text Font
@default #FFFFFF
@desc The color of the text in hexadecimal.

@param Text Line Color
@text Outline Color
@type string
@parent Text Font
@default rgba(0, 0, 0, 0.5)
@desc The red, green, blue, and alpha of the text outline.

@param Text Line Width
@text Outline Width
@type float
@parent Text Font
@default 3
@desc The thickness of the text outline.

@param Line Spacing
@type float
@parent Text Font
@default 3
@desc The empty horizontal space between each line.

@param Window Opacity
@type number
@default 255

@param Window X
@text X Pos
@type string
@parent Window Opacity
@default Graphics.boxWidth / 4

@param Window Y
@text Y Pos
@type string
@parent Window Opacity
@default 52

@param Window Width
@text Width
@type string
@parent Window Opacity
@default Graphics.boxWidth / 2

@param Window Height
@text Height
@type string
@parent Window Opacity
@default Graphics.boxHeight - 52

@param Enable Scene Label
@type boolean
@desc Show the menu name at the top of the notepad window.
@default true

@param Label Opacity
@text Opacity
@type number
@parent Enable Scene Label
@default 0

@param Label X
@text X Pos
@type string
@parent Enable Scene Label
@default Graphics.boxWidth / 4

@param Label Y
@text Y Pos
@type string
@parent Enable Scene Label
@default 0

@param Label Width
@text Width
@type string
@parent Enable Scene Label
@default Graphics.boxWidth / 2

@param Label Height
@text Height
@type string
@parent Enable Scene Label
@default 52

@param Background Image
@type file

@param Image X
@text X Pos
@type string
@parent Background Image
@default 0

@param Image Y
@text Y Pos
@type string
@parent Background Image
@default 0

@param Cursor Length Adjust
@type float
@default 0
@desc Fine tunes the length of the cursor.

@param Cursor Thickness
@type float
@parent Cursor Length Adjust
@default 1
@desc The width of the cursor.

@param Cursor Color
@type string
@parent Cursor Length Adjust
@default #FFFFFF
@desc The color of the cursor in hexadecimal.

@command Open
@text Open Notepad

*/

(() => {
	'use strict';
    var r88 = r88 || {};
    r88.NP = r88.NP || {};
	r88.NP.parameters = PluginManager.parameters('r88_Notepad');
	r88.NP.keyCodes = {
		'tab': '9', 'ctrl': '17', 'alt': '18', 'capslock': '20'
	};
	r88.NP.textBlock = [];

	Input.keyMapper[r88.NP.keyCodes[r88.NP.parameters['Hotkey']]] = 'openNotepad';

	// Adds notebook command to Scene_Menu.
	if (r88.NP.parameters["Enable Menu Access"] === 'true') {

		const r88_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
		Scene_Menu.prototype.createCommandWindow = function () {
			r88_Scene_Menu_createCommandWindow.call(this);

			this._commandWindow.setHandler("notepad", this.commandNotes.bind(this));
		};

		Scene_Menu.prototype.commandNotes = function () {
			SceneManager.push(r88_NoteScene);
		};

		const r88_Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
		Window_MenuCommand.prototype.addMainCommands = function () {
			r88_Window_MenuCommand_addMainCommands.apply(this, arguments);

			const enabled = this.areMainCommandsEnabled();
			const menuName = r88.NP.parameters['Menu Name'];

			this.addCommand(menuName, "notepad", enabled);
		};
	};

	//-----------------------------------------------------------------------------
	// r88_NoteScene
	//
	// The scene class of the notepad.

	function r88_NoteScene() {
		this.initialize(...arguments);
	};

	r88_NoteScene.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_MenuBase.prototype.constructor = Scene_MenuBase;

	r88_NoteScene.prototype.initialize = function () {
		Scene_MenuBase.prototype.initialize.call(this);
		this._typeableWindow = null;
		this._defaultKeyMapper = Object.assign({}, Input.keyMapper);
		this._notesBackground = null;
		this.loadFromFile();

	};

	r88_NoteScene.prototype.create = function () {
		this.createBackground();
		this.createNotesBackground();
		this.updateActor();
		this.createWindowLayer();
		this.createButtons();
		this.createTypeableWindow();
		this.createSceneLabel();
	};

	r88_NoteScene.prototype.createSceneLabel = function () {
		if (r88.NP.parameters['Enable Scene Label'] === 'true') {
			const rect = this.sceneLabelRect();
			const sceneLabel = new Window_Base(rect);
			this.addWindow(sceneLabel);
			sceneLabel.opacity = JSON.parse(r88.NP.parameters['Label Opacity']);
			sceneLabel.drawTextEx(r88.NP.parameters['Menu Name'], 5, -6, this.innerWidth)
		}
	}

	r88_NoteScene.prototype.sceneLabelRect = function () {
		const ww = eval?.(r88.NP.parameters['Label Width']);
		const wh = eval?.(r88.NP.parameters['Label Height']);
		const wx = eval?.(r88.NP.parameters['Label X']);
		const wy = eval?.(r88.NP.parameters['Label Y']);
		return new Rectangle(wx, wy, ww, wh);
	}

	r88_NoteScene.prototype.createNotesBackground = function () {
		let path = r88.NP.parameters['Background Image'];
		if (!path) return;
		const cut = path.lastIndexOf('/');
		const folder = path.slice(0, cut);
		const filename = path.slice(cut);
		const bitmap = ImageManager.loadBitmap(folder, filename);
		this._notesBackground = new Sprite();
		this._notesBackground.bitmap = bitmap;
		this._notesBackground.x = eval?.(r88.NP.parameters['Image X']);
		this._notesBackground.y = eval?.(r88.NP.parameters['Image Y']);
		this.addChild(this._notesBackground);
	};

	r88_NoteScene.prototype.createButtons = function () {

		if (r88.NP.parameters['Show Clear Button'] === 'true') {
			const clearButton = new Sprite_Button("down2");
			this.addWindow(clearButton);
			clearButton.setClickHandler(this.onNotepadClear.bind(this));
			clearButton.x = 0
			clearButton.y = this.buttonAreaTop();

		}

		if (r88.NP.parameters['Show Back Button'] === 'true') {
			const backButton = new Sprite_Button("cancel")
			this.addWindow(backButton);
			backButton.setClickHandler(this.onNotepadClose.bind(this));
			backButton.x = Graphics.boxWidth - backButton.width - 4;
			backButton.y = this.buttonY();
		}
	};

	r88_NoteScene.prototype.createTypeableWindow = function () {
		this._defaultInputs = Input.keyMapper;
		const rect = this.typeableWindowRect();
		const typeableWindow = new r88_TypeableWindow(rect);
		this.addWindow(typeableWindow);
		this._typeableWindow = typeableWindow;
	};

	r88_NoteScene.prototype.typeableWindowRect = function () {
		const ww = eval?.(r88.NP.parameters['Window Width']);
		const wh = eval?.(r88.NP.parameters['Window Height']);
		const wx = eval?.(r88.NP.parameters['Window X']);
		const wy = eval?.(r88.NP.parameters['Window Y']);
		return new Rectangle(wx, wy, ww, wh);
	};

	r88_NoteScene.prototype.saveToFile = function () {
		const textBlock = this._typeableWindow.getTextBlock();
		StorageManager.saveObject("r88_notepad_save", textBlock);
	}

	r88_NoteScene.prototype.loadFromFile = function () {
		const filePath = "save/r88_notepad_save.rmmzsave";
		const fs = require("fs");

		if (fs.existsSync(filePath)) {
			StorageManager.loadObject('r88_notepad_save').then(contents =>
				r88.NP.textBlock = contents);

		} else {
			r88.NP.textBlock = [];
			StorageManager.saveObject("r88_notepad_save", r88.NP.textBlock);
		}
	}

	r88_NoteScene.prototype.onNotepadClose = function () {
		SoundManager.playCancel();
		r88.NP.textBlock = this._typeableWindow.getTextBlock();
		Input.keyMapper = this._defaultKeyMapper;
		this.saveToFile();
		SceneManager.pop();
	}

	r88_NoteScene.prototype.onNotepadClear = function () {
		this._typeableWindow.clearAll();
	}

	//-----------------------------------------------------------------------------
	// r88_TypeableWindow
	//
	// Window for taking user text input.

	function r88_TypeableWindow() {
		this.initialize(...arguments);
	}

	r88_TypeableWindow.prototype = Object.create(Window_Base.prototype);
	r88_TypeableWindow.prototype.constructor = r88_TypeableWindow;

	r88_TypeableWindow.prototype.initialize = function (rect) {
		Window_Base.prototype.initialize.call(this, rect);
		this._defaultInputs = Input.keyMapper;
		this._textBlock = r88.NP.textBlock;
		this._cursorIndex = this._textBlock.length;
		this._cursorMap = [];
		this._cursorX = 0;
		this._cursorY = 0;
		this._shift = false;
		this._charsPerLine = 1000;
		this._cursorBlinkMax = 50;
		this._cursorBlink = 0;
		this._cursorBlinkDuration = this._cursorBlinkMax;
		this._cursorThickness = JSON.parse(r88.NP.parameters['Cursor Thickness']);
		this._lineSpacing = JSON.parse(r88.NP.parameters['Line Spacing']);
		this._specialKeys = {
			8: 'backspace', 13: 'enter', 16: 'shift', 17: 'control', 18: 'alt', 19: 'capslock',
			32: 'space', 27: 'escape', 37: 'left', 38: 'up', 39: 'right', 40: 'down', 46: 'delete'
		}
		this._glyphs = {
			48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8',
			57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g',
			72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o',
			80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w',
			88: 'x', 89: 'y', 90: 'z', 186: ';', 187: '=', 188: ',', 189: '-', 190: '.',
			191: '/', 192: '`', 219: '[', 220: '\\', 221: ']', 222: '\''
		}
		this._glyphsModified = {
			'0': ')', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '8',
			'9': '(', '-': '_', '=': '+', '`': '~', '[': '{', ']': '}', '\\': '|', ';': ':',
			'\'': '\"', ',': '<', '.': '>', '/': '?', ' ': ' ', '¶': '¶', '←': '⇇', '→': '⇉'
		}

		Object.keys(this._specialKeys).forEach(key => {
			Input.keyMapper[key] = this._specialKeys[key];
		});

		Object.keys(this._glyphs).forEach(key => {
			Input.keyMapper[key] = this._glyphs[key];
		});

		this.setFont('Text');
		this._startOffset = 37.1641 * Math.pow(0.9278, this.contents.fontSize)
		this._lineMax = this.calcLineMax();
		this.drawTextBlock();
		this.setBackgroundOptions();
		this.calcCursorPosition();
		this.refresh();
	};

	r88_TypeableWindow.prototype.update = function () {
		Window_Base.prototype.update.call(this);
		this.blinkCursor();
		this.processInputs();
	};

	r88_TypeableWindow.prototype.blinkCursor = function () {
		this._cursorBlink++;

		if (this._cursorBlink >= this._cursorBlinkMax) {
			this._cursorThickness = 0;
			this._cursorBlinkDuration--;

			if (this._cursorBlinkDuration <= 0) {
				this._cursorThickness = JSON.parse(r88.NP.parameters['Cursor Thickness']);
				this._cursorBlink = 0;
				this._cursorBlinkDuration = this._cursorBlinkMax;
			}
		}
		this.refresh();
	}

	r88_TypeableWindow.prototype.resetCursorBlink = function () {
		this._cursorThickness = JSON.parse(r88.NP.parameters['Cursor Thickness']);
		this._cursorBlinkDuration = this._cursorBlinkMax;
		this._cursorBlink = 0;
	}

	r88_TypeableWindow.prototype.setBackgroundOptions = function () {
		this.opacity = JSON.parse(r88.NP.parameters['Window Opacity']);
	};

	r88_TypeableWindow.prototype.getTextBlock = function () {
		return this._textBlock;
	};

	r88_TypeableWindow.prototype.processInputs = function () {

		if (Input.isPressed('shift')) {
			this._shift = true;
		} else {
			this._shift = false;
		}

		if (Input.isRepeated('space')) this.updateTextBlock(' ');
		if (Input.isRepeated('backspace')) this.updateTextBlock('←');
		if (Input.isRepeated('delete')) this.updateTextBlock('→');
		if (Input.isRepeated('enter') && this._cursorMap.length < this._lineMax) {
			this.updateTextBlock('¶');
		}

		if (Input.isRepeated('left')) this.updateCursor('left');
		if (Input.isRepeated('right')) this.updateCursor('right');
		if (Input.isRepeated('up')) this.updateCursor('up');
		if (Input.isRepeated('down')) this.updateCursor('down');

		Object.keys(this._glyphs).forEach(key => {
			if (Input.isRepeated(this._glyphs[key])) {
				this.updateTextBlock(this._glyphs[key]);
			}
		});
	};


	r88_TypeableWindow.prototype.calcLineMax = function () {
		const textHeight = this.textWidth('M') * 2;
		let lineNumber = 0;
		let totalHeight = this._startOffset;

		while (totalHeight < this.innerHeight) {
			totalHeight += this._lineSpacing + textHeight;
			lineNumber++;
		}

		return lineNumber - 1;
	}

	r88_TypeableWindow.prototype.calcCursorPosition = function () {
		let cursorX = 0;
		let cursorY = 0;

		for (let i = 0; i < this._cursorIndex; i++) {
			cursorX++;

			if (cursorX > this._cursorMap[cursorY]) {

				if (this._cursorMap[cursorY] >= this._charsPerLine) {
					cursorX = 1
				} else {
					cursorX = 0
				}
				cursorY++;
			}
		}

		this._cursorX = cursorX;
		this._cursorY = cursorY;
	};

	r88_TypeableWindow.prototype.calcCursorIndex = function () {
		let cursorIndex = 0;

		for (let i = 0; i < this._cursorY; i++) {
			cursorIndex = cursorIndex + this._cursorMap[i] + 1;
		}

		cursorIndex = cursorIndex + this._cursorX;
		this._cursorIndex = cursorIndex;
	};

	r88_TypeableWindow.prototype.drawCursor = function () {
		const charWidth = this.textWidth('M');
		let charHeight = charWidth * 2;
		this.calcCursorPosition();
		const x = 5 + this._cursorX * charWidth;
		const y = this._startOffset + (charHeight + this._lineSpacing) * this._cursorY;
		const rect = new Rectangle(x, y, this._cursorThickness, charHeight + JSON.parse(r88.NP.parameters['Cursor Length Adjust']));
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, r88.NP.parameters['Cursor Color']);
	};

	r88_TypeableWindow.prototype.updateCursor = function (dir) {
		this.resetCursorBlink();
		let cursorX = this._cursorX;
		let cursorY = this._cursorY;
		const lastCursorY = cursorY;

		switch (dir) {
			case 'left':
				if (this._cursorIndex > 0) {
					this._cursorIndex--;
					this.refresh();
				}
				return;
			case 'right':
				if (this._cursorIndex < this._textBlock.length) {
					this._cursorIndex++;
					this.refresh();
				}
				return;
			case 'down':
				if (cursorY >= this._cursorMap.length - 1) return;
				cursorY++;
				break;
			case 'up':
				if (cursorY <= 0) return;
				cursorY--;
				break;
		}


		if (cursorX > this._cursorMap[cursorY] || this._cursorMap[lastCursorY] === 0) {
			cursorX = this._cursorMap[cursorY];
		}

		this._cursorX = cursorX;
		this._cursorY = cursorY;
		this.calcCursorIndex();
		this.refresh();

	};

	r88_TypeableWindow.prototype.updateTextBlock = function (glyph) {
		this.resetCursorBlink();
		let textBlock = this._textBlock;

		if (this._shift && glyph.match(/[a-z]/i)) {
			glyph = glyph.toUpperCase();
		} else if (this._shift) {
			glyph = this._glyphsModified[glyph];
		}

		if (glyph === '⇇' || glyph === '←') {
			const count = (glyph === '⇇') ? 4 : 1;
			for (let i = 0; i < count; i++) {
				if (this._cursorIndex > 0) {
					textBlock.splice(this._cursorIndex - 1, 1);
					this.updateCursor('left');
				}
			}
		} else if (glyph === '⇉' || glyph === '→') {
			const count = (glyph === '⇉') ? 4 : 1;
			for (let i = 0; i < count; i++) {
				if (this._cursorIndex < textBlock.length) {
					textBlock.splice(this._cursorIndex, 1);
				}
			}
		} else {
			textBlock.splice(this._cursorIndex, 0, glyph);
			this.updateCursor('right');
		}

		this._textBlock = textBlock;
		this.refresh();
	};

	r88_TypeableWindow.prototype.drawTextBlock = function () {
		let textBlock = this._textBlock.join('');
		let lineArray = this.wrapText(textBlock);
		const textHeight = this.textWidth('M') * 2;
		let totalHeight = 0;

		for (let i = 0; i < lineArray.length; i++) {
			if (i != 0) totalHeight += this._lineSpacing + textHeight;
			this.drawText(lineArray[i], 5, totalHeight, this.innerWidth);
		}

		this._cursorMap = []
		for (let i = 0; i < lineArray.length; i++) {
			this._cursorMap[i] = lineArray[i].length;
		}

	};


	r88_TypeableWindow.prototype.wrapText = function (text) {
		const pageWidth = this.innerWidth;
		const lineArray = [];
		let line = '';

		for (let i = 0; i < text.length; i++) {
			let char = text[i];
			let lineWidth = line + char;
			lineWidth = this.textWidth(lineWidth);

			if (lineWidth > pageWidth) {
				let cut = line.lastIndexOf(' ');

				if (char === '¶') {
					char = ' ';
				}

				if (lineArray.length + 1 >= this._lineMax) {
					this._textBlock.pop();
					this.updateCursor('left');
					break;
				} else if (cut < 0) {
					lineArray.push(line);
					this._charsPerLine = line.length;
					line = char;

				} else {
					lineArray.push(line.slice(0, cut));
					line = line.slice(cut + 1) + char;
				}
				continue;
			}

			if (char === '¶') {
				lineArray.push(line);
				line = '';
			} else {
				line += char;
			}
		}

		lineArray.push(line);
		return lineArray;
	};

	r88_TypeableWindow.prototype.refresh = function () {
		this.contents.clear();
		this.drawTextBlock();
		this.drawCursor();
	};

	r88_TypeableWindow.prototype.clearAll = function () {
		this.contents.clear();
		this._textBlock = [];
		this._cursorIndex = 0;
		this._cursorX = 0;
		this._cursorY = 0;
	}

	r88_TypeableWindow.prototype.setFont = function (type) {
		const properties = [
			{ key: 'Font', target: 'fontFace' },
			{ key: 'Size', target: 'fontSize' },
			{ key: 'Bold', target: 'fontBold', type: 'boolean' },
			{ key: 'Italics', target: 'fontItalic', type: 'boolean' },
			{ key: 'Color', target: 'textColor' },
			{ key: 'Line Color', target: 'outlineColor' },
			{ key: 'Line Width', target: 'outlineWidth' }
		];

		for (const prop of properties) {
			const parameterKey = type + ' ' + prop.key;
			let value = r88.NP.parameters[parameterKey];

			if (value !== undefined) {
				if (prop.type === 'boolean') {
					value = value === 'true';
				}
				this.contents[prop.target] = value;
			}
		}
	};


	// Hotkeys __________________________________________________________________
	const r88_Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function () {
		r88_Scene_Map_update.apply(this, arguments);

		if (Input.isTriggered('openNotepad')) {
			SceneManager.push(r88_NoteScene);
		}
	};

	const r88_r88_NoteScene_update = r88_NoteScene.prototype.update;
	r88_NoteScene.prototype.update = function () {
		r88_r88_NoteScene_update.apply(this, arguments);

		if (Input.isTriggered('openNotepad') || Input.isTriggered("escape")) {
			this.onNotepadClose();
		}
	};

	// Plugin Commands ___________________________________________________________
	function r88_NP_launch() {
		SceneManager.push(r88_NoteScene);
	};

	PluginManager.registerCommand("r88_Notepad", "Open", r88_NP_launch);
})();