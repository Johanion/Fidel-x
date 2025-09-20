import blue from "../../assets/images/DOC/blueDOC.png";
import green from "../../assets/images/DOC/greenDOC.png";
import purple from "../../assets/images/DOC/purpleDOC.png";

import quizMetaData from "./quizMetaData";

const Exams = [
  { name: "Biology", image: blue, exams: quizMetaData.Biology, icon: "local-florist"},
  { name: "Chemistry", image: blue, exams: quizMetaData.Chemistry, icon: "" },
  { name: "Physics", image: blue, exams: quizMetaData.Physics, icon: "" },
  { name: "English", image: purple, exams: quizMetaData.English, icon: "" },
  { name: "Aptitude", image: purple, exams: quizMetaData.Aptitude, icon: "" },
  { name: "Economics", image: green, exams: quizMetaData.Economics, icon: "" },
  { name: "History", image: green, exams: quizMetaData.History, icon: "" },
];

export default Exams;
