export interface Agent {
  id: string;
  name: string;
  status: string;
  statusColor: 'green' | 'amber' | 'blue' | 'gray' | 'purple';
  avatarGradient: [string, string];
  initials: string;
}

export interface ThreadItem {
  id: string;
  title: string;
  active?: boolean;
}

export interface ActivityMessage {
  id: string;
  agentName: string;
  agentInitials: string;
  avatarGradient: [string, string];
  message: string;
  subItems?: string[];
  timestamp: string;
}

export const agents: Agent[] = [
  {
    id: 'campaign-director',
    name: 'Campaign Director',
    status: 'Active',
    statusColor: 'green',
    avatarGradient: ['#c8a96e', '#a68b4b'],
    initials: 'CD',
  },
  {
    id: 'brand-strategist',
    name: 'Brand Strategist',
    status: 'Monitoring',
    statusColor: 'blue',
    avatarGradient: ['#5b8a72', '#3d7a5f'],
    initials: 'BS',
  },
  {
    id: 'trend-scout',
    name: 'Trend Scout',
    status: 'Processing',
    statusColor: 'amber',
    avatarGradient: ['#8b6f4e', '#6b5535'],
    initials: 'TS',
  },
  {
    id: 'visual-director',
    name: 'Visual Director',
    status: 'Curating',
    statusColor: 'purple',
    avatarGradient: ['#7a6b8a', '#5a4d6a'],
    initials: 'VD',
  },
  {
    id: 'content-architects',
    name: 'Content Architects',
    status: 'Idle',
    statusColor: 'gray',
    avatarGradient: ['#6b8a7a', '#4d6a5a'],
    initials: 'CA',
  },
  {
    id: 'performance-critic',
    name: 'Performance Critic',
    status: 'Awaiting input',
    statusColor: 'gray',
    avatarGradient: ['#8a7a6b', '#6a5a4d'],
    initials: 'PC',
  },
];

export const threads: ThreadItem[] = [
  { id: 't1', title: 'Q4 Holiday Push - Strategy', active: true },
  { id: 't2', title: 'Sustainable Apparel Launch - Content' },
  { id: 't3', title: 'Global Wellness Trends - Research' },
  { id: 't4', title: 'Global Wellness Trends - Content' },
  { id: 't5', title: 'Weekly Social Calendar - Draft' },
];

export const activityMessages: ActivityMessage[] = [
  {
    id: 'a1',
    agentName: 'Trend Scout',
    agentInitials: 'TS',
    avatarGradient: ['#8b6f4e', '#6b5535'],
    message: 'identified 3 emerging cultural signals relevant to holiday campaigns.',
    timestamp: '2 min ago',
  },
  {
    id: 'a2',
    agentName: 'Campaign Director',
    agentInitials: 'CD',
    avatarGradient: ['#c8a96e', '#a68b4b'],
    message: 'updated strategy brief based on new insights.',
    timestamp: '5 min ago',
  },
  {
    id: 'a3',
    agentName: 'Visual Director',
    agentInitials: 'VD',
    avatarGradient: ['#7a6b8a', '#5a4d6a'],
    message: 'collected mood references aligned with sustainable luxury gifting.',
    subItems: ['Campaign Director updated tonal guidelines.'],
    timestamp: '12 min ago',
  },
  {
    id: 'a4',
    agentName: 'Brand Strategist',
    agentInitials: 'BS',
    avatarGradient: ['#5b8a72', '#3d7a5f'],
    message: 'requests review of tonal guidelines.',
    timestamp: '18 min ago',
  },
  {
    id: 'a5',
    agentName: 'Performance Critic',
    agentInitials: 'PC',
    avatarGradient: ['#8a7a6b', '#6a5a4d'],
    message: 'is waiting for stronger draft candidates.',
    timestamp: '25 min ago',
  },
];
