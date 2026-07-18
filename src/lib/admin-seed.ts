import { collection, addDoc, getDocs, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Bundled asset URLs (Vite resolves these to hashed URLs)
import independence from "@/assets/independence.jpg";
import cultural from "@/assets/cultural.jpg";
import sports from "@/assets/sports.jpg";
import lab from "@/assets/computer-lab.jpg";
import studentLife from "@/assets/student-life.jpg";
import hero from "@/assets/hero-classroom.jpg";

export const seedGallery = [
  { url: independence, title: "Independence Day", category: "Festivals" },
  { url: cultural, title: "Annual Cultural Day", category: "Festivals" },
  { url: studentLife, title: "Classroom Energy", category: "School" },
  { url: hero, title: "Smart Classroom", category: "School" },
  { url: sports, title: "Sports Meet", category: "Activities" },
  { url: lab, title: "Computer Lab", category: "School" },
  { url: cultural, title: "Krishnastami", category: "Festivals" },
  { url: independence, title: "Republic Day Parade", category: "Events" },
  { url: studentLife, title: "Prayer Assembly", category: "School" },
  { url: sports, title: "Inter-Class Football", category: "Activities" },
  { url: lab, title: "Science Expo", category: "Events" },
  { url: hero, title: "Teachers' Day", category: "Events" },
];

export const seedEvents = [
  { imageUrl: cultural, title: "Annual Cultural Day", date: "15 Dec 2025", place: "School Auditorium", desc: "An evening of dance, drama and music celebrating the spirit of Newton." },
  { imageUrl: sports, title: "Inter-School Sports Meet", date: "08 Jan 2026", place: "School Grounds", desc: "Track, ball games and team events for classes V–X." },
  { imageUrl: lab, title: "Science & Innovation Expo", date: "22 Jan 2026", place: "Block B Lab Wing", desc: "Student-built projects on energy, AI and the environment." },
  { imageUrl: independence, title: "Republic Day Celebration", date: "26 Jan 2026", place: "Main Assembly Ground", desc: "Flag hoisting, parade and patriotic performances." },
  { imageUrl: studentLife, title: "Parent-Teacher Meet", date: "12 Feb 2026", place: "Respective Classrooms", desc: "Term progress reviews and one-on-one conversations." },
];

export const seedAchievements = [
  { year: "2024-25", title: "100% pass in 10ᵗʰ Class", text: "Every student cleared with strong scores." },
  { year: "2024-25", title: "District-level Quiz Winners", text: "Team of four bagged the top prize." },
  { year: "2024-25", title: "Best Cultural Performance", text: "Annual inter-school competition." },
  { year: "2023-24", title: "12 students scored 9+ CGPA", text: "Across 10ᵗʰ board examinations." },
  { year: "2023-24", title: "State-level Science Fair Finalists", text: "Two projects selected." },
  { year: "2021-22", title: "Online learning excellence award", text: "Recognised by district education board." },
];

export const seedAbout = {
  mission:
    "To prepare every student to face global educational challenges with confidence — through engaging academics, modern resources and a culture rooted in care.",
  vision:
    "An education that goes beyond grades — building responsible citizens who think clearly, act kindly and lead with integrity.",
  principalQuote:
    "Welcome to Newton's EM School — where we not only educate minds but nurture hearts. Students are instilled with core values like honesty, kindness, generosity, courage, freedom and respect.",
  principalBio:
    "Established in 2000, we have been committed to providing quality education and holistic development. Our dedicated team works tirelessly to create a nurturing environment where every child can thrive.",
};

async function seedCollection(name: string, rows: Record<string, unknown>[]) {
  const existing = await getDocs(collection(db, name));
  if (existing.size > 0) return { added: 0, skipped: true };
  for (const r of rows) {
    await addDoc(collection(db, name), { ...r, createdAt: serverTimestamp() });
  }
  return { added: rows.length, skipped: false };
}

export const seedAlumni = [
  { name: "R. Pavani", where: "Google, Hyderabad", note: "Software Engineer" },
  { name: "K. Srinivas", where: "Indian Navy", note: "Officer" },
  { name: "M. Lakshmi", where: "Andhra Medical College", note: "MBBS" },
  { name: "S. Karthik", where: "IIT Madras", note: "B.Tech CSE" },
];

export const seedFaculty = [
  {
    name: "Mr. K. Srinivasa Rao",
    role: "Senior Mathematics Faculty",
    qualification: "M.Sc., B.Ed",
    dept: "Mathematics",
    initials: "KS",
  },
  {
    name: "Mrs. P. Anuradha",
    role: "English Language Coordinator",
    qualification: "M.A., B.Ed",
    dept: "English",
    initials: "PA",
  },
  {
    name: "Mr. S. K. Murthy",
    role: "Social Studies Department Head",
    qualification: "M.A., B.Ed",
    dept: "Social Sciences",
    initials: "SM",
  },
  {
    name: "Mrs. G. Lakshmi",
    role: "Senior Telugu & Hindi Mentor",
    qualification: "M.A., Sahitya Ratna",
    dept: "Languages",
    initials: "GL",
  },
  {
    name: "Mrs. K. Madhavi",
    role: "Physical & Natural Sciences Faculty",
    qualification: "M.Sc., B.Ed",
    dept: "Sciences",
    initials: "KM",
  },
  {
    name: "Mr. V. Raju",
    role: "Physical Education Director",
    qualification: "B.P.Ed",
    dept: "Physical Education",
    initials: "VR",
  },
];

export async function importGallery() {
  return seedCollection("gallery", seedGallery);
}
export async function importEvents() {
  return seedCollection("events", seedEvents);
}
export async function importAchievements() {
  return seedCollection("achievements", seedAchievements);
}
export async function importAlumni() {
  return seedCollection("alumni", seedAlumni);
}
export async function importFaculty() {
  return seedCollection("faculty", seedFaculty);
}
export async function importAbout() {
  const ref = doc(db, "content", "about");
  const snap = await getDoc(ref);
  if (snap.exists() && Object.keys(snap.data() ?? {}).length > 0) {
    return { skipped: true };
  }
  await setDoc(ref, seedAbout, { merge: true });
  return { skipped: false };
}
