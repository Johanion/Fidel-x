import units from "./units.js";
import topics from "../constants/topics.js"

const SocialScience = [
  { name: "Economics",topic: topics.Economics },
  { name: "History",  topic: topics.History },
  { name: "Geography", topic: topics.Geography },
];

const NaturalScience = [
  { name: "Biology",  topic: topics.Biology },
  { name: "Chemistry",  topic: topics.Chemistry },
  { name: "Physics",  topic: topics.Physics },
];

const Language = [
  { name: "English",  topic: topics.English },
  { name: "SAT", topic: topics.SAT },
];

export default { SocialScience, NaturalScience, Language };
