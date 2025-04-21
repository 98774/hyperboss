import BaseBoss from "./BaseBoss.js";
import { ASSETS } from "../utils/constants.js"; // Assuming you define asset keys there

export default class SlimeBoss extends BaseBoss {
    constructor(scene, x, y) {
        // Pass texture key, initial frame (optional), HP, points
        super(scene, x, y, ASSETS.EXECUTIONER_SUMMON, 0, 800, 1000);
        this.body.allowGravity = true; 
        this.body.setSize(48, 32).setOffset(8, 32); // Adjust hitbox
        this.state = "idle";
        // Add slime-specific properties (jump timers, etc.)
        this.jumpTimer = null;
    }

    // --- Override BaseBoss methods ---
    updateAI(time, delta) {
        // Implement Slime specific movement, attack patterns, phase changes...
        // Example: Simple jump periodically
        if (!this.jumpTimer || time > this.jumpTimer) {
            if (this.body.blocked.down) {
                // Only jump if on ground
                this.body.setVelocityY(-300);
                this.body.setVelocityX(Phaser.Math.Between(-100, 100));
                this.state = "jump";
                // Set next jump time
                this.jumpTimer = time + Phaser.Math.Between(2000, 4000);
            }
        }

        if (
            this.body.velocity.y === 0 &&
            this.body.blocked.down &&
            this.state !== "idle"
        ) {
            this.state = "idle"; // Landed
            this.body.setVelocityX(0);
        }
    }

    updateAnimation() {
        // Play animation based on the current state
        if (this.state === "jump") {
            this.anims.play("slime_jump", true);
        } else if (this.state === "attack") {
            // Add attack state
            this.anims.play("slime_attack", true);
        } else {
            // 'idle' or other states
            this.anims.play("slime_idle", true);
        }
    }

    // --- Add Slime-specific methods ---
    // spitProjectile() { ... }
}
