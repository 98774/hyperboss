import { SCENES } from "../utils/constants.js";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MAIN_MENU);
    }

    create() {
        console.log("MainMenuScene created");
        // Add title
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                "BOSS RUSH GAME",
                { fontSize: "48px", fill: "#fff" }
            )
            .setOrigin(0.5);

        // Add Start Button Text
        const startButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "Start Game",
                { fontSize: "32px", fill: "#0f0" }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }); // Make it interactive

        // Add hover effect (optional)
        startButton.on("pointerover", () =>
            startButton.setStyle({ fill: "#ff0" })
        );
        startButton.on("pointerout", () =>
            startButton.setStyle({ fill: "#0f0" })
        );

        // Add click handler
        startButton.on("pointerdown", () => {
            console.log("Starting game...");
            this.scene.start(SCENES.GAME); // Transition to GameScene
        });

        // TODO: Add Seed input field
        // TODO: Add Difficulty/Customization options
    }
}
