/*:
@target MZ
@plugindesc Simplifies the item menu.
@author reflector88
@help 
"Simple Inventory 1.1"
This plugin removes item categories (weapons, armor, etc.) from the
inventory scene and enables customization options, like changing the size
and position of the window.

Updates
-v1.1 (5/28) Added options for hiding item icon, text, and number.
    Also added option to change the colon separator.
______________________________________________________________________
CONFIGURATION
Inventory is the item list and Help Window is the item description.
X and Y Pos are where the window spawns on the screen, while Width
and Height are the dimensions of the window itself.
______________________________________________________________________

NOTES
If you want quick access to the inventory, use my "Custom Controls"
Plugin to assign a hotkey to Item Menu. The same plugin can also be used
to remove the UI buttons.


TERMS OF USE
Free for use in both commercial and non-commcercial projects, though
please credit me.

@param Columns
@type number
@default 2

@param Hide Item Icon
@type boolean
@desc Hides the icon of the item.
@default false

@param Hide Item Name
@type boolean
@desc Hides the name of the item.
@parent Hide Item Icon
@default false

@param Separator
@type string
@desc The text that separates the item from the number.
@parent Hide Item Icon
@default :

@param Hide Item Number
@type boolean
@desc Hides the item count.
@parent Hide Item Icon
@default false

@param Inventory X Pos
@type number
@default 0

@param Inventory Y Pos
@type number
@default 120

@param Inventory Width
@type number
@default 808

@param Inventory Height
@type number
@default 400

@param Show Help Window
@type boolean
@default true

@param Help Window X Pos
@type number
@default 0

@param Help Window Y Pos
@type number
@default 520

@param Help Window Width
@type number
@default 808

@param Help Window Height
@type number
@default 100

*/

(() => {
    'use strict';

    const parameters = PluginManager.parameters('r88_SimpleInventory');
    const columnNumber = parameters['Columns'];
    const showHelpWindow = JSON.parse(parameters['Show Help Window']);
    const windowX = parameters['Inventory X Pos'];
    const windowY = parameters['Inventory Y Pos'];
    const windowWidth = parameters['Inventory Width'];
    const windowHeight = parameters['Inventory Height'];
    const helpX = parameters['Help Window X Pos'];
    const helpY = parameters['Help Window Y Pos'];
    const helpWidth = parameters['Help Window Width'];
    const helpHeight = parameters['Help Window Height'];

    Scene_MenuBase.prototype.createCustomHelpWindow = function () {
        const rect = this.customHelpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    Scene_MenuBase.prototype.customHelpWindowRect = function () {
        const wx = helpX;
        const wy = helpY;
        const ww = helpWidth;
        const wh = helpHeight
        return new Rectangle(wx, wy, ww, wh);
    };

    if (columnNumber !== 2) {
        Window_ItemList.prototype.maxCols = function () {
            return columnNumber;
        };

    }

    if (JSON.parse(parameters['Hide Item Number'])) {
        Window_ItemList.prototype.drawItem = function (index) {
            const item = this.itemAt(index);
            if (item) {
                const numberWidth = this.numberWidth();
                const rect = this.itemLineRect(index);
                this.changePaintOpacity(this.isEnabled(item));
                this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
                this.changePaintOpacity(1);
            }
        };
    }

    if (parameters['Separator'] !== ':') {
        Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
            if (this.needsNumber()) {
                this.drawText(parameters['Separator'], x, y, width - this.textWidth("00"), "right");
                this.drawText($gameParty.numItems(item), x, y, width, "right");
            }
        };
    }

    if (JSON.parse(parameters['Hide Item Icon']) || JSON.parse(parameters['Hide Item Name'])) {
        Window_Base.prototype.drawItemName = function (item, x, y, width) {
            if (item) {
                const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
                const textMargin = ImageManager.iconWidth + 4;
                const itemWidth = Math.max(0, width - textMargin);
                this.resetTextColor();

                if (!JSON.parse(parameters['Hide Item Icon'])) {
                    this.drawIcon(item.iconIndex, x, iconY);
                }

                if (!JSON.parse(parameters['Hide Item Name'])) {
                    this.drawText(item.name, x + textMargin, y, itemWidth);
                }
            }
        };
    }

    Scene_Item.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        if (showHelpWindow) this.createCustomHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    };


    Scene_Item.prototype.createItemWindow = function () {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_ItemList(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
        this._itemWindow.y -= this._categoryWindow.height;
        this._itemWindow.height += this._categoryWindow.height;
        this._itemWindow.createContents();
        this._categoryWindow.update();
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this.onCategoryOk();
    };

    Scene_Item.prototype.itemWindowRect = function () {
        const wx = windowX;
        const wy = windowY;
        const ww = windowWidth;
        const wh = windowHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

})();