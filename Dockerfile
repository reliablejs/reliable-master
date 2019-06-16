FROM centos:centos7

RUN yum -y install curl \
    && mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup \
    && curl http://mirrors.163.com/.help/CentOS7-Base-163.repo -o /etc/yum.repos.d/CentOS7-Base-163.repo \
    && yum clean all \
    && yum makecache \
    && yum install -y make \
      bzip2 \
      gcc-c++ \
      ca-certificates \
      xorg-x11-server-Xvfb \
      gtk2 \
      vim \
      git \
      gtk2-devel \
      libXScrnSaver \
      GConf2 \
      libXtst.i686 \
      alsa-lib-devel \
      libXScrnSaver* \
      epel-release \
      libappindicator-gtk3 \
      glibc-common \
      xorg-x11-fonts-Type1 \
      wqy-microhei-fonts \
      wqy-zenhei-fonts \
      thai-scalable-garuda-fonts \
      cjkuni-ukai-fonts \
      cjkuni-uming-fonts

# Variable Layer: Node.js etc.
ENV NODE_VERSION=8.12.0 \
    NODE_REGISTRY=https://npm.taobao.org/mirrors/node \
    CHROMEDRIVER_CDNURL=http://npm.taobao.org/mirrors/chromedriver/ \
    ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ \
    DISPLAY=':99.0' \
    NODE_IN_DOCKER=1

RUN curl -SLO "$NODE_REGISTRY/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
      && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
      && rm "node-v$NODE_VERSION-linux-x64.tar.gz"

COPY . /root/reliable-web

WORKDIR /root/reliable-web

RUN npm install && ln -s /root/logs . \
  && cd view && npm i \
  && npm run build

WORKDIR /root/reliable-web

HEALTHCHECK --interval=10s --retries=6 \
  CMD wget -O /dev/null localhost:9900 || echo 1

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 9900

CMD ["npm", "start"]
