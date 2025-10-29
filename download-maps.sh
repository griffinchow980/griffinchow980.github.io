#!/bin/bash
# 下载 ECharts 地图数据

set -e

TARGET_DIR="static/vendor/maps"
mkdir -p "$TARGET_DIR"

echo "📥 下载 ECharts 地图数据..."
echo ""

# 下载中国地图
echo "下载中国地图 (china.js)..."
curl -L "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json" | \
  cat <(echo 'echarts.registerMap("china",') - <(echo ');') > "$TARGET_DIR/china.js"

echo "✅ 中国地图下载完成"
echo ""

# 下载世界地图
echo "下载世界地图 (world.js)..."
# 尝试多个数据源
WORLD_DOWNLOADED=false

# 尝试 GitHub 数据源（最稳定）
if curl -f -L "https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json" 2>/dev/null > "$TARGET_DIR/world.json.tmp"; then
  if [ -s "$TARGET_DIR/world.json.tmp" ]; then
    cat <(echo 'echarts.registerMap("world",') "$TARGET_DIR/world.json.tmp" <(echo ');') > "$TARGET_DIR/world.js"
    rm -f "$TARGET_DIR/world.json.tmp"
    echo "✅ 世界地图下载完成 (使用 GitHub 数据源)"
    WORLD_DOWNLOADED=true
  fi
fi

# 如果 GitHub 失败，尝试 jsDelivr CDN
if [ "$WORLD_DOWNLOADED" = false ]; then
  if curl -f -L "https://cdn.jsdelivr.net/npm/echarts@5/map/json/world.json" 2>/dev/null > "$TARGET_DIR/world.json.tmp"; then
    if [ -s "$TARGET_DIR/world.json.tmp" ]; then
      cat <(echo 'echarts.registerMap("world",') "$TARGET_DIR/world.json.tmp" <(echo ');') > "$TARGET_DIR/world.js"
      rm -f "$TARGET_DIR/world.json.tmp"
      echo "✅ 世界地图下载完成 (使用 jsDelivr CDN)"
      WORLD_DOWNLOADED=true
    fi
  fi
fi

# 如果都失败了
if [ "$WORLD_DOWNLOADED" = false ]; then
  echo "❌ 世界地图下载失败，所有数据源都无法访问"
  echo "   请手动下载世界地图数据或检查网络连接"
fi
echo ""

echo "🎉 所有地图数据下载完成！"
echo ""
echo "文件位置:"
echo "  - $TARGET_DIR/china.js"
echo "  - $TARGET_DIR/world.js"
echo ""
echo "下一步:"
echo "  1. 运行 'hugo' 重新构建网站"
echo "  2. 刷新浏览器查看地图"

