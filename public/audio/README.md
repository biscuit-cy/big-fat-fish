# 环境音素材

当前版本**没有接入音频素材**，`src/lib/ambience.ts` 中的总开关 `AMBIENCE_ENABLED` 为 `false`，
所以不会发起任何音频请求，页面是安静的。

如果要启用环境音：

1. 把三个循环音频文件放进本目录：
   - `dawn.mp3` —— 清晨菜市场：远远的叫卖、推车、晨风
   - `afternoon.mp3` —— 午后老街：蝉声、扇子、零星的脚步
   - `night.mp3` —— 深夜烧烤摊：炭火噼啪、油滴、低声闲谈
2. 打开 `src/lib/ambience.ts`，把 `AMBIENCE_ENABLED` 改为 `true`。
3. 重新运行 `npm run dev` 或重新构建。

音频会在用户点燃炉火（第一次手势）后解锁，并在三个时段之间交叉淡入淡出。
HUD 上的「音效开/关」按钮已经接好，静音状态会保存在 localStorage。

建议使用 44.1kHz、128kbps 左右的 mp3，单个文件控制在 1 MB 以内；
循环点尽量做在无爆音的位置。
