import Phaser from "phaser";

const createQueenAnims = ( anims: Phaser.Animations.AnimationManager ) => {
    anims.create({
        key: 'queen-idle',
        frames: anims.generateFrameNames('queen', { start: 1, end: 4, prefix: 'queen_idle_' }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: 'queen-walk',
        frames: anims.generateFrameNames('queen', { start: 1, end: 4, prefix: 'queen_walk_' }),
        repeat: -1,
        frameRate: 15
    })
}

export {
    createQueenAnims
}
