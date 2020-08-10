# Reliable-CLI

---

## Installment

```bash
$ npm i reliable-cli -g
```

## Usage

### report

```bash
$ reliable report -c ./reliable.config.js
```

## Configuration

```javascript
module.exports = {
  files: [
    `build/Release-iphonesimulator/${pkg.name}.app`
  ],
  packages: [
    {
      version,
      path: `${pkg.name}.app`,
    }
  ],
  testInfo: {
  },
  extraInfo: {
  }
};
```


| key | value type | description |
| --- | ---   | ---         |
| files | `string[]` | extra build artifacts  |
| packages | `Obejct[]` | core build artifacts |
| testInfo | `Object` | test coverage report |
| extraInfo | `Object` | extra infomation |
| environment | `Object` | ci runner environment |
| gitCommitInfo | `Object` | last commit log by [last-commit-log](//github.com/node-modules/last-commit-log/) |


```json
{
  "files": [],
  "packages": [
  ],
  "testInfo": {
    "tests": 4,
    "passes": 4,
    "linePercent": 91.67,
    "passPercent": 100,
    "testHtmlReporterPath": "http://your-storage-host/example/c153d93/reports/index.html",
    "coverageHtmlReporterPath": "http://your-storage-host/example/c153d93/coverage/index.html"
  },
  "extraInfo": {
    "webpack": "4.27.1",
    "macaca-wd": "2.1.8",
  },
  "environment": {
    "ci": {
      "JOB_NAME": "reliable",
      "RUNNER_TYPE": "GITLAB_CI",
      "BUILD_NUMBER": "123"
    },
    "os": {
      "platform": "linux",
      "nodeVersion": "v8.12.0"
    },
    "platform": "web"
  },
  "gitCommitInfo": {
    "body": "",
    "hash": "9a5ebe6da33ba87a2a70947db2297c0bc3195de1",
    "author": {
      "date": "1545019270",
      "name": "user",
      "email": "user@macacajs.com",
      "relativeDate": "2 minutes ago"
    },
    "gitTag": "",
    "gitUrl": "http://gitlab.com/app/reliable",
    "subject": "feat: update reliable",
    "committer": {
      "date": "1545019270",
      "name": "user",
      "email": "user@macacajs.com",
      "relativeDate": "2 minutes ago"
    },
    "gitBranch": "feat/toast",
    "gitRemote": "http://gitlab-ci-token/app/reliable.git",
    "shortHash": "9a5ebe6",
    "sanitizedSubject": "feat-update"
  }
}
```

## Helper Methods

User helper methods to resolve the iOS and Android platforms.

```javascript
const helper = require('reliable-cli').helper;
const {
  iosUtils,
  androidUtils,
  webUtils,
} = helper;

// frequently methods

https://macacajs.github.io/reliable-cli/

```

## Environment Variable

 | name              | description                  |
| ----------------- | ---------------------------- |
| RELIABLE_SERVER_URL | server url for Reliable server |

```bash
$ RELIABLE_SERVER_URL=http://127.0.0.1:9900 ci.sh
```

## Integration Samples

- [ios-app-bootstrap](//github.com/app-bootstrap/ios-app-bootstrap)
- [android-app-bootstrap](//github.com/app-bootstrap/android-app-bootstrap)
- [web-app-bootstrap](//github.com/app-bootstrap/web-app-bootstrap)
