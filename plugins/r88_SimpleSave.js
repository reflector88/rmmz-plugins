/*:
@target MZ
@plugindesc Save/load directly to save slots using plugin commands.
@author reflector88
@url https://reflector88.itch.io/
@help
"Simple Save 1.1"
This plugin allows you to skip the save/load scene, either by using the
default save and continue options or through event commands.

Updates
V1.1 - Improved Compatibility
___________________________________________________________________________
CONFIGURATION
1. Open the event commands window and select "Plugin Command"

2. Select Save or Load, then select a slot to save to or load from

3. Enable Quick Continue in the r88.SS.parameters if you want "Continue" on
the title screen to bypass the save/load scene

4. Enable Quicksave From Menu if you want "Save" in the menu to
bypass the save/load scene. To remove the menu option entirely, go to
Database > System 2 > Menu Commands and uncheck Save.
___________________________________________________________________________

NOTES
If you want to create a Quicksave hotkey, use in conjunction with my Custom
Controls plugin to assign a hotkey to a common event.


TERMS OF USE
This plugin is free to use in both commercial and non-commercial projects,
though please credit me.

@param Quick Continue
@type boolean
@default true
@desc "Continue" from Title Screen will load the latest save instead of
opening the load screen.

@param Continue Slot
@type select
@option 1 @option 2 @option 3 @option 4
@default 1

@param Quicksave From Menu
@type boolean
@default true

@param Menu Slot
@type select
@option 1 @option 2 @option 3 @option 4
@default 1

@command Save
@text Save
@desc Save game to the specified save file.

	@arg File
	@type select
	@option 1 @option 2 @option 3 @option 4
	@default 1

@command Load
@text Load
@desc Load the specified save file.

	@arg File
	@type select
	@option 1 @option 2 @option 3 @option 4
	@default 1

*/

(() => {
	'use strict';
	var r88 = r88 || {};
    r88.SS = r88.SS || {};
	r88.SS.parameters = PluginManager.parameters("r88_SimpleSave");

	const r88_sTitle_commandContinue = Scene_Title.prototype.commandContinue;
	Scene_Title.prototype.commandContinue = function () {
		this._commandWindow.close();
		if (r88.SS.parameters['Quick Continue'] === 'true') {
			DataManager.loadGame(r88.SS.parameters['Continue Slot'])
			.then(() => onLoadSuccess())
			.catch(() => SoundManager.playBuzzer());
		} else {
			r88_sTitle_commandContinue.apply(this, arguments);
		}
	}

	const r88_sMenu_commandSave = Scene_Menu.prototype.commandSave;
	Scene_Menu.prototype.commandSave = function() {
		if (r88.SS.parameters['Quicksave From Menu'] === 'true') {
			executeSave(r88.SS.parameters['Menu Slot']);
			SceneManager.pop(Scene_Menu);
		} else {
			r88_sMenu_commandSave.apply(this, arguments);
		}
	
	};

	function r88_simpleSave(args) {
		const index = args['File'];
		r88_executeSave(index);
	}

	function r88_executeSave(fileNumber) {
		$gameSystem.setSavefileId(fileNumber);
		$gameSystem.onBeforeSave();
		$gameSystem.saveBgm();
		DataManager.saveGame(fileNumber)
			.then(() => SoundManager.playSave())
			.catch(() => SoundManager.playBuzzer());
	}


	function r88_simpleLoad(args) {
		DataManager.loadGame(args['File'])
			.then(() => r88_onLoadSuccess())
			.catch(() => SoundManager.playBuzzer());

	}
	
	function r88_onLoadSuccess() {
		const time = 48/60;

		SoundManager.playLoad();
		AudioManager.fadeOutBgm(time);
		AudioManager.fadeOutBgs(time);
		AudioManager.fadeOutMe(time);

		if ($gameSystem.versionId() !== $dataSystem.versionId) {
			const mapId = $gameMap.mapId();
			const x = $gamePlayer.x;
			const y = $gamePlayer.y;
			const d = $gamePlayer.direction();
			$gamePlayer.reserveTransfer(mapId, x, y, d, 0);
			$gamePlayer.requestMapReload();
		}
		SceneManager.goto(Scene_Map)
		$gameSystem.replayBgm();

	}

	PluginManager.registerCommand("r88_SimpleSave", "Save", r88_simpleSave);
	PluginManager.registerCommand("r88_SimpleSave", "Load", r88_simpleLoad);
})();