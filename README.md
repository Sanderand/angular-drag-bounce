# angular-drag-bounce
angular on screen containers that are draggable and bounce off each other and the screens edges

<img src="https://media.giphy.com/media/3oKIPqAIpzziVWE1nG/giphy.gif">

## How you use it

1. import BounceableModule into your root angular module `imports: [ BounceableModule.initialize() ]`
2. use `<as-bounceable>` in your templates
3. set style.position to either `absolute` or `fixed`
4. bind a start position using `[position]="{x: 10, y: 10}"`
5. bind a start momentum using `[momentum]="{x: 0, y: -5}"`

```
<as-bounceable
  [position]="{ x: 500, y: 500 }"
  style="position: absolute">
  <h1>My cool draggable and bounceable overlay</h1>
  <p>Lorem ispum dolor sit amet</p>
</as-bounceable>
```

## Configure stuff
`BounceableModule.initialize(config?)` takes an optional config parameter of type `BounceableConfig` that lets you overwrite the following values
- framesPerSecond (default: 50)
- momentumSlowDownFactor (default: 0.1)
- momentumNullThreshold (default: 0.5)
- airFrictionFactor (default: 0.9)
- edgeBounceFrictionFactor (default: 0.5)

## Things that might come
1. performance improvements
2. better collision detections and handling
3. customizing friction, gravity, bounceability, fps ...
5. publish on npm

You're more than welcome to create a pull request!
