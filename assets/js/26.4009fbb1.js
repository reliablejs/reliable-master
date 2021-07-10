(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{459:function(e,a,t){"use strict";t.r(a);var r=t(54),s=Object(r.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"web-服务部署"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#web-服务部署"}},[e._v("#")]),e._v(" Web 服务部署")]),e._v(" "),t("hr"),e._v(" "),t("p",[e._v("注意：运行 reliable 需要启动数据库容器（"),t("code",[e._v("reliable-mysql")]),e._v("）和应用容器（"),t("code",[e._v("reliable-web")]),e._v("）。")]),e._v(" "),t("h2",{attrs:{id:"使用-docker-compose-推荐"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#使用-docker-compose-推荐"}},[e._v("#")]),e._v(" 使用 "),t("a",{attrs:{href:"https://docs.docker.com/compose/",target:"_blank",rel:"noopener noreferrer"}},[e._v("docker-compose"),t("OutboundLink")],1),e._v(" (推荐)")]),e._v(" "),t("h3",{attrs:{id:"生产环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#生产环境"}},[e._v("#")]),e._v(" 生产环境")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# start services")]),e._v("\n$ docker-compose -p reliable -f docker-compose.yml up -d\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# NOTE: if you meet the problem, maybe the issue caused by the existed service, just run the stop command below.")]),e._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# stop services")]),e._v("\n$ docker-compose -p reliable -f docker-compose.yml down\n")])])]),t("p",[e._v("执行 "),t("code",[e._v("docker ps")]),e._v(" 我们能够看到以下容器：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('$  docker ps\nCONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS                            PORTS                               NAMES\n7c641bdb57c6        macacajs/reliable-web:v2   "./entrypoint.sh npm…"   6 seconds ago       Up 5 seconds (health: starting)   0.0.0.0:9900->9900/tcp              reliable_web_1\nf589b1c9046f        macacajs/reliable-mysql    "docker-entrypoint.s…"   6 minutes ago       Up 6 seconds                      0.0.0.0:3306->3306/tcp, 33060/tcp   reliable_mysql_1\n')])])]),t("p",[e._v("第一次运行需添加初始数据，否则服务器会返回500错误：")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("$ "),t("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("NODE_ENV")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("production "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" run db:seed:all\n")])])]),t("p",[e._v("如何进入 MySQL：")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("$ docker "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("exec")]),e._v(" -it reliable_mysql_1 mysql -uroot -preliable\nmysql"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" use reliable"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\nmysql"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" show tables"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\nmysql"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("select")]),e._v(" * from reliable.jobNames"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n")])])]),t("h3",{attrs:{id:"开发环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#开发环境"}},[e._v("#")]),e._v(" 开发环境")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# start services")]),e._v("\n$ docker-compose up\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# stop services")]),e._v("\n$ docker-compose down\n")])])]),t("p",[e._v("Reliable 服务默认运行在 "),t("code",[e._v("http://127.0.0.1:9900")]),e._v("。")]),e._v(" "),t("p",[e._v("Nginx 服务默认运行在 "),t("code",[e._v("http://127.0.0.1:9920")]),e._v("，服务的跟路径在\n"),t("code",[e._v("$HOME/reliable_home/static")]),e._v("，如果不需要也可以去掉这项服务。")]),e._v(" "),t("p",[e._v("需要按需修改 "),t("a",{attrs:{href:"https://github.com/macacajs/reliable/blob/master/docker-compose.yml",target:"_blank",rel:"noopener noreferrer"}},[e._v("docker-compose.yml"),t("OutboundLink")],1),e._v(" 配置。")]),e._v(" "),t("h2",{attrs:{id:"其他-docker-服务部署"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#其他-docker-服务部署"}},[e._v("#")]),e._v(" 其他 "),t("a",{attrs:{href:"https://docs.docker.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker"),t("OutboundLink")],1),e._v(" 服务部署")]),e._v(" "),t("h3",{attrs:{id:"database-container-reliable-mysql"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#database-container-reliable-mysql"}},[e._v("#")]),e._v(" Database container - reliable-mysql")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/Dockerfile",target:"_blank",rel:"noopener noreferrer"}},[e._v("Dockerfile"),t("OutboundLink")],1)]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/README.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("doc"),t("OutboundLink")],1)])]),e._v(" "),t("h3",{attrs:{id:"reliable-main-app-container-backend-and-frontend-reliable-web"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#reliable-main-app-container-backend-and-frontend-reliable-web"}},[e._v("#")]),e._v(" Reliable main app container (backend and frontend) - reliable-web")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://github.com/macacajs/reliable/blob/master/Dockerfile",target:"_blank",rel:"noopener noreferrer"}},[e._v("Dockerfile"),t("OutboundLink")],1)]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/macacajs/reliable/blob/master/docker/reliable-web/README.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("doc"),t("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=s.exports}}]);