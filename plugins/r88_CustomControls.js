/*:
@target MZ
@plugindesc Gives you more control over your game's controls.
@author reflector88
@url https://reflector88.itch.io/
@help 
"Custom Controls 1.3"
This plugin allows you to customize your game's controls (something that
should probably be a default function in RPG Maker, but isn't). It also
adds a few custom hotkey functions like opening menus and triggering
Common Events.

Update
-V1.1 Improved compatibility
-V1.2 Gamepad buttons can be mapped to common events
-V1.3 (5/31) Refactored code. Added support for Left and Right Triggers and 
    Start and Select buttons. Gamepad names are less misleading.
___________________________________________________________________________
CONFIGURATION
1. Double click the desired parameter to bring up a list window. You can
add any number of keys to trigger any given function.

2. Add keys by typing the character into the text box. For multi-digit keys
and numpad keys, use the following terms:

● alt                       ● backspace                 ● num0 - num9                     
● arrowdown                 ● capslock                  ● shift
● arrowleft                 ● ctrl                      ● space
● arrowright                ● enter                     ● tab
● arrowup                   ● esc 

Gamepads are more complicated. All gamepads are different, so you'll have
to do some experimentation with the following buttons to see how they map
to your controller:

● gpadup          ● gpad0           ● gpad4          ● gpad8  
● gpaddown        ● gpad1           ● gpad5          ● gpad9
● gpadleft        ● gpad2           ● gpad6          ● gpad10
● gpadright       ● gpad3           ● gpad7          ● gpad11 

gpad0-3 are usually the face buttons.
gpad4-7 are usually the left and right buttons/triggers.
gpad8-11 are usually start, select, and other buttons.

3. "Disable Mouse Controls" disables all mouse/touch inputs and also
gets rid of the hamburger menu in the top right corner.

___________________________________________________________________________

TERMS OF USE
This plugin is free to use in both commercial and non-commercial projects,
though please credit me.

@param Up
@type string[]
@default ["arrowup", "gpadup"]

@param Down
@type string[]
@default ["arrowdown", "gpaddown"]

@param Left
@type string[]
@default ["arrowleft", "gpadleft"]

@param Right
@type string[]
@default ["arrowright", "gpadright"]

@param Confirm
@type string[]
@default ["z", "gpad0"]

@param Cancel/Menu
@type string[]
@default ["x", "esc"]

@param Sprint
@type string[]
@default ["shift", "gpad2"]

@param Noclip
@type string[]
@default ["ctrl"]

@param Cancel
@type string[]
@default ["gpad1"]

@param Menu Scene
@type string[]
@default ["gpad3"]

@param Item Scene
@type string[]
@default []

@param Skill Scene
@type string[]
@default []

@param Equip Scene
@type string[]
@default []

@param Options Scene
@type string[]
@default []

@param Save Scene
@type string[]
@default []

@param Load Scene
@type string[]
@default []

@param Common Events
@type struct<CommonEventsStruct>[]
@desc Assign hotkeys to trigger Common Events
@default []

@param Disable Mouse Controls
@type boolean
@default false

@param Disable UI Buttons
@type boolean
@default false

*/

/*~struct~CommonEventsStruct:
@param Key
@type string

@param ID
@type common_event
*/

