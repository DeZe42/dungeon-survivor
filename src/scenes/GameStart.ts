import Phaser from "phaser";

export default class GameStart extends Phaser.Scene {
    constructor() {
        super('game-start')
    }

    create() {
        this.add.text(this.scale.width * 0.5, 50, 'Dungeon Survivor', {
            fontSize: '48px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5)

        this.add.text(this.scale.width * 0.5, 100, 'Description', {
            fontSize: '24px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5)

        this.add.text(this.scale.width * 0.5, 150, 'Move: up, down, left, right', {
            fontSize: '16px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5)

        this.add.text(this.scale.width * 0.5, 180, 'Throw knife: space', {
            fontSize: '16px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5)

        this.add.text(this.scale.width * 0.5, 200, 'Open chest: space (when you are next to the chest)', {
            fontSize: '16px',
            color: '#FFF'
        }).setOrigin(0.5, 0.5)

        const text = this.add.text(this.scale.width * 0.5, (this.scale.height + 250) * 0.5, "Start game", {
            fontSize: "28px",
            color: "#FFF",
            align: "center"
        }).setOrigin(0.5, 0.5);

        text.setInteractive()

        this.input.on('gameobjectdown', () => {
            this.scene.start('game')
        })
    }
}
