# 上报客户端

---

## 安装

```bash
$ npm i reliable-cli -D
```

## 使用

### 上报

```bash
$ reliable report -c ./reliable.config.js
```

## 脚本配置

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

## 完整配置

| key | value type | description |
| --- | ---   | ---         |
| files | `string[]` | 构建附属产物 |
| packages | `Obejct[]` | 构建产物 |
| testInfo | `Object` | 测试覆盖率和通过率 |
| extraInfo | `Object` | 额外统计的数据，比如依赖版本信息等 |
| environment | `Object` | ci 运行环境信息 |
| gitCommitInfo | `Object` | git commit 信息 by [last-commit-log](//github.com/node-modules/last-commit-log/) |

上报内容如下：

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
    "subject": "feat: update",
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

## 工具函数

客户端预置了很多各平台常需要的工具函数。

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

## 环境变量

| name              | description                  |
| ----------------- | ---------------------------- |
| RELIABLE_SERVER_URL | Reliable 服务端的访问地址 |

```bash
$ RELIABLE_SERVER_URL=http://127.0.0.1:9900 ci.sh
```

## 集成示例

- [ios-app-bootstrap](//github.com/app-bootstrap/ios-app-bootstrap)
- [android-app-bootstrap](//github.com/app-bootstrap/android-app-bootstrap)
- [web-app-bootstrap](//github.com/app-bootstrap/web-app-bootstrap)
