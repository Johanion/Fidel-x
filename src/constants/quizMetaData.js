// Natural science exams meta data
const Biology = [
  { id: 1, subject: "biology", type: "EUEE", year: "2014", time: 120, amount: 100, questions: "biology_2014" },
  { id: 2, subject: "biology", type: "EUEE", year: "2015", time: 120, amount: 100, questions: "biology_2015" },
  { id: 3, subject: "biology", type: "EUEE", year: "2016", time: 120, amount: 100, questions: "biology_2016" },
  { id: 4, subject: "biology", type: "EUEE", year: "2017", time: 120, amount: 100, questions: "biology_2017" },
  { id: 5, subject: "biology", type: "Model 1", year: "", time: 120, amount: 100, questions: "biology_model_1" },
  { id: 6, subject: "biology", type: "Model 2", year: "", time: 120, amount: 100, questions: "biology_model_2" },
  { id: 7, subject: "biology", type: "Model 3", year: "", time: 120, amount: 100, questions: "biology_model_3" },
  { id: 8, subject: "biology", type: "Model 4", year: "", time: 120, amount: 100, questions: "biology_model_4" },
  { id: 9, subject: "biology", type: "Model 5", year: "", time: 120, amount: 100, questions: "biology_model_5" },
];


const Physics = [
  { id: 1, subject: "physics", type: "EUEE", year: "2014", time: 120, amount: 50, questions: "physics_2014" },
  { id: 2, subject: "physics", type: "EUEE", year: "2015", time: 120, amount: 50, questions: "physics_2015" },
  { id: 3, subject: "physics", type: "EUEE", year: "2016", time: 120, amount: 50, questions: "physics_2016" },
  { id: 4, subject: "physics", type: "EUEE", year: "2017", time: 120, amount: 50, questions: "physics_2017" },
  { id: 5, subject: "physics", type: "Model 1", year: "", time: 120, amount: 50, questions: "physics_model_1" },
  { id: 6, subject: "physics", type: "Model 2", year: "", time: 120, amount: 50, questions: "physics_model_2" },
  { id: 7, subject: "physics", type: "Model 3", year: "", time: 120, amount: 50, questions: "physics_model_3" },
  { id: 8, subject: "physics", type: "Model 4", year: "", time: 120, amount: 50, questions: "physics_model_4" },
  { id: 9, subject: "physics", type: "Model 5", year: "", time: 120, amount: 50, questions: "physics_model_5" },
];

const Chemistry = [
  { subject: "chemistry", type: "EUEE", year: "2014", time: 150, amount: 80, questions: "chemistry_2014" },
  { subject: "chemistry", type: "EUEE", year: "2015", time: 150, amount: 80, questions: "chemistry_2015" },
  { subject: "chemistry", type: "EUEE", year: "2016", time: 150, amount: 80, questions: "chemistry_2016" },
  { subject: "chemistry", type: "EUEE", year: "2017", time: 150, amount: 80, questions: "chemistry_2017" },
  { subject: "chemistry", type: "Model 1", year: "", time: 150, amount: 80, questions: "chemistry_model_1" },
  { subject: "chemistry", type: "Model 2", year: "", time: 150, amount: 80, questions: "chemistry_model_2" },
  { subject: "chemistry", type: "Model 3", year: "", time: 150, amount: 80, questions: "chemistry_model_3" },
  { subject: "chemistry", type: "Model 4", year: "", time: 150, amount: 80, questions: "chemistry_model_4" },
  { subject: "chemistry", type: "Model 5", year: "", time: 150, amount: 80, questions: "chemistry_model_5" },
];

