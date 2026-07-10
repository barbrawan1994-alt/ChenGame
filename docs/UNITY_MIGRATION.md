# 超级精灵：Unity 6 原生客户端迁移说明

## 1. 当前交付范围

仓库现在同时保留两套客户端：

- `src/`、Electron/webpack 配置：现有 React/Electron 完整版客户端，继续保留并可正常构建、游玩和导出旧存档。
- `UnityClient/`：Unity 6.5（`6000.5.3f1`）创建的原生 2D URP 客户端，不是 WebView 或网页套壳。

Unity 端当前是一个可玩的**原生垂直切片与后续迁移底座**，已经包含：

- 32×22 程序化原生地图、像素训练师和精灵运行时绘制；
- 键盘方向键/WASD、手柄移动，原生镜头跟随和地图边界；
- URP 2D 日夜光照、雨、萤火等环境表现；
- 距离触发随机遭遇；
- 原生回合战斗、技能选择、血条、战斗动画、震屏、胜利/失败与撤离；
- 探索 HUD、地图扫描、坐标与 FPS；
- Unity 独立原生存档，以及旧客户端存档的安全导入入口；
- 自动化探索 → 遭遇 → 战斗 → 返回探索运行验收。

这并不表示原 React 客户端约 35,000 行的所有玩法已经一次性迁完。当前版本完成了可运行的 Unity 核心循环、数据桥、存档桥和可扩展工程结构，后续玩法应按照第 8 节逐步迁移。

## 2. 目录关系

```text
ChenGame/
├── src/                                  # 原 React/Electron 完整客户端（保留）
├── scripts/export-unity-data.cjs         # 旧 JS 数据 → Unity JSON 导出器
├── UnityClient/
│   ├── Assets/Scenes/SuperSpirit.unity   # Unity 原生入口场景
│   ├── Assets/StreamingAssets/SuperSpirit/game-data.json
│   ├── Assets/SuperSpirit/Core/          # 启动、状态机、运行验收
│   ├── Assets/SuperSpirit/Data/          # 数据库和存档迁移
│   ├── Assets/SuperSpirit/Exploration/   # 地图、移动、镜头、遭遇
│   ├── Assets/SuperSpirit/Battle/        # 战斗模型、公式和控制器
│   ├── Assets/SuperSpirit/Presentation/  # 运行时美术、环境、震屏
│   ├── Assets/SuperSpirit/UI/            # 原生 HUD 与战斗 UI
│   └── Assets/Tests/EditMode/            # EditMode 单元测试
└── docs/UNITY_MIGRATION.md
```

以下目录是 Unity 本地生成状态，不进入 Git：`Library/`、`Temp/`、`Logs/`、`UserSettings/`、`Builds/`、`Artifacts/` 和 `Assets/_Recovery/`。

## 3. Unity 版本和打开项目

本机已使用：

```text
Unity 6000.5.3f1
/Applications/Unity/Hub/Editor/6000.5.3f1/Unity.app
```

在 Unity Hub 中选择 **Add project from disk**，打开：

```text
/Users/chencheng/ChenGame/UnityClient
```

入口场景：

```text
Assets/Scenes/SuperSpirit.unity
```

也可从终端打开：

```bash
UNITY="/Applications/Unity/Hub/Editor/6000.5.3f1/Unity.app/Contents/MacOS/Unity"
"$UNITY" -projectPath "/Users/chencheng/ChenGame/UnityClient"
```

## 4. 导出旧版游戏数据

Unity 运行时使用结构化 JSON 接入旧客户端已有地图、精灵、技能和属性数据。每次旧数据发生变化后，在仓库根目录运行：

```bash
npm run export:unity-data
```

输出：

```text
UnityClient/Assets/StreamingAssets/SuperSpirit/game-data.json
```

当前已接入的数据量：

- 45 张地图；
- 904 只精灵；
- 485 个技能；
- 26 种属性。

导出脚本只读取原数据并写入 Unity 数据文件，不会修改浏览器存档。

## 5. 旧存档迁移

旧客户端仍使用：

```text
localStorage key: DREAM_RPG_LEGEND_V17_FIXED
saveVersion: 34
```

迁移步骤：

1. 启动旧 React/Electron 客户端；
2. 打开设置页的“Unity 6 原生客户端迁移”；
3. 点击“导出 Unity 迁移存档”；
4. 保持文件名为 `super-spirit-legacy-save.json`，通常会进入“下载”目录；
5. 第一次启动 Unity 客户端。

Unity 会依次在其原生存档目录、桌面、文档和下载目录查找该文件。找到后：

- 原 JSON 会完整备份为 `super-spirit-legacy-save.preserved.json`；
- 当前垂直切片会迁入训练师名、晶币、地图和位置；
- Unity 使用独立的 `super-spirit-unity-save.json`；
- 不删除、不覆盖浏览器/Electron 存档；
- 尚未被 Unity 模型消费的未知旧字段仍保留在备份 JSON 中，供后续迁移阶段继续解析。

