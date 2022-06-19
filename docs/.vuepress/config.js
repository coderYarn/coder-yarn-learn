const moment = require('moment');
module.exports = {
  title: 'CoderYarn',
  description: 'CoderYarn',
  base: '/coder-yarn-learn/',
  theme: 'reco',
  head: [
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?00ce7bd1e1301dcbbe7a5c1222ae331a";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
     `
    ],
    // ['link', { rel: 'icon', href: '/logo.png' }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    // ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    // ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    // ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    // ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    // ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    // ['meta', { name: 'msapplication-TileColor', content: '#000000' }]


  ],
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    vssueConfig: {
      platform: 'github',
      owner: 'coderYarn',
      repo: 'coder-yarn-learn',
      clientId: '02424aee27015e7f508f',
      clientSecret: '08cde9fa952466e975fced7b4c895f18c8f3cf83',
    }
    ,
    lastUpdated: '上次更新',
    subSidebar: 'auto',
    // valineConfig: {
    //   appId: 'VRITksdSLiWsat9MA6zX4Pmk-gzGzoHsz',// your appId
    //   appKey: 'f47c91a7deaf8cb7e5a1847492062c9a9ab608b1' // your appKey
    // },
    nav: [
      { text: '首页', link: '/' },
      {
        text: 'CoderYarn 的博客',
        items: [
          { text: 'Github', link: 'https://github.com/coderYarn' },
          { text: '掘金', link: 'https://juejin.cn/user/1494936063324973' }
        ]
      }
    ],
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false,
        children: [
          { title: "学前必读", path: "/" }
        ]
      },
      {
        title: "基础学习",
        path: '/handbook/ConditionalTypes',
        collapsable: false,
        children: [
          { title: "条件类型", path: "/handbook/ConditionalTypes" },
          { title: "泛型", path: "/handbook/Generics" }
        ],
      }
    ]
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          moment.locale(lang)
          return moment(timestamp).fromNow()
        }
      }
    ],
    [
      require('./vuepress-plugin-code-copy'),
      {
        'copybuttonText': '复制',
        'copiedButtonText': '已复制！'
      }
    ],

  ]

}
