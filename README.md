# angular-drag-bounce
angular on screen containers that are draggable and bounce off each other and the screens edges

<img src="https://media.giphy.com/media/3oKIPqAIpzziVWE1nG/giphy.gif">

## How you use it

1. import BounceableModule into your NgModule
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

## Things that might come
1. performance improvements
2. better collision detections and handling
3. customizing friction, gravity, bounceability ...

You're more than welcome to create a pull request!
