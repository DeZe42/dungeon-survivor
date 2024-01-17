import Phaser from "phaser";
import {sceneEvents} from "~/events/EventCenter";

export default class GameUI extends Phaser.Scene {
    private _hearts: Phaser.GameObjects.Group
    private _timerText: any
    private _timedEvent: any
    private _initialTime: number

    constructor() {
        super({ key: 'game-ui'})
    }

    create() {

        this._initialTime = 0

        this._timerText = this.add.text(10, 40, `Time: ${this._initialTime}s`, {
            fontSize: '16'
        });
        this._timedEvent = this.time.addEvent({ delay: 1000, callback: this._onTimerEvent, callbackScope: this, loop: true });

        this.add.image(8, 26, 'treasure', 'coin_anim_f0.png')

        const coinsLabel = this.add.text(16, 21, '0', {
            fontSize: '14'
        })

        sceneEvents.on('player-coins-changed', (coins: number) => {
            coinsLabel.text = coins.toString()
        })

        this._hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })

        this._hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        })

        sceneEvents.on('player-health-changed', this._handlePlayerHealthChanged, this)

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this._handlePlayerHealthChanged, this)
            sceneEvents.off('player-coins-changed')
        })
    }

    private _onTimerEvent() {
        this._initialTime += 1
        this._timerText.setText(`Time: ${this._initialTime}s`)
    }

    private _handlePlayerHealthChanged(health: number) {
        this._hearts.children.each((go, idx) => {
            const heart = go as Phaser.GameObjects.Image
            if (idx < health) {
                heart.setTexture('ui-heart-full')
            } else {
                heart.setTexture('ui-heart-empty')
            }

            if (health <= 0) {
                this._timedEvent.remove()
            }
        })
    }
}
