import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from "./scenes/Preloader";
import GameUI from "~/scenes/GameUI";
import GameOver from "~/scenes/GameOver";
import GameStart from "~/scenes/GameStart";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 500,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [Preloader, Game, GameUI, GameOver, GameStart],
	scale: {
		zoom: 2,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