const NaturalMaths = [
  { id: 1, subject: "N.Mathematics", type: "EUEE", year: "2015", time: 120, amount: 50, questions: "N_maths_2015" },
  { id: 2, subject: "N.Mathematics", type: "EUEE", year: "2016", time: 120, amount: 50, questions: "N_maths_2016" },
  { id: 3, subject: "N.Mathematics", type: "EUEE", year: "2017", time: 120, amount: 50, questions: "N_maths_2017" },
  { id: 4, subject: "N.Mathematics", type: "Model 1", year: "", time: 120, amount: 50, questions: "N_maths_model_1" },
  { id: 5, subject: "N.Mathematics", type: "Model 2", year: "", time: 120, amount: 50, questions: "N_maths_model_2" },
  { id: 6, subject: "N.Mathematics", type: "Model 3", year: "", time: 120, amount: 50, questions: "N_maths_model_3" },
  { id: 7, subject: "N.Mathematics", type: "Model 4", year: "", time: 120, amount: 50, questions: "N_maths_model_4" },
  { id: 8, subject: "N.Mathematics", type: "Model 5", year: "", time: 120, amount: 50, questions: "N_maths_model_5" },
];

// common exams for both stream meta data
// Natural science exams meta data
const English = [
  { id: 1, subject: "english", type: "EUEE", year: "2014 Natural science", time: 120, amount: 120, questions: "EnglishNS_2014" },
  { id: 2, subject: "english", type: "EUEE", year: "2015 Natural science", time: 120, amount: 120, questions: "EnglishNS_2015" },
  { id: 3, subject: "english", type: "EUEE", year: "2016 Natural science", time: 120, amount: 120, questions: "EnglishNS_2016" },
  { id: 4, subject: "english", type: "EUEE", year: "2017 Natural science", time: 120, amount: 120, questions: "EnglishNS_2017" },
  { id: 5, subject: "english", type: "EUEE", year: "2015 Social science", time: 120, amount: 120, questions: "EnglishNS_2015" },
  { id: 6, subject: "english", type: "EUEE", year: "2016 Social science", time: 120, amount: 120, questions: "EnglishNS_2016" },
  { id: 7, subject: "english", type: "Model 1", year: "", time: 120, amount: 120, questions: "English_model_1" },
  { id: 8, subject: "english", type: "Model 2", year: "", time: 120, amount: 120, questions: "English_model_2" },
  { id: 9, subject: "english", type: "Model 3", year: "", time: 120, amount: 120, questions: "English_model_3" },
  { id: 10, subject: "english", type: "Model 4", year: "", time: 120, amount: 120, questions: "English_model_4" },
  { id: 11, subject: "english", type: "Model 5", year: "", time: 120, amount: 120, questions: "English_model_5" },
];

// Natural science exams meta data
const Aptitude = [
  { id: 1, subject: "aptitude", type: "EUEE", year: "2014", time: 120, amount: 100, questions: "Aptitude_2014" },
  { id: 2, subject: "aptitude", type: "EUEE", year: "2015", time: 120, amount: 100, questions: "Aptitude_2015" },
  { id: 3, subject: "aptitude", type: "EUEE", year: "2016", time: "100", amount: 100, questions: "Aptitude_2016" },
  { id: 4, subject: "aptitude", type: "EUEE", year: "2017", time: "100", amount: 100, questions: "Aptitude_2017" },
  { id: 5, subject: "aptitude", type: "Model 1", year: "", time: "100", amount: 100, questions: "Aptitude_model_1" },
  { id: 6, subject: "aptitude", type: "Model 2", year: "", time: "100", amount: 100, questions: "Aptitude_model_2" },
  { id: 7, subject: "aptitude", type: "Model 3", year: "", time: "100", amount: 100, questions: "Aptitude_model_3" },
  { id: 8, subject: "aptitude", type: "Model 4", year: "", time: "100", amount: 100, questions: "Aptitude_model_4" },
  { id: 9, subject: "aptitude", type: "Model 5", year: "", time: "100", amount: 100, questions: "Aptitude_model_5" },
  { id: 10, subject: "aptitude", type: "Model 6", year: "", time: "100", amount: 100, questions: "Aptitude_model_6" },
  { id: 11, subject: "aptitude", type: "Model 7", year: "", time: "100", amount: 100, questions: "Aptitude_model_7" },
  { id: 12, subject: "aptitude", type: "Model 8", year: "", time: "100", amount: 100, questions: "Aptitude_model_8" },
  { id: 13, subject: "aptitude", type: "Model 9", year: "", time: "100", amount: 100, questions: "Aptitude_model_9" },
  { id: 14, subject: "aptitude", type: "Model 10", year: "", time: "100", amount: 100, questions: "Aptitude_model_10" },
];