(() => {
    'use strict';

    const parameters = PluginManager.parameters('r88_CustomControls');
    const commonEvents = JSON.parse(parameters['Common Events']);
    const keyCodes = new Map([
        ["1", "49"], ["2", "50"], ["3", "51"], ["4", "52"], ["5", "53"], ["6", "54"], ["7", "55"], ["8", "56"],
        ["9", "57"], ["backspace", "8"], ["tab", "9"], ["enter", "13"], ["shift", "16"], ["ctrl", "17"], ["alt", "18"], ["capslock", "20"], ["esc", "27"],
        ["space", "32"], ["arrowleft", "37"], ["arrowup", "38"], ["arrowright", "39"], ["arrowdown", "40"], ["a", "65"],
        ["b", "66"], ["c", "67"], ["d", "68"], ["e", "69"], ["f", "70"], ["g", "71"], ["h", "72"], ["i", "73"], ["j", "74"],
        ["k", "75"], ["l", "76"], ["m", "77"], ["n", "78"], ["o", "79"], ["p", "80"], ["q", "81"], ["r", "82"], ["s", "83"],
        ["t", "84"], ["u", "85"], ["v", "86"], ["w", "87"], ["x", "88"], ["y", "89"], ["z", "90"], ["num0", "96"],
        ["num1", "97"], ["num2", "98"], ["num3", "99"], ["num4", "100"], ["num5", "101"], ["num6", "102"], ["num7", "103"],
        ["num8", "104"], ["num9", "105"], ["=", "187"], [",", "188"], ["-", "189"], [".", "190"], ["/", "191"], ["`", "192"],
        ["[", "219"], ["\\", "220"], ["]", "221"]
    ]);
    const buttonCodes = new Map([
        ["gpad0", "0"], ["gpad1", "1"], ["gpad2", "2"], ["gpad3", "3"], ["gpad4", "4"], ["gpad5", "5"],
        ["gpad6", "6"], ["gpad7", "7"], ["gpad8", "8"], ["gpad9", "9"], ["gpad10", "10"],
        ["gpad11", "11"], ["gpadup", "12"], ["gpaddown", "13"], ["gpadleft", "14"], ["gpadright", "15"],
    ])
    const keyMappings = new Map([
        ["Up", "up"], ["Left", "left"], ["Down", "down"], ["Right", "right"], ["Confirm", "ok"], ["Cancel/Menu", "escape"],
        ["Sprint", "shift"], ["Noclip", "control"], ["Cancel", "cancel"], ["Menu Scene", "openMenu"], ["Item Scene", "openItem"],
        ["Skill Scene", "openSkill"], ["Equip Scene", "openEquip"], ["Options Scene", "openOptions"], ["Save Scene", "openSave"],
        ["Load Scene", "openLoad"]
    ]);

    for (const key of [16, 17, 27, 37, 38, 39, 40, 88, 90]) {
        delete Input.keyMapper[key];
    }
    for (const key of [0, 1, 2, 3, 12, 13, 14, 15]) {
        delete Input.gamepadMapper[key];
    }

    if (JSON.parse(parameters['Disable Mouse Controls'])) {
        TouchInput.initialize = function () { this.clear() };
        TouchInput._onMouseDown = function (event) { };
    }

    if (JSON.parse(parameters['Disable UI Buttons'])) {
        Scene_Map.prototype.createButtons = function () { };
        Scene_Battle.prototype.createButtons = function () { };
        Scene_MenuBase.prototype.createButtons = function () { };
    }

    for (const [name, action] of keyMappings) {
        const binds = JSON.parse(parameters[name]);

        for (const bind of binds) {
            if (keyCodes.has(bind)) Input.keyMapper[keyCodes.get(bind)] = action;
            else if (buttonCodes.has(bind)) Input.gamepadMapper[buttonCodes.get(bind)] = action;
        }
    }

    for (const commonEvent of commonEvents) {
        const bind = JSON.parse(commonEvent)["Key"];
        const ID = JSON.parse(commonEvent)["ID"];

        if (keyCodes.has(bind)) Input.keyMapper[keyCodes.get(bind)] = 'commonEvent' + ID;
        else if (buttonCodes.has(bind)) Input.gamepadMapper[buttonCodes.get(bind)] = 'commonEvent' + ID;
    }

    const scenes = ["Menu", "Item", "Skill", "Equip", "Options", "Save", "Load"];

    const Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        Scene_Map_update.apply(this, arguments);

        for (const scene of scenes) {
            if (Input.isTriggered("open" + scene)) SceneManager.push(eval?.("Scene_" + scene));
        }

        for (const commonEvent of commonEvents) {
            const ID = JSON.parse(commonEvent)["ID"];

            if (Input.isTriggered('commonEvent' + ID)) {
                $gameTemp.reserveCommonEvent(ID);
            }
        }
    };

    for (const scene of scenes) {
        closeScene(eval?.("Scene_" + scene), "open" + scene);
    }

    function closeScene(sceneClass, trigger) {
        const Scene_update = sceneClass.prototype.update;
        sceneClass.prototype.update = function () {
            Scene_update.apply(this, arguments);

            if (Input.isTriggered(trigger)) {
                SoundManager.playCancel();
                SceneManager.pop();
            }
        };
    }

})();