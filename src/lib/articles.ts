export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "verify-before-renting-bangalore",
    title: "5 Crucial Things to Verify Before Renting in Bangalore",
    category: "Renting Tips",
    excerpt: "From security deposit norms to water supply schedules, make sure you check these parameters before signing your rent agreement.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    author: "Rahul Sharma",
    date: "May 18, 2026",
    readTime: "5 min read",
    tags: ["Deposit", "Agreement", "Bangalore"],
    content: [
      "Renting a house in Bangalore is an exciting milestone, but it also comes with unique local customs that can surprise newcomers. To ensure a smooth renting experience and protect your hard-earned money, here are 5 crucial checkpoints to verify before signing your tenancy contract.",
      "1. Demystify the Security Deposit Norms: In Bangalore, landlords traditionally ask for a security deposit equivalent to 5 to 10 months of rent. While this is standard, you can negotiate this down to 3-4 months, especially for newer properties or co-living spaces. Always ensure that the deposit refund clause is clearly documented in the rent agreement, outlining any paint or maintenance deductions.",
      "2. Check the Water Source & Supply Schedule: Water scarcity is a known challenge in parts of Bangalore. Ask the landlord if the property has Cauvery water connection, borewell water, or relies on water tankers. Be sure to query the water supply timings and whether there's an additional cost for tanker water during summer months.",
      "3. Maintenance Charges & What they Cover: Many apartments quote a base rent and add a separate maintenance charge. Clarify if the quoted rent includes maintenance. If not, verify what services are covered (security, gym, lift, backup power) and ensure the amount is listed in the agreement.",
      "4. The 11-Month Lease Custom & Renewal Clause: Most residential agreements in Bangalore are written for 11 months to avoid mandatory registration fees. Read the renewal clause carefully—standard annual rent increments range between 5% and 8%. Negotiate this percentage beforehand to avoid sudden rent hikes next year.",
      "5. Verify Owner Credentials: Unfortunately, rental scams do happen. Before making any deposit transfers, verify the landlord's proof of ownership (tax receipts, electricity bill, or sale deed) and make sure the name matches the bank account you are sending the deposit to. Direct communication with the owner is always recommended."
    ]
  },
  {
    id: "2",
    slug: "student-friendly-neighborhoods-delhi-ncr",
    title: "Top 5 Student-Friendly Neighborhoods in Delhi NCR",
    category: "City Guides",
    excerpt: "Exploring budget-friendly areas near major university campuses with excellent metro connectivity and vibrant student communities.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    author: "Priya Patel",
    date: "May 15, 2026",
    readTime: "8 min read",
    tags: ["Delhi NCR", "Metro", "Students"],
    content: [
      "Delhi NCR hosts some of India's premier educational institutions, attracting hundreds of thousands of students every year. Finding the right place to live that balances safety, budget, and accessibility is key. Here are the top 5 student-friendly neighborhoods in the capital region.",
      "1. North Campus (GTB Nagar & Hudson Lane): The ultimate student hub for Delhi University. Famous for its vibrant café culture, PG accommodations, and shared apartments. Excellent connectivity via the Yellow Line metro makes commuting a breeze, though rent here can be slightly premium due to high demand.",
      "2. Satya Niketan (South Campus): The counterpart to North Campus, Satya Niketan is packed with PG options, budget dining joints, and student crowds. It is highly accessible via the Pink Line metro and offers more competitive renting options compared to South Delhi's residential colonies.",
      "3. Katwaria Sarai & Jia Sarai: Situated near IIT Delhi and JNU, these areas are perfect for students preparing for competitive exams or attending campus. The rent is extremely budget-friendly, and the locality offers numerous library spaces, tiffin services, and study groups.",
      "4. Noida Sector 62 & 63: Ideal for students enrolled in engineering and management colleges in Noida. These sectors offer modern high-rise apartments, excellent road infrastructure, and dedicated student hostels at a fraction of Delhi's core pricing.",
      "5. Laxmi Nagar (East Delhi): The go-to destination for CA and UPSC aspirants. Rents are incredibly low, and there is an abundance of single-room PG options, coaching centers, and cheap eateries, all connected via the Blue Line metro."
    ]
  },
  {
    id: "3",
    slug: "coliving-perfect-match-young-techies",
    title: "Why Coliving is the Perfect Match for Young Techies",
    category: "Coliving",
    excerpt: "Unpacking the community benefits, zero-maintenance lifestyle, and flexible leases that make modern coliving spaces a massive hit.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    author: "Amit Verma",
    date: "May 12, 2026",
    readTime: "6 min read",
    tags: ["Coliving", "Tech Hubs", "Community"],
    content: [
      "The traditional way of renting—dealing with brokers, buying furniture, setting up Wi-Fi, and fighting over utility bills—is fast becoming obsolete for young professionals. Coliving spaces have emerged as the modern lifestyle solution for techies in major Indian cities. Here is why.",
      "1. Fully Furnished, Zero Setup Hassles: When you move into a coliving space, you just bring your suitcase. High-speed Wi-Fi, modern work desks, smart TVs, beds, washing machines, and kitchen appliances are already set up and managed by the operator.",
      "2. Single Monthly Bill: Instead of paying separate bills for rent, electricity, maintenance, cleaning, water, and internet, coliving bundles everything into one unified monthly invoice. This makes budgeting seamless and avoids roommate disputes over shared expenses.",
      "3. Professional Housekeeping & Security: Rooms and common areas are cleaned regularly by professional staff. Most spaces also feature 24/7 security, CCTV monitoring, and digital smart locks, giving residents peace of mind.",
      "4. Community & Networking: Tech hubs can sometimes feel isolating. Coliving spaces host weekly community events, game nights, networking mixers, and festival celebrations, helping you make friends and professional connections easily.",
      "5. Unmatched Lease Flexibility: Traditional landlords demand an 11-month lock-in period. Coliving operators offer much more flexible terms, with lock-ins as short as 1 to 3 months, making it perfect for interns or professionals on project assignments."
    ]
  }
];
