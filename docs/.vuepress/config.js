'use strict';

const macacaEcosystem = require('macaca-ecosystem');

const name = 'reliable';

const title = 'Reliable';

module.exports = {
  dest: 'docs_dist',
  base: `/${name}/`,

  locales: {
    '/': {
      lang: 'en-US',
      title,
      description: 'Testing management suite with continuous delivery support.',
    },
    '/zh/': {
      lang: 'zh-CN',
      title,
      description: 'Macaca 的持续交付服务套件。',
    },
  },
  head: [
    ['link', {
      rel: 'icon',
      href: 'https://macacajs.github.io/assets/favicon.ico'
    }],
    ['script', {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-49226133-2',
    }, ''],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-49226133-2');
    `],
    ['style', {}, `
      img {
        width: 100%;
      }
    `]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: `macacajs/${name}`,
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
          },
        },
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          macacaEcosystem.en,
        ],
        sidebar: {
          '/guide/': genSidebarConfig([
            'Guide',
            'CI/CD',
            'Community'
          ]),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用',
            buttonText: '刷新',
          },
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          macacaEcosystem.zh,
        ],
        sidebar: {
          '/zh/guide/': genSidebarConfig([
            '使用指南',
            '持续集成',
            '社区支持'
          ]),
        },
      },
    },
  },
};

function genSidebarConfig(arr) {
  return [
    {
      title: arr[0],
      collapsable: false,
      children: [
        'reliable-cli',
        'reliable-web-deploy',
      ],
    },
    {
      title: arr[1],
      collapsable: false,
      children: [
        'integrate-with-jenkins',
        'jenkins-web',
        'jenkins-ios',
        'jenkins-android',
        'integrate-with-gitlab-ci',
      ],
    },
    {
      title: arr[2],
      collapsable: false,
      children: [
        'presentations',
      ],
    },
  ];
}
