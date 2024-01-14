import React, { useState } from 'react';
import './App.css';
import Phaser from 'phaser';
import { SCENE_KEYS } from './phaser/scenes/scene-keys';
import { usePhaserGame } from './hooks/usePhaserGame';
import { PreloadScene } from './phaser/scenes/preload-scene';
import { TitleScene } from './phaser/scenes/title-scene';
import { WorldScene } from './phaser/scenes/world-scene';
import { BattleScene } from './phaser/scenes/battle-scene';
import { OptionsScene } from './phaser/scenes/options-scene';
import { TestScene } from './phaser/scenes/test-scene';

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
    scene: [PreloadScene, TitleScene, WorldScene,
      BattleScene, OptionsScene, TestScene],
  }

  const game = usePhaserGame(gameConfig);
  // game?.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
  // game?.scene.add(SCENE_KEYS.WORLD_SCENE, WorldScene);
  // game?.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
  // game?.scene.add(SCENE_KEYS.TITLE_SCENE, TitleScene);
  // game?.scene.add(SCENE_KEYS.OPTIONS_SCENE, OptionsScene);
  // game?.scene.add(SCENE_KEYS.TEST_SCENE, TestScene);
  //game?.scene.start(SCENE_KEYS.PRELOAD_SCENE);

  const gamescene = gameSceneLoaded ? game?.scene?.keys?.GameScene : null;
  
  return (
    <>
      <div id="phaser-div"/>
    </>
  )
}

export default App
