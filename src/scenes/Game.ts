import Phaser from 'phaser'
import {debugDraw} from "~/utils/debug";
import {createQueenAnims} from "~/anims/EnemeyAnims";
import {createThiefAnims} from "~/anims/CharacterAnims";
import Queen from "~/enemies/Queen";
import '../characters/Thief'
import Thief from "~/characters/Thief";
import {sceneEvents} from "~/events/EventCenter";
import {createChestAnims} from '../anims/TreasureAnims'
import Chest from "~/items/Chest";

export default class Game extends Phaser.Scene
{
    private _cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private _thief!: Thief
    private _knives!: Phaser.Physics.Arcade.Group
    private _queens!: Phaser.Physics.Arcade.Group
    private _timer: any

    private _thiefQueenCollider?: Phaser.Physics.Arcade.Collider

	constructor() {
		super('game')
	}

	preload() {
        this._cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        this.scene.run('game-ui')

        createQueenAnims(this.anims)
        createThiefAnims(this.anims)
        createChestAnims(this.anims)

        const map = this.make.tilemap({ key: 'dungeon' })
        const tileset = map.addTilesetImage('BeachTileset', 'tiles',32, 32)

        const ground = map.createLayer('Ground', tileset)

        ground.setCollisionByProperty({ collides: true })

        const chests = this.physics.add.staticGroup({
            classType: Chest
        })
        const chestsLayer = map.getObjectLayer('Chests')
        chestsLayer.objects.forEach(chestObj => {
            chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, 'treasure')
        })

        debugDraw(ground, this)

        this._knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image
        })

        this._thief = this.add.thief(128, 128, 'thief')
        this._thief.setKnives(this._knives)

        this.cameras.main.startFollow(this._thief, true)

        this._queens = this.physics.add.group({
            classType: Queen,
            createCallback: (go) => {
                const queenGo = go as Queen
                queenGo.body.onCollide = true
            }
        })

        // this._queens.createMultiple({
        //     key: 'queen',
        //     repeat: 10,
        //     setXY: {
        //         x: Phaser.Math.Between(50, this.scale.width - 50),
        //         y: Phaser.Math.Between(50, this.scale.height - 50)
        //     }
        // })

        this._timer = setInterval(() => {
            this._queens.get(Phaser.Math.Between(50, this.scale.width - 50), Phaser.Math.Between(50, this.scale.height - 50), 'queen')
            console.log('spawn')
        }, 1500)

        this.physics.add.collider(this._thief, ground)
        this.physics.add.collider(this._queens, ground)
        // this.physics.add.collider(this._queens, this._queens)

        this.physics.add.collider(this._knives, ground, this._handleKnifeCollideCollision, undefined, this)
        this.physics.add.collider(this._knives, this._queens, this._handleKnifeQueenCollision, undefined, this)

        this.physics.add.collider(this._thief, chests, this._handleThiefChestCollision, undefined, this)

        this._thiefQueenCollider = this.physics.add.collider(this._queens, this._thief, this._handleThiefQueenCollision, undefined, this)
    }

    private _handleKnifeCollideCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this._knives.killAndHide(obj1)
        this._knives.remove(obj1)
    }

    private _handleKnifeQueenCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this._knives.killAndHide(obj1)
        this._knives.remove(obj1)
        this._queens.killAndHide(obj2)
        this._queens.remove(obj2)
    }

    private _handleThiefChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const chest = obj2 as Chest
        this._thief.setChest(chest)
    }

    private _handleThiefQueenCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const queen = obj2 as Queen

        const dx = this._thief.x - queen.x
        const dy = this._thief.y - queen.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

        this._thief.handleDamage(dir)

        sceneEvents.emit('player-health-changed', this._thief.health)

        if (this._thief.health <= 0) {
            clearInterval(this._timer)
            this.scene.stop('game')
            this._thiefQueenCollider?.destroy()
            this.scene.start('game-over', {
                title: 'Game Over'
            })
        }
    }

    update(t: number, dt: number) {
        if (this._thief) {
            this._thief.update(this._cursors)
        }
    }
}
