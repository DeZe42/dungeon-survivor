import Phaser from "phaser";
import Thief from "~/characters/Thief";
import Body = Phaser.Physics.Arcade.Body;
import StaticBody = Phaser.Physics.Arcade.StaticBody;

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const randomDirection = (exclude: Direction) => {
    let newDirection = Phaser.Math.Between(0, 3)
    while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3)
    }
    return newDirection
}

export default class Queen extends Phaser.Physics.Arcade.Sprite {
    private _direction = Direction.RIGHT
    private _moveEvent: Phaser.Time.TimerEvent
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('queen-idle')


        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

        this._moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this._direction = randomDirection(this._direction)
            },
            loop: true
        })
    }

    destroy(fromScene?: boolean) {
        this._moveEvent.destroy()
        super.destroy(fromScene)
    }

    private handleTileCollision(go: Phaser.GameObjects.GameObject, tiles: Phaser.Tilemaps.Tile) {
        if (go !== this) {
            return
        }

        this._direction = randomDirection(this._direction)
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)

        const speed = 50

        switch (this._direction) {
            case Direction.UP:
                this.setVelocity(0, -speed)
                break

            case Direction.DOWN:
                this.setVelocity(0, speed)
                break

            case Direction.LEFT:
                this.setVelocity(-speed, 0)
                break

            case Direction.RIGHT:
                this.setVelocity(speed, 0)
                break

        }
    }
}
