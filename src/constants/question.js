const quiz = [
  {
    question: "What is React?",
    options: [
      "A UI library for JavaScript",
      "A server-side language",
      "A database system",
      "An OS",
    ],
    correctAnswer: "A UI library for JavaScript",
    explanation: "React is a JavaScript library for building user interfaces, developed by Facebook."
  },
  {
    question: "What is the virtual DOM?",
    options: [
      "A representation of the DOM",
      "A way to manipulate the DOM",
      "A method for caching",
      "A way to store state",
    ],
    correctAnswer: "A representation of the DOM",
    explanation: "The virtual DOM is an in-memory representation of the real DOM, allowing React to update the UI efficiently."
  },
  {
    question: "Which hook is used for state management in React?",
    options: ["useEffect", "useState", "useContext", "useRef"],
    correctAnswer: "useState",
    explanation: "useState allows functional components to hold and update local state."
  },
  {
    question: "Which hook runs after the component renders?",
    options: ["useState", "useReducer", "useEffect", "useMemo"],
    correctAnswer: "useEffect",
    explanation: "useEffect runs side effects after rendering, such as fetching data or updating the DOM."
  },
  {
    question: "What is JSX?",
    options: [
      "A JavaScript XML syntax",
      "A JSON format",
      "A CSS preprocessor",
      "A database query language",
    ],
    correctAnswer: "A JavaScript XML syntax",
    explanation: "JSX allows writing HTML-like syntax inside JavaScript, making UI components more readable."
  },
  {
    question: "Which method is used to render React components into the DOM?",
    options: ["ReactDOM.render()", "React.mount()", "React.attach()", "ReactDOM.attach()"],
    correctAnswer: "ReactDOM.render()",
    explanation: "ReactDOM.render() is used to render a React element into the DOM."
  },
  {
    question: "What does lifting state up mean?",
    options: [
      "Moving state from a child to a parent component",
      "Using Redux for state",
      "Saving state to local storage",
      "Creating global state",
    ],
    correctAnswer: "Moving state from a child to a parent component",
    explanation: "Lifting state up means moving shared state to the closest common ancestor."
  },
  {
    question: "Which hook provides context in React?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useContext",
    explanation: "useContext allows accessing values from React Context without prop drilling."
  },
  {
    question: "What is a React Fragment?",
    options: [
      "A lightweight component wrapper",
      "A method for debugging",
      "A CSS utility",
      "A hook",
    ],
    correctAnswer: "A lightweight component wrapper",
    explanation: "Fragments let you group multiple elements without adding extra DOM nodes."
  },
  {
    question: "Which hook helps to optimize performance by memoizing values?",
    options: ["useEffect", "useMemo", "useState", "useReducer"],
    correctAnswer: "useMemo",
    explanation: "useMemo memoizes expensive calculations so they don’t re-run on every render."
  },
  {
    question: "What is prop drilling?",
    options: [
      "Passing props through multiple components",
      "Debugging props",
      "Removing unused props",
      "Encrypting props",
    ],
    correctAnswer: "Passing props through multiple components",
    explanation: "Prop drilling is when props are passed through many layers of components unnecessarily."
  },
  {
    question: "Which hook is used to access DOM elements directly?",
    options: ["useRef", "useMemo", "useState", "useReducer"],
    correctAnswer: "useRef",
    explanation: "useRef returns a mutable object that can store a reference to a DOM element."
  },
  {
    question: "What is the purpose of React keys?",
    options: [
      "To uniquely identify list elements",
      "To secure data",
      "To style components",
      "To connect with APIs",
    ],
    correctAnswer: "To uniquely identify list elements",
    explanation: "Keys help React identify which items changed, added, or removed in lists."
  },
  {
    question: "Which command creates a new React app using Create React App?",
    options: [
      "npx create-react-app myApp",
      "npm install react",
      "react new myApp",
      "npm start myApp",
    ],
    correctAnswer: "npx create-react-app myApp",
    explanation: "The official way to create a React app is using the Create React App tool."
  },
  {
    question: "What is Redux used for?",
    options: [
      "State management",
      "Styling components",
      "Routing",
      "API requests",
    ],
    correctAnswer: "State management",
    explanation: "Redux is a predictable state container for managing global application state."
  },
  {
    question: "What does React Router provide?",
    options: [
      "Navigation between pages",
      "State management",
      "Styling components",
      "Database queries",
    ],
    correctAnswer: "Navigation between pages",
    explanation: "React Router allows navigation and dynamic routing in React applications."
  },
  {
    question: "What is lazy loading in React?",
    options: [
      "Loading components only when needed",
      "Caching components in memory",
      "Rendering all components at once",
      "Loading CSS files dynamically",
    ],
    correctAnswer: "Loading components only when needed",
    explanation: "Lazy loading improves performance by splitting code and loading parts when required."
  },
  {
    question: "What is the default port for React development server?",
    options: ["3000", "8080", "5000", "4000"],
    correctAnswer: "3000",
    explanation: "By default, React apps run on port 3000 when using Create React App."
  },
  {
    question: "What is a Higher-Order Component (HOC)?",
    options: [
      "A function that takes a component and returns a new component",
      "A built-in React hook",
      "A type of context provider",
      "A method to update state",
    ],
    correctAnswer: "A function that takes a component and returns a new component",
    explanation: "HOCs are advanced techniques for reusing component logic."
  },
  {
    question: "Which method is used to start a React app?",
    options: ["npm start", "npm run dev", "npm build", "npx react-start"],
    correctAnswer: "npm start",
    explanation: "The command 'npm start' launches the development server for a React project."
  }
];


export default quiz;