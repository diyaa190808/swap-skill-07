import {
  Code, Palette, Atom, Languages, Briefcase, GraduationCap, Sprout, Music, HeartPulse, Sparkles,
  FlaskConical, BarChart3, Cloud, Shield, ClipboardList, Wallet, Scale, School, Video, Box, Shirt,
  ChefHat, Leaf, HandHeart, Trophy, Accessibility, Lightbulb, Laptop, Plane, Home, Bot, Cpu,
  Smartphone, Gamepad2, Sigma, PenTool, Camera, Headphones, Rocket, BookOpen, type LucideIcon,
} from "lucide-react";

export type Domain = { id: string; name: string; description: string; icon: LucideIcon; skills: string[] };

const d = (id: string, name: string, description: string, icon: LucideIcon, skills: string[]): Domain => ({ id, name, description, icon, skills });

/** Extensible catalogue: add a domain here (or later, from a database) and Explore picks it up automatically. */
export const DOMAINS: Domain[] = [
  d("tech", "Technology and Programming", "Code, build and ship software.", Code, ["Python", "C programming", "JavaScript", "Web development", "Java", "Git & GitHub"]),
  d("design", "Design and Creativity", "Interfaces, visuals and creative thinking.", Palette, ["UI/UX", "Figma", "Wireframing", "Graphic design", "Canva"]),
  d("stem", "Academics and STEM", "Core school and university subjects.", Atom, ["Physics", "Chemistry", "Biology", "Calculus"]),
  d("lang", "Languages and Communication", "Speak, write and connect.", Languages, ["English communication", "Spanish", "French", "Japanese", "Hindi"]),
  d("biz", "Business and Entrepreneurship", "Ideas, markets and growth.", Briefcase, ["Marketing", "Business plans", "Sales basics"]),
  d("career", "Career and Professional Skills", "Get hired and grow at work.", GraduationCap, ["Resume writing", "Interview prep", "LinkedIn profile"]),
  d("personal", "Personal Development", "Habits, focus and confidence.", Sprout, ["Time management", "Goal setting", "Mindfulness"]),
  d("arts", "Arts, Music and Hobbies", "Make things for joy.", Music, ["Guitar", "Sketching", "Painting", "Calligraphy"]),
  d("fitness", "Fitness and Well-being", "Move well, feel well.", HeartPulse, ["Yoga", "Home workouts", "Nutrition basics"]),
  d("other", "Other Skills", "Everything that doesn't fit elsewhere.", Sparkles, ["Chess", "Rubik's cube", "Origami"]),
  d("science", "Science and Emerging Technologies", "What's next in science.", FlaskConical, ["Quantum computing basics", "Biotech intro", "Space science"]),
  d("data", "Data Science and Analytics", "Turn data into decisions.", BarChart3, ["Data analysis", "Excel", "SQL", "Power BI"]),
  d("ai", "AI and Machine Learning", "Models, prompts and practical AI.", Bot, ["Machine learning", "Machine learning basics", "Prompt engineering", "Deep learning"]),
  d("cloud", "Cloud Computing and DevOps", "Deploy and scale.", Cloud, ["AWS basics", "Docker", "CI/CD"]),
  d("security", "Cybersecurity and Digital Safety", "Stay safe online.", Shield, ["Ethical hacking basics", "Password hygiene", "Network security"]),
  d("pm", "Product and Project Management", "Plan, prioritise and deliver.", ClipboardList, ["Agile & Scrum", "Product thinking", "Notion"]),
  d("finance", "Finance and Financial Literacy", "Money skills for life.", Wallet, ["Budgeting", "Investing basics", "Taxes 101"]),
  d("law", "Law, Civics and Social Awareness", "Know your rights and systems.", Scale, ["Constitution basics", "Consumer rights"]),
  d("teach", "Teaching and Mentoring", "Help others learn well.", School, ["Peer tutoring", "Lesson planning"]),
  d("media", "Content Creation and Media", "Tell stories online.", Video, ["YouTube basics", "Podcasting", "Social media"]),
  d("3d", "Animation and 3D Design", "Bring ideas to life in 3D.", Box, ["Blender", "2D animation"]),
  d("fashion", "Fashion and Lifestyle", "Style and self-expression.", Shirt, ["Styling", "Sewing basics"]),
  d("cooking", "Cooking and Culinary Arts", "Cook with confidence.", ChefHat, ["Baking", "Indian cooking", "Meal prep"]),
  d("sustain", "Sustainability and Environment", "Live and build greener.", Leaf, ["Composting", "Sustainable living"]),
  d("impact", "Community Service and Social Impact", "Make a difference together.", HandHeart, ["Volunteering", "Fundraising"]),
  d("sports", "Sports and Recreation", "Play, train and compete.", Trophy, ["Football", "Badminton", "Cricket"]),
  d("a11y", "Accessibility and Inclusive Design", "Design for everyone.", Accessibility, ["Web accessibility", "Sign language basics"]),
  d("research", "Research and Innovation", "Ask good questions.", Lightbulb, ["Research methods", "Paper writing"]),
  d("freelance", "Freelancing and Professional Independence", "Work on your own terms.", Laptop, ["Freelance pricing", "Client communication"]),
  d("travel", "Travel and Cultural Exchange", "Explore cultures.", Plane, ["Travel planning", "Cultural etiquette"]),
  d("home", "Home and Practical Life Skills", "Everyday competence.", Home, ["Basic repairs", "Gardening"]),
  d("robotics", "Robotics and Electronics", "Circuits and machines.", Cpu, ["Arduino", "Circuit basics"]),
  d("iot", "Internet of Things", "Connected devices.", Cpu, ["ESP32", "Home automation"]),
  d("mobile", "Mobile App Development", "Apps in your pocket.", Smartphone, ["Flutter", "React Native", "Android basics"]),
  d("games", "Game Development", "Design and build games.", Gamepad2, ["Unity", "Game design"]),
  d("math", "Mathematics and Statistics", "Numbers, logic and proof.", Sigma, ["Mathematics", "Statistics", "Linear algebra"]),
  d("writing", "Writing, Editing and Publishing", "Words that work.", PenTool, ["Creative writing", "Editing", "Blogging"]),
  d("photo", "Photography and Videography", "Capture the moment.", Camera, ["Photography", "Video editing"]),
  d("audio", "Music Production and Audio", "Make and mix sound.", Headphones, ["FL Studio", "Mixing basics"]),
  d("startup", "Entrepreneurship and Startup Skills", "From idea to launch.", Rocket, ["Pitching", "MVP building"]),
  d("edtech", "Education Technology and Learning Design", "Build better learning.", BookOpen, ["Instructional design", "Public speaking", "Presentation skills", "Presentation design"]),
];