// social science exams meta data
const Economics = [
  { id: 1, subject: "economics", type: "EUEE", year: "2016", time: "100", amount: 100, questions: "economics_2016" },
  { id: 2, subject: "economics", type: "EUEE", year: "2017", time: "100", amount: 100, questions: "economics_2017" },
  { id: 3, subject: "economics", type: "Model 1", year: "", time: "100", amount: 100, questions: "economics_model_1" },
  { id: 4, subject: "economics", type: "Model 2", year: "", time: "100", amount: 100, questions: "economics_model_2" },
  { id: 5, subject: "economics", type: "Model 3", year: "", time: "100", amount: 100, questions: "economics_model_3" },
  { id: 6, subject: "economics", type: "Model 4", year: "", time: "100", amount: 100, questions: "economics_model_4" },
  { id: 7, subject: "economics", type: "Model 5", year: "", time: "100", amount: 100, questions: "economics_model_5" },
  { id: 8, subject: "economics", type: "Model 6", year: "", time: "100", amount: 100, questions: "economics_model_6" },
  { id: 9, subject: "economics", type: "Model 7", year: "", time: "100", amount: 100, questions: "economics_model_7" },
  { id: 10, subject: "economics", type: "Model 8", year: "", time: "100", amount: 100, questions: "economics_model_8" },
  { id: 11, subject: "economics", type: "Model 9", year: "", time: "100", amount: 100, questions: "economics_model_9" },
  { id: 12, subject: "economics", type: "Model 10", year: "", time: "100", amount: 100, questions: "economics_model_10" },
];

const History = [
  { id: 1, subject: "history", type: "EUEE", year: "2014", time: "100", amount: 100, questions: "history_2014" },
  { id: 2, subject: "history", type: "EUEE", year: "2015", time: "100", amount: 100, questions: "history_2015" },
  {id: 3,  subject: "history", type: "EUEE", year: "2016", time: "100", amount: 100, questions: "history_2016" },
  {id: 4,  subject: "history", type: "EUEE", year: "2017", time: "100", amount: 100, questions: "history_2017" },
  {id: 5,  subject: "history", type: "Model 1", year: "", time: "100", amount: 100, questions: "history_model_1" },
  {id: 6,  subject: "history", type: "Model 2", year: "", time: "100", amount: 100, questions: "history_model_2" },
  {id: 7,  subject: "history", type: "Model 3", year: "", time: "100", amount: 100, questions: "history_model_3" },
  { id: 8, subject: "history", type: "Model 4", year: "", time: "100", amount: 100, questions: "history_model_4" },
  { id: 9, subject: "history", type: "Model 5", year: "", time: "100", amount: 100, questions: "history_model_5" },
  { id: 10, subject: "history", type: "Model 6", year: "", time: "100", amount: 100, questions: "history_model_6" },
  { id: 11, subject: "history", type: "Model 7", year: "", time: "100", amount: 100, questions: "history_model_7" },
  { id: 12, subject: "history", type: "Model 8", year: "", time: "100", amount: 100, questions: "history_model_8" },
  { id: 13, subject: "history", type: "Model 9", year: "", time: "100", amount: 100, questions: "history_model_9" },
  { id: 14, subject: "history", type: "Model 10", year: "", time: "100", amount: 100, questions: "history_model_10" },
];

