/* ==========================================================================
   data.js: the single source of truth for everything the page renders.
   Every entry here traces back to a real file in the school archive.
   Nothing is invented. Where something is unverified it says so.
   ========================================================================== */

window.SITE = {

  profile: {
    name: "Jhan Maurice C. De Roxas",
    short: "Jhan Maurice",
    initials: "JM",
    program: "BSIT",
    school: "Mapúa Malayan Colleges Laguna",
    gradYear: "2027",
    email: "jhanmauricederoxas@gmail.com",
    phone: "0932 447 5709",
    github: "https://github.com/mauwcchiato",
    githubHandle: "mauwcchiato",
    linkedin: "https://www.linkedin.com/in/jm-de-roxas-42aa5530a/",
    location: "Cabuyao, Laguna",
    roles: [
      "Full-stack developer",
      "Android developer (Kotlin + Compose)",
      "Cloud & IoT builder",
      "Project manager who still writes code",
      "ITSOC President, A.Y. 2024–2025"
    ]
  },

  /* ---------------------------------------------------------------- JOURNEY */
  journey: [
    {
      id: "learning",
      idx: "01",
      title: "Learning",
      years: "2024",
      lede: "First year. Pointers, gates, and the unglamorous fundamentals.",
      body: "Linked lists that segfault, truth tables that refuse to simplify, Tkinter windows that will not resize. I kept an output screenshot for every lab. That habit paid off later.",
      items: [
        { t: "C++ data structures", s: "CS102-1L · 2024", p: "Linked lists, stacks, queues, BSTs and Dijkstra. Each one captured from a working program." },
        { t: "Digital logic design", s: "IT132 · 2024", p: "Logisim, Boolean simplification, Karnaugh maps. The same topic I later taught." },
        { t: "Python GUI + first games", s: "2024", p: "Tkinter: Mines, an image bingo board, a picture browser, calculators, payroll." },
        { t: "C# fundamentals", s: "IT111L · 2024", p: "Console and WinForms: order forms, grade calculators, a voter system, a student form." }
      ]
    },
    {
      id: "building",
      idx: "02",
      title: "Building",
      years: "2024 – 2025",
      lede: "Second year. Real clients, real requirements. The hard part is not the code.",
      body: "PulsePoint started as a Figma mockup, then I built the system after a countersigned letter from St. Luke's Global City. ShuttleCock began as a campus booking design and later became MakiRide. Scope written down is scope that survives.",
      items: [
        { t: "PulsePoint", s: "CS103P · Jan 2025", p: "Clinic scheduling. Mockup first, then the ASP.NET build. I was the project manager." },
        { t: "ShuttleCock → MakiRide", s: "CS110P · 2024", p: "Campus shuttle booking in Figma. The design later evolved into MakiRide." },
        { t: "Hotel Reservation System", s: "IT111L · 2024", p: "C# WinForms with an abstract permissions model. Three iterations after feedback." },
        { t: "Web & database labs", s: "IT114 / IT115L · 2025", p: "ASP.NET, Oracle SQL, Power BI, Tableau, Access." }
      ]
    },
    {
      id: "leading",
      idx: "03",
      title: "Leading",
      years: "2024 – 2025",
      lede: "President of ITSOC. Two mentoring sessions, one outreach, a term-end report with my name on it.",
      body: "Most of the job is logistics nobody sees. The part I cared about was teaching K-maps to second-years, then reading that 8 of the 9 mentees who came passed their exam.",
      items: [
        { t: "President, ITSOC", s: "A.Y. 2024–2025", p: "Four officers plus four year-level representatives at Mapúa MCL's IT Society." },
        { t: "Peer mentoring × 2", s: "Oct & Nov 2024", p: "Logic Design, then K-maps. Tinkercad and Logisim. Feedback via MS Forms." },
        { t: "Pamaskong Handog", s: "Dec 2024", p: "Outreach at Diezmo Integrated School. Gifts and supplies for kindergarten. I coordinated it." },
        { t: "Project manager, repeatedly", s: "2024 – 2026", p: "PulsePoint, Kusina Kode, D.I.L.I.G., BNK WMS. Someone has to hold the schedule." }
      ]
    },
    {
      id: "creating",
      idx: "04",
      title: "Creating",
      years: "2025 – 2026",
      lede: "Third year. Hardware, mobile, backend, and a cloud tier that has to agree.",
      body: "D.I.L.I.G. put sensors, firmware, a REST hub and an Android app into one working system. Kusina Kode grew from a course project into my capstone. I also drew a burger in x86 assembly.",
      items: [
        { t: "D.I.L.I.G.", s: "IT145 / IT155P · 2026", p: "Five-tier IoT irrigation. Arduino to ESP8266 to PHP REST to MySQL to Kotlin." },
        { t: "Kusina Kode", s: "IT123P → IT140P → capstone", p: "Filipino-cuisine word puzzle. Three iterations. Now the capstone, with a blockchain layer." },
        { t: "BNK WMS", s: "2026", p: "278-file PHP system for a pet boarding business. Three roles, RFID check-in, PDF reports." },
        { t: "Pixels of Meaning", s: "CS125 · Nov 2025", p: "Three pixel-art pieces in x86 assembly through INT 10h. Solo. Every block is a register write." }
      ]
    },
    {
      id: "preparing",
      idx: "05",
      title: "Preparing",
      years: "2026 – 2027",
      lede: "Certifications, cloud architecture, and a field trip to Japan.",
      body: "Thirty-one certificates so far, mostly AWS, DevOps and security, each backing a project I was already building. Next is shipping this kind of work for real users, not just for a grade.",
      items: [
        { t: "Cloud & DevOps track", s: "2025 – 2026", p: "AWS essentials, Architecting on AWS, Kubernetes, CI/CD, IaC, Git. Nine certificates." },
        { t: "CCNA: Introduction to Networks", s: "Jul 2025", p: "Cisco Networking Academy through Mapúa MCL, plus about 40 Packet Tracer labs." },
        { t: "Japan technology immersion", s: "Mar 2026", p: "Miraikan robotics and AI, DiverCity Tokyo, and how Japan puts tech into public transport." },
        { t: "Google Cloud Skills Boost", s: "Feb – Mar 2024", p: "Eight badges: four Computing Foundations completions, plus skill badges for networks, load balancing, app-dev setup, and ML APIs." }
      ]
    }
  ],

  /* ----------------------------------------------------------- ABOUT (personal)
     The About section talks about me, not my projects. Everything here is
     restated from facts elsewhere in this file. */
  traits: [
    { t: "Organized", p: "I like keeping track of tasks and deadlines so group work stays on schedule." },
    { t: "Hands-on", p: "I learn best by building things myself." },
    { t: "Helpful", p: "I enjoy helping classmates review topics I've already worked through." },
    { t: "Responsible", p: "I try to finish what I start, including the documentation." },
    { t: "Curious", p: "I like learning how different pieces of technology fit together." }
  ],

  /* "What people say" under About. Stays hidden while this list is empty.
     Only add real quotes, with the person's permission. One entry looks like:
       { quote: "What they wrote, word for word.",
         name: "Their Name", role: "Their title", relation: "Capstone adviser" }
     Optional: photo: "assets/img/people/their-photo.jpg" (otherwise initials are shown). */
  recommendations: [],

  /* shown under Leadership & recognition */
  recognition: [
    { t: "President's Lister", p: "Mapúa Malayan Colleges Laguna", icon: "list" },
    { t: "Full Academic Scholar", p: "Mapúa Malayan Colleges Laguna", icon: "cap" },
    { t: "Student Ambassador", p: "Mapúa Malayan Colleges Laguna · A.Y. 2024–2025", icon: "star",
      img: "assets/img/leadership/ambassador.jpg", cap: "Mapúa MCL enrollment campaign, A.Y. 2024–2025." }
  ],

  milestones: [
    { when: "2023", t: "Started BS Information Technology", p: "Mapúa Malayan Colleges Laguna." },
    { when: "Feb – Mar 2024", t: "Google Cloud skill badges", p: "My first steps into cloud computing." },
    { when: "A.Y. 2024 – 2025", t: "President, IT Society (ITSOC)", p: "Worked with four officers and four year-level representatives." },
    { when: "A.Y. 2024 – 2025", t: "Student Ambassador", p: "Took part in Mapúa MCL's enrollment campaign." },
    { when: "Oct & Nov 2024", t: "Peer mentoring", p: "Helped classmates review Logic Design and K-maps." },
    { when: "Dec 2024", t: "Pamaskong Handog", p: "Helped organize a Christmas outreach for kindergarten pupils at Diezmo Integrated School." },
    { when: "Jul 2025", t: "CCNA: Introduction to Networks", p: "Through the Cisco Networking Academy." },
    { when: "Mar 2026", t: "Japan technology immersion", p: "Visited Miraikan and saw how technology is used in public transport." },
    { when: "2027", t: "Graduating (expected)", p: "BS Information Technology." }
  ],

  /* --------------------------------------------------------------- PROJECTS */
  projects: [
    {
      id: "dilig",
      featured: true,
      rank: "Featured",
      name: "D.I.L.I.G.",
      sub: "Digital Irrigation and Lifeform Information Gathering",
      kicker: "IoT · Systems Integration",
      year: "2026",
      course: "IT145 Systems Integration & Architecture · IT155P",
      team: "Group project",
      role: "Project Manager · Mobile, IoT & Full-stack Developer",
      hero: "assets/img/projects/dilig-hardware-prototype.png",
      blurb: "A family-shared plant watering system that spans five computing tiers (sensors, firmware, a protocol gateway, a REST hub and an Android app) and makes all of them agree.",
      tagline: "Houseplants die for a boring reason: nobody's sure whose turn it was. D.I.L.I.G. keeps the plant alive on its own, and tells the whole family who watered it and when.",
      problem: "In a shared household, watering fails twice over: either everyone assumes someone else did it, or three people do it in one day. Consumer options are either dumb mechanical timers with no feedback, or single-user apps with no concept of a family.",
      solution: "An Arduino Uno reads soil moisture (HW-080) and temperature/humidity (DHT11) every 5 seconds and drives a relay pump autonomously when the soil crosses the dry threshold. An ESP8266 gateway translates UART serial frames into HTTP/JSON and relays commands back down. A 12-endpoint PHP REST API over MySQL acts as the integration hub. A Kotlin/Jetpack Compose app gives every family member live telemetry, one-tap watering, and a record of who did what.",
      contribution: [
        "Held the module boundaries across four platforms and three transport protocols",
        "Built the Android client: 43 Kotlin files, MVVM with StateFlow, Retrofit, NavController, light/dark themes",
        "Wrote the embedded side: Arduino sensing and AUTO watering logic, ESP8266 serial-to-HTTP gateway firmware",
        "Built the PHP REST middleware and MySQL schema that both the app and the web dashboard read from",
        "Engineered the reliability layer: hardware liveness detection, retry on safety-critical pump-stop, offline caching"
      ],
      tech: ["Kotlin", "Jetpack Compose", "MVVM", "Retrofit", "Coroutines", "PHP", "MySQL", "Arduino C++", "FreeRTOS", "ESP8266", "XAMPP", "REST"],
      skills: ["Systems integration", "IoT / embedded", "Contract-first design", "API design", "Mobile architecture", "Reliability engineering"],
      features: [
        "Autonomous AUTO mode: waters itself below the 46% moisture threshold",
        "Timed manual watering (10 / 30 / 60 s) with a countdown and immediate Stop",
        "Per-member attribution: a calendar and activity log of who watered, and when",
        "Threshold alerts with local notifications above 35 °C or below the dry line, edge-triggered",
        "Liveness detection: controls lock and readings blank out after 60 s of hardware silence",
        "Rolling moisture chart plotted against the hardware's own dry threshold",
        "Browser dashboard and reports page: no install needed on the home network"
      ],
      process: "Every boundary between tiers was written down as a contract before anything was built. The mobile app, the API and the database were completed and verified against those documented contracts while the physical hardware was still on the bench.",
      outcome: "The project's central claim was demonstrated literally: because each boundary was a documented contract, a mid-project firmware revision integrated with zero changes anywhere else in the stack.",
      gallery: [
        { src: "assets/img/projects/dilig-hardware-prototype.png", cap: "The working prototype: labelled wet/dry soil zones, water pump, HW-080 sensor, Arduino and ESP8266 on the breadboard, app running on the phone." },
        { src: "assets/img/projects/dilig-architecture.png", cap: "Five-tier hub-and-spoke architecture: Perception → Edge → Gateway → Integration Hub → Presentation." },
        { src: "assets/img/projects/dilig-app-onboarding.png", cap: "Android client: onboarding, household sign-up, and the live dashboard in its offline state." },
        { src: "assets/img/gallery/dilig-app-calendar-log.png", cap: "Watering calendar, the member-selection gate, live dashboard and activity log." },
        { src: "assets/img/gallery/dilig-data-flow-diagram.png", cap: "Data flow diagram: telemetry flowing upward, commands flowing back down." },
        { src: "assets/img/gallery/dilig-database-erd.png", cap: "MySQL schema: five tables with cascade rules and indexed foreign keys." },
        { src: "assets/img/gallery/dilig-photo-2.jpg", cap: "The prototype from another angle: pump reservoir, sensor bed and the app in dark mode." }
      ],
      video: { src: "assets/video-web/dilig-demo.mp4", cap: "Full system demo: hardware, app and auto-watering." }
    },

    {
      id: "kusinakode",
      apk: true,   // visitors can ask me for the Android build
      /* real app screens for the phone in the deep dive; ch = which chapter shows them */
      phone: [
        { src: "assets/img/projects/kusinakode/phone/splash.webp", ch: 0 },
        { src: "assets/img/projects/kusinakode/phone/welcome.webp", ch: 0 },
        { src: "assets/img/projects/kusinakode/phone/home.webp", ch: 0 },
        { src: "assets/img/projects/kusinakode/phone/explore_dishes.webp", ch: 1 },
        { src: "assets/img/projects/kusinakode/phone/dish.webp", ch: 1 },
        { src: "assets/img/projects/kusinakode/phone/game.webp", ch: 2 },
        { src: "assets/img/projects/kusinakode/phone/game_powerups_open.webp", ch: 2 },
        { src: "assets/img/projects/kusinakode/phone/game_win.webp", ch: 2 },
        { src: "assets/img/projects/kusinakode/phone/leadership_weekly.webp", ch: 3 },
        { src: "assets/img/projects/kusinakode/phone/profile_badges.webp", ch: 3 },
        { src: "assets/img/projects/kusinakode/phone/shop_avatar.webp", ch: 4 },
        { src: "assets/img/projects/kusinakode/phone/login.webp", ch: 4 }
      ],
      featured: true,
      rank: "Featured",
      name: "Kusina Kode",
      sub: "Filipino Cuisine Word Puzzle App",
      kicker: "Android · Capstone",
      year: "2025 – 2026",
      course: "IT123P → IT140P → IT200-1D Capstone",
      team: "Group project · capstone",
      role: "Project Leader / Developer · Game Systems & Cloud Integration",
      hero: "assets/img/projects/kusinakode/welcome.png",
      blurb: "A Wordle built out of Filipino food. Guess the dish in six tries; get its history and regional origin back as the reward. Three iterations, now my capstone.",
      tagline: "Filipino cuisine as the vocabulary, and the trivia card as the prize. It works as a game first: the cultural content is what the logic is wrapped around, not decoration on top of it.",
      problem: "Cultural knowledge doesn't survive by being assigned. Younger Filipinos grow up more connected to global content than to the regional food traditions around them, and traditional instruction doesn't compete for that attention.",
      solution: "A 6×6 guessing grid with a custom image-tile keyboard, green/yellow/brown feedback, a three-hint limit and a speed timer. Twenty curated 6-letter dishes, each with a written trivia line and an image. Behind it: a PHP REST + SOAP backend on MySQL and an ASP.NET admin portal so the level content can be edited without shipping a new build.",
      contribution: [
        "Led the project across three course iterations and into the capstone",
        "Built the game engine and core loop: guess evaluation, tile states, hint system, timer, level progression",
        "Wrote the backend: PHP REST endpoints with PDO prepared statements, plus 4 SOAP operations for analytics",
        "Designed and normalised the MySQL schema to 3NF: users, levels, unlocks, attempts",
        "Integrated Jetpack Compose UI components and wired them to StateFlow-driven ViewModels",
        "Owns the cloud sync, data persistence and migration modules in the capstone scope"
      ],
      tech: ["Kotlin", "Jetpack Compose", "MVVM", "StateFlow", "Ktor", "Retrofit", "PHP", "PDO", "MySQL", "SOAP", "ASP.NET", "BCrypt"],
      skills: ["Game logic", "Mobile architecture", "OOP", "API design", "Database normalisation", "Team leadership", "Secure input handling"],
      features: [
        "6×6 guess grid with green / yellow / brown letter feedback",
        "Custom image-tile keyboard rendered from hand-made assets",
        "Hint system capped at 3 per level, plus a speed timer that feeds the ranking",
        "Level unlocks, profile stats and a global leaderboard: the Kusina Masters",
        "Trivia reveal card with each dish's history and regional origin",
        "ASP.NET admin portal: dashboard analytics, user CRUD, level CRUD, attempt log",
        "8 REST endpoints for the app, 4 SOAP operations for the analytics dashboard"
      ],
      process: "Defence in depth on every input: client-side validation for instant feedback and reduced server load, server-side validation as the final authority, and debouncing plus rate limiting against spam. PDO prepared statements eliminate the injection surface entirely.",
      outcome: "User survey with 6 respondents returned an average rating of about 4.8 out of 5, with no critical bugs or crashes identified. The most requested additions were more levels, sound, and a broader dish database.",
      gallery: [
        { src: "assets/img/projects/kusinakode/welcome.png", cap: "Landing: the puzzle-tile logo, chef mascot, and log in / create account." },
        { src: "assets/img/projects/kusinakode/splash.png", cap: "Splash screen before the first session." },
        { src: "assets/img/projects/kusinakode/login.png", cap: "Sign-in. Credentials are hashed with BCrypt on the server." },
        { src: "assets/img/projects/kusinakode/home.png", cap: "Home: continue the current level, region progress, and the bottom nav." },
        { src: "assets/img/projects/kusinakode/game.png", cap: "The 6-letter guess grid, timer, and on-screen keyboard. Philippines, level 1." },
        { src: "assets/img/projects/kusinakode/game_powerups_open.png", cap: "Power-ups (bomb, reveal, skip) spend coins earned from solved dishes." },
        { src: "assets/img/projects/kusinakode/game_win.png", cap: "Win card: the dish, points, and a trivia line on where it comes from." },
        { src: "assets/img/projects/kusinakode/explore_dishes.png", cap: "Explore the Philippines. Luzon selected, 8 dishes solved, pixel map." },
        { src: "assets/img/projects/kusinakode/dish.png", cap: "Dish page: history, region, and the recipe steps behind the puzzle." },
        { src: "assets/img/projects/kusinakode/leadership_weekly.png", cap: "Kusina Masters leaderboard: today, weekly, and all-time ranks." },
        { src: "assets/img/projects/kusinakode/profile_badges.png", cap: "Profile badges earned from solved dishes and streak play." },
        { src: "assets/img/projects/kusinakode/shop_avatar.png", cap: "Avatar shop. Coins from gameplay unlock cosmetic items." }
      ],
      playable: "kusinakode",
      note: "The playable demo on this page is a browser recreation of the Android original, using the same 20-dish dataset and the same artwork."
    },

    {
      id: "pulsepoint",
      /* real desktop screens from the Figma file, shown in a laptop; scroll: the page scrolls inside */
      laptop: [
        { src: "assets/img/projects/pulsepoint/laptop/01-landing.webp", ch: 0, scroll: true },
        { src: "assets/img/projects/pulsepoint/laptop/02-login.webp", ch: 1 },
        { src: "assets/img/projects/pulsepoint/laptop/03-admin-overview.webp", ch: 2 },
        { src: "assets/img/projects/pulsepoint/laptop/04-admin-users.webp", ch: 2 },
        { src: "assets/img/projects/pulsepoint/laptop/05-notifications.webp", ch: 3 },
        { src: "assets/img/projects/pulsepoint/laptop/01-landing.webp", ch: 4, scroll: true }
      ],
      featured: true,
      rank: "Featured",
      name: "PulsePoint",
      sub: "Clinic Appointment Scheduling System",
      kicker: "Systems Analysis · Full-stack",
      year: "2025",
      course: "CS103P System Analysis and Design",
      team: "Group project",
      role: "Project Manager · Documentation, Research & Database",
      hero: "assets/img/projects/pulsepoint-landing.jpg",
      figma: "https://www.figma.com/design/fHUm15QyG01q4F4bXNJGQF/PulsePoint?node-id=1-2",
      githubSoon: true,
      blurb: "Clinic scheduling with patient, doctor and secretary dashboards. It started as a Figma mockup. I then built the system. The study behind it earned a countersigned letter from a real hospital.",
      tagline: "Mockup first, then the code. Interviews, surveys and statistical treatment, then an ASP.NET build on SQL Server that answers what the study found.",
      problem: "Clinic scheduling ran on manual coordination: a shared calendar on a reception laptop, phone bookings, and no reliable view of who was double-booked. Patients waited; staff improvised.",
      solution: "Three role-specific dashboards over a SQL Server database. Patients book and track appointments; doctors see their day; the secretary manages the schedule and pulls reports. A DBHelper data layer and a PasswordHelper for hashing sit under the ASP.NET Web Forms front end.",
      contribution: [
        "Led the project as manager: kept the schedule and owned what 'done' meant",
        "Wrote and maintained the project documentation across every chapter of the study",
        "Ran the research: review of related literature, theoretical framework, methodology",
        "Designed the database and its logical ERD",
        "Contributed to the interface and overall system design"
      ],
      tech: ["ASP.NET Web Forms", "C#", "SQL Server", "T-SQL", "draw.io", "Firebase Hosting", "Figma"],
      skills: ["Requirements elicitation", "Stakeholder engagement", "Survey design", "STROBE observation", "Statistical treatment", "ERD modelling", "Project management"],
      features: [
        "Patient dashboard: booking, appointment history, profile",
        "Doctor dashboard: schedule view and appointment management",
        "Secretary console: full appointment management and reporting",
        "Onboarding flow, login/registration with hashed credentials",
        "Reports module, privacy policy and terms pages",
        "SQL Server schema shipped with both a script and a restorable backup"
      ],
      process: "Prototyping methodology end to end: requirements gathering and analysis → quick design → prototype → user evaluation → refinement → final system. The study included a patient survey instrument, structured interviews with a transcript, STROBE observation analysis and Likert-scale statistical treatment.",
      outcome: "A signed Letter of Request from St. Luke's Medical Center Global City is in the project folder. Very little student work carries a countersigned client engagement.",
      gallery: [
        { src: "assets/img/projects/pulsepoint-landing.jpg", cap: "Figma landing page: booking, dashboard preview, queue display, and the first-come-first-serve CTA." },
        { src: "assets/img/projects/pulsepoint-architecture.png", cap: "Appointment scheduling system architecture, drawn in draw.io." }
      ],
      note: "Started as a Figma mockup, then I built the ASP.NET system. Source is going up on GitHub."
    },

    {
      id: "awsome",
      featured: true,
      rank: "Featured",
      name: "AWS-ome Tech",
      sub: "Cloud Infrastructure for ABC Retail Corporation",
      kicker: "Cloud Architecture",
      year: "2026",
      course: "IT191-4P Cloud Computing: Final Exam",
      team: "Group project",
      role: "Project Manager · Cloud Infrastructure & Documentation",
      hero: "assets/img/projects/aws-cloud-architecture.png",
      heroFit: "contain",
      blurb: "A complete target-state AWS environment for a retail client with zero existing cloud footprint: plus the runbook, KT document and handover checklist that make it someone else's to operate.",
      tagline: "Designing the architecture is half the job. The other half is the paperwork that lets a client's own IT staff run it after you leave.",
      problem: "ABC Retail Corporation operates nationwide with no cloud infrastructure at all. They need a platform that supports store expansion without re-architecture, keeps customer and payment data protected, and stays cost-predictable as it scales.",
      solution: "A single VPC (10.0.0.0/16) spanning two Availability Zones. Public subnets host the internet-facing web tier and NAT gateway; private subnets isolate the application and database tiers. EC2 for compute, Multi-AZ-capable RDS MySQL in a private DB subnet group, S3 with SSE-S3 encryption, versioning and lifecycle rules, and CloudWatch alarms feeding SNS notifications.",
      contribution: [
        "Owned the cloud infrastructure design and coordinated the full deliverable set",
        "Cloud infrastructure design against the AWS Well-Architected Framework",
        "Network and security design: subnet tiering, security group segmentation, least-privilege IAM",
        "Contributed to the full professional document set: design, deployment, admin, KT, runbook, cost report"
      ],
      tech: ["AWS VPC", "EC2", "RDS MySQL", "Amazon S3", "IAM", "CloudWatch", "SNS", "AWS Backup", "draw.io"],
      skills: ["Cloud architecture", "Network design", "Security posture", "Cost optimisation", "Technical documentation", "Knowledge transfer"],
      features: [
        "Two-AZ VPC with public/private subnet tiering for high availability",
        "Web-SG / DB-SG segmentation: database reachable on 3306 from the app tier only",
        "S3 with SSE-S3 encryption, versioning and automated lifecycle rules",
        "CloudWatch CPU/RAM alarms wired to SNS for email and SMS alerting",
        "Scheduled AWS Backup plans covering both EC2 and RDS",
        "Cost estimation and optimisation report built on the AWS Pricing Calculator"
      ],
      process: "Every client and rubric requirement was mapped explicitly to the AWS service that satisfies it, and the whole design was checked against all five pillars of the Well-Architected Framework: operational excellence, security, reliability, performance efficiency and cost optimisation.",
      outcome: "Delivered as a complete handover package: Infrastructure Design Document, Deployment Guide, Administrator Guide, Knowledge Transfer document, Operations Runbook, Cost Estimation & Optimisation Report and Handover Checklists.",
      gallery: [
        { src: "assets/img/projects/aws-cloud-architecture.png", cap: "Cloud architecture diagram: the full service map across compute, database, storage, security and management tiers." },
        { src: "assets/img/projects/aws-network-diagram.png", cap: "Network diagram: VPC, subnets, gateways, route tables and security group boundaries." }
      ],
      note: "AWS console screenshots exist in the project documentation but are not published here: they expose account identifiers."
    },

    {
      id: "bnkwms",
      featured: true,
      rank: "Featured",
      name: "BNK WMS",
      sub: "Pet Boarding & Grooming Management System",
      kicker: "PHP · RFID",
      year: "2026",
      course: "Systems project",
      team: "Team project",
      role: "Team Lead / Project Manager · Full-stack Developer · RFID Integration",
      hero: "assets/img/projects/bnk-figma-splash.png",
      figma: "https://www.figma.com/design/1NkfF3bOM25bIijGVtZPI1/Untitled?node-id=0-1",
      blurb: "A 278-file PHP system for a real grooming and boarding business. Customers book online, staff run RFID check-in at the shop, admins configure everything and pull PDF reports.",
      tagline: "Three roles, one database, and an RFID reader on the counter. Built for BNK Grooming & Boarding.",
      problem: "A pet grooming and boarding business running on paper: bookings taken by phone, boarding check-in tracked by memory, and no way for an owner to see their pet's status without calling.",
      solution: "A role-routed web application. Customers register, add pet profiles, compare rates and kennels, book a service and track it. Staff confirm bookings, run RFID-based boarding check-in and send updates. Admins manage services, staff accounts, kennels, customers and pets, and generate PDF reports through Dompdf.",
      contribution: [
        "Led the project and owned the system architecture",
        "Built all three role areas (customer, staff and admin) across 278 PHP files",
        "Designed the MySQL schema covering users, pets, bookings, kennels and activity logging",
        "Integrated the RFID reader through a dedicated API layer for scan, lookup and last-scan",
        "Implemented authentication, password reset, file uploads and PDF report generation"
      ],
      tech: ["PHP", "MySQL", "JavaScript", "Dompdf", "Composer", "XAMPP", "RFID", "Figma"],
      skills: ["Role-based access control", "Session authentication", "CRUD at scale", "Hardware/API bridging", "Reporting", "File upload handling"],
      features: [
        "Three routed roles (customer, staff, administrator) from one login",
        "Online booking with pet profiles, rate comparison and kennel availability",
        "RFID boarding check-in through a dedicated scan / lookup / last-scan API",
        "Boarding update messages and a notification system",
        "PDF reports via Dompdf, plus an activity log for auditability",
        "Password reset flow and avatar / pet photo uploads"
      ],
      process: "Documented as a system-design storyboard: user goal, user action and thought, system response. Scene by scene from the public landing page through to admin sign-out.",
      outcome: "Ships with a full database export, a restore procedure and a click-by-click defence walkthrough. Hierarchical IPO charts and Mermaid manuscript diagrams are included in the docs folder.",
      gallery: [
        { src: "assets/img/projects/bnk-figma-splash.png", cap: "Figma splash: grooming, hotel, supplies. Get Started. The mobile mockup, not the PHP build." }
      ],
      note: "The splash is Figma-only. The live system is the PHP + RFID web app."
    },

    {
      id: "shuttlecock",
      featured: true,
      rank: "Featured",
      name: "ShuttleCock",
      sub: "Campus shuttle booking, later MakiRide",
      kicker: "UI / UX Design",
      year: "2024 – 2025",
      course: "CS110P → IT133 Technopreneurship",
      team: "Group project",
      role: "Designer · User Journey Documentation",
      hero: "assets/img/projects/shuttlecock-hero.png",
      figma: "https://www.figma.com/design/Z10KqWuDcUq7BKV1ggtcAn/SHUTTLECOCK--Copy-?node-id=239-1917",
      blurb: "A campus shuttle booking app designed in Figma, then evolved into MakiRide. Over a hundred screens, a working prototype, and a design system that holds across the whole flow.",
      tagline: "ShuttleCock was the booking product: onboarding, ride selection, live tracking, wallet, ratings. That design later became MakiRide.",
      problem: "Getting to and from campus meant guessing. No visibility into shuttle schedules, no way to reserve a seat, no record of a trip once it ended.",
      solution: "An end-to-end app design covering the whole journey: account creation and email verification, ride selection between Reserve a Ride, Ride Now and the Mapúa shuttle, map-based trip tracking with driver profile and plate number, fare estimation and payment through an in-app wallet, ratings, support and an e-copy receipt.",
      contribution: [
        "Contributed to the design across the full screen set",
        "Wrote the User Journey Document mapping the flow end to end",
        "Filed individual progress reports through the project's lifecycle",
        "Worked in a shared Figma file covering the full screen set"
      ],
      tech: ["Figma", "Interactive prototyping", "Design systems", "User journey mapping"],
      skills: ["UI/UX", "Wireframing", "Hi-fidelity mockups", "Design systems", "Accessibility screens", "Teamwork"],
      features: [
        "Onboarding, sign-up and email verification flow",
        "Three ride modes: Reserve a Ride, Ride Now, and campus shuttle",
        "Map-based live tracking with driver profile, rating and plate number",
        "Fare estimate, ride journey summary and cancellation flow",
        "CockPay in-app wallet with QR payment and e-copy receipts",
        "Full settings tree: account, privacy, notifications, and accessibility (mobility, visual, hearing)",
        "Support: livechat, lost-and-found, feedback survey and thank-you states"
      ],
      process: "Wireframes first, then hi-fidelity screens on a shared design system, then a clickable prototype. The same file later grew into MakiRide.",
      outcome: "A working Figma prototype for ShuttleCock, then a second life as MakiRide. Open the Figma file for the full screen set.",
      gallery: [
        { src: "assets/img/projects/shuttlecock-hero.png", cap: "Presentation mockup: home dashboard, account creation and live trip tracking." }
      ],
      video: { src: "assets/video-web/shuttlecock-demo.mp4", cap: "Prototype walkthrough." }
    },

    {
      id: "pixels",
      featured: true,
      rank: "Featured",
      name: "Pixels of Meaning",
      sub: "A Journey Through Food, Pets and Mentorship in Assembly Art",
      kicker: "x86 Assembly · Solo",
      year: "2025",
      course: "CS125 Architecture and Organization",
      team: "Solo",
      role: "Sole author",
      hero: "assets/img/pixel/burger.png",
      heroFit: "contain",
      heroPixel: true,
      blurb: "Three pixel-art pieces drawn entirely in x86 assembly. No bitmap data: every coloured block is an INT 10h call with hand-computed row, column and colour registers.",
      tagline: "Assembly is usually taught as the language you suffer through. I used it to draw a burger, Mau, and a thank-you to a teacher.",
      problem: "Low-level programming gets framed as purely mechanical: registers, interrupts, tedium. That framing makes it harder to learn, not easier.",
      solution: "Video BIOS interrupt 10h, function AH=06h (scroll window with a blank attribute) used as a pixel plotter. BH carries the colour attribute, CH/CL the top-left corner and DH/DL the bottom-right. Sequence enough of those and you have an image, with every block explicitly positioned by hand.",
      contribution: [
        "Sole author: design document, all three artworks, all the assembly",
        "Hand-plotted 78, 113 and 154 draw calls respectively for the burger, Mau, and the teddy bear",
        "Worked out colour attribute blending and coordinate positioning from the interrupt spec"
      ],
      tech: ["x86 Assembly", "MASM", "emu8086", "DOSBox", "INT 10h", "BIOS video services"],
      skills: ["Low-level programming", "Computer architecture", "Register-level control", "Coordinate math", "Creative problem solving"],
      features: [
        "Burger: comfort food, 78 draw calls",
        "Mau: companionship, 113 draw calls. She is a she.",
        "Teddy bear: a thank-you to a teacher, 154 draw calls",
        "80×25 text mode, standard 16-colour attribute palette",
        "Every rectangle defined by explicit register writes rather than bitmap data"
      ],
      process: "Each art piece uses explicit register definitions per shape rather than stored bitmap data. Every line of code is one block in the pixel grid, which gives complete control over positioning and colour blending: and means the source reads as the drawing instructions themselves.",
      outcome: "Three finished pieces plus a design document explaining the interrupt mechanics. The replayable plotter on this site parses the original .asm files and re-runs every draw call in order.",
      gallery: [
        { src: "assets/img/pixel/burger.png", cap: "Burger: 78 INT 10h draw calls, cropped to the artwork.", pixel: true },
        { src: "assets/img/pixel/cat.png", cap: "Mau: 113 draw calls.", pixel: true },
        { src: "assets/img/pixel/teddy.png", cap: "Teddy bear: 154 draw calls.", pixel: true },
        { src: "assets/img/pixel/asm-burger.png", cap: "Original emu8086 window: 80×25 text mode, the environment the drawings were made in.", pixel: true }
      ],
      playable: "pixelplot"
    },

    /* ------------------------- secondary / supporting ------------------------ */
    {
      id: "cloudshot",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Secondary",
      name: "CloudShot",
      sub: "Scalable Multi-Tenant Media Delivery & Storage",
      kicker: "Serverless AWS",
      year: "2026",
      course: "IT191-2P Cloud Computing Infrastructure & Storage",
      team: "Group project",
      role: "Project Manager · Cloud Architecture",
      icon: "S3",
      blurb: "An event-driven, serverless-first photography platform on AWS. Upload triggers Lambda; delivery goes through CloudFront only; storage ages itself into Glacier.",
      tagline: "Photography businesses lose work to hardware failure and deliver it over USB sticks. CloudShot automates the whole path from raw upload to secure global delivery.",
      problem: "Local storage means data-loss risk with no redundancy. USB and consumer cloud links have no access control. On-premise servers can't scale for a wedding's worth of RAW files. And nothing expires, so storage cost only ever goes up.",
      solution: "Four operational stages on AWS. Capture: photographers upload to a raw bucket via an EC2 admin dashboard behind IAM. Process: S3 Event Notifications trigger a Lambda on every upload for watermarking and metadata extraction. Deliver: galleries are served only through CloudFront with Origin Access Control, so clients never get a direct S3 link. Archive: lifecycle rules transition aged files through Standard-IA and Glacier, then expire temporary uploads.",
      contribution: [
        "Drove the architecture design and the three-tier split",
        "Three-tier separation across presentation, application and data with a dedicated network isolation layer",
        "Built the client-facing HTML front end: portfolio, login, packages, photographer and client gallery pages"
      ],
      tech: ["Amazon S3", "AWS Lambda", "CloudFront", "Origin Access Control", "EC2", "DynamoDB", "IAM", "VPC", "HTML", "CSS"],
      skills: ["Serverless architecture", "Event-driven design", "CDN strategy", "Storage lifecycle & cost control", "Access control design"],
      features: [
        "S3 event-triggered Lambda processing: zero manual intervention",
        "CloudFront with OAC blocking all direct bucket access",
        "Lifecycle transitions to Standard-IA and Glacier with automatic expiry",
        "Schemaless DynamoDB for variable image metadata",
        "Public/private subnet separation between client-facing and backend resources",
        "Deployed to ap-southeast-1 (Singapore) for regional latency"
      ],
      outcome: "A full architecture document mapping every cloud principle (elasticity, high availability, automation, cost optimisation, network isolation, access control and managed metadata) to the AWS service implementing it.",
      gallery: []
    },

    {
      id: "ciphers",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Secondary",
      name: "Cipher Demonstration Suite",
      sub: "Classical Cryptography in the Terminal",
      kicker: "Python · Security",
      year: "2025",
      course: "IT129 Information Assurance & Security 2",
      team: "Group project",
      role: "Author: Kama Sutra cipher module",
      icon: "KS",
      blurb: "A unified launcher running four classical ciphers. I wrote the Kama Sutra implementation: a paired-letter substitution cipher, with a fully centred ANSI terminal interface.",
      tagline: "Substitution ciphers, presented properly. Colour, alignment and interaction all handled in a plain terminal.",
      problem: "Cipher exercises are usually thrown away after they run once. We wanted something that could actually be demonstrated to a room.",
      solution: "One launcher, four cipher modules, each runnable standalone. Mine is the Kama Sutra cipher: the alphabet is split into pairs, and encryption swaps each letter for its partner. The same operation decrypts, which makes it a clean involution to demonstrate.",
      contribution: [
        "Wrote the Kama Sutra cipher module end to end, with a byline in the source header",
        "Built the interactive console UI: ANSI colour, terminal-width detection, centred layout",
        "Contributed to the shared launcher that runs each cipher as a subprocess"
      ],
      tech: ["Python 3", "ANSI escape sequences", "subprocess", "regex"],
      skills: ["Cryptography fundamentals", "Substitution ciphers", "Terminal UX", "Modular multi-author structure"],
      features: [
        "Kama Sutra paired-substitution cipher: encryption and decryption are the same operation",
        "Caesar, Polyalphabetic Vigenère and Sari-Suri modules in the same launcher",
        "Terminal-width-aware centring that survives resizing",
        "ANSI-coloured menus with a unified launcher"
      ],
      playable: "cipher",
      gallery: []
    },

    {
      id: "hotel",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Secondary",
      name: "Hotel Reservation System",
      sub: "C# WinForms · Machine Problem",
      kicker: "OOP · Desktop",
      year: "2024",
      course: "IT111L",
      team: "Group project",
      role: "Developer",
      icon: "C#",
      blurb: "Desktop hotel management built on an abstract permissions model: an abstract Account class with abstract capability properties, and role subclasses that answer them differently.",
      tagline: "The interesting part isn't the booking form. It's that every role's permissions are enforced by the type system rather than by if-statements scattered through the UI.",
      problem: "Room availability, reservations, payments and staff permissions all in one desktop app, with different staff roles needing genuinely different capabilities.",
      solution: "An abstract Account base class declaring CanManageAccounts, CanManageRooms, CanManageReservations, CanProcessCheckInOut and CanViewReports as abstract properties. Each role subclass answers them. The UI reads capabilities rather than checking role strings.",
      contribution: [
        "Built the account and permissions model, reservation logic and file persistence",
        "Iterated the system three times: v1, v2.0, then v2.1 with navigation fixes from feedback"
      ],
      tech: ["C#", ".NET WinForms", "File I/O"],
      skills: ["Abstract classes", "Inheritance & polymorphism", "Encapsulation", "Desktop UI", "Iterative development"],
      features: [
        "Room management across Single, Double, Suite and Deluxe with live availability",
        "Date-range reservation with unique booking IDs and conflict checking",
        "Payment processing with cost calculation and electronic receipts",
        "Customer records with reservation history",
        "Cancellation and modification that release availability automatically",
        "Admin panel with occupancy and revenue reporting"
      ],
      outcome: "Three visible iterations in the archive. The last one is titled after the exact feedback it addressed: a back button and a centred main menu.",
      video: { src: "assets/video/hotel-system-ui-demo.mp4", cap: "UI forms walkthrough." },
      gallery: []
    },

    {
      id: "bookstore",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Bookstore Ordering System",
      sub: "ASP.NET over Oracle",
      kicker: "Oracle · Solo",
      year: "2025",
      course: "IT115L",
      team: "Solo",
      role: "Sole developer",
      icon: "OR",
      blurb: "A solo ASP.NET ordering system running on Oracle: books, customers, orders, order lines, payments and reports, with twenty hand-made book covers I could not resist writing jokes for.",
      tagline: "A normalised Oracle schema behind a working order flow. Also the only project where I got to name a book 'CSS for People Who Cry a Lot'.",
      problem: "Build a complete ordering system against a real relational database, not a toy one.",
      solution: "ASP.NET Web Forms talking to Oracle through Oracle.ManagedDataAccess. Separate pages for Books, Customers, Orders, OrderLines, Payments, PlaceOrder and Reports, each backed by parameterised queries.",
      contribution: [
        "Sole developer: schema, queries, pages and assets",
        "Designed the ERD and wrote the SQL across eight lab activities including joins, views and triggers",
        "Made the twenty book cover graphics"
      ],
      tech: ["ASP.NET Web Forms", "C#", "Oracle SQL", "Oracle.ManagedDataAccess", "SQL Developer"],
      skills: ["Relational modelling", "Oracle SQL", "Joins, views, triggers", "Web forms", "Reporting"],
      features: ["Book catalogue and inventory", "Customer records", "Order and order-line management", "Payment recording", "Place-order flow", "Reporting page"],
      gallery: [
        { src: "assets/img/gallery/bookstore-erd.png", cap: "Entity relationship diagram for the bookstore schema." },
        { src: "assets/img/gallery/oracle-consignor.png", cap: "Oracle SQL Developer: consignor table." },
        { src: "assets/img/gallery/oracle-item.png", cap: "Oracle SQL Developer: item table." },
        { src: "assets/img/gallery/oracle-prices.png", cap: "Oracle SQL Developer: prices table." }
      ]
    },

    {
      id: "makiride",
      featured: true,
      /* real screens from the Figma file (designed as ShuttleCock), shown in a phone */
      phone: [
        { src: "assets/img/projects/makiride/phone/01-onboarding.webp", ch: 0 },
        { src: "assets/img/projects/makiride/phone/02-signup.webp", ch: 0 },
        { src: "assets/img/projects/makiride/phone/03-trip-scheduling.webp", ch: 1 },
        { src: "assets/img/projects/makiride/phone/04-shuttle-availability.webp", ch: 1 },
        { src: "assets/img/projects/makiride/phone/05-tracking.webp", ch: 2 },
        { src: "assets/img/projects/makiride/phone/06-traffic.webp", ch: 2 },
        { src: "assets/img/projects/makiride/phone/07-cockpay.webp", ch: 2 },
        { src: "assets/img/projects/makiride/phone/08-rewards.webp", ch: 3 },
        { src: "assets/img/projects/makiride/phone/09-ratings.webp", ch: 3 },
        { src: "assets/img/projects/makiride/phone/10-live-chat.webp", ch: 4 },
        { src: "assets/img/projects/makiride/phone/11-booking-confirmed.webp", ch: 4 }
      ],
      rank: "Supporting",
      name: "MakiRide",
      sub: "Carpooling pitch, grown from ShuttleCock",
      kicker: "Technopreneurship",
      year: "2025",
      course: "IT133 Technopreneurship",
      team: "Group project",
      role: "Pitch & product",
      icon: "MR",
      figma: "https://www.figma.com/design/Z10KqWuDcUq7BKV1ggtcAn/SHUTTLECOCK--Copy-?node-id=239-1917",
      blurb: "A ride-matching concept for students, grown out of the ShuttleCock design. Pitched with a quantified problem: 1.5 to 2 hour commutes, 90% peak parking occupancy, ₱500 to 700 a week on fuel.",
      tagline: "Sharing rides, saving lives. Market framing, personas, objection handling, and a deck that has to survive questions.",
      problem: "Students commuting alone in single-passenger vehicles, campus parking at 90% during peak, and fuel costs of ₱500–700 weekly per student: with transportation contributing roughly 30% of CO₂ emissions.",
      solution: "Match drivers and passengers travelling the same routes, with real-time scheduling, verified profiles and ride cost sharing.",
      contribution: [
        "Contributed to the pitch deck, write-up and implementation plan",
        "Filed weekly individual progress reports across the project"
      ],
      tech: ["Trello", "Figma-style mockups", "Pitch decks", "Video production"],
      skills: ["Market framing", "Persona development", "Product goals", "Objection handling", "Project management"],
      features: ["Route matching between drivers and passengers", "Real-time scheduling", "Verified profiles", "Ride cost sharing", "Driver mode and route setting", "In-app payment and rating"],
      gallery: [
        { src: "assets/img/gallery/makiride-Dashboard-+-Home-Page.png", cap: "Dashboard and home page concept." },
        { src: "assets/img/gallery/makiride-Pool-a-Car.png", cap: "Pool a car: the core matching flow." },
        { src: "assets/img/gallery/makiride-Driving-Mode.png", cap: "Driving mode." },
        { src: "assets/img/gallery/makiride-Set-Drivinbg-Route.png", cap: "Setting a driving route." },
        { src: "assets/img/gallery/makiride-07---Set-Driving-Route-and-Schedule.png", cap: "Route and schedule together." },
        { src: "assets/img/gallery/makiride-Payment-Page.png", cap: "Payment page." },
        { src: "assets/img/gallery/makiride-Rate.png", cap: "Rating a ride." },
        { src: "assets/img/gallery/makiride-Acc-Inmfo--Ver.png", cap: "Account information and verification." }
      ],
      video: { src: "assets/video-web/makiride-pitch.mp4", cap: "Video pitch." }
    },

    {
      id: "gradex",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Grade-X",
      sub: "Scalable Cloud Framework for Student Services",
      kicker: "Cloud Design",
      year: "2025",
      course: "IT191-1 Introduction to Cloud Computing",
      team: "Group project",
      role: "Architecture",
      icon: "GX",
      blurb: "A three-tier AWS design for a university grade portal, sized specifically for the traffic spike on grade release day.",
      tagline: "The interesting constraint wasn't average load. It was the fifteen minutes when every student in the university refreshes at once.",
      problem: "A student portal that is idle most of the term and then takes thousands of simultaneous requests the moment grades are released.",
      solution: "Containerised EC2 instances behind an Application Load Balancer with Auto Scaling Groups: containers chosen over VMs specifically because they start in seconds rather than minutes. A VPC with public and private subnets, security groups and ACLs, and a managed RDS database with Multi-AZ replication.",
      contribution: [
        "Contributed to the architecture and its justification against course principles"
      ],
      tech: ["AWS EC2", "Docker", "Auto Scaling Groups", "Application Load Balancer", "RDS Multi-AZ", "VPC", "Security Groups"],
      skills: ["Three-tier architecture", "Elastic scaling", "Fault tolerance", "Network segmentation", "Virtualisation"],
      features: ["Containerised presentation tier with ASG", "ALB traffic distribution", "Private-subnet application tier", "Multi-AZ RDS for durability", "Security groups and network ACLs"],
      video: { src: "assets/video/gradex-presentation.mp4", cap: "System presentation." },
      gallery: []
    },

    {
      id: "dsa",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "C++ Data Structures",
      sub: "Lists, Stacks, Queues, Trees, Dijkstra",
      kicker: "Fundamentals",
      year: "2024",
      course: "CS102-1L",
      team: "Solo",
      role: "Sole author",
      icon: "DS",
      blurb: "Every core data structure implemented from scratch in C++, each with its captured output. Singly, doubly and circular linked lists, stacks, queues, binary search trees and Dijkstra's shortest path.",
      tagline: "The unglamorous foundation. I kept the output screenshot for every single one, which is why they're all still here.",
      problem: "Learn the structures by building them rather than importing them.",
      solution: "Hand-written node structures and class implementations for each structure, plus four applied scenario programs: a card queue, customer records, a queueing simulation and a binary search tree.",
      contribution: ["Sole author across all lab exercises and scenario programs"],
      tech: ["C++", "Pointers", "Dynamic memory"],
      skills: ["Linked lists", "Stacks & queues", "Binary search trees", "Graph algorithms", "Pointer manipulation"],
      features: ["Singly linked list", "Doubly linked list", "Circular linked list", "Stack", "Queue", "Binary search tree", "Dijkstra's shortest path"],
      gallery: [
        { src: "assets/img/gallery/dsa-singly-linked-list.png", cap: "Singly linked list output." },
        { src: "assets/img/gallery/dsa-doubly-linked-list.png", cap: "Doubly linked list output." },
        { src: "assets/img/gallery/dsa-circular-linked-list.png", cap: "Circular linked list output." },
        { src: "assets/img/gallery/dsa-stack.png", cap: "Stack implementation output." },
        { src: "assets/img/gallery/dsa-queue.png", cap: "Queue implementation output." },
        { src: "assets/img/gallery/dsa-dijkstra.jpg", cap: "Dijkstra's shortest path output." }
      ]
    },

    {
      id: "networking",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Networking Lab Portfolio",
      sub: "Cisco Packet Tracer: CCNA 1 & 2",
      kicker: "Networking",
      year: "2025",
      course: "CCNA171P-1 & CCNA171P-2",
      team: "Solo",
      role: "Sole author",
      icon: "NW",
      blurb: "Around forty completed Packet Tracer labs with written documentation, spanning both CCNA courses: from OSI model exploration through to wireless controller configuration.",
      tagline: "Backed by the Cisco Networking Academy certificate for CCNA: Introduction to Networks.",
      problem: "Build networking competence that holds up outside a multiple-choice exam.",
      solution: "Complete every lab, document every one, and keep both the .pka file and the write-up.",
      contribution: ["Sole author across roughly forty labs and their documentation"],
      tech: ["Cisco Packet Tracer", "Cisco IOS", "Wireshark"],
      skills: ["VLANs & trunking", "Inter-VLAN routing", "STP", "EtherChannel", "DHCPv4", "HSRP", "VLSM subnetting", "IPv6", "Port security", "WLC configuration", "Frame analysis"],
      features: [
        "CCNA 1: OSI/TCP-IP models, switch configuration, physical layer, VLSM, IPv6, secure device config",
        "CCNA 2: VLANs and trunking, router-on-a-stick, Layer 3 switching, STP loop prevention, EtherChannel",
        "DHCPv4 and HSRP configuration, data centre exploration",
        "Port security, switch security configuration, wireless network and WLC setup",
        "Wireshark labs examining Ethernet frames and MAC address tables"
      ],
      gallery: []
    },

    {
      id: "logic",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Digital Logic Design",
      sub: "Logisim Circuits & Karnaugh Maps",
      kicker: "Hardware",
      year: "2024",
      course: "IT132",
      team: "Solo",
      role: "Sole author",
      icon: "LG",
      blurb: "Logisim circuits built from AND, OR, NOT and NAND gates, plus Boolean simplification through Karnaugh maps: the same topic I later taught to second-year students as ITSOC president.",
      tagline: "Learn it, then teach it. This coursework is the direct source of the two peer-mentoring sessions I ran.",
      problem: "Design and simplify combinational logic circuits from a truth table.",
      solution: "Three-variable circuit projects in Logisim with labelled pins, alongside written Karnaugh map simplification of Boolean expressions.",
      contribution: ["Sole author of the circuits and the simplification write-up"],
      tech: ["Logisim", "Tinkercad", "Boolean algebra"],
      skills: ["Logic gates", "Truth tables", "Karnaugh maps", "Boolean simplification", "Circuit design"],
      features: ["Three-variable circuit project", "AND / OR / NOT / NAND gate compositions", "Truth table to K-map conversion", "Boolean expression simplification"],
      gallery: []
    },

    {
      id: "bi",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Data & BI Lab Work",
      sub: "Power BI, Tableau, Oracle SQL",
      kicker: "Data",
      year: "2025",
      course: "IT115L",
      team: "Solo",
      role: "Sole author",
      icon: "BI",
      blurb: "Three Power BI dashboards, a Tableau workbook and eight Oracle SQL lab activities covering joins, views, triggers and user creation.",
      tagline: "The data half of the degree: modelling it, querying it, then making it legible.",
      problem: "Turn relational data into something a person can actually read.",
      solution: "Dashboards in both Power BI and Tableau over the same underlying Oracle datasets, alongside the SQL that produces them.",
      contribution: ["Sole author across the dashboards and all eight SQL lab activities"],
      tech: ["Power BI", "Tableau", "Oracle SQL", "SQL Developer"],
      skills: ["Dashboard design", "Joins & set operators", "Views", "Triggers", "User management", "Data modelling"],
      features: ["Three Power BI dashboards", "Tableau workbook", "Join, union, intersect and minus operators", "Views and triggers", "Database user creation"],
      gallery: []
    },

    {
      id: "pygui",
      hide: true,   // kept in the archive, not shown on the site
      rank: "Supporting",
      name: "Python GUI Lab Set",
      sub: "Tkinter Applications",
      kicker: "Python",
      year: "2024",
      course: "First year lab work",
      team: "Solo",
      role: "Sole author",
      icon: "PY",
      blurb: "The Tkinter years: calculators, layout managers, a payroll tool, a picture browser, and the two games that ended up playable on this site.",
      tagline: "Where I learned that a UI is a state machine wearing a costume.",
      problem: "Learn GUI programming and event-driven state from first principles.",
      solution: "A run of small applications, each targeting a specific concept: pack, place and grid layout managers, dialogs, image handling, and game state.",
      contribution: ["Sole author of this set of applications"],
      tech: ["Python 3", "Tkinter", "PhotoImage"],
      skills: ["Event-driven programming", "Layout managers", "Widget composition", "Game state", "Image handling"],
      features: ["Simple calculators", "Layout manager exercises (pack / place / grid)", "Simple payroll tool", "Image browser over an indexed picture set", "Mines betting game", "Animal Bingo Blackout"],
      gallery: [
        { src: "assets/img/gallery/py-simplecalc.png", cap: "Simple calculator." },
        { src: "assets/img/gallery/py-grid-layout.png", cap: "Grid layout manager exercise." },
        { src: "assets/img/gallery/py-bingo.png", cap: "Animal Bingo Blackout: image bingo with multiple cards." },
        { src: "assets/img/gallery/py-image-browser.png", cap: "Image browser with first / previous / next / last navigation." }
      ]
    }
  ],

  /* ----------------------------------------------- DESIGN GALLERY
     Curated diagrams and interface work only: not a second dump of
     every screenshot already sitting in a case study. */
  designGallery: [
    { src: "assets/img/projects/dilig-architecture.png", cap: "Five-tier hub-and-spoke: Perception → Edge → Gateway → Integration Hub → Presentation.", title: "D.I.L.I.G.", sub: "Systems architecture", cat: "Architecture", wide: true },
    { src: "assets/img/gallery/dilig-data-flow-diagram.png", cap: "Telemetry up, commands down.", title: "D.I.L.I.G.", sub: "Data flow", cat: "Architecture" },
    { src: "assets/img/gallery/dilig-database-erd.png", cap: "MySQL schema: five tables, cascade rules, indexed keys.", title: "D.I.L.I.G.", sub: "ERD", cat: "Data" },
    { src: "assets/img/projects/dilig-app-onboarding.png", cap: "Onboarding, household sign-up, and the live dashboard offline.", title: "D.I.L.I.G.", sub: "Android UI", cat: "Mobile UI" },
    { src: "assets/img/gallery/dilig-app-calendar-log.png", cap: "Watering calendar, member gate, live dashboard, activity log.", title: "D.I.L.I.G.", sub: "Android UI", cat: "Mobile UI" },
    { src: "assets/img/projects/aws-cloud-architecture.png", cap: "Target-state AWS map for a retail client with no existing cloud footprint.", title: "AWS-ome Tech", sub: "Cloud architecture", cat: "Architecture", wide: true },
    { src: "assets/img/projects/aws-network-diagram.png", cap: "VPC, subnets, gateways, route tables, security-group boundaries.", title: "AWS-ome Tech", sub: "Network diagram", cat: "Architecture" },
    { src: "assets/img/projects/pulsepoint-architecture.png", cap: "Clinic appointment system architecture.", title: "PulsePoint", sub: "System architecture", cat: "Architecture" }
  ],

  /* --------------------------------------------------------------- PLAYABLE */
  playable: [
    {
      id: "kusinakode",
      title: "Kusina Kode",
      sub: "Filipino cuisine word puzzle",
      origin: "Android · Kotlin + Jetpack Compose · 2025–2026",
      desc: "Guess the six-letter Filipino dish in six tries. Green means right letter, right place. Then the trivia card tells you where the dish comes from.",
      art: ["assets/img/game/kusinakode/kk-logo.png"],
      tag: "20 real levels"
    },
    {
      id: "facechange",
      title: "Face Change Cube",
      sub: "Speed pattern matching",
      origin: "Android · C# / Xamarin · 2025",
      desc: "Roll a target face, then tap the four quadrants until your cube matches it. The clock is running and it remembers your best.",
      art: ["assets/img/game/facechange/upperleft1.png", "assets/img/game/facechange/upperright3.png"],
      tag: "Original sprites"
    },
    {
      id: "mines",
      title: "Mines",
      sub: "Press your luck",
      origin: "Python · Tkinter · 2024",
      desc: "Set the mine count, place your bet, and reveal tiles for a rising multiplier. Cash out before you hit one. Starts you at 100 coins, same as the original.",
      art: [],
      tag: "Faithful rules"
    },
    {
      id: "pixelplot",
      title: "Assembly Plotter",
      sub: "Watch the code draw",
      origin: "x86 Assembly · emu8086 · 2025",
      desc: "Replays the actual INT 10h draw calls from my assembly source files, one rectangle at a time, exactly in the order the CPU would execute them.",
      art: ["assets/img/pixel/cat.png"],
      tag: "Parsed from .asm"
    },
    {
      id: "cipher",
      title: "Kama Sutra Cipher",
      sub: "Encrypt and decrypt",
      origin: "Python · Terminal · 2025",
      desc: "The paired-substitution cipher I wrote for Information Assurance. Encryption and decryption are the same operation: run it twice and you get your text back.",
      art: [],
      tag: "Same algorithm"
    }
  ],

  /* ----------------------------------------------------------------- SKILLS */
  skills: [
    { cat: "Programming", icon: "{}", items: ["Kotlin", "C#", "Python", "PHP", "C++", "x86 Assembly", "Arduino C++", "SQL", "JavaScript", "VB.NET"] },
    { cat: "Mobile", icon: "[]", items: ["Jetpack Compose", "MVVM", "StateFlow", "Retrofit", "Ktor", "Coroutines", "NavController", "Xamarin.Android", "Gradle"] },
    { cat: "Web & Backend", icon: "</>", items: ["ASP.NET Web Forms", "ASP.NET MVC", "PHP + PDO", "REST API design", "SOAP web services", "HTML5", "CSS3", "XAMPP / Apache"] },
    { cat: "Database", icon: "DB", items: ["MySQL", "Oracle SQL", "SQL Server", "MS Access", "ERD modelling", "3NF normalisation", "Triggers & views", "Prepared statements"] },
    { cat: "Cloud & DevOps", icon: "☁", items: ["AWS EC2", "Amazon S3", "AWS Lambda", "CloudFront", "RDS", "VPC", "IAM", "CloudWatch", "DynamoDB", "Docker", "Kubernetes", "CI/CD", "Git"] },
    { cat: "IoT & Hardware", icon: "◈", items: ["Arduino Uno", "ESP8266 NodeMCU", "DHT11", "HW-080", "Relay control", "UART serial", "RFID", "Logisim", "Karnaugh maps", "Tinkercad"] },
    { cat: "Networking", icon: "≋", items: ["Cisco Packet Tracer", "Cisco IOS", "VLANs & trunking", "Inter-VLAN routing", "STP", "EtherChannel", "DHCPv4", "HSRP", "VLSM", "IPv6", "Wireshark"] },
    { cat: "Security", icon: "🔒", items: ["Classical cryptography", "Password hashing (BCrypt)", "Defense in depth validation", "SQL injection prevention", "Least-privilege IAM", "Security group segmentation", "Rate limiting"] },
    { cat: "Analysis & Design", icon: "◇", items: ["Requirements elicitation", "Stakeholder interviews", "Survey design", "STROBE observation", "Process mapping", "Work breakdown structure", "Data flow diagrams"] },
    { cat: "UI/UX", icon: "◐", items: ["Figma", "Interactive prototyping", "User journey mapping", "Wireframing", "Design systems", "Light/dark theming", "Onboarding flows"] },
    { cat: "Data & BI", icon: "▤", items: ["Power BI", "Tableau", "Data cleaning", "Dashboard design", "Data modelling"] },
    { cat: "Leadership & PM", icon: "★", items: ["Team leadership", "Project management", "Trello", "Scope & module planning", "Technical documentation", "Operations runbooks", "Knowledge transfer", "Peer mentoring"] }
  ],

  /* ----------------------------------------------------------------- CERTS */
  certTypes: {
    pro:      { label: "Professional Certificate", color: "var(--lilac)" },
    spec:     { label: "Specialization",           color: "var(--lilac)" },
    training: { label: "Training / Completion",    color: "var(--mint)" },
    academy:  { label: "Academy Certificate",      color: "var(--peach)" },
    seminar:  { label: "Seminar / Participation",  color: "var(--ink-3)" },
    org:      { label: "Organisational",           color: "var(--sun)" }
  },

  certs: [
    { id: "ccna",        name: "CCNA: Introduction to Networks", issuer: "Cisco Networking Academy", via: "Malayan Colleges Laguna", date: "30 Jul 2025", year: 2025, type: "academy", cat: "Networking", featured: true, file: "assets/certs/cisco-ccna-intro-networks.pdf", verify: "", note: "Instructor: Maribelle Nicerio" },
    { id: "aws-cte",     name: "AWS Cloud Technical Essentials", issuer: "Amazon Web Services", via: "Coursera", date: "13 Feb 2026", year: 2026, type: "training", cat: "Cloud", featured: true, file: "assets/certs/aws-cloud-technical-essentials.pdf", verify: "https://coursera.org/verify/UO7BTMX27KMO" },
    { id: "aws-as",      name: "Architecting Solutions on AWS", issuer: "Amazon Web Services", via: "Coursera", date: "13 Feb 2026", year: 2026, type: "training", cat: "Cloud", featured: true, file: "assets/certs/aws-architecting-solutions.pdf", verify: "https://coursera.org/verify/EMMPZWXMLQP8" },
    { id: "gsec",        name: "Foundations of Cybersecurity", issuer: "Google", via: "Coursera", date: "30 Aug 2025", year: 2025, type: "training", cat: "Security", featured: true, file: "assets/certs/google-foundations-cybersecurity.pdf", verify: "https://coursera.org/verify/IR10IMSDHTZ6" },
    { id: "ms-aipm",     name: "Microsoft AI Product Manager", issuer: "Microsoft", via: "Coursera · 5-course programme", date: "2 Oct 2025", year: 2025, type: "pro", cat: "Product", featured: true, file: "assets/certs/ms-ai-product-manager.pdf", verify: "" },
    { id: "devops-git",  name: "DevOps Essentials and Version Control with Git", issuer: "Edureka", via: "Coursera", date: "12 Mar 2026", year: 2026, type: "training", cat: "DevOps", featured: true, file: "assets/certs/devops-git.pdf", verify: "https://coursera.org/verify/BSPAGNPD5X1C" },

    { id: "aws-cdas",    name: "AWS Certified Data Analytics Specialty (2023) Hands-on", issuer: "Amazon Web Services", via: "Coursera · 3-course specialization", date: "12 Mar 2026", year: 2026, type: "spec", cat: "Cloud", file: "assets/certs/aws-data-analytics-specialization.pdf", verify: "https://coursera.org/verify/specialization/LYH74CIWAGST", note: "A Coursera specialization preparing for the AWS exam: not the proctored AWS certification itself." },
    { id: "aws-bdl",     name: "Building Data Lakes on AWS", issuer: "Amazon Web Services", via: "Coursera", date: "19 Feb 2026", year: 2026, type: "training", cat: "Cloud", file: "assets/certs/aws-building-data-lakes.pdf", verify: "https://coursera.org/verify/UZALM9YV5WJY" },
    { id: "s3-deep",     name: "Amazon S3 Deep Dive: Complete AWS Cloud Storage Guide", issuer: "Packt", via: "Coursera", date: "7 Jan 2026", year: 2026, type: "training", cat: "Cloud", file: "assets/certs/amazon-s3-deep-dive.pdf", verify: "https://coursera.org/verify/90XCEERTN8EN" },
    { id: "s3-basics",   name: "AWS S3 Basics", issuer: "Coursera", via: "Guided project", date: "16 Feb 2026", year: 2026, type: "training", cat: "Cloud", file: "assets/certs/aws-s3-basics-project.pdf", verify: "https://coursera.org/verify/K6UKA268L5JM" },
    { id: "ibm-cc",      name: "Introduction to Cloud Computing", issuer: "IBM", via: "Coursera", date: "30 Aug 2025", year: 2025, type: "training", cat: "Cloud", file: "assets/certs/ibm-intro-cloud-computing.pdf", verify: "https://coursera.org/verify/2EQ3HBTIP5U8" },
    { id: "cloud101",    name: "Cloud Computing Basics (Cloud 101)", issuer: "LearnQuest", via: "Coursera", date: "22 Oct 2025", year: 2025, type: "training", cat: "Cloud", file: "assets/certs/cloud-101-basics.pdf", verify: "https://coursera.org/verify/QM8MC5XTB3A9" },

    { id: "k8s-fund",    name: "Kubernetes Fundamentals", issuer: "LearnKartS", via: "Coursera", date: "22 Oct 2025", year: 2025, type: "training", cat: "DevOps", file: "assets/certs/kubernetes-fundamentals.pdf", verify: "https://coursera.org/verify/LR27CNEH9GZV" },
    { id: "k8s-adv",     name: "Advanced Kubernetes", issuer: "LearnKartS", via: "Coursera", date: "27 Oct 2025", year: 2025, type: "training", cat: "DevOps", file: "assets/certs/kubernetes-advanced.pdf", verify: "https://coursera.org/verify/3TC4KC7OO3OS" },
    { id: "container-f", name: "Container and Container Orchestration Fundamentals", issuer: "LearnKartS", via: "Coursera", date: "22 Oct 2025", year: 2025, type: "training", cat: "DevOps", file: "assets/certs/container-orchestration-fundamentals.pdf", verify: "https://coursera.org/verify/VKU3LHH3LKBR" },
    { id: "devops-cont", name: "Containerization and Orchestration", issuer: "Edureka", via: "Coursera", date: "12 Mar 2026", year: 2026, type: "training", cat: "DevOps", file: "assets/certs/devops-containerization.pdf", verify: "https://coursera.org/verify/731F4Q4U7A5D" },
    { id: "devops-cicd", name: "Continuous Integration and Continuous Deployment", issuer: "Edureka", via: "Coursera", date: "12 Mar 2026", year: 2026, type: "training", cat: "DevOps", file: "assets/certs/devops-ci-cd.pdf", verify: "https://coursera.org/verify/PWI4I838K3BY" },
    { id: "devops-iac",  name: "Infrastructure as Code and Monitoring", issuer: "Edureka", via: "Coursera", date: "12 Mar 2026", year: 2026, type: "training", cat: "DevOps", file: "assets/certs/devops-iac-monitoring.pdf", verify: "https://coursera.org/verify/VQXTT3F8MLG6" },

    { id: "g-data",      name: "Foundations: Data, Data, Everywhere", issuer: "Google", via: "Coursera", date: "30 Aug 2025", year: 2025, type: "training", cat: "Data", file: "assets/certs/google-data-foundations.pdf", verify: "https://coursera.org/verify/TP3XBHP2UE85" },
    { id: "g-ask",       name: "Ask Questions to Make Data-Driven Decisions", issuer: "Google", via: "Coursera", date: "1 Sep 2025", year: 2025, type: "training", cat: "Data", file: "assets/certs/google-ask-questions.pdf", verify: "https://coursera.org/verify/2D9L4QS3060L" },
    { id: "g-prep",      name: "Prepare Data for Exploration", issuer: "Google", via: "Coursera", date: "2 Oct 2025", year: 2025, type: "training", cat: "Data", file: "assets/certs/google-prepare-data.pdf", verify: "https://coursera.org/verify/CL8SG65OKIJY" },
    { id: "g-clean",     name: "Process Data from Dirty to Clean", issuer: "Google", via: "Coursera", date: "2 Oct 2025", year: 2025, type: "training", cat: "Data", file: "assets/certs/google-process-data.pdf", verify: "https://coursera.org/verify/L6Y1USKES0KI" },

    { id: "ms-design",   name: "Product Design and UX/UI Fundamentals", issuer: "Microsoft", via: "Coursera", date: "4 Sep 2025", year: 2025, type: "training", cat: "Design", file: "assets/certs/ms-product-design-uxui.pdf", verify: "https://coursera.org/verify/0OLO9UJ146JX" },
    { id: "cub-color",   name: "Graphic Elements of Design: Color Theory and Image Formats", issuer: "University of Colorado Boulder", via: "Coursera", date: "24 May 2026", year: 2026, type: "training", cat: "Design", file: "assets/certs/cu-boulder-color-theory.pdf", verify: "https://coursera.org/verify/UY11CYMGSV5W" },
    { id: "ms-epm",      name: "Enterprise Product Management Fundamentals", issuer: "Microsoft", via: "Coursera", date: "1 Sep 2025", year: 2025, type: "training", cat: "Product", file: "assets/certs/ms-enterprise-product-mgmt.pdf", verify: "https://coursera.org/verify/3J4LL8U1NY5A" },
    { id: "ms-strategy", name: "Product Strategy and Roadmapping", issuer: "Microsoft", via: "Coursera", date: "1 Sep 2025", year: 2025, type: "training", cat: "Product", file: "assets/certs/ms-product-strategy.pdf", verify: "https://coursera.org/verify/HPMEINFVBX26" },
    { id: "ms-market",   name: "Market Research and Competitive Analysis", issuer: "Microsoft", via: "Coursera", date: "1 Sep 2025", year: 2025, type: "training", cat: "Product", file: "assets/certs/ms-market-research.pdf", verify: "https://coursera.org/verify/UYP16VIN989Y" },

    { id: "lund-ai",     name: "Artificial Intelligence: Ethics & Societal Challenges", issuer: "Lund University", via: "Coursera", date: "2 Oct 2025", year: 2025, type: "training", cat: "Security", file: "assets/certs/ai-ethics-lund.pdf", verify: "https://coursera.org/verify/R6WMD6SQF07F" },
    { id: "va-prod",     name: "Leveraging Virtual Assistants for Personal Productivity", issuer: "Coursera Instructor Network", via: "Starweaver", date: "30 Aug 2025", year: 2025, type: "training", cat: "Product", file: "assets/certs/virtual-assistants-productivity.pdf", verify: "https://coursera.org/verify/N6M2FXLTALUT" },
    { id: "epcps",       name: "Information Security in Cybersecurity", issuer: "Ethel Programming Computer Programming Services", via: "1-hour webinar", date: "25 Jan 2026", year: 2026, type: "seminar", cat: "Security", file: "assets/certs/epcps-infosec-webinar.pdf", verify: "" },
    { id: "itsoc-pres",  name: "President: Information Technology Society", issuer: "Mapúa Malayan Colleges Laguna", via: "ITSOC", date: "A.Y. 2024–2025", year: 2025, type: "org", cat: "Leadership", featured: false, file: "assets/certs/itsoc-president.pdf", verify: "" }
  ],

  badges: {
    title: "Google Cloud Skills Boost",
    count: 8,
    note: "Earned on the public Google Skills profile, alongside the Google Cloud Career Launchpad APAC programme.",
    profile: "https://www.skills.google/public_profiles/5dc0d52b-b333-4568-a469-5979f4ce5967",
    items: [
      { name: "Prepare Data for ML APIs on Google Cloud", kind: "Skill Badge · Introductory", track: "Smart Analytics", date: "5 Mar 2024" },
      { name: "Build a Secure Google Cloud Network", kind: "Skill Badge · Intermediate", track: "Security", date: "4 Mar 2024" },
      { name: "Set Up an App Dev Environment on Google Cloud", kind: "Skill Badge · Introductory", track: "Infrastructure Modernization", date: "25 Feb 2024" },
      { name: "Implementing Cloud Load Balancing for Compute Engine", kind: "Skill Badge · Introductory", track: "Infrastructure Modernization", date: "23 Feb 2024" },
      { name: "Google Cloud Computing Foundations: Data, ML, and AI in Google Cloud", kind: "Completion Badge", track: "Foundations", date: "22 Feb 2024" },
      { name: "Google Cloud Computing Foundations: Networking & Security in Google Cloud", kind: "Completion Badge", track: "Foundations", date: "20 Feb 2024" },
      { name: "Google Cloud Computing Foundations: Infrastructure in Google Cloud", kind: "Completion Badge", track: "Foundations", date: "19 Feb 2024" },
      { name: "Google Cloud Computing Foundations: Cloud Computing Fundamentals", kind: "Completion Badge", track: "Foundations", date: "19 Feb 2024" }
    ]
  },

  /* ------------------------------------------------------------- LEADERSHIP */
  leadership: {
    role: "President",
    org: "Information Technology Society (ITSOC)",
    where: "Mapúa Malayan Colleges Laguna",
    term: "Academic Year 2024 – 2025",
    body: "The visible part is events. The actual work is venue coordination, volunteer recruitment, publicity timelines, financial reporting and a term-end report that has to reconcile all of it.",
    photos: [
      { src: "assets/img/leadership/campaign.jpg", title: "Candidate for President", sub: "ITSOC · A.Y. 2024–2025", cap: "Official candidate poster: Information Technology Society.", hero: true },
      { src: "assets/img/leadership/general-assembly.jpg", title: "IT General Assembly", sub: "On stage", cap: "Hosting the IT General Assembly as ITSOC President.", wide: true },
      { src: "assets/img/leadership/pamaskong-handog.jpg", title: "Pamaskong Handog", sub: "Dec 2024", cap: "Community outreach at Diezmo Integrated School: I coordinated the programme and the gift-giving." },
      { src: "assets/img/leadership/python-competition.jpg", title: "CCIS Week", sub: "Jun 2025", cap: "Python Programming Competition during CCIS Week. I was there as President." }
    ],
    events: [
      {
        d: "16", m: "Oct 2024",
        t: "Peer Mentoring: Logic Design and Circuits",
        p: "A session for second-year BSIT students on logic gates, variables, terms and literals, with hands-on work in Tinkercad and Logisim. Feedback collected through MS Forms.",
        win: ""
      },
      {
        d: "06", m: "Nov 2024",
        t: "Peer Mentoring: K-maps and Truth Tables",
        p: "Twelve participants worked through building truth tables, converting them to Karnaugh maps, and simplifying Boolean expressions for efficient circuit design, ahead of their exams.",
        win: "8 of 9 mentees who attended passed their exam"
      },
      {
        d: "16", m: "Dec 2024",
        t: "Pamaskong Handog para sa Kabataan",
        p: "Community outreach at Diezmo Integrated School, Barangay Butong, Cabuyao: gift-giving, school supplies and Filipino-themed games for kindergarten students. I handled overall event coordination and facilitated the gift-giving.",
        win: "Coordinated with CSCE"
      },
      {
        d: "24", m: "Jun 2025",
        t: "Python Programming Competition: CCIS Week",
        p: "A timed contest in the lab during CCIS Week. I was there as President: the room, the clock, and the programme on the screen.",
        win: ""
      }
    ],
    also: [
      "Authored the ITSOC roadmap, general assembly deck and meeting agendas",
      "Produced the term-end report: officer roster, activities, partnerships, financial report and accountability",
      "Wrote opening remarks and event host scripts",
      "Maintained the organisation's event calendar and renewal documentation"
    ]
  },

  /* -------------------------------------------------------------- EDUCATION */
  education: [
    { k: "Ambassador", t: "Mapúa MCL Student Ambassador", p: "Official face of the A.Y. 2024–2025 enrollment campaign. This is the photograph the college published.", m: "A.Y. 2024–2025", img: "assets/img/leadership/ambassador.jpg", cap: "Mapúa Malayan Colleges Laguna ambassador campaign, A.Y. 2024–2025. I'm on the left." },
    { k: "Degree", t: "BS Information Technology", p: "Mapúa Malayan Colleges Laguna. Full academic scholar and President's Lister. Expected graduation 2027.", m: "2023 – 2027 (expected)", mark: "BSIT" },
    { k: "Capstone", t: "Kusina Kode: Integrating Blockchain Incentives in Gamified Filipino Culinary Education", p: "Project Manager, with ownership of the game systems and cloud integration modules.", m: "Adviser: Khristian G. Kikuchi" },
    { k: "Immersion", t: "Japan Technology Exposure Tour", p: "Miraikan robotics and AI, DiverCity Tokyo, and how Japan puts technology into public transport and services.", m: "7 – 11 March 2026" }
  ],

  honors: [
    "President's Lister",
    "Full Academic Scholar",
    "President, ITSOC · A.Y. 2024–2025",
    "Student Ambassador · A.Y. 2024–2025"
  ],

  techIcons: [
    { name: "Kotlin", slug: "kotlin", color: "7F52FF" },
    { name: "C#", slug: "csharp", color: "512BD4" },
    { name: "Python", slug: "python", color: "3776AB" },
    { name: "PHP", slug: "php", color: "777BB4" },
    { name: "C++", slug: "cplusplus", color: "00599C" },
    { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
    { name: "HTML5", slug: "html5", color: "E34F26" },
    { name: "CSS3", slug: "css", color: "1572B6" },
    { name: "MySQL", slug: "mysql", color: "4479A1" },
    { name: "AWS", slug: "amazonwebservices", color: "FF9900" },
    { name: "Docker", slug: "docker", color: "2496ED" },
    { name: "Kubernetes", slug: "kubernetes", color: "326CE5" },
    { name: "Git", slug: "git", color: "F05032" },
    { name: "Android", slug: "android", color: "3DDC84" },
    { name: "Arduino", slug: "arduino", color: "00979D" },
    { name: "Figma", slug: "figma", color: "F24E1E" },
    { name: "Trello", slug: "trello", color: "0052CC" },
    { name: "Cisco", slug: "cisco", color: "1BA0D7" },
    { name: "Wireshark", slug: "wireshark", color: "1679A7" },
    { name: "Apache", slug: "apache", color: "D22128" },
    { name: "Power BI", slug: "powerbi", color: "F2C811" },
    { name: "Tableau", slug: "tableau", color: "E97627" },
    { name: "RFID", mark: "RF", color: "B49CFF" },
    { name: "x86 Assembly", mark: "ASM", color: "6FE3BE" },
    { name: "Oracle SQL", mark: "SQL", color: "FFAC8C" }
  ],

  skillRoles: [
    {
      n: "01",
      k: "IT, systems & build",
      ico: "</>",
      p: "Android apps, REST APIs, databases and small hardware projects, plus the cloud setup that connects them.",
      tags: ["Kotlin", "PHP", "Arduino", "AWS", "MySQL", "Figma"]
    },
    {
      n: "02",
      k: "Leadership & delivery",
      ico: "★",
      p: "Keeping group work organized: planning, task tracking and documentation. Also a year serving as ITSOC president.",
      tags: ["Project management", "Peer mentoring", "Trello", "Technical documentation"]
    }
  ],

  softSkills: [
    { t: "Organized", p: "Someone has to hold the schedule. On PulsePoint, Kusina Kode, D.I.L.I.G. and BNK, that was me." },
    { t: "Hands-on", p: "I don't step back from the code. The Kotlin, the PHP, and the Arduino are mine." },
    { t: "Mentoring", p: "K-maps session: 8 of the 9 mentees who came passed their exam." },
    { t: "Accountable", p: "ITSOC term-end report: officer roster, activities, partnerships, money. My name on it." },
    { t: "Curious", p: "A burger in x86 assembly, eight Google Cloud badges, hardware still on the bench." }
  ],

  proofs: [
    { src: "assets/img/leadership/ambassador.jpg", title: "Student Ambassador", sub: "A.Y. 2024–2025", cap: "Mapúa MCL enrollment campaign. I'm on the left.", wide: true },
    { src: "assets/img/leadership/campaign.jpg", title: "ITSOC President", sub: "Candidate poster", cap: "Official candidate poster: Information Technology Society.", tall: true },
    { src: "assets/img/leadership/general-assembly.jpg", title: "IT General Assembly", sub: "On stage", cap: "Hosting the IT General Assembly as ITSOC President.", wide: true },
    { src: "assets/img/leadership/pamaskong-handog.jpg", title: "Pamaskong Handog", sub: "Dec 2024", cap: "Outreach at Diezmo Integrated School. I coordinated it." },
    { src: "assets/img/leadership/python-competition.jpg", title: "CCIS Week", sub: "Jun 2025", cap: "Python Programming Competition. I was there as President." }
  ]
};
