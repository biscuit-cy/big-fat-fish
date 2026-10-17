/**
 * 老街内容数据。
 *
 * 整条街分成三个时段，每个时段一屏宽（桌面端世界共 300vw）。
 * 热点在所属时段内以百分比定位：x 为水平位置，y 为距底部的偏移。
 * 每个热点只讲一段故事、只给一枚碎片，集齐 8 枚触发片尾。
 */

export type ZoneId = 'dawn' | 'afternoon' | 'night'

export type HotspotArt = 'stall' | 'poster' | 'cat'

export interface Fragment {
  id: string
  name: string
  quote: string
  seal: string
}

export interface Hotspot {
  id: string
  zone: ZoneId
  art: HotspotArt
  /** 摊位插画的配色变体，对应 CSS 中的 .stall--{theme} */
  theme: string
  name: string
  time: string
  /** 在所属时段内的水平位置（%） */
  x: number
  /** 距时段底部的距离（%） */
  y: number
  intro: string
  story: string[]
  fragment: Fragment
}

export const TOTAL_HOTSPOTS = 8

export const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'chen',
    zone: 'dawn',
    art: 'stall',
    theme: 'chen',
    name: '陈记热干面',
    time: '06:52',
    x: 15,
    y: 10,
    intro: '“过早冇？第一次来？面要掸得干，麻酱才搅得开。”',
    story: [
      '陈伯把面在滚水里一掸，捞起来，手腕一抖，麻酱落进碗里。',
      '“头一回吧？这个辣度，下次我就记住了。”',
      '墙上的录取通知书复印件被油烟熏黄了，他每天收摊前都擦一遍相框。',
    ],
    fragment: {
      id: 'chen',
      name: '辣得蛮扎实',
      quote: '下次来，我记得你的辣度。',
      seal: '壹',
    },
  },
  {
    id: 'zhou',
    zone: 'dawn',
    art: 'stall',
    theme: 'zhou',
    name: '周姐豆皮',
    time: '07:05',
    x: 45,
    y: 16,
    intro: '“赶时间就站着吃，不赶就等这一锅。”',
    story: [
      '你站在旁边等，没催她。',
      '她手上的动作慢了一点：“莫急，好的是要等。”',
      '账本背面，贴着她女儿写“我妈是这条街起得最早的人”的作文奖状。',
    ],
    fragment: {
      id: 'zhou',
      name: '等得及',
      quote: '莫急，好的是要等。',
      seal: '贰',
    },
  },
  {
    id: 'po',
    zone: 'dawn',
    art: 'stall',
    theme: 'po',
    name: '婆婆豆浆',
    time: '07:18',
    x: 75,
    y: 8,
    intro: '“最后一杯了。”',
    story: [
      '婆婆给你多套了一层塑料袋：“带给谁？路上莫洒了。”',
      '豆浆桶见了底，她把最后一点刮进杯里。',
      '“卖了二十年，下大雨也来。总有人等着。”',
    ],
    fragment: {
      id: 'po',
      name: '坐一会儿',
      quote: '卖了二十年，总有人等着。',
      seal: '叁',
    },
  },
  {
    id: 'watch',
    zone: 'afternoon',
    art: 'stall',
    theme: 'watch',
    name: '老周修表摊',
    time: '15:10',
    x: 15,
    y: 12,
    intro: '“表停了不可怕，怕的是没人再上弦。”',
    story: [
      '老周把放大镜卡在眼眶上，镊子尖挑开表壳。',
      '柜台里躺着十几只等修的表，每一只都压着一张写了名字的纸条。',
      '“表没坏，是忘了上弦。”他说完，把一只停了十年的表重新拨动。',
    ],
    fragment: {
      id: 'watch',
      name: '时间会走',
      quote: '表没坏，是忘了上弦。',
      seal: '肆',
    },
  },
  {
    id: 'poster',
    zone: 'afternoon',
    art: 'poster',
    theme: 'poster',
    name: '褪色的旧海报',
    time: '15:40',
    x: 42,
    y: 36,
    intro: '楚剧团，1987 年，最后一场《柜中缘》。',
    story: [
      '海报被雨水泡过，边角卷起来，颜色只剩一层浅浅的红。',
      '背面有人用圆珠笔写：等你回来，老位置。',
      '字迹已经淡了，但每一笔都还在。',
    ],
    fragment: {
      id: 'poster',
      name: '旧纸有光',
      quote: '字淡了，人还记得。',
      seal: '伍',
    },
  },
  {
    id: 'cat',
    zone: 'afternoon',
    art: 'cat',
    theme: 'cat',
    name: '檐下打盹的猫',
    time: '16:20',
    x: 62,
    y: 6,
    intro: '它每天下午都睡在这块青砖上。',
    story: [
      '猫把身子团成一个圆，尾巴垂在台阶外。',
      '有人经过，它耳朵动一下，眼睛不睁。',
      '整条街的午后，被它睡成了两句：一句是阳光，一句是风。',
    ],
    fragment: {
      id: 'cat',
      name: '半个下午',
      quote: '它把一下午睡成了两句。',
      seal: '陆',
    },
  },
  {
    id: 'bbq',
    zone: 'night',
    art: 'stall',
    theme: 'bbq',
    name: '老李烧烤',
    time: '22:10',
    x: 18,
    y: 10,
    intro: '“再晚也开，总有人这个点才下班。”',
    story: [
      '炭火红起来的时候，老李把第一把肉串架上去。',
      '塑料凳上坐着刚下夜班的人，领带松着，手机扣在桌上。',
      '“再晚，也有一口热的。”他说。',
    ],
    fragment: {
      id: 'bbq',
      name: '炭火不睡',
      quote: '再晚，也有一口热的。',
      seal: '柒',
    },
  },
  {
    id: 'dessert',
    zone: 'night',
    art: 'stall',
    theme: 'dessert',
    name: '深夜糖水铺',
    time: '23:00',
    x: 58,
    y: 14,
    intro: '“最后一碗桂花糊，收摊了。”',
    story: [
      '锅里只剩最后一碗，桂花的香气浮在热气上。',
      '老板娘把碗推过来：“收摊前，总留一碗。”',
      '街灯一盏盏灭下去，甜味还留在舌尖。',
    ],
    fragment: {
      id: 'dessert',
      name: '甜到最后',
      quote: '收摊前，总留一碗。',
      seal: '捌',
    },
  },
]

export function getHotspot(id: string): Hotspot | undefined {
  return HOTSPOTS.find((hotspot) => hotspot.id === id)
}

export function getHotspotsByZone(zone: ZoneId): readonly Hotspot[] {
  return HOTSPOTS.filter((hotspot) => hotspot.zone === zone)
}
