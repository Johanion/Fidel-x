// constants/specificExams.js
import bluewhite from "../../assets/images/DOC/bluewhiteDOC.png";
import red from "../../assets/images/DOC/redDOC.png";

const specificExam = [
  // ENGLISH TOPICS — Premium Blue Theme
  {
    $id: "eng-grammar",
    type: "Grammar",
    name: "Grammar Mastery",           // CHANGED
    image: bluewhite,
    icon: "pen-fancy",                 // CHANGED — Elegant golden pen
    badge: "BEST",                     // CHANGED — More premium than "POPULAR"
  },
  {
    $id: "eng-writing",
    type: "Writing",
    name: "Essay & Composition",
    image: bluewhite,
    icon: "pencil-alt",
  },
  {
    $id: "eng-reading",
    type: "Reading Passage",
    name: "Reading Comprehension",
    image: bluewhite,
    icon: "book-reader",
  },
  {
    $id: "eng-coherence",
    type: "Paragraph Coherence",
    name: "Paragraph Flow",
    image: bluewhite,
    icon: "paragraph",
  },
  {
    $id: "eng-communicative",
    type: "Communicative",
    name: "Functional English",
    image: bluewhite,
    icon: "comments",
  },
  {
    $id: "eng-letter",
    type: "Letter Writing",
    name: "Formal & Informal Letters",
    image: bluewhite,
    icon: "envelope-open-text",
  },
  {
    $id: "eng-punctuation",
    type: "Punctuation",
    name: "Punctuation Rules",
    image: bluewhite,
    icon: "quote-right",
  },
  {
    $id: "eng-jumbled",
    type: "Jumbled Words",
    name: "Sentence Builder",          // CHANGED — Smarter name
    image: bluewhite,
    icon: "puzzle-piece",              // CHANGED — Perfect for rearranging
    badge: "FUN",                      // CHANGED — Students love fun
  },

  // APTITUDE TOPICS — Fresh Green Theme
  {
    $id: "apt-synonym",
    type: "Synonym",
    name: "Synonyms & Word Pairs",
    image: red,
    icon: "equals",
  },
  {
    $id: "apt-antonym",
    type: "Antonym",
    name: "Opposite Words Master",     // CHANGED — Stronger, premium
    image: red,
    icon: "balance-scale-left",        // CHANGED — Perfect balance of opposites
    badge: "PRO",                      // Kept — perfect for this
  },
  {
    $id: "apt-completion",
    type: "Sentence Completion",
    name: "Cloze Test",
    image: red,
    icon: "fill",
  },
  {
    $id: "apt-analogy",
    type: "Analogy",
    name: "Word Relationships",
    image: red,
    icon: "link",
  },
  {
    $id: "apt-substitution",
    type: "Word Substitution",
    name: "One Word Substitution",
    image: red,
    icon: "retweet",
  },
  {
    $id: "apt-reasoning",
    type: "Logical Reasoning",
    name: "Critical Thinking",
    image: red,
    icon: "brain",
    badge: "HARD",
  },
];

export default specificExam;