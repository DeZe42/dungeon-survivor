import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    create(data: { title: string }) {
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, data.title, {
            fontSize: '48px',
            color: '#FFF',
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        }).setOrigin(0.5, 0.5)

        const text = this.add.text(this.scale.width * 0.5, (this.scale.height + 100) * 0.5, "Restart game", {
            fontSize: "40px",
            color: "#FFF",
            align: "center"
        }).setOrigin(0.5, 0.5);

        text.setInteractive()

        this.input.on('gameobjectdown', () => {
            this.scene.start('game')
        })
    }
}
