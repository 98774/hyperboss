// Define constants, like scene keys, to avoid typos
export const SCENES = {
    PRELOADER: "PreloaderScene",
    MAIN_MENU: "MainMenuScene",
    GAME: "GameScene",
    UI: "UIScene",
    // GAME_OVER: 'GameOverScene'
};

export const ASSETS = {
    LOGO: "logo",
    PLAYER: "player",

    //Backgrounds
    BACKGROUND_TECH: "background-tech",
    PLATFORM: "platform-brick",

    //Executioner
    EXECUTIONER: "executioner",
    EXECUTIONER_ATTACKING: "ex_attacking",
    EXECUTIONER_DEATH: "ex_death",
    EXECUTIONER_IDLE: "ex_idle",
    EXECUTIONER_IDLE2: "ex_idle2",
    EXECUTIONER_SKILL: "ex_skill",
    EXECUTIONER_SUMMON: "ex_summon",
    EXECUTIONER_SUMMON_APPEAR: "ex_summon_appear",
    EXECUTIONER_SUMMON_DEATH: "ex_summon_death",
    EXECUTIONER_SUMMON_IDLE: "ex_summon_idle",

    // Define keys for your assets loaded in Preloader
};

export const EVENTS = {
    PLAYER_DIED: "playerDied",
    UPDATE_PLAYER_HP: "updatePlayerHP",

    BOSS_DIED: "bossDied",
    UPDATE_BOSS_HP: "updateBossHP",
};
