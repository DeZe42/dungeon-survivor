import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preload')
    }

    preload() {
        this.load.image('tiles', 'tiles/BeachTileset.png')
        this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon-01.json')

        this.load.atlas('thief', 'characters/thief.png', 'characters/thief_atlas.json')
        this.load.atlas('queen', 'characters/queen.png', 'characters/queen_atlas.json')
        this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

        this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
        this.load.image('ui-heart-full', 'ui/ui_heart_full.png')

        this.load.image('knife', 'weapons/weapon_knife.png')
    }

    create() {
        this.scene.start('game-start')
    }
}
