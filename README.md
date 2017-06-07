# Angular Drag Bounce
on screen containers for angular, that are draggable and bounce off each other and the screens edges!

<img src="https://media.giphy.com/media/3oKIPqAIpzziVWE1nG/giphy.gif">

## How to use it

1. import BounceableModule into your root angular module `imports: [ BounceableModule.initialize() ]`
2. use `<as-bounceable>` to wrap content in your templates
3. set style.position to either `absolute` or `fixed` (default: fixed)
4. bind a start position using `[position]="{x: 10, y: 10}"` (default: {x: 0, y: 0})
5. bind a start momentum using `[momentum]="{x: 0, y: -5}"` (default: {x: 0, y: 0})

```
<as-bounceable
  [position]="{ x: 500, y: 500 }"
  style="position: absolute">
  <h1>My cool draggable and bounceable overlay</h1>
  <p>Lorem ispum dolor sit amet</p>
</as-bounceable>
```

### Configure physics calculation
`BounceableModule.initialize(config?)` takes an optional config parameter of type `BounceableConfig` that lets you overwrite the following values
- framesPerSecond (default: 50)
- momentumSlowDownFactor (default: 0.1)
- momentumNullThreshold (default: 0.5)
- airFrictionFactor (default: 0.9)
- edgeBounceFrictionFactor (default: 0.5)

### Things that might come in the future
1. performance improvements
2. better collision detections and handling
3. publish on npm
4. use renderer(2) for dom manipulations
5. use @directive instead of @component

You're more than welcome to create a pull request!