macOS 独立包的原生存档目录当前为：

```text
~/Library/Application Support/com.chengame.superspirit.native/
```

## 6. 生成场景、测试和运行验收

设置 Unity 可执行文件：

```bash
UNITY="/Applications/Unity/Hub/Editor/6000.5.3f1/Unity.app/Contents/MacOS/Unity"
PROJECT="/Users/chencheng/ChenGame/UnityClient"
```

重新生成原生场景与项目基线：

```bash
"$UNITY" -batchmode -nographics \
  -projectPath "$PROJECT" \
  -executeMethod SuperSpirit.Editor.SuperSpiritProjectBuilder.BuildProject \
  -quit \
  -logFile /tmp/chengame-unity-compile.log
```

运行 EditMode 测试（Unity 6.5 中平台值使用小写 `editmode`）：

```bash
"$UNITY" -batchmode -nographics \
  -projectPath "$PROJECT" \
  -runTests \
  -testPlatform editmode \
  -testResults /tmp/chengame-unity-tests.xml \
  -logFile /tmp/chengame-unity-tests.log
```

当前测试覆盖旧 JS 伤害公式兼容、最低伤害和非法状态转换。

在编辑器菜单中可以运行：

```text
Super Spirit → Run Automated Validation
```

它只在验收模式下自动执行探索、遭遇和战斗，不影响正常玩家控制。结果和截图位于：

```text
UnityClient/Artifacts/RuntimeValidation/
├── exploration.png
├── battle.png
├── returned-to-exploration.png
└── PASS.txt 或 FAIL.txt
```

## 7. 构建和验收 macOS 原生客户端

构建：

```bash
"$UNITY" -batchmode -nographics \
  -projectPath "$PROJECT" \
  -executeMethod SuperSpirit.Editor.SuperSpiritProjectBuilder.BuildMacPlayer \
  -quit \
  -logFile /tmp/chengame-unity-macos-build.log
```

输出（本地产物，Git 忽略）：

```text
UnityClient/Builds/macOS/SuperSpirit.app
```

直接运行自动验收：

```bash
APP="$PROJECT/Builds/macOS/SuperSpirit.app"
"$APP/Contents/MacOS/超级精灵 · Unity Native" \
  --validate-super-spirit \
  -logFile /tmp/chengame-player-validation.log
```

结果写入：

```text
~/Library/Application Support/com.chengame.superspirit.native/RuntimeValidation/
```

正常游玩时不要传 `--validate-super-spirit`。

## 8. 后续完整迁移矩阵

| 阶段 | 旧版模块 | Unity 实施方向 | 当前状态 |
|---|---|---|---|
| P0 | 数据、原生项目、存档桥 | JSON 导出、Scriptable/运行时模型、独立存档、旧档保全 | 已建立 |
| P1 | 地图探索、移动、镜头、遭遇 | Tilemap/程序化地图、Input System、Camera、世界交互 | 可玩切片已完成 |
| P1 | 核心回合战斗 | 战斗状态机、伤害公式、技能 UI、反馈动画 | 可玩切片已完成 |
| P2 | 精灵图鉴、队伍、养成 | 原生列表虚拟化、队伍编成、升级/进化、数据校验 | 待迁移 |
| P2 | 背包、装备、商店、任务 | ScriptableObject/JSON 目录、库存事务、原生 UI | 待迁移 |
| P2 | 主线剧情和地图事件 | 场景事件图、对话系统、任务状态机、存档版本迁移 | 待迁移 |
| P3 | 无限城、竞技场、远征、矿场、世界 Boss | 独立玩法状态机、共享战斗服务、奖励结算 | 待迁移 |
| P3 | 火影、三国、武侠等扩展玩法 | 按内容包/程序集拆分，复用核心战斗与数据层 | 待迁移 |
| P4 | 美术与声音生产化 | 正式 Sprite/动画、Addressables、音效、音乐、VFX | 待迁移 |
| P4 | 性能和发布 | Profiler、对象池、Sprite Atlas、资源异步加载、签名/公证 | 待迁移 |

建议每个阶段都保留一段时间的双客户端并行：先完成数据一致性和自动化验收，再将对应模块的权威实现切换到 Unity。不要在所有功能迁移完成前删除旧 Electron 客户端。

## 9. 当前质量基线

本次落地验证结果：

- React/Electron：`npm run build` 成功；
- Unity 编译/场景生成：成功，无 C# 编译错误；
- Unity EditMode：3 passed / 0 failed；
- Unity 编辑器：探索 → 遭遇 → 战斗 → 返回探索自动验收通过；
- macOS 独立 Player：同一闭环自动验收通过；
- macOS App：universal `arm64 + x86_64`，本机开发构建约 284 MB；
- 编辑器和独立 Player 验收日志中未发现 `MissingComponentException`、`NullReferenceException` 或验收失败。
