First run,

```
eval $(cat appveyor.env | sed 's/^/export /')
```
or,

```
eval $(cat travis.env | sed 's/^/export /')
```


To test this package in locally run,


```
npm run build && PING_URL=http://localhost:8000/review-apps/2/ node test.js
```
