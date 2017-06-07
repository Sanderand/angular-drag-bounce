export interface BounceableConfig {
    framesPerSecond?: number;
    momentumSlowDownFactor?: number;
    momentumNullThreshold?: number;
    airFrictionFactor?: number;
    edgeBounceFrictionFactor?: number;
}

export const DEFAULT_CONFIG: BounceableConfig = {
    framesPerSecond: 50,
    momentumSlowDownFactor: 0.1,
    momentumNullThreshold: 0.5,
    airFrictionFactor: 0.9,
    edgeBounceFrictionFactor: 0.5
};
