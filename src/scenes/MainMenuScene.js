import { ASSETS, SCENES } from "../utils/constants.js";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MAIN_MENU);
    }

    create() {
        console.log("MainMenuScene created");
        this.add
            .image(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                ASSETS.LOGO
            )
            .setScale(0.5);

        // Add Start Button Text
        const startButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 150,
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

        const leaderboardButton = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 200,
                "Leaderboards",
                { fontSize: "32px", fill: "#0f0" }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }); // Make it interactive

        // TODO: Add Seed input field
        // TODO: Add Difficulty/Customization options
    }
}