// "Public speaking" etc. live in edtech for now so no skill is duplicated across domains.
export const ALL_SKILLS = Array.from(new Set(DOMAINS.flatMap((x) => x.skills))).sort();

export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Student = {
  username: string;
  name: string;
  teaches: string[];
  learns: string[];
  level: Level;
  levelNote: string;
  languages: string[];
  about: string;
  availability: string;
  formats: ("Online" | "In person")[];
  when: ("Weekdays" | "Evenings" | "Weekends")[];
  credits: number;
  rating: number;
  sessions: number;
  review: string;
  goal: string;
  /** Optional monetary price per hour (INR) the provider accepts as an alternative to credits. */
  pricePerHour?: number;
  hue: number;
};

/** Fictional demonstration profiles — every figure is sample data. */
export const STUDENTS: Student[] = [
  { username: "aarav_codes", name: "Aarav Sharma", teaches: ["Python", "C programming"], learns: ["UI/UX", "Figma"], level: "Intermediate", levelNote: "Intermediate", languages: ["English", "Hindi"], about: "A coding enthusiast who enjoys explaining concepts through simple examples.", availability: "Online, weekdays after 5 PM", formats: ["Online"], when: ["Weekdays", "Evenings"], credits: 120, rating: 4.8, sessions: 12, review: "A patient teacher who explains programming concepts with practical examples.", goal: "Build a portfolio project.", pricePerHour: 200, hue: 255 },
  { username: "meera.designs", name: "Meera Iyer", teaches: ["UI/UX", "Figma", "Wireframing"], learns: ["Python", "Machine learning"], level: "Advanced", levelNote: "Advanced in Figma", languages: ["English", "Tamil"], about: "A creative thinker who enjoys turning ideas into usable interfaces.", availability: "Online, evenings and weekends", formats: ["Online"], when: ["Evenings", "Weekends"], credits: 95, rating: 4.9, sessions: 18, review: "Made design principles easy to understand and gave useful feedback on my prototype.", goal: "Design an education app.", pricePerHour: 250, hue: 300 },
  { username: "rohan_ai", name: "Rohan Verma", teaches: ["Machine learning basics", "Python", "Data analysis"], learns: ["Public speaking", "Web development"], level: "Intermediate", levelNote: "Intermediate in machine learning", languages: ["English", "Hindi"], about: "An AI enthusiast interested in practical projects.", availability: "Online, weekends", formats: ["Online"], when: ["Weekends"], credits: 150, rating: 4.7, sessions: 10, review: "Helped me understand how a simple machine learning model works from start to finish.", goal: "Build an AI learning assistant.", hue: 210 },
  { username: "ananya_speaks", name: "Ananya Rao", teaches: ["Public speaking", "Presentation skills", "English communication"], learns: ["Python", "Data analysis"], level: "Advanced", levelNote: "Advanced in communication", languages: ["English", "Telugu", "Hindi"], about: "A confident communicator who enjoys helping peers express ideas.", availability: "Online or in person, flexible evenings", formats: ["Online", "In person"], when: ["Evenings"], credits: 80, rating: 4.9, sessions: 15, review: "The practice exercises helped me feel much more confident presenting my project.", goal: "Present a technical project at a hackathon.", pricePerHour: 180, hue: 20 },
  { username: "kabir_builds", name: "Kabir Khan", teaches: ["Web development", "JavaScript"], learns: ["Machine learning", "Figma"], level: "Intermediate", levelNote: "Intermediate in web development", languages: ["English", "Hindi", "Urdu"], about: "A hands-on builder who learns by making projects.", availability: "Online, evenings", formats: ["Online"], when: ["Evenings"], credits: 110, rating: 4.6, sessions: 9, review: "We built a responsive page together, and I finally understood how the layout works.", goal: "Build and deploy a web application.", hue: 160 },
  { username: "priya_creates", name: "Priya Nair", teaches: ["Graphic design", "Canva", "Presentation design"], learns: ["Public speaking", "JavaScript"], level: "Intermediate", levelNote: "Intermediate in design", languages: ["English", "Malayalam", "Tamil"], about: "A visual storyteller who values clarity and accessibility.", availability: "Online or in person, weekends", formats: ["Online", "In person"], when: ["Weekends"], credits: 135, rating: 4.8, sessions: 11, review: "Turned my messy slides into a clear, beautiful story.", goal: "Launch a design portfolio.", hue: 330 },
];

