# ECharts 地图数据

此目录存放 ECharts 地图的 GeoJSON 数据文件。

## 文件列表

- `china.js` - 中国地图 GeoJSON 数据
- `world.js` - 世界地图 GeoJSON 数据

## 数据来源

这些地图数据来自 ECharts 官方地图数据仓库：
https://github.com/apache/echarts/tree/master/test/data/map

## 使用方法

地图数据会在 `diagrams.js` 中自动注册。使用方式：

```json
{
  "geo": {
    "map": "china"  // 或 "world"
  }
}
```

## 注意事项

- 地图数据文件较大，建议在生产环境中考虑 CDN 加载
- 当前使用本地文件以确保离线可用

