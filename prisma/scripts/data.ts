import { ScaleName } from "../../utils/models";

interface Scale {
  name: ScaleName;
  type: 'binary' | 'pentanary';
  count: number;
  monthlyPrice: number;
  subScales: string[];
  labels: {
    name: string;
    value: number;
  }[]
}

const scales: Scale[] = [/* {
  name: "DSMD",
  count: 108,
  subScales: ["Psychoticism", "Neuroticism", "Lie Scale", "Extraversion"],
  expiresAt: new Date("2023-06-14T02:02:53Z")
},  */{
    name: "EPQ",
    type: 'binary',
    count: 101,
    monthlyPrice: 20,
    subScales: ["psychoticism", "neuroticism", "extraversion", "lie-scale"],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "EPQ-R",
    type: 'binary',
    count: 90,
    monthlyPrice: 18,
    subScales: ["psychoticism", "neuroticism", "extraversion", "lie-scale"],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  },  /* {
  name: "JEPQ",
  count: 108,
  subScales: ["Psychoticism", "Neuroticism", "Lie Scale", "Extraversion"],
  expiresAt: new Date("2023-06-14T02:02:53Z")
}, */ {
    name: "JTCI",
    type: 'binary',
    count: 108,
    monthlyPrice: 21,
    subScales: ["novelty-seeking", "harm-avoidance", "reward-dependence", "persistence", "self-directedness", "cooperativeness", "self-transcendence-(1)", "self-transcendence-(2)", "validity"],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "MACI",
    type: 'binary',
    count: 160,
    monthlyPrice: 32,
    subScales: ['introversive',
      'inhibited',
      'doleful',
      'submissive',
      'dramatizing',
      'egoistic',
      'unruly',
      'forceful',
      'conforming',
      'oppositional',
      'self-demeaning',
      'borderline-tendency',
      'identity-diffusion',
      'self-devaluation',
      'body-disapproval',
      'sexual-discomfort',
      'peer-insecurity',
      'social-insensitivity',
      'family-discord',
      'childhood-abuse',
      'eating-dysfunctions',
      'substance-abuse-proneness',
      'delinquent-predisposition',
      'impulsive-propensity',
      'anxious-feelings',
      'depressive-affect',
      'suicidal-tendency',
      'desirability',
      'debasement',
      'reliability',
    ],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "MCMI",
    type: 'binary',
    count: 175,
    monthlyPrice: 35,
    subScales: ['desirability',
      'debasement',
      'schizoid',
      'avoidant',
      'depressive',
      'dependent',
      'histrionic',
      'narcissistic',
      'antisocial',
      'sadistic',
      'compulsive',
      'negativistic',
      'masochistic',
      'schizotypal',
      'borderline',
      'paranoid',
      'anxiety',
      'somatoform',
      'bipolar',
      'dysthymia',
      'alcohol-dependence',
      'drug-dependence',
      'post-traumatic-stress-disorder',
      'thought-disorder',
      'major-depression',
      'delusional-disorder',
      'validity'
    ],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "MMPI-RF",
    type: 'binary',
    count: 338,
    monthlyPrice: 67,
    subScales: ['VRINr',
      'TRINr',
      'Fr',
      'Fpr',
      'Fs',
      'FBSr',
      'Lr',
      'Kr',
      'EID',
      'THD',
      'BXD',
      'RCd',
      'RC1',
      'RC2',
      'RC3',
      'RC4',
      'RC6',
      'RC7',
      'RC8',
      'RC9',
      'MLS',
      'GIC',
      'HPC',
      'NUC',
      'COG',
      'SUI',
      'HLP',
      'SFD',
      'NFC',
      'STW',
      'AXY',
      'ANP',
      'BRF',
      'MSF',
      'JCP',
      'SUB',
      'AGG',
      'ACT',
      'FML',
      'IPP',
      'SAV',
      'SHY',
      'DSF',
      'AES',
      'MEC',
      'AGGRr',
      'PSYCr',
      'DISCr',
      'NEGEr',
      'INTRr'
    ], labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "MPQ",
    type: 'binary',
    count: 100,
    monthlyPrice: 20,
    subScales: ['anxiety',
      'hysteria',
      'paranoia',
      'mania',
      'depression',
      'schizophrenia',
      'repressive-sensitization',
      'personality-disorder',
      'k-(lie)'
    ], labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  }, {
    name: "TCI",
    type: 'binary',
    count: 240,
    monthlyPrice: 48,
    subScales: [
      'novelty-seeking',
      'harm-avoidance',
      'reward-dependence',
      'persistance',
      'self-directedness',
      'cooperativeness',
      'self-transcendence',
      'numb',
      'run'
    ],
    labels: [
      { name: "False", value: 0 },
      { name: "True", value: 1 },
    ]
  },
  {
    name: "SCL-90R",
    type: 'pentanary',
    count: 90,
    monthlyPrice: 27,
    subScales: [
      'somalization',
      'psychoticism',
      'hostility',
      'depression',
      'anxiety',
      'oc',
      'interpersonal',
      'phobia',
      "paranoid-ideation"
    ],
    labels: [
      { name: "0", value: 0 },
      { name: "1", value: 1 },
      { name: "2", value: 2 },
      { name: "3", value: 3 },
      { name: "4", value: 4 },
    ]
  },
]

export { scales as dataScales };