import ExamIcon from "../../assets/images/Feature_Categories_Image/Exam_Icon.png"
import Productive from "../../assets/images/Feature_Categories_Image/Productive.png"
import Telegram from "../../assets/images/Feature_Categories_Image/Telegram.png"
import Study from "../../assets/images/Feature_Categories_Image/Study.png"


// featured catefories data
const featuredCategoriesData = [
    {
      text: "400+ EUEE and Model exams",
      colors: ["#FFFFFF", "#F8FCFB", "#E2F2F0", "#BDE3DE", "#95D4CE"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
      id: "exam",
      image: ExamIcon
    },
    {
      text: "Your daily study checklist",
      colors: ["#FFFFFF", "#F8FCFB", "#E2F2F0", "#BDE3DE", "#95D4CE"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
      id:"toolKit",
      image: Productive
    },
    {
      text: "scientific study guide",
      colors: ["#FFFFFF", "#FFFDF5", "#FFF3E0", "#FFE4C4", "#FFD8A8"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
      id: "toolKit",
      image: Study
    },
    {
      text: "    join our community!       ",
      colors: ["#FFFFFF", "#F9FAFC", "#E3E8EF", "#C9D3E0", "#A0B2C8"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
      id: "telegram",
      image: Telegram
    },
  ];

  export default featuredCategoriesData;