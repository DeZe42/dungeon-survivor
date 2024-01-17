import Phaser from "phaser";
import Chest from "~/items/Chest";
import { sceneEvents } from '../events/EventCenter'
import P = Phaser.Input.Keyboard.KeyCodes.P;

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            thief(x: number, y: number, texture: string, frame?: string | number): Thief
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

export default class Thief extends Phaser.Physics.Arcade.Sprite {
    private _healthState = HealthState.IDLE
    private _damageTime = 0
    private _health = 3
    private _coins = 0
    private _activeChest?: Chest
    private _knives?: Phaser.Physics.Arcade.Group

    get health() {
        return this._health
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('thief_idle')
    }

    private _throwKnife(direction?: string) {
        if (!this._knives) {
            return
        }

        const vec= new Phaser.Math.Vector2(0, 0)

        switch (direction) {
            case 'up':
                vec.y = -1
                break
            case 'down':
                vec.y = 1
                break
            case 'left':
                vec.x = -1
                break
            case 'right':
                vec.x = 1
                break
            default:
                vec.x = 1
                break
        }

        const angle = vec.angle()
        const knife = this._knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image

        knife.setActive(true)
        knife.setVisible(true)

        knife.setRotation(angle)

        knife.x += vec.x * 16
        knife.y += vec.y * 16

        knife.setVelocity(vec.x * 300, vec.y * 300)
    }

    setChest(chest: Chest) {
        this._activeChest = chest
    }

    setKnives(knives: Phaser.Physics.Arcade.Group) {
        this._knives = knives
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return
        }

        if (this._healthState === HealthState.DAMAGE) {
            return
        }

        --this._health

        if (this._health <= 0) {
            this._healthState = HealthState.DEAD
            this.setVelocity(0, 0)
            this.destroy()
        } else {
            this.setVelocity(dir.x, dir.y)

            this.setTint(0xff0000)

            this._healthState = HealthState.DAMAGE
            this._damageTime = 0
        }
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)

        switch (this._healthState) {
            case HealthState.IDLE:
                break
            case HealthState.DAMAGE:
                this._damageTime += dt
                if (this._damageTime >= 250) {
                    this._healthState = HealthState.IDLE
                    this.setTint(0xffffff)
                    this._damageTime = 0
                }
                break
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this._healthState === HealthState.DAMAGE || this._healthState === HealthState.DEAD) {
            return
        }

        if (!cursors) {
            return
        }

        const leftDown = cursors.left?.isDown
        const rightDown = cursors.right?.isDown
        const upDown = cursors.up?.isDown
        const downDown = cursors.down?.isDown

        if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
            if (this._activeChest) {
                const coins = this._activeChest.open()
                this._coins += coins
                sceneEvents.emit('player-coins-changed', this._coins)
            } else {
                if (leftDown) {
                    this._throwKnife('left')
                } else if (rightDown) {
                    this._throwKnife('right')
                } else if (upDown) {
                    this._throwKnife('up')
                } else if (downDown) {
                    this._throwKnife('down')
                } else {
                    this._throwKnife()
                }
            }
            return
        }

        const speed = 100

        if (leftDown) {
            this.anims.play('thief_walk', true)
            this.setVelocity(-speed, 0)
            this.scaleX = -1
            this.body.offset.x = 24
        } else if (rightDown) {
            this.anims.play('thief_walk', true)
            this.setVelocity(speed, 0)
            this.scaleX = 1
            this.body.offset.x = 8
        } else if (upDown) {
            this.anims.play('thief_walk', true)
            this.setVelocity(0, -speed)
            this.body.offset.y = 10
        } else if (downDown) {
            this.anims.play('thief_walk', true)
            this.setVelocity(0, speed)
        } else {
            this.anims.play('thief_idle', true)
            this.setVelocity(0, 0)
            this.body.offset.y = 10
        }
        if (leftDown || rightDown || upDown || downDown) {
            this._activeChest = undefined
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('thief', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Thief(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

    return sprite
})
