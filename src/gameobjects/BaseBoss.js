export default class BaseBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, hp, points) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); // Or handle specific bounds

        this.hp = hp;
        this.maxHp = hp;
        this.pointsValue = points; // Score for defeating
        this.isAlive = true;
        // Basic state machine? e.g., this.state = 'idle';
    }

    takeDamage(amount) {
        if (!this.isAlive) return;
        this.hp -= amount;
        this.scene.events.emit("updateBossHP", this.hp, this.maxHp, this); // Pass more info

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        } else {
            // Common damage feedback (can be overridden)
            this.scene.tweens.add({
                /* ... tint tween ... */
            });
        }
        console.log(
            `${this.constructor.name} HP: <span class="math-inline">\{this\.hp\}/</span>{this.maxHp}`,
        );
    }

    die() {
        if (!this.isAlive) return;
        console.log(`${this.constructor.name} Died`);
        this.isAlive = false;
        this.body.setEnable(false); // Disable physics
        // Common death sequence start (can be overridden for specific animations)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => this.destroy(), // Remove from scene completely
        });
        this.scene.events.emit("bossDied", this.pointsValue, this); // Notify GameScene
    }

    preUpdate(time, delta) {
        // Automatically called by Phaser if method exists
        super.preUpdate(time, delta); // Important to keep sprite updating
        if (this.isAlive) {
            this.updateAI(time, delta); // Call specific AI logic
            this.updateAnimation(); // Update animation based on state
        }
    }

    // Abstract methods to be implemented by subclasses
    updateAI(time, delta) {
        // Override in SlimeBoss, RobotBoss, etc.
    }

    updateAnimation() {
        // Override in SlimeBoss, RobotBoss, etc.
    }
}
