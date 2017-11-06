[![Travis](https://travis-ci.org/GetFission/electron-fission.svg?branch=master)](https://travis-ci.org/GetFission/electron-fission) [![Appveyor](https://ci.appveyor.com/api/projects/status/hkyq44jaeakkwf86/branch/master?svg=true)](https://ci.appveyor.com/project/levthedev/electron-fission)



# Electron Fission

Electron Fission is a tool to help you manage your Electron application releases. It allows you to roll out a beta release to a small percentage of users, analyze which releases are used by which users, and even roll back releases that have bugs. It has a very small API and is quite easy to setup.

## Install (5 minutes)

### Getting Started

To get started, let's install the latest version from NPM:

```bash
$ npm i electron-fission --save-dev
```

Next, we need to tell Electron Fission which AWS S3 bucket you want to use (or already use) to store your Electron app builds in. Run the following command from your top level directory (it must have a `package.json` file).

```bash
$ fission init --bucket my-s3-bucket
```

Replace `my-s3-bucket` with the URL of your AWS S3 bucket.

This command will configure your `package.json` to be enabled for S3 uploads. Specifically this will cause all app build uploads to go to the AWS S3 bucket in the following location: `<bucket>/<branch>/<commit>/<platform>`.



### Setting Environment Variables

For your Mac, Windows, and Linux CIs configure the following secrent environment variables in order for your releases to be visible on your getfission.com dashboard:

- `API_KEY` - used by Electron Fission to update your dashboard
- `AWS_ACCESS_KEY_ID` - used by `electron-builder` to publish to S3
- `AWS_SECRET_ACCESS_KEY` - used by `electron-builder` to publish to S3

Go to https://getfission.com to get an API_KEY if you don't already have one.



### Building and Releasing

Now that you have initiated the necessary settings for Electon Fission, you are ready to release. Add the following line to your CI configurations - right now, we support Travis and AppVeyor, with more coming soon.


```bash
$ fission prep
```

This command needs to be run before you run your `electron-builder` command, so that it can set the correct environment variables for `electron-builder`.

This command will create a file for `electron-builder` called `electron-builder.env` which will contain the current branch, commit, and platform.


Next run electron builder and tell it to always publish (this is likely what you are already doing to create app releases with `electron-builder`):

```bash
$ electron-builder -p always
```


This will let `electron builder` publish the build artifacts specified in `package.json:build` to AWS S3.

The final step is to `ping` the `electron-fission` fission service about the build completion. This lets our API know that the build was created, and tells us where to find out. This way, you can manage this build from your Electron Fission dashboard.

```bash
$ fission ping
```


If you want to simplify this flow, you can combine all the above steps in one command in your `package.json` as follows,

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

That's all there is to it! It's pretty simple - all you need to do is `init` your project the first time you install Electron Fission, `prep` your project before a build, and `ping` our API after a build.

You can now navigate to your projects build page on `getfission.com/#/review-apps/<my-project>`. If you don't have an account already, you can sign up [] From there, you can manage, roll back, and analyze your releases.

