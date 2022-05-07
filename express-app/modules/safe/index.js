const xXssProtection = require("x-xss-protection");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header'); // 配置csp安全策略
const safe = (app) => {
  app.use(xXssProtection());
  // CSP 安全策略 只信任 信任源
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF],
      'script-src': [SELF, INLINE, 'somehost.com'],
      'style-src': [SELF, 'mystyles.net'],
      'img-src': [SELF, 'data:', 'images.com'],
      'worker-src': [NONE],
      'block-all-mixed-content': true
    }
  }));
}

module.exports = safe;