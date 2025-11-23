const { tocObj } = require('hexo-util');

module.exports = function () {
  return function tableOfContent(str, options = {}) {

      options = Object.assign({
        min_depth: 1,
        max_depth: 6,
      }, options);
    
      const data = tocObj(str, { min_depth: options.min_depth, max_depth: options.max_depth });

    
      if (!data.length) return '';
    
      let html = '';

      data.forEach(item => {
        html += `<li class="toc-list-level-${item.level}"><a href="#${item.id}">${item.text}</a></li>`
      });

      return `<ol class="toc-list">${html}</ol>`;
  };
};
