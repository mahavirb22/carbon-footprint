import type { CarbonData, CategoryData, QuizQuestion, TimelineEvent, NextStepAction } from '../types';

export const CATEGORIES: CategoryData[] = [
  {
    id: 'transport',
    title: 'Transport',
    description: 'Emissions from driving, flying, and public transit.',
    activities: [
      {
        id: 'drive_gas_car',
        title: 'Driving a Gasoline Car',
        description: 'Average emissions per km driven.',
        emissionFactor: 0.192,
        unit: 'km',
        tips: ['Carpool', 'Switch to an EV', 'Take public transit']
      },
      {
        id: 'short_flight',
        title: 'Short-haul Flight',
        description: 'Emissions per km flown (economy).',
        emissionFactor: 0.255,
        unit: 'km',
        tips: ['Take a train instead', 'Vacation locally']
      }
    ],
    reductionTips: [
      'Walk or bike for trips under 2 miles.',
      'Use public transportation to commute to work.'
    ]
  },
  {
    id: 'food',
    title: 'Food & Diet',
    description: 'Emissions related to food production, transport, and waste.',
    activities: [
      {
        id: 'beef_meal',
        title: 'Beef Meal',
        description: 'Emissions per serving of beef.',
        emissionFactor: 7.7,
        unit: 'serving',
        tips: ['Try a plant-based alternative', 'Reduce portion size']
      }
    ],
    reductionTips: [
      'Eat plant-based meals 2-3 times a week.',
      'Reduce food waste by planning your meals.'
    ]
  },
  {
    id: 'energy',
    title: 'Home Energy',
    description: 'Electricity, heating, and cooling your home.',
    activities: [
      {
        id: 'electricity_kwh',
        title: 'Grid Electricity',
        description: 'Emissions per kWh of grid electricity.',
        emissionFactor: 0.385,
        unit: 'kWh',
        tips: ['Switch to a green energy provider', 'Install solar panels']
      }
    ],
    reductionTips: [
      'Turn off lights when leaving a room.',
      'Wash clothes in cold water.'
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Goods',
    description: 'Emissions from producing and shipping the items you buy.',
    activities: [
      {
        id: 'buy_clothes',
        title: 'Fast Fashion Items',
        description: 'Emissions per new clothing item.',
        emissionFactor: 15.0,
        unit: 'item',
        tips: ['Buy second-hand', 'Repair old clothes']
      }
    ],
    reductionTips: [
      'Prioritize quality over quantity.',
      'Support sustainable and local brands.'
    ]
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'kyoto',
    title: 'Kyoto Protocol',
    description: 'An international treaty that committed state parties to reduce greenhouse gas emissions.',
    date: '1997',
    status: 'done'
  },
  {
    id: 'paris',
    title: 'Paris Agreement',
    description: 'A legally binding international treaty on climate change.',
    date: '2015',
    status: 'done'
  },
  {
    id: 'net_zero_2050',
    title: 'Net Zero by 2050',
    description: 'The global goal to balance the amount of greenhouse gas produced and the amount removed from the atmosphere.',
    date: '2050',
    status: 'upcoming'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which sector is the largest contributor to global greenhouse gas emissions?',
    options: ['Agriculture', 'Transportation', 'Energy (Electricity & Heat)', 'Industry'],
    correctIndex: 2,
    explanation: 'Energy production for electricity and heat is the largest single source of global greenhouse gas emissions.'
  },
  {
    id: 'q2',
    question: 'Which diet has the lowest carbon footprint?',
    options: ['Omnivore', 'Vegetarian', 'Pescatarian', 'Vegan'],
    correctIndex: 3,
    explanation: 'A vegan diet completely eliminates animal products, which are highly resource-intensive and produce significant methane emissions.'
  },
  {
    id: 'q3',
    question: 'What is "Net Zero"?',
    options: ['Producing absolutely zero emissions', 'Balancing emissions produced with emissions removed', 'Switching entirely to renewable energy', 'A political slogan'],
    correctIndex: 1,
    explanation: 'Net Zero refers to achieving an overall balance between greenhouse gas emissions produced and greenhouse gas emissions taken out of the atmosphere.'
  }
];

export const NEXT_STEPS: NextStepAction[] = [
  {
    id: 'step1',
    title: 'Audit your home energy',
    description: 'Find out where you are wasting energy in your house.',
    prompt: 'How can I do a simple home energy audit?'
  },
  {
    id: 'step2',
    title: 'Try Meatless Mondays',
    description: 'Commit to eating plant-based meals one day a week.',
    prompt: 'Give me some easy vegetarian recipes for beginners.'
  },
  {
    id: 'step3',
    title: 'Explore green transit',
    description: 'Look into alternative commuting options in your city.',
    prompt: 'What are the most carbon-efficient ways to commute?'
  }
];

export const GLOBAL_DATA: CarbonData = {
  region: 'global',
  categories: CATEGORIES,
  timeline: TIMELINE,
  quiz: QUIZ_QUESTIONS,
  nextSteps: NEXT_STEPS
};
