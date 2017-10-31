

## Install

Install the latest version from NPM,

```
$ npm i electron-fission --save-dev
```


Initialize your project so that it uploads builds to S3
```
$ fission init --bucket my-s3-bucket
```

This will configure your `package.json` to be enabled for S3 uploads. Specifically this will cause all app build uploads to go to the S3 in the following location `<bucket>/<branch>/<commit>/<platform>`.

From now on before you run `electron-builder` you need to give it the current `branch`, `commit`, and `platform` as environement variables. This can be faciliated through `electron-fission` through the `prep` command


```
$ fission prep
```

This will create a file called `electron-builder.env` which will contain the current branch, commit, and platform which `electron-builder` will pick up environment variables from.


Next run electron builder and tell it to always publish

```
$ electron-builder -p always
```


This will let electron builder publish the build artifacts specified in `package.json:build` to `S3`.

The final thing to do is `ping` the `electron-fission` fission service about the build completion.

```
$ fission ping
```

You can then naviate to your projects build page on `getfission.com/#/review-apps/<my-project>`


You can combine all the above steps in one command in your `package.json` as follows,

```
fission prep && electron-build -p always && electron ping
```
