import { SCENES, ASSETS, EVENTS } from "../utils/constants.js";
import Player from "../gameobjects/Player.js";
import Boss from "../gameobjects/BaseBoss.js";
import BossExecutioner from "../gameobjects/BossExecutioner.js";

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
        // Create Player
        this.player = new Player(this, 200, this.cameras.main.height - 100); // Adjust start position

        // Create Boss (adjust position)
        this.boss = new BossExecutioner(
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

        console.log("Creating Executioner animations...");

        // --- Executioner Idle Animation ---
        // *** VERIFY frame numbers (start/end) based on your 'idle.png' sheet! ***
        this.anims.create({
            key: "exec_idle", // Matches ANIMS.IDLE in BossExecutioner
            frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_IDLE, {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // *** VERIFY frame numbers based on your 'idle2.png' sheet! ***
        this.anims.create({
            key: "exec_idle2", // Matches ANIMS.IDLE2
            frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_IDLE2, {
                start: 0,
                end: 7,
            }), // ADJUST FRAMES
            frameRate: 8,
            repeat: -1,
        });

        // --- Executioner Attacking Animation ---
        // *** VERIFY frame numbers based on your 'attacking.png' sheet! ***
        // Based on your uploaded image, it has 13 frames (indices 0 to 12)
        this.anims.create({
            key: "exec_attack", // Matches ANIMS.ATTACK
            frames: this.anims.generateFrameNumbers(
                ASSETS.EXECUTIONER_ATTACKING,
                { start: 0, end: 12 }
            ), // ADJUST FRAMES
            frameRate: 15, // Adjust speed
            repeat: 0, // Play once
        });

        // --- Executioner Death Animation ---
        // *** VERIFY frame numbers based on your 'death.png' sheet! ***
        this.anims.create({
            key: "exec_death", // Matches ANIMS.DEATH
            frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_DEATH, {
                start: 0,
                end: 8,
            }), // ADJUST FRAMES
            frameRate: 10,
            repeat: 0, // Play once
        });

        // --- Executioner Skill Animation ---
        // *** VERIFY frame numbers based on your 'skill.png' sheet! ***
        this.anims.create({
            key: "exec_skill", // Matches ANIMS.SKILL
            frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_SKILL, {
                start: 0,
                end: 10,
            }), // ADJUST FRAMES
            frameRate: 12,
            repeat: 0,
        });

        // --- Executioner Summon Animation ---
        // *** VERIFY frame numbers based on your 'summon.png' sheet! ***
        this.anims.create({
            key: "exec_summon", // Matches ANIMS.SUMMON
            frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_SUMMON, {
                start: 0,
                end: 7,
            }), // ADJUST FRAMES
            frameRate: 12,
            repeat: 0,
        });

        // --- Add animations for the SUMMONED UNIT's actions using their sheets ---
        // Example:
        // this.anims.create({
        //     key: 'summoned_unit_idle',
        //     frames: this.anims.generateFrameNumbers(ASSETS.EXECUTIONER_SUMMON_IDLE, { start: 0, end: 4 }), // ADJUST
        //     frameRate: 6,
        //     repeat: -1
        // });
        // ... add more for summon_appear, summon_death etc. These would be played on the
        // separate sprite objects created for the summoned units, not the main boss.

        console.log("Executioner animations created.");
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
