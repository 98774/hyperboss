import { ASSETS } from "../utils/constants.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS.PLAYER); // Use asset key from preloader

        scene.add.existing(this); // Add to scene's display list
        scene.physics.add.existing(this); // Add to physics simulation

        // --- Physics Properties ---
        this.setCollideWorldBounds(true); // Prevent going off-screen (based on world bounds)
        this.body.setGravityY(300); // Player is affected by gravity
        this.body.setSize(this.width * 0.8, this.height * 0.9); // Adjust physics body size if needed

        // --- Player Stats ---
        this.hp = 100;
        this.speed = 250;
        this.jumpSpeed = 400; // Adjust jump strength
        this.isAlive = true;

        // --- State ---
        this.isJumping = false;

        console.log("Player initialized at", x, y);
    }

    update(cursors, actionKey) {
        if (!this.isAlive) return;

        const body = this.body;

        // --- Movement ---
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true); // Face left
            // Add running animation later
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false); // Face right
            // Add running animation later
        } else {
            this.setVelocityX(0);
            // Add idle animation later
        }

        // --- Jumping ---
        const onGround = body.blocked.down || body.touching.down;
        if (onGround) {
            this.isJumping = false; // Reset jump state when on ground
        }

        // Allow jump only if on ground and Up key is pressed
        if (cursors.up.isDown && onGround) {
            console.log("Player Jump");
            this.setVelocityY(-this.jumpSpeed);
            this.isJumping = true;
            // Add jump animation later
            // Play jump sound: this.scene.sound.play('jump_sound');
        }

        // --- Actions ---
        if (Phaser.Input.Keyboard.JustDown(actionKey)) {
            console.log("Player Action (Attack)");
            // Implement attack logic (e.g., create projectile, play animation)
            this.attack();
        }
    }

    attack() {
        // Placeholder for attack logic
        // Example: Create a projectile
        // new Projectile(this.scene, this.x, this.y, this.flipX);
        console.log("Player attacks!");

        // Simple test: Check if boss exists and deal damage
        if (this.scene.boss && this.scene.boss.active) {
            // Check distance or overlap before damaging
            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.scene.boss.x,
                this.scene.boss.y,
            );
            if (distance < 100) {
                // Example range check for melee
                this.scene.boss.takeDamage(20); // Deal 20 damage
            }
        }
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.hp -= amount;
        console.log(`Player HP: ${this.hp}`);
        this.scene.events.emit("updatePlayerHP", this.hp); // Notify UI

        if (this.hp <= 0) {
            this.die();
        } else {
            // Add feedback like tinting red and brief invulnerability
            this.scene.tweens.add({
                targets: this,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                repeat: 2,
            });
        }
    }

    die() {
        console.log("Player Died");
        this.isAlive = false;
        this.setVelocity(0, 0); // Stop movement
        this.setTint(0xff0000); // Turn red
        // Could play death animation
        this.scene.events.emit("playerDied"); // Notify GameScene
        // Disable physics body after a short delay or animation
        this.scene.time.delayedCall(500, () => {
            // this.body.setEnable(false); // Fully disable physics
        });
    }
}
