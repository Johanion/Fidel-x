// constants/specificExams.js
import bluewhite from "../../assets/images/DOC/bluewhiteDOC.png";
import red from "../../assets/images/DOC/redDOC.png";
import specificExamData from "./specificExamData";

const specificExam = [
  // ENGLISH TOPICS — Premium Blue Theme
  {
    $id: "eng-grammar",
    type: "Grammar",
    name: "Grammar Mastery",           
    image: bluewhite,
    icon: "pen-fancy",                
    badge: "BEST",  
    exams: specificExamData.Grammar               

  },
  {
    $id: "eng-writing",
    type: "Writing",
    name: "Essay & Composition",
    image: bluewhite,
    icon: "pencil-alt",
    exams: specificExamData.Writing
  },
  {
    $id: "eng-reading",
    type: "Reading Passage",
    name: "Reading Comprehension",
    image: bluewhite,
    icon: "book-reader",
    exams: specificExamData.ReadingPassage
  },
  {
    $id: "eng-coherence",
    type: "Paragraph Coherence",
    name: "Paragraph Flow",
    image: bluewhite,
    icon: "paragraph",
    exams: specificExamData.paragraphCoherence
  },
  {
    $id: "eng-communicative",
    type: "Communicative",
    name: "Functional English",
    image: bluewhite,
    icon: "comments",
    exams: specificExamData.Communicative
  },
  {
    $id: "eng-letter",
    type: "Letter Writing",
    name: "Formal & Informal Letters",
    image: bluewhite,
    icon: "envelope-open-text",
    exams: specificExamData.LetterWriting
  },
  {
    $id: "eng-punctuation",
    type: "Punctuation",
    name: "Punctuation Rules",
    image: bluewhite,
    icon: "quote-right",
    exams: specificExamData.Punctuation
  },
  {
    $id: "eng-jumbled",
    type: "Jumbled Words",
    name: "Sentence Builder",          
    image: bluewhite,
    icon: "puzzle-piece",              
    badge: "FUN", 
    exams: specificExamData.JumbledWords                    
  },

  // APTITUDE TOPICS — Fresh Green Theme
  {
    $id: "apt-synonym",
    type: "Synonym",
    name: "Synonyms & Word Pairs",
    image: red,
    icon: "equals",
    exams: specificExamData.AptSynonym
  },
  {
    $id: "apt-antonym",
    type: "Antonym",
    name: "Opposite Words Master",     
    image: red,
    icon: "balance-scale-left",      
    badge: "PRO",   
    exams: specificExamData.AptAntonym                  
  },
  {
    $id: "apt-completion",
    type: "Sentence Completion",
    name: "Cloze Test",
    image: red,
    icon: "fill",
    exams: specificExamData.AptCompletion
  },
  {
    $id: "apt-analogy",
    type: "Analogy",
    name: "Word Relationships",
    image: red,
    icon: "link",
    exams: specificExamData.AptAnalogy
  },
  {
    $id: "apt-substitution",
    type: "Word Substitution",
    name: "One Word Substitution",
    image: red,
    icon: "retweet",
    exams: specificExamData.AptSubstitution
  },
  {
    $id: "apt-reasoning",
    type: "Logical Reasoning",
    name: "Critical Thinking",
    image: red,
    icon: "brain",
    badge: "HARD",
    exams: specificExamData.AptReasoning
  },
];

export default specificExam;