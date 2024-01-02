import React, { useState } from 'react';
import './App.css';
import Phaser from 'phaser';
import { usePhaserGame } from './hooks/usePhaserGame';
import { PreloadScene } from './phaser/scenes/preload-scene';

function App() {
  const [gameSceneLoaded, setGameSceneLoaded] = useState(false);
  const gameConfig = {
    type: Phaser.CANVAS,
    pixelArt: false,
    scale: {
      parent: 'phaser-div',
      width: 1024,
      height: 576,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000000',
    scene: [PreloadScene],
  }

  const game = usePhaserGame(gameConfig);
  const gamescene = gameSceneLoaded ? game?.scene?.keys?.GameScene : null;
  
  return (
    <>
      Hello Everybutties
      <div id="phaser-div"/>
    </>
  )
}

export default App
