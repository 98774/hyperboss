import PreloaderScene from "./scenes/PreloaderScene.js";
import MainMenuScene from "./scenes/MainMenuScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: 800, // Game width in pixels
    height: 600, // Game height in pixels
    parent: "game-container", // ID of the div element to inject the canvas
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 }, // Adjust gravity as needed
            // debug: true // Set to true for physics debugging visuals
        },
    },
    scale: {
        mode: Phaser.Scale.FIT, // Fit the game within the container
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas
    },
    scene: [
        PreloaderScene,
        MainMenuScene,
        GameScene,
        UIScene,
    ],
};

// Instantiate the game
const game = new Phaser.Game(config);
