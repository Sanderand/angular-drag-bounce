# Angular Drag Bounce
Sweet on screen containers for angular, that are draggable and bounce off each other and the screens edges!

<img src="https://media.giphy.com/media/3oKIPqAIpzziVWE1nG/giphy.gif">

## How to use it

1. `npm i angular-drag-bounce`
2. import and initialize BounceableModule into your root angular module `imports: [ BounceableModule.initialize() ]`
2. wrap bounceable DOM in `<as-bounceable></as-bounceable>`

Optional:

- set style.position to either `absolute` or `fixed` (default: `fixed`)
- bind a start position using `[position]="{x: 10, y: 10}"` (default: `{x: 0, y: 0}`)
- bind a start momentum using `[momentum]="{x: 0, y: -5}"` (default: `{x: 0, y: 0}`)

```
<as-bounceable
  [position]="{ x: 500, y: 500 }"
  style="position: absolute; background: #fff; border: 1px solid #000;">
  <h1>My cool draggable and bounceable overlay</h1>
  <p>Lorem ispum dolor sit amet</p>
</as-bounceable>
```

### Configure physics calculation
`BounceableModule.initialize(config?)` takes an optional config parameter of type `BounceableConfig` that lets you overwrite the following values
- framesPerSecond (default: `50`): Calculations per second when containers are moving
- momentumSlowDownFactor (default: `0.1`): New momentums will get multiplied with this number initially
- momentumNullThreshold (default: `0.5`): If a containers momentum goes below this value, it will stop moving completely 
- airFrictionFactor (default: `0.9`): How much of a containers velocity remains after one calculation cycle
- edgeBounceFrictionFactor (default: `0.5`): How much energy is lost when a container hits the screen edge

### Things that might come in the future
1. Further performance improvements
2. Use `Renderer`/`Renderer2` for DOM manipulations

Please create pull requests for changes that you'd like to see :)
