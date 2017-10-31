

## Install

Install the latest version from NPM,

```bash
$ npm i electron-fission --save-dev
```


Initialize your project so that it uploads builds to S3

```bash
$ fission init --bucket my-s3-bucket
```

This will configure your `package.json` to be enabled for S3 uploads. Specifically this will cause all app build uploads to go to the S3 in the following location `<bucket>/<branch>/<commit>/<platform>`.

From now on before you run `electron-builder` you need to give it the current `branch`, `commit`, and `platform` as environement variables. This can be faciliated through `electron-fission` through the `prep` command


```bash
$ fission prep
```

This will create a file called `electron-builder.env` which will contain the current branch, commit, and platform which `electron-builder` will pick up environment variables from.


Next run electron builder and tell it to always publish

```bash
$ electron-builder -p always
```


This will let electron builder publish the build artifacts specified in `package.json:build` to `S3`.

The final thing to do is `ping` the `electron-fission` fission service about the build completion.

```bash
$ fission ping
```

You can then naviate to your projects build page on `getfission.com/#/review-apps/<my-project>`


You can combine all the above steps in one command in your `package.json` as follows,

```json
  "scripts": {
    "fission-publish": "fission prep && npm run dist -- -p always && fission ping"
  }
  ...
```

Then you can just run,

```bash
npm run fission-publish
```


## CI Configuration

For your Mac, Windows, and Linux CIs configure the following secrent env variables in order for fission review apps to be visible on your getfission.com dashboard,

* `API_KEY` - used by `electron-fission` to update your `review apps` dashboard
* `AWS_ACCESS_KEY_ID` - used by `electron-builder` to publish to S3
* `AWS_SECRET_ACCESS_KEY` - used by `electron-builder` to publish to S3

Go to https://getfission.com to get an API_KEY

