import Phaser from 'phaser';
import { DIRECTION } from '../common/direction';
import { TEXT_SPEED, TILE_SIZE } from '../config';
import { TEXT_SPEED_OPTIONS, BATTLE_SCENE_OPTIONS, BATTLE_STYLE_OPTIONS, SOUND_OPTIONS } from '../common/options';
import { exhaustiveGuard } from './guard';

const LOCAL_STORAGE_KEY = 'MONSTER_TAMER_DATA';

/**
 * @typedef GlobalState
 * @type {object}
 * @property {object} player
 * @property {object} player.position
 * @property {number} player.position.x
 * @property {number} player.position.y
 * @property {import('../common/direction.js').Direction} player.direction
 * @property {object} options
 * @property {import('../common/options.js').TextSpeedMenuOptions} options.textSpeed
 * @property {import('../common/options.js').BattleSceneMenuOptions} options.battleSceneAnimations
 * @property {import('../common/options.js').BattleStyleMenuOptions} options.battleStyle
 * @property {import('../common/options.js').SoundMenuOptions} options.sound
 * @property {import('../common/options.js').VolumeMenuOptions} options.volume
 * @property {import('../common/options.js').MenuColorOptions} options.menuColor
 * @property {boolean} gameStarted
 */

/** @type {GlobalState} */
const initialState = {
    player: {
        position: {
        x: 6 * TILE_SIZE,
        y: 21 * TILE_SIZE,
        },
        direction: DIRECTION.DOWN,
    },
    options: {
        textSpeed: TEXT_SPEED_OPTIONS.MID,
        battleSceneAnimations: BATTLE_SCENE_OPTIONS.ON,
        battleStyle: BATTLE_STYLE_OPTIONS.SHIFT,
        sound: SOUND_OPTIONS.ON,
        volume: 4,
        menuColor: 0,
    },
    gameStarted: false,
};

export const DATA_MANAGER_STORE_KEYS = Object.freeze({
    PLAYER_POSITION: 'PLAYER_POSITION',
    PLAYER_DIRECTION: 'PLAYER_DIRECTION',
    OPTIONS_TEXT_SPEED: 'OPTIONS_TEXT_SPEED',
    OPTIONS_BATTLE_SCENE_ANIMATIONS: 'OPTIONS_BATTLE_SCENE_ANIMATIONS',
    OPTIONS_BATTLE_STYLE: 'OPTIONS_BATTLE_STYLE',
    OPTIONS_SOUND: 'OPTIONS_SOUND',
    OPTIONS_VOLUME: 'OPTIONS_VOLUME',
    OPTIONS_MENU_COLOR: 'OPTIONS_MENU_COLOR',
    GAME_STARTED: 'GAME_STARTED',
});

class DataManager extends Phaser.Events.EventEmitter {
  /** @type {Phaser.Data.DataManager} */
    #store;

    constructor() {
        super();
        this.#store = new Phaser.Data.DataManager(this);
        // initialize state with initial values
        this.#updateDataManger(initialState);
    }

    /** @type {Phaser.Data.DataManager} */
    get store() {
        return this.#store;
    }

    /**
     * @returns {void}
     */
    loadData() {
        // attempt to load data from browser storage and populate the data manager
        if (typeof Storage === 'undefined') {
        console.warn(
            `[${DataManager.name}:loadData] localStorage is not supported, will not be able to save and load data.`
        );
        return;
        }

        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData === null) {
        return;
        }
        try {
        // TODO: we should add error handling and data validation at this step to make sure we get the data we expect.
        /** @type {GlobalState} */
        const parsedData = JSON.parse(savedData);
        // update the state with the saved data
        this.#updateDataManger(parsedData);
        } catch (error) {
        console.warn(
            `[${DataManager.name}:loadData] encountered an error while attempting to load and parse saved data.`
        );
        }
    }

    /**
     * @returns {void}
     */
    saveData() {
        // attempt to storage data in browser storage from data manager
        if (typeof Storage === 'undefined') {
        console.warn(
            `[${DataManager.name}:saveData] localStorage is not supported, will not be able to save and load data.`
        );
        return;
        }
        const dataToSave = this.#dataManagerDataToGlobalStateObject();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }

    startNewGame() {
        // get existing data before resetting all of the data, so we can persist options data
        const existingData = { ...this.#dataManagerDataToGlobalStateObject() };
        existingData.player.position = { ...initialState.player.position };
        existingData.player.direction = initialState.player.direction;
        existingData.gameStarted = initialState.gameStarted;
    
        this.#store.reset();
        this.#updateDataManger(existingData);
        this.saveData();
    }

    /**
     * @returns {number}
     */
    getAnimatedTextSpeed() {
        /** @type {import('../common/options.js').TextSpeedMenuOptions | undefined} */
        const chosenTextSpeed = this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED);
        if (chosenTextSpeed === undefined) {
        return TEXT_SPEED.MEDIUM;
        }

        switch (chosenTextSpeed) {
        case TEXT_SPEED_OPTIONS.FAST:
            return TEXT_SPEED.FAST;
        case TEXT_SPEED_OPTIONS.MID:
            return TEXT_SPEED.MEDIUM;
        case TEXT_SPEED_OPTIONS.SLOW:
            return TEXT_SPEED.SLOW;
        default:
            exhaustiveGuard(chosenTextSpeed);
        }
    }

    /**
     * @param {GlobalState} data
     * @returns {void}
     */
    #updateDataManger(data) {
        this.#store.set({
            [DATA_MANAGER_STORE_KEYS.PLAYER_POSITION]: data.player.position,
            [DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION]: data.player.direction,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED]: data.options.textSpeed,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE_ANIMATIONS]: data.options.battleSceneAnimations,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE]: data.options.battleStyle,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND]: data.options.sound,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME]: data.options.volume,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR]: data.options.menuColor,
            [DATA_MANAGER_STORE_KEYS.GAME_STARTED]: data.gameStarted,
        });
    }

    /**
     * @returns {GlobalState}
     */
    #dataManagerDataToGlobalStateObject() {
        return {
            player: {
                position: {
                x: this.#store.get(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION).x,
                y: this.#store.get(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION).y,
                },
                direction: this.#store.get(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION),
            },
            options: {
                textSpeed: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED),
                battleSceneAnimations: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE_ANIMATIONS),
                battleStyle: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE),
                sound: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND),
                volume: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME),
                menuColor: this.#store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR),
            },
            gameStarted: this.#store.get(DATA_MANAGER_STORE_KEYS.GAME_STARTED),
        };
    }
}

export const dataManager = new DataManager();
