import BaseBoss from "./BaseBoss.js";
import { ASSETS } from "../utils/constants.js"; // Assuming you define asset keys there

// Define animation keys for this boss to avoid typos
const ANIMS = {
    IDLE: "exec_idle",
    IDLE2: "exec_idle2", // If you have a second idle animation
    ATTACK: "exec_attack",
    DEATH: "exec_death",
    SKILL: "exec_skill",
    SUMMON: "exec_summon",
    // Add keys for summon unit animations if they are part of this sheet, unlikely
};

export default class BossExecutioner extends BaseBoss {
    constructor(scene, x, y) {
        // --- Constructor ---
        // Pass texture key FOR THE DEFAULT/INITIAL SPRITE (e.g., idle), frame, HP, points
        // Make sure ASSETS.EXECUTIONER_IDLE is loaded correctly in preloader!
        super(scene, x, y, ASSETS.EXECUTIONER_IDLE, 0, 800, 1000);
        // Define animation keys for this boss to avoid typos
        this.ANIMS = {
            IDLE: "exec_idle",
            IDLE2: "exec_idle2", // If you have a second idle animation
            ATTACK: "exec_attack",
            DEATH: "exec_death",
            SKILL: "exec_skill",
            SUMMON: "exec_summon",
            // Add keys for summon unit animations if they are part of this sheet, unlikely
        };

        this.body.allowGravity = true; // Or false if the boss floats/doesn't use standard gravity
        // Adjust hitbox - make sure this matches your new sprites
        // Example: If frames are 100x100, adjust accordingly
        this.body.setSize(30, 90).setOffset(10, 10); // <<< ADJUST these values based on your sprite visuals

        // --- State Management ---
        // Define states relevant to the Executioner
        this.state = "idle"; // Initial state

        // --- Executioner Specific Properties ---
        this.attackCooldown = 2500; // Milliseconds
        this.lastAttackTime = 0;
        this.skillCooldown = 8000;
        this.lastSkillTime = 0;

        // Set the initial texture based on the state (redundant if constructor uses idle)
        // this.anims.play(ANIMS.IDLE); // Play initial animation immediately

        console.log("Executioner Boss Created");
    }

    // --- Override BaseBoss methods ---

    updateAI(time, delta) {
        // --- Implement Executioner specific AI ---
        // This needs actual logic based on player position, timers, health phases etc.
        // Placeholder logic: Decide action based on timers and state

        if (!this.isAlive) {
            this.state = "dead"; // Ensure state is set for death animation
            return; // Don't do AI if dead
        }

        const player = this.scene.player; // Assuming player is accessible via this.scene.player
        if (!player || !player.active) return; // No player, do nothing

        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        // Simple AI Example: Attack if player is close and cooldown is ready
        if (
            this.state !== "attacking" &&
            this.state !== "skill" &&
            this.state !== "summoning"
        ) {
            // Don't interrupt actions
            if (
                distanceToPlayer < 150 &&
                time > this.lastAttackTime + this.attackCooldown
            ) {
                this.startAttack(time);
            } else if (
                distanceToPlayer < 400 &&
                distanceToPlayer > 150 &&
                time > this.lastSkillTime + this.skillCooldown
            ) {
                // Example: Use skill if player is at mid-range
                this.startSkill(time);
            } else {
                // Default to idle if no other action is taken
                this.state = "idle";
                // Maybe add walking logic here if the boss moves
            }
        }

        // If currently performing an action, let the animation complete (handled partly by state checks above)
        // More complex actions might need checks within their own methods or timers.
    }

    updateAnimation() {
        if (!this.isAlive) {
            // Make sure death animation plays only once
            if (this.state !== "dead_playing") {
                this.state = "dead_playing";
                this.anims.play(ANIMS.DEATH, true); // Play death animation
            }
            return;
        }

        // --- Play animation based on the current state ---
        switch (this.state) {
            case "idle":
                // Play the primary idle animation, ignore if already playing
                this.anims.play(ANIMS.IDLE, true);
                break;
            case "idle2": // If you implement logic to switch to idle2
                this.anims.play(ANIMS.IDLE2, true);
                break;
            case "attacking":
                // Play attack anim. 'true' prevents restarting if called multiple times during attack
                // Chain back to idle *after* the attack animation completes
                this.anims
                    .play(ANIMS.ATTACK, true)
                    .once("animationcomplete", () => {
                        // Only switch back if still in attacking state (might have been interrupted)
                        if (this.state === "attacking") {
                            this.state = "idle";
                        }
                    });
                break;
            case "skill":
                this.anims
                    .play(ANIMS.SKILL, true)
                    .once("animationcomplete", () => {
                        if (this.state === "skill") {
                            this.state = "idle";
                        }
                    });
                break;
            case "summoning":
                this.anims
                    .play(ANIMS.SUMMON, true)
                    .once("animationcomplete", () => {
                        if (this.state === "summoning") {
                            this.state = "idle";
                        }
                    });
                break;
            // Add cases for 'walking', 'jumping', 'taking_damage' etc. if needed
            default:
                this.anims.play(ANIMS.IDLE, true);
        }
    }

    // --- Executioner Specific Methods ---

    startAttack(currentTime) {
        console.log("Executioner: Starting Attack");
        this.state = "attacking";
        this.lastAttackTime = currentTime;
        this.setVelocityX(0); // Stop horizontal movement during attack maybe?
        // Add logic here to actually deal damage or create hitboxes at specific frames
        // Example: Use this.scene.time.delayedCall(...) to time damage with animation
    }

    startSkill(currentTime) {
        console.log("Executioner: Starting Skill");
        this.state = "skill";
        this.lastSkillTime = currentTime;
        this.setVelocityX(0);
        // Add logic for the skill effect (e.g., create projectiles)
    }

    startSummon(currentTime) {
        console.log("Executioner: Starting Summon");
        this.state = "summoning";
        // Add logic for summoning minions
    }

    // Override die() from BaseBoss if you need specific death cleanup BEFORE animation finishes
    // The BaseBoss die() handles disabling physics and fading out AFTER animation.
    // updateAnimation() handles playing the death animation itself.

    // You might override takeDamage if the boss has phases or different reactions to damage
    // takeDamage(amount) {
    //     super.takeDamage(amount); // Call base class method
    //     // Add specific reactions, e.g., change state if HP is low
    //     if (this.hp < this.maxHp / 2 && !this.enteredPhaseTwo) {
    //          this.enteredPhaseTwo = true;
    //          // Change AI, maybe use different skills...
    //     }
    // }
}
