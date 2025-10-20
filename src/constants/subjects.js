import coverPage from "./coverPage.js";
import units from "./units.js";
import topics from "../constants/topics.js"

const SocialScience = [
  { name: "Economics", image: coverPage.Economics, topic: topics.History },
  { name: "History", image: coverPage.History, topic: topics.History },
  { name: "Geography", image: coverPage.English, topic: topics.History },
];

const NaturalScience = [
  { name: "Biology", image: coverPage.Biology, topic: topics.History },
  { name: "Chemistry", image: coverPage.Chemistry, topic: topics.History },
  { name: "Physics", image: coverPage.Physics, topic: topics.History },
];

const Language = [
  { name: "English", image: coverPage.English, topic: topics.History },
  { name: "SAT", image: coverPage.Aptitude, topic: topics.History },
];

export default { SocialScience, NaturalScience, Language };
