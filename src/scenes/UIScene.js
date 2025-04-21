import { EVENTS, SCENES } from "../utils/constants.js";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.UI, active: false }); // Start inactive until launched by GameScene
        this.gameScene = null;
        this.playerHPText = null;
        this.bossHPText = null;
        // Add other UI elements (score, timer, etc.)
    }

    // data object is passed from the scene that launched this one (GameScene)
    create(data) {
        console.log("UIScene created");
        this.gameScene = data.gameScene; // Get reference to the main game scene if needed

        // --- Create UI Elements ---
        // Player HP Text
        this.playerHPText = this.add.text(20, 20, "", {
            fontSize: "24px",
            fill: "#0f0",
        });

        // Boss HP Text (position appropriately)
        this.bossHPText = this.add
            .text(this.cameras.main.width - 20, 20, "", {
                fontSize: "24px",
                fill: "#f00",
            })
            .setOrigin(1, 0);

        // --- Listen for events from GameScene or Game Objects ---
        // Ensure GameScene and player/boss exist before setting up listeners
        if (this.gameScene && this.gameScene.events) {
            this.gameScene.events.on(
                EVENTS.UPDATE_PLAYER_HP,
                (hp) => {
                    this.playerHPText.setText(`Player HP: ${hp}`);
                },
                this
            );

            this.gameScene.events.on(
                EVENTS.UPDATE_BOSS_HP,
                (hp) => {
                    this.bossHPText.setText(`Boss HP: ${hp}`);
                },
                this
            );
        }

        // Initial UI setup (get initial values) - Delay slightly to ensure player/boss exist
        this.time.delayedCall(100, () => {
            if (this.gameScene?.player) {
                this.playerHPText.setText(
                    `Player HP: ${this.gameScene.player.hp}`
                );
            }
            if (this.gameScene?.boss) {
                this.bossHPText.setText(`Boss HP: ${this.gameScene.boss.hp}`);
            }
        });

        // TODO: Add mobile on-screen controls if needed
    }

    // update() {
    // If not using events, you could poll data here, but events are better:
    // if(this.gameScene && this.gameScene.player) {
    //     this.playerHPText.setText(`Player HP: ${this.gameScene.player.hp}`);
    // }
    // }
}
