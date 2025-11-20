// src/services/store.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* -------------------------------------------------
   Types (unchanged)
   ------------------------------------------------- */
type Task = {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  interval: string;
};

type Table = {
  id: string;
  title: string;
  icon: string;
  date?: string;
  tasks: Task[];
};

type Store = {
  tables: Table[];

  addTable: () => void;
  deleteTable: (id: string) => void;
  updateTableTitle: (id: string, title: string) => void;
  updateTableDate: (id: string, date: string) => void;

  addTask: (tableId: string) => void;
  deleteTask: (tableId: string, taskId: string) => void;
  updateTask: (
    tableId: string,
    taskId: string,
    field: keyof Task,
    value: any
  ) => void;

  // ← ADD THIS LINE
  _persist: () => Promise<void>;
};

/* -------------------------------------------------
   AsyncStorage helpers
   ------------------------------------------------- */
const STORAGE_KEY = "@tables";

const save = async (value: Table[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    console.warn("AsyncStorage save error:", e);
  }
};

const load = async (fallback: Table[]) => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("AsyncStorage load error:", e);
    return fallback;
  }
};

/* -------------------------------------------------
   Initial data (still used if nothing is stored)
   ------------------------------------------------- */
const initialTables: Table[] = [
  {
    id: Date.now().toString() + Math.random(),
    title: "New Board",
    icon: "clipboard",
    tasks: [],
  },
];

/* -------------------------------------------------
   Zustand store – now async-aware
   ------------------------------------------------- */
const useStore = create<Store>((set, get) => ({
  // Load on first mount
  tables: [],

  // -----------------------------------------------------------------
  // Helper: persist after every mutation
  // -----------------------------------------------------------------
  _persist: async () => {
    const state = get();
    await save(state.tables);
  },

  // -----------------------------------------------------------------
  // BOARD ACTIONS
  // -----------------------------------------------------------------
  addTable: () => {
    const newTable: Table = {
      id: Date.now().toString() + Math.random(),
      title: "New Board",
      icon: "clipboard",
      tasks: [],
    };
    set((state) => {
      const updated = [...state.tables, newTable];
      // fire-and-forget persistence
      get()._persist();
      return { tables: updated };
    });
  },

  deleteTable: (id) =>
    set((state) => {
      const updated = state.tables.filter((t) => t.id !== id);
      get()._persist();
      return { tables: updated };
    }),

  updateTableTitle: (id, title) =>
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === id ? { ...t, title } : t
      );
      get()._persist();
      return { tables: updated };
    }),

  updateTableDate: (id, date) =>
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === id ? { ...t, date } : t
      );
      get()._persist();
      return { tables: updated };
    }),

  // -----------------------------------------------------------------
  // TASK ACTIONS
  // -----------------------------------------------------------------
  addTask: (tableId) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random(),
      name: "New Task",
      status: "To Do",
      priority: "Medium",
      interval: "1 hour",
    };
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === tableId
          ? { ...t, tasks: [...t.tasks, newTask] }
          : t
      );
      get()._persist();
      return { tables: updated };
    });
  },

  deleteTask: (tableId, taskId) =>
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === tableId
          ? { ...t, tasks: t.tasks.filter((task) => task.id !== taskId) }
          : t
      );
      get()._persist();
      return { tables: updated };
    }),

  updateTask: (tableId, taskId, field, value) =>
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              tasks: t.tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task
              ),
            }
          : t
      );
      get()._persist();
      return { tables: updated };
    }),
}));

// -----------------------------------------------------------------
// Load persisted data **once** when the module is first imported
// -----------------------------------------------------------------
(async () => {
  const persisted = await load(initialTables);
  useStore.setState({ tables: persisted });
})();

export default useStore;