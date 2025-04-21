import { SCENES, ASSETS, EVENTS } from "../utils/constants.js";
import Player from "../gameobjects/Player.js";
import Boss from "../gameobjects/BaseBoss.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(SCENES.GAME);
        this.player = null;
        this.boss = null;
        this.cursors = null;
        this.wasd = null;
        // Add keys for other actions if needed (e.g., WASD)
        this.actionKey = null;
    }

    create() {
        console.log("GameScene created");
        // Launch the UI Scene in parallel
        this.scene.launch(SCENES.UI, { gameScene: this }); // Pass reference if needed

        this.add.image(0, 0, ASSETS.BACKGROUND_TECH).setOrigin(0, 0);
        this.add
            .image(0, this.cameras.main.height - 100, ASSETS.PLATFORM)
            .setOrigin(0, 0);

        // Create Player
        this.player = new Player(this, 200, this.cameras.main.height - 100); // Adjust start position

        // Create Boss (adjust position)
        this.boss = new Boss(
            this,
            this.cameras.main.width - 200,
            this.cameras.main.height - 150
        );

        // --- Physics Setup ---
        // World bounds (optional, player/boss might have their own)
        this.physics.world.setBounds(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        ); // Example: wider world

        // Simple platform (example)
        const platforms = this.physics.add.staticGroup();
        platforms
            .create(
                this.cameras.main.width / 2,
                this.cameras.main.height - 30,
                null
            ) // Invisible platform base
            .setScale(this.cameras.main.width / 16, 2)
            .refreshBody(); // Adjust scale/size as needed

        // Collisions
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.boss, platforms);
        this.physics.add.collider(
            this.player,
            this.boss,
            this.handlePlayerBossCollision,
            null,
            this
        );

        // --- Input Setup ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // --- Camera ---
        this.cameras.main.setBounds(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        ); // Match world bounds if needed
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Smooth follow

        // --- Event Listeners from game objects ---
        this.events.on(EVENTS.PLAYER_DIED, () => {
            console.log("Player Died Event Received");
            // Handle game over logic here or transition to a GameOverScene
            this.time.delayedCall(1000, () => {
                this.scene.stop(SCENES.UI); // Stop UI scene
                this.scene.start(SCENES.MAIN_MENU); // Go back to menu (or GameOver)
            });
        });

        this.events.on(EVENTS.BOSS_DIED, () => {
            console.log("Boss Died Event Received");
            // Handle victory logic - maybe load next boss or go to results
            this.time.delayedCall(1000, () => {
                // For now, just restart or go to menu
                this.scene.stop(SCENES.UI);
                this.scene.start(SCENES.MAIN_MENU);
            });
        });

        console.log("GameScene setup complete. Player and Boss created.");
    }

    update(time, delta) {
        // Update game objects
        if (this.player && this.player.active) {
            this.player.update(this.cursors, this.actionKey);
        }
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta, this.player); // Pass player ref if boss needs it for AI
        }
    }

    handlePlayerBossCollision(player, boss) {
        // Basic damage logic - placeholder
        console.log("Player collided with Boss");
        // Implement damage taking, knockback etc.
        player.takeDamage(10); // Example call
    }
}
