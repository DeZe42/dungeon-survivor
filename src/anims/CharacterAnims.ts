import Phaser from 'phaser'

const createThiefAnims = ( anims: Phaser.Animations.AnimationManager ) => {
    anims.create({
        key: 'thief_walk',
        frames: anims.generateFrameNames('thief', { start: 1, end: 4, prefix: 'thief_walk_'}),
        repeat: -1,
        frameRate: 15
    })
    anims.create({
        key: 'thief_idle',
        frames: anims.generateFrameNames('thief', { start: 1, end: 4, prefix: 'thief_idle_'}),
        repeat: -1,
        frameRate: 15
    })
}

export {
    createThiefAnims
}