const Geography = [
  { id: 1, subject: "geography", type: "EUEE", year: "2014", time: "100", amount: 100, questions: "geography_2014" },
  { id: 2, subject: "geography", type: "EUEE", year: "2015", time: "100", amount: 100, questions: "geography_2015" },
  { id: 3, subject: "geography", type: "EUEE", year: "2016", time: "100", amount: 100, questions: "geography_2016" },
  { id: 4, subject: "geography", type: "EUEE", year: "2017", time: "100", amount: 100, questions: "geography_2017" },
  { id: 5, subject: "geography", type: "Model 1", year: "", time: "100", amount: 100, questions: "geography_model_1" },
  { id: 6, subject: "geography", type: "Model 2", year: "", time: "100", amount: 100, questions: "geography_model_2" },
  { id: 7, subject: "geography", type: "Model 3", year: "", time: "100", amount: 100, questions: "geography_model_3" },
  { id: 8, subject: "geography", type: "Model 4", year: "", time: "100", amount: 100, questions: "geography_model_4" },
  { id: 9, subject: "geography", type: "Model 5", year: "", time: "100", amount: 100, questions: "geography_model_5" },
  { id: 10, subject: "geography", type: "Model 6", year: "", time: "100", amount: 100, questions: "geography_model_6" },
  { id: 11, subject: "geography", type: "Model 7", year: "", time: "100", amount: 100, questions: "geography_model_7" },
  { id: 12, subject: "geography", type: "Model 8", year: "", time: "100", amount: 100, questions: "geography_model_8" },
  { id: 13, subject: "geography", type: "Model 9", year: "", time: "100", amount: 100, questions: "geography_model_9" },
  { id: 14, subject: "geography", type: "Model 10", year: "", time: "100", amount: 100, questions: "geography_model_10" },
];

const SocialMaths = [
  { id: 1, subject: "S.Mathematics", type: "EUEE", year: "2014", time: 120, amount: 50, questions: "N.maths_2014" },
  { id: 2, subject: "S.Mathematics", type: "EUEE", year: "2015", time: 120, amount: 50, questions: "N.maths_2015" },
  { id: 3, subject: "S.Mathematics", type: "EUEE", year: "2016", time: 120, amount: 50, questions: "N.maths_2016" },
  { id: 4, subject: "S.Mathematics", type: "EUEE", year: "2017", time: 120, amount: 50, questions: "N.maths_2017" },
  { id: 5, subject: "S.Mathematics", type: "Model 1", year: "", time: 120, amount: 50, questions: "N.maths_model_1" },
  { id: 6, subject: "S.Mathematics", type: "Model 2", year: "", time: 120, amount: 50, questions: "N.maths_model_2" },
  { id: 7, subject: "S.Mathematics", type: "Model 3", year: "", time: 120, amount: 50, questions: "N.maths_model_3" },
  { id: 8, subject: "S.Mathematics", type: "Model 4", year: "", time: 120, amount: 50, questions: "N.maths_model_4" },
  { id: 9, subject: "S.Mathematics", type: "Model 5", year: "", time: 120, amount: 50, questions: "N.maths_model_5" },
  {id: 10,  subject: "S.Mathematics", type: "Model 6", year: "", time: 120, amount: 50, questions: "N.maths_model_6" },
  { id: 11, subject: "S.Mathematics", type: "Model 7", year: "", time: 120, amount: 50, questions: "N.maths_model_7" },
  { id: 12, subject: "S.Mathematics", type: "Model 8", year: "", time: 120, amount: 50, questions: "N.maths_model_8" },
  { id: 13, subject: "S.Mathematics", type: "Model 9", year: "", time: 120, amount: 50, questions: "N.maths_model_9" },
  { id: 14, subject: "S.Mathematics", type: "Model 10", year: "", time: 120, amount: 50, questions: "N.maths_model_10" },
];

export default {
  Biology,
  Chemistry,
  Physics,
  NaturalMaths,
  English,
  Aptitude,
  Economics,
  History,
  Geography,
  SocialMaths
};
