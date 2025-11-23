// 使用相对路径导入。'.' 代表当前目录 (src)
import './i18n.js';

// ... 其他代码保持不变
import { registerAnalytics } from "@humansignal/core";
registerAnalytics();

import "./app/App";
import "./utils/service-worker";
