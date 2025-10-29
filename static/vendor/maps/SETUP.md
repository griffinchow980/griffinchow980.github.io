# 地图数据设置指南

## 📥 获取地图数据

### 方法 1: 从 ECharts 官方获取

访问 ECharts 地图示例，从浏览器开发者工具中获取地图数据：

1. **中国地图**
   - 访问: https://echarts.apache.org/examples/zh/editor.html?c=map-china
   - 打开浏览器开发者工具 (F12) -> Network 标签
   - 刷新页面，找到 `china.js` 文件
   - 复制内容保存为 `china.js`

2. **世界地图**
   - 访问: https://echarts.apache.org/examples/zh/editor.html?c=map-world
   - 打开浏览器开发者工具 (F12) -> Network 标签
   - 刷新页面，找到 `world.js` 文件
   - 复制内容保存为 `world.js`

### 方法 2: 从 GitHub 下载

```bash
# 中国地图
curl -o china.js https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/china.json

# 世界地图
curl -o world.js https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json
```

## 📝 文件格式要求

地图数据文件需要是 JavaScript 文件，使用 `echarts.registerMap()` 注册地图。

### 标准格式示例

```javascript
// china.js
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'echarts'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports, require('echarts'));
  } else {
    factory({}, root.echarts);
  }
}(this, function(exports, echarts) {
  var geoJson = {
    "type": "FeatureCollection",
    "features": [
      // ... GeoJSON 数据
    ]
  };
  echarts.registerMap('china', geoJson);
}));
```

或者更简单的格式：

```javascript
// china.js
echarts.registerMap('china', {
  "type": "FeatureCollection",
  "features": [
    // ... GeoJSON 数据
  ]
});
```

## ⚠️ 重要提示

1. **文件命名**: 
   - 中国地图: `china.js`
   - 世界地图: `world.js`

2. **注册名称**: 
   - 文件中的注册名称必须与文件名一致
   - `echarts.registerMap('china', ...)` 对应 `china.js`
   - `echarts.registerMap('world', ...)` 对应 `world.js`

3. **文件位置**: 
   - 将文件放在 `static/vendor/maps/` 目录下
   - 构建后会复制到 `public/vendor/maps/`

## ✅ 验证安装

1. 将地图数据文件放到此目录
2. 重新构建: `hugo`
3. 查看测试页面: `图表功能测试.md`
4. 地图应该正常显示

## 🔍 故障排除

### 地图不显示

1. **检查控制台**: 是否有加载错误？
2. **检查文件路径**: 文件是否在 `public/vendor/maps/` 中？
3. **检查文件内容**: 是否包含 `echarts.registerMap()`？
4. **检查网络**: 在 Network 标签中查看文件是否成功加载

### 地图加载但显示错误

1. **检查注册名称**: `echarts.registerMap()` 的第一个参数是否正确？
2. **检查 GeoJSON 格式**: 数据是否是有效的 GeoJSON？
3. **查看控制台错误**: 具体错误信息是什么？

## 📚 支持的地图

当前系统支持以下地图（需要手动添加数据文件）：

- ✅ `china` - 中国地图
- ✅ `world` - 世界地图

如需添加其他地图：

1. 准备地图 GeoJSON 数据
2. 创建 `<mapname>.js` 文件并注册地图
3. 在 `diagrams.js` 的 `mapFiles` 对象中添加映射

