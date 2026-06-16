// ─── Types ───────────────────────────────────────────────────────────────────

export interface Nominee {
  id: string;
  slug: string;
  name: string;
  initials: string;
  level: string;
  department: string;
  institution: string;
  imageUrl: string;
  quote: string;
  totalVotes: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  groupId: string;
  icon: string; // lucide icon name
  votingClosesAt: string; // ISO string
  isLive: boolean;
  nominees: NomineeInCategory[];
}

export interface NomineeInCategory {
  nomineeId: string;
  votes: number;
  trending?: boolean;
}

export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  categoryIds: string[];
}

export interface Transaction {
  id: string;
  studentName: string;
  initials: string;
  email: string;
  amount: number;
  reference: string;
  categoryName: string;
  nomineeName: string;
  votes: number;
  createdAt: string;
}

// ─── Nominees ────────────────────────────────────────────────────────────────

export const nominees: Nominee[] = [
  {
    id: "nom-001",
    slug: "david-olamide",
    name: "David Olamide",
    initials: "DO",
    level: "400L",
    department: "Software Engineering",
    institution: "University of Lagos",
    imageUrl: "/nominees/david-olamide.png",
    quote:
      "Code is poetry and I'm writing an epic. Every line I write brings our community closer to a smarter future.",
    totalVotes: 2_137,
  },
  {
    id: "nom-002",
    slug: "emmanuel-chukwu",
    name: "Emmanuel Chukwu",
    initials: "EC",
    level: "300L",
    department: "Computer Science",
    institution: "University of Lagos",
    imageUrl: "/nominees/emmanuel-chukwu.png",
    quote:
      "Innovation is not about being first; it's about being impactful. I build to serve and inspire.",
    totalVotes: 1_820,
  },
  {
    id: "nom-003",
    slug: "ibrahim-musa",
    name: "Ibrahim Musa",
    initials: "IM",
    level: "400L",
    department: "Information Systems",
    institution: "University of Lagos",
    imageUrl: "/nominees/ibrahim-musa.png",
    quote:
      "Technology bridging gaps is my calling. Proud to represent the north and the whole of NACOS.",
    totalVotes: 1_389,
  },
  {
    id: "nom-004",
    slug: "michael-adeniyi",
    name: "Michael Adeniyi",
    initials: "MA",
    level: "500L",
    department: "Computer Engineering",
    institution: "University of Lagos",
    imageUrl: "/nominees/michael-adeniyi.png",
    quote:
      "Driving innovation and building communities. I'm honoured to be nominated for this year's NACOS Awards. Your support means everything to me!",
    totalVotes: 3_587,
  },
  {
    id: "nom-005",
    slug: "sarah-nwachukwu",
    name: "Sarah Nwachukwu",
    initials: "SN",
    level: "300L",
    department: "Cyber Security",
    institution: "Federal University of Technology",
    imageUrl: "/nominees/sarah-nwachukwu.png",
    quote:
      "Securing the digital future of Africa one byte at a time. Breaking barriers in a field dominated by the boys!",
    totalVotes: 2_980,
  },
  {
    id: "nom-006",
    slug: "chioma-adebayo",
    name: "Chioma Adebayo",
    initials: "CA",
    level: "400L",
    department: "Information Technology",
    institution: "University of Lagos",
    imageUrl: "/nominees/chioma-adebayo.png",
    quote:
      "Style, grace, and an unwavering spirit — I carry NACOS forward with every step I take.",
    totalVotes: 1_654,
  },
  {
    id: "nom-007",
    slug: "adeyemi-john",
    name: "Adeyemi John",
    initials: "AJ",
    level: "500L",
    department: "Computer Science",
    institution: "University of Lagos",
    imageUrl: "/nominees/david-olamide.png", // reused placeholder
    quote: "Excellence is a habit, not an act. I show up every single day.",
    totalVotes: 3_420,
  },
  {
    id: "nom-008",
    slug: "oluwaseun-babatunde",
    name: "Oluwaseun Babatunde",
    initials: "OB",
    level: "400L",
    department: "Software Engineering",
    institution: "University of Lagos",
    imageUrl: "/nominees/emmanuel-chukwu.png", // reused placeholder
    quote:
      "Tech bro by day, community builder by night. The future of Nigerian tech is bright and I'm proof.",
    totalVotes: 2_100,
  },
  {
    id: "nom-009",
    slug: "tunde-adeyemi",
    name: "Tunde Adeyemi",
    initials: "TA",
    level: "300L",
    department: "Computer Science",
    institution: "University of Lagos",
    imageUrl: "/nominees/ibrahim-musa.png", // reused placeholder
    quote: "From Lagos to Silicon Valley — this is just the beginning.",
    totalVotes: 1_200,
  },
  {
    id: "nom-010",
    slug: "grace-nwachukwu",
    name: "Grace Nwachukwu",
    initials: "GN",
    level: "400L",
    department: "Information Systems",
    institution: "University of Lagos",
    imageUrl: "/nominees/chioma-adebayo.png", // reused placeholder
    quote:
      "From zero to hero was never linear. I bring grit, grace, and genius to everything I do.",
    totalVotes: 1_890,
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "cat-001",
    name: "Tech Bro of the Year",
    description:
      "Recognising outstanding male students excelling in technical skills and community contribution.",
    groupId: "grp-tech",
    icon: "Laptop",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-001", votes: 450, trending: false },
      { nomineeId: "nom-002", votes: 412, trending: true },
      { nomineeId: "nom-003", votes: 389, trending: false },
      { nomineeId: "nom-008", votes: 280, trending: false },
    ],
  },
  {
    id: "cat-002",
    name: "Mr. NACOS",
    description:
      "The face of NACOS — embodying leadership, charisma, and academic excellence.",
    groupId: "grp-social",
    icon: "Crown",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-007", votes: 1240, trending: true },
      { nomineeId: "nom-002", votes: 980, trending: false },
      { nomineeId: "nom-003", votes: 750, trending: false },
    ],
  },
  {
    id: "cat-003",
    name: "Software Developer of the Year",
    description:
      "Celebrating the most prolific and impactful software developer in the faculty.",
    groupId: "grp-tech",
    icon: "Code2",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-004", votes: 45210, trending: false },
      { nomineeId: "nom-005", votes: 42810, trending: true },
      { nomineeId: "nom-007", votes: 38100, trending: false },
    ],
  },
  {
    id: "cat-004",
    name: "Most Innovative Student",
    description:
      "Recognising the student whose projects and ideas push boundaries and inspire.",
    groupId: "grp-tech",
    icon: "Lightbulb",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-002", votes: 28950, trending: false },
      { nomineeId: "nom-009", votes: 25100, trending: false },
      { nomineeId: "nom-006", votes: 19400, trending: false },
    ],
  },
  {
    id: "cat-005",
    name: "Best Dressed",
    description: "The student who consistently turns heads with impeccable style.",
    groupId: "grp-social",
    icon: "Shirt",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-006", votes: 890, trending: true },
      { nomineeId: "nom-010", votes: 732, trending: false },
      { nomineeId: "nom-005", votes: 612, trending: false },
    ],
  },
  {
    id: "cat-006",
    name: "Scholar of the Year",
    description: "Honouring the student with the most outstanding academic record.",
    groupId: "grp-academic",
    icon: "GraduationCap",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-005", votes: 1650, trending: true },
      { nomineeId: "nom-004", votes: 1420, trending: false },
      { nomineeId: "nom-007", votes: 1180, trending: false },
    ],
  },
  {
    id: "cat-007",
    name: "Sports Person of the Year",
    description: "Recognising the most dedicated and talented sports personality.",
    groupId: "grp-sports",
    icon: "Trophy",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-003", votes: 920, trending: false },
      { nomineeId: "nom-009", votes: 810, trending: true },
      { nomineeId: "nom-008", votes: 640, trending: false },
    ],
  },
  {
    id: "cat-008",
    name: "Tech Sis of the Year",
    description:
      "Celebrating the outstanding female student making waves in tech and innovation.",
    groupId: "grp-tech",
    icon: "Sparkles",
    votingClosesAt: new Date(Date.now() + 24 * 3600 * 1000 + 13 * 60 * 1000).toISOString(),
    isLive: true,
    nominees: [
      { nomineeId: "nom-005", votes: 982, trending: true },
      { nomineeId: "nom-006", votes: 876, trending: false },
      { nomineeId: "nom-010", votes: 541, trending: false },
    ],
  },
];

