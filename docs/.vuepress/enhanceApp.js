import Vue from 'vue'
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (typeof _hmt !== "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }
    
    next();
  });
  Vue.mixin({
    mounted() {
      // 不加 setTimeout 会有报错，但不影响效果
      setTimeout(() => {
        try {
          docsearch({
            apiKey: '6984245660d18e98719011710b0b828b',
            indexName: 'coder-yarn-learn',
            appId: '9ULXUMDVYU',
            container: '.search-box',
            debug: false
          });
        } catch(e) {
          console.log(e);
        }
      }, 100)
    },
  });

};
