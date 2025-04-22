import BossExecutioner from "../gameobjects/BossExecutioner.js";
import { SCENES, ASSETS } from "../utils/constants.js";

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super(SCENES.PRELOADER);
    }

    preload() {
        console.log("Preloading assets...");
        // Display loading text
        let loadingText = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                "Loading...",
                { fontSize: "32px", fill: "#fff" }
            )
            .setOrigin(0.5);

        // Add a loading bar graphic (optional)
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(
            this.cameras.main.centerX - 160,
            this.cameras.main.centerY,
            320,
            50
        );

        this.load.on("progress", (value) => {
            // console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                this.cameras.main.centerX - 150,
                this.cameras.main.centerY + 10,
                300 * value,
                30
            );
        });

        this.load.on("complete", () => {
            console.log("Preloading complete.");
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            // Start the Main Menu scene
            this.scene.start(SCENES.MAIN_MENU);
        });

        // Load all the assets
        this.load.setPath("assets");
        this.load.image(ASSETS.LOGO, "logo.png");
        this.load.image(
            ASSETS.BACKGROUND_TECH,
            "backgrounds/background-tech.png"
        );
        this.load.image(ASSETS.PLATFORM, "platform.png");
        this.load.image(ASSETS.PLAYER, "player/player.png");

        // Set the base path for these assets (this line remains the same)
        this.load.setPath("assets/bosses/executioner/");

        this.load.spritesheet(ASSETS.EXECUTIONER_ATTACKING, "attacking.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(ASSETS.EXECUTIONER_DEATH, "death.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(ASSETS.EXECUTIONER_IDLE, "idle.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(ASSETS.EXECUTIONER_IDLE2, "idle2.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(ASSETS.EXECUTIONER_SKILL, "skill.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(ASSETS.EXECUTIONER_SUMMON, "summon.png", {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet(
            ASSETS.EXECUTIONER_SUMMON_APPEAR,
            "summon_appear.png",
            {
                frameWidth: 50,
                frameHeight: 50,
            }
        );

        this.load.spritesheet(
            ASSETS.EXECUTIONER_SUMMON_DEATH,
            "summon_death.png",
            {
                frameWidth: 50,
                frameHeight: 50,
            }
        );

        this.load.spritesheet(
            ASSETS.EXECUTIONER_SUMMON_IDLE,
            "summon_idle.png",
            {
                frameWidth: 50,
                frameHeight: 50,
            }
        );

        // Reset the path if you load assets from other directories afterwards
        this.load.setPath(); // Or set it to your default assets path
    }

    create() {
        // Create bitmap font and load it in cache
        const config = {
            image: "knighthawks",
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 },
        };
    }
}
