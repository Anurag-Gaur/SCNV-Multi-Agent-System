import React from 'react';
import { Network, Search, Activity } from 'lucide-react';

export const AGENTS = [
  {
    id: 'orchestrator',
    icon: <Network size={20} />,
    iconNode: <Network size={24} strokeWidth={1.5} color="#CCA23E" />,
    title: 'Orchestrator Agent',
    subtitle: 'Coordination',
    desc: 'Routes STO events + user queries, synthesizes findings, and makes final decisions.',
    features: ['Event Routing', 'Query Synthesis', 'Decision Support'],
    color: '#CCA23E',
    gradient: 'linear-gradient(135deg, #CCA23E 0%, #B8963A 100%)',
    bgColor: 'rgba(204,162,62,0.12)',
  },
  {
    id: 'analyst',
    icon: <Search size={20} />,
    iconNode: <Search size={24} strokeWidth={1.5} color="#3B82F6" />,
    title: 'SCM Analyst Agent',
    subtitle: 'Classification',
    desc: 'Applies business rules (1–4), performs master data checks, and handles Tier 1 & Tier 2 classification.',
    features: ['Business Rules', 'Master Data Check', 'Tier 1/2 Classification'],
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    bgColor: 'rgba(59,130,246,0.12)',
  },
  {
    id: 'optimizer',
    icon: <Activity size={20} />,
    iconNode: <Activity size={24} strokeWidth={1.5} color="#22C55E" />,
    title: 'Optimizer Agent',
    subtitle: 'Optimization',
    desc: 'Finds best re-route options, calculates potential savings, and optimizes network flow.',
    features: ['Route Optimization', 'Savings Calculation', 'Flow Analysis'],
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
    bgColor: 'rgba(34,197,94,0.12)',
  },
];