// ─── Category Groups ─────────────────────────────────────────────────────────

export const categoryGroups: CategoryGroup[] = [
  {
    id: "grp-tech",
    name: "Flagship & Tech",
    description: "Programmer, Tech Bro/Sis, Best Startup...",
    imageUrl: "/categories/tech.png",
    icon: "Monitor",
    categoryIds: ["cat-001", "cat-003", "cat-004", "cat-008"],
  },
  {
    id: "grp-social",
    name: "Social & Lifestyle",
    description: "Mr/Miss NACOS, Socialite, Fashionista...",
    imageUrl: "/categories/social.png",
    icon: "Users",
    categoryIds: ["cat-002", "cat-005"],
  },
  {
    id: "grp-academic",
    name: "Academic",
    description: "Scholar of the Year, Best Project...",
    imageUrl: "/categories/academic.png",
    icon: "BookOpen",
    categoryIds: ["cat-006"],
  },
  {
    id: "grp-sports",
    name: "Sports & Entertainment",
    description: "Sportsman/woman, Content Creator...",
    imageUrl: "/categories/sports.png",
    icon: "Dumbbell",
    categoryIds: ["cat-007"],
  },
];

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactions: Transaction[] = [
  {
    id: "txn-001",
    studentName: "Samuel Ojo",
    initials: "SO",
    email: "samuel.ojo@student.unilag.edu.ng",
    amount: 5000,
    reference: "FLW-001",
    categoryName: "Tech Bro of the Year",
    nomineeName: "David Olamide",
    votes: 50,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-002",
    studentName: "Chioma Adebayo",
    initials: "CA",
    email: "chioma.adebayo@student.unilag.edu.ng",
    amount: 10000,
    reference: "FLW-002",
    categoryName: "Software Developer of the Year",
    nomineeName: "Sarah Nwachukwu",
    votes: 100,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-003",
    studentName: "Ibrahim Babatunde",
    initials: "IB",
    email: "ibrahim.babatunde@student.unilag.edu.ng",
    amount: 2500,
    reference: "FLW-003",
    categoryName: "Mr. NACOS",
    nomineeName: "Adeyemi John",
    votes: 25,
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-004",
    studentName: "Grace Nwachukwu",
    initials: "GN",
    email: "grace.nwachukwu@student.unilag.edu.ng",
    amount: 15000,
    reference: "FLW-004",
    categoryName: "Tech Sis of the Year",
    nomineeName: "Sarah Nwachukwu",
    votes: 150,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-005",
    studentName: "Tunde Adeyemi",
    initials: "TA",
    email: "tunde.adeyemi@student.unilag.edu.ng",
    amount: 3000,
    reference: "FLW-005",
    categoryName: "Sports Person of the Year",
    nomineeName: "Ibrahim Musa",
    votes: 30,
    createdAt: new Date(Date.now() - 68 * 60 * 1000).toISOString(),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getNomineeById = (id: string): Nominee | undefined =>
  nominees.find((n) => n.id === id);

export const getNomineeBySlug = (slug: string): Nominee | undefined =>
  nominees.find((n) => n.slug === slug);

export const getCategoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

export const getCategoriesForNominee = (nomineeId: string): Category[] =>
  categories.filter((cat) =>
    cat.nominees.some((n) => n.nomineeId === nomineeId)
  );

export const getVotesForNomineeInCategory = (
  nomineeId: string,
  categoryId: string
): number => {
  const cat = getCategoryById(categoryId);
  return cat?.nominees.find((n) => n.nomineeId === nomineeId)?.votes ?? 0;
};

export const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

export const formatVotes = (votes: number): string =>
  votes.toLocaleString("en-NG");

// Dashboard stats
export const dashboardStats = {
  totalRevenue: 1_250_000,
  totalVotes: 12_500,
  totalCategories: 8,
  revenueGrowth: "+15% this hour",
  topCategoryName: "Tech Bro of the Year",
  topCategoryActivity: 85,
  topStudentName: "Adeyemi John",
  topStudentVotes: 3_420,
};
