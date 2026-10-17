export type StallId = 'chen' | 'zhou' | 'po'

export interface Stamp {
  name: string
  quote: string
  endingFragment: string
}

export interface StallChoice {
  id: string
  label: string
  reply: string[]
  stamp: Stamp
}

export interface Stall {
  id: StallId
  seal: string
  shopName: string
  owner: string
  time: string
  intro: string
  choices: readonly [StallChoice, StallChoice]
}

/**
 * 三位摊主均为虚构复合人物。
 * 文案上限约定：开场 ≤ 20 字；单段回应 ≤ 40 字，最多两段；摊主原话 ≤ 20 字。
 */
export const STALLS: readonly Stall[] = [
  {
    id: 'chen',
    seal: '壹',
    shopName: '陈记热干面',
    owner: '陈伯',
    time: '06:52',
    intro: '“过早冇？第一次来？面要掸得干，麻酱才搅得开。”',
    choices: [
      {
        id: 'chen-spicy',
        label: '加一勺辣',
        reply: [
          '陈伯手腕一抖，红油落进面里。',
          '“头一回吧？这个辣度，下次我就记住了。”',
          '墙上的录取通知书复印件被油烟熏黄了，他每天收摊前都擦一遍相框。',
        ],
        stamp: {
          name: '辣得蛮扎实',
          quote: '下次来，我记得你的辣度。',
          endingFragment: '辣味先把你叫醒',
        },
      },
      {
        id: 'chen-egg-wine',
        label: '加一个蛋酒',
        reply: [
          '滚水冲开蛋酒，甜香冒出来。',
          '“你们读书人，早上吃点甜的，脑子转得快。”',
          '他说这话时，眼睛看着墙上那张录取通知书复印件。',
        ],
        stamp: {
          name: '多一勺甜的',
          quote: '读书辛苦，早上甜一点。',
          endingFragment: '蛋酒的甜留在舌根',
        },
      },
    ],
  },
  {
    id: 'zhou',
    seal: '贰',
    shopName: '周姐豆皮',
    owner: '周姐',
    time: '07:05',
    intro: '“赶时间就站着吃，不赶就等这一锅。”',
    choices: [
      {
        id: 'zhou-help',
        label: '顺手帮她摞碗',
        reply: ['你把她手边的空碗摞起来。', '她没抬头，出锅时多铲了一勺臊子：“内行。”'],
        stamp: {
          name: '搭把手',
          quote: '内行，多给你一勺。',
          endingFragment: '你替周姐空出了两只碗',
        },
      },
      {
        id: 'zhou-wait',
        label: '不催她，等这一锅',
        reply: [
          '你站在旁边等，没催她。',
          '她手上的动作慢了一点：“莫急，好的是要等。”',
          '账本背面，贴着她女儿写“我妈是这条街起得最早的人”的作文奖状。',
        ],
        stamp: {
          name: '等得及',
          quote: '莫急，好的是要等。',
          endingFragment: '你把这一锅豆皮等到了底',
        },
      },
    ],
  },
  {
    id: 'po',
    seal: '叁',
    shopName: '婆婆豆浆',
    owner: '婆婆',
    time: '07:18',
    intro: '“最后一杯了。”',
    choices: [
      {
        id: 'po-sit',
        label: '坐下来喝完',
        reply: [
          '你把搪瓷杯捧在手里，坐在小板凳上。',
          '她靠在桶边看街：“卖了二十年，下大雨也来。总有人等着。”',
        ],
        stamp: {
          name: '坐一会儿',
          quote: '卖了二十年，总有人等着。',
          endingFragment: '你坐下来，把最后一杯喝完',
        },
      },
      {
        id: 'po-takeaway',
        label: '多买一杯带给室友',
        reply: [
          '婆婆给你多套了一层塑料袋。',
          '“带给谁？路上莫洒了。你们这些伢，早上都不晓得吃东西。”',
        ],
        stamp: {
          name: '带一份',
          quote: '路上莫洒了。',
          endingFragment: '你把最后一份早晨，捎给了室友',
        },
      },
    ],
  },
]