export const findStudent = (u: string) => STUDENTS.find((s) => s.username === u);

export const offeringsFor = (skill: string) => STUDENTS.filter((s) => s.teaches.includes(skill));
export const domainOfferings = (dm: Domain) => STUDENTS.filter((s) => s.teaches.some((t) => dm.skills.includes(t))).length;

/** Compatibility: what they teach that I want + what I teach that they want. */
export function matchScore(me: { teach: string[]; learn: string[] }, s: Student) {
  const theyTeachMe = s.teaches.filter((t) => me.learn.includes(t));
  const iTeachThem = s.learns.filter((t) => me.teach.includes(t));
  const score = theyTeachMe.length * 2 + iTeachThem.length * 2;
  const reasons: string[] = [];
  if (theyTeachMe.length) reasons.push(`Teaches ${theyTeachMe.join(", ")} — on your learn list`);
  if (iTeachThem.length) reasons.push(`Wants to learn ${iTeachThem.join(", ")} — which you teach`);
  return { score, reasons, mutual: theyTeachMe.length > 0 && iTeachThem.length > 0 };
}

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", status: "full" },
  { code: "hi", label: "Hindi", native: "हिन्दी", status: "partial" },
  { code: "zh", label: "Chinese", native: "中文", status: "planned" },
  { code: "ta", label: "Tamil", native: "தமிழ்", status: "planned" },
  { code: "te", label: "Telugu", native: "తెలుగు", status: "planned" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", status: "planned" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", status: "planned" },
  { code: "bn", label: "Bengali", native: "বাংলা", status: "planned" },
  { code: "mr", label: "Marathi", native: "मराठी", status: "planned" },
  { code: "ur", label: "Urdu", native: "اردو", status: "planned" },
  { code: "es", label: "Spanish", native: "Español", status: "planned" },
  { code: "fr", label: "French", native: "Français", status: "planned" },
  { code: "de", label: "German", native: "Deutsch", status: "planned" },
  { code: "pt", label: "Portuguese", native: "Português", status: "planned" },
  { code: "ar", label: "Arabic", native: "العربية", status: "planned" },
  { code: "ja", label: "Japanese", native: "日本語", status: "planned" },
  { code: "ko", label: "Korean", native: "한국어", status: "planned" },
] as const;

export const GROUPS = [
  { id: "py-circle", name: "Python Circle", skill: "Python", members: 4, about: "Weekly problem-solving with beginner-friendly Python." },
  { id: "design-lab", name: "Design Lab", skill: "UI/UX", members: 3, about: "Share prototypes, get kind and useful feedback." },
  { id: "speak-up", name: "Speak Up Club", skill: "Public speaking", members: 5, about: "Practise short talks in a safe, supportive room." },
  { id: "ml-starters", name: "ML Starters", skill: "Machine learning", members: 3, about: "From zero to your first model, together." },
];

export const DEMO_POSTS = [
  { id: "p1", author: "meera.designs", text: "Just finished a Figma session with a new learner — wireframes are clicking! Who wants to join Design Lab this weekend?", likes: 12, at: "2h ago" },
  { id: "p2", author: "rohan_ai", text: "Sharing my notes on linear regression in plain English. DM me if you want the doc.", likes: 8, at: "5h ago" },
  { id: "p3", author: "ananya_speaks", text: "Speak Up Club tip: record yourself once, watch it once, improve one thing. That's it.", likes: 21, at: "1d ago" },
];
