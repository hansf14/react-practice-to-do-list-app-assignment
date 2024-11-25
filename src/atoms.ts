import { createKeyValueMapping } from "@/utils";
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
} from "recoil";

export const ToDoDefaultCategoryTypes = ["To Do", "Doing", "Done"] as const;
export type ToDoDefaultCategoryType = (typeof ToDoDefaultCategoryTypes)[number];
export const ToDoDefaultCategoryMapping = createKeyValueMapping({
  arr: ToDoDefaultCategoryTypes,
});

export const ToDoReservedCategoryTypes = [
  "All",
  ...ToDoDefaultCategoryTypes,
] as const;
export type ToDoReservedCategoryType =
  (typeof ToDoReservedCategoryTypes)[number];
export const ToDoReservedCategoryMapping = createKeyValueMapping({
  arr: ToDoReservedCategoryTypes,
});

export type ToDoCategoryType = ToDoReservedCategoryType | string;

export interface ToDoData {
  id: string;
  category: ToDoCategoryType;
  text: string;
}

export interface ToDosData {
  [category: ToDoCategoryType]: ToDoData[] | undefined;
}

export const atomFamilyToDo = atomFamily<ToDoData, ToDoData["id"]>({
  key: "atom-family-to-do",
  default: (id) => ({
    id,
    category: "To Do",
    text: "",
  }),
});

// export const selectorFamilyToDo = selectorFamily<ToDoData, ToDoData["id"]>({
// 	key: "selector-family-to-do",
// 	get:
// 		(id) =>
// 		({ get }) => {
// 			return get(atomFamilyToDo(id));
// 		},
// 	set:
// 		(id) =>
// 		({ set }, newValue) => {
// 			set(atomFamilyToDo(id), newValue);
// 		},
// });

export const atomCategories = atom<ToDoCategoryType[]>({
  key: "atom-categories",
  default: [...ToDoReservedCategoryTypes],
});

export const atomToDoAdderCurrentCategory = atom<ToDoCategoryType | undefined>({
  key: "atom-to-do-adder-current-category",
  default: selector({
    key: "atom-to-do-adder-current-category/default",
    get: ({ get }) => {
      return get(atomCategories).filter(
        (stateCategory) => stateCategory !== "All",
      )[0];
    },
  }),
  // set: ({}, newValue) => {},
});

export const atomToDoDisplayCurrentCategory = atom<
  ToDoCategoryType | undefined
>({
  key: "atom-to-do-display-current-category",
  default: selector({
    key: "atom-to-do-display-current-category/default",
    get: ({ get }) => {
      return get(atomCategories).find(
        (stateCategory) => stateCategory === "All",
      );
    },
  }),
  // set: ({}, newValue) => {},
});

// export const atomToDoAdderCurrentCategory = atom<
//   ToDoCategoryType | undefined
// >({
//   key: "atom-to-do-adder-current-category",
//   default: ({ get }) => {
//     return get(atomCategories).filter(
//       (stateCategory) => stateCategory !== "All",
//     )[0];
//   },
//   set: ({}, newValue) => {},
// });

// export const selectorToDoAdderCurrentCategory = selector<
//   ToDoCategoryType | undefined
// >({
//   key: "atom-to-do-adder-current-category",
//   get: ({ get }) => {
//     return get(atomCategories).filter(
//       (stateCategory) => stateCategory !== "All",
//     )[0];
//   },
//   set: ({}, newValue) => {},
// });

// export const selectorToDoAdderCurrentCategory = selector<
//   ToDoCategoryType | undefined
// >({
//   key: "atom-to-do-adder-current-category",
//   get: ({ get }) => {
//     return get(atomCategories).filter(
//       (stateCategory) => stateCategory !== "All",
//     )[0];
//   },
//   // set: ({}, newValue) => {},
// });

// export const selectorToDoAdderCurrentCategory = selector<
//   ToDoCategoryType | undefined
// >({
//   key: "atom-to-do-adder-current-category",
//   get: ({ get }) => {
//     return get(atomCategories).filter(
//       (stateCategory) => stateCategory !== "All",
//     )[0];
//   },
//   set: ({}, newValue) => {
//     return newValue;
//   },
// });

// export const selectorCategories = selector<ToDoCategoryType[]>({
// 	key: "selector-categories",
// 	get: ({ get }) => {
// 		return get(atomCategories);
// 	},
// 	set: ({set}, newValue) => {
// 		return {}
// 	}
// });

export const atomToDos = atom<ToDosData>({
  key: "atom-to-dos",
  default: {
    All: [],
    "To Do": [],
    Doing: [],
    Done: [],
  },
});

// export const selectorFamilyToDoList = selectorFamily<
//   ToDoData[] | undefined,
//   ToDoCategoryType
// >({
//   key: "selector-family-to-do-list",
//   get:
//     (category) =>
//     ({ get }) => {
//       return get(atomToDos)[category];
//     },
//   set:
//     (category) =>
//     ({ set, get }, newValue) => {
//       set(atomToDos, {
//         ...get(atomToDos),
//         [category]: newValue instanceof DefaultValue ? [] : newValue,
//       });
//     },
// });

// export const selectorFamilyToDos = selectorFamily<ToDosData, ToDoCategoryType>({
// 	key: "selector-family-to-dos",
// 	get:
// 		(category) =>
// 		({ get }) => {
// 			const specificCategoryToDoList = get(atomToDos)[category];
// 			return specificCategoryToDoList;
// 		},
// 	set:
// 		(category) =>
// 		({ set, get }, newValue) => {
// 			const ToDosData = get(atomToDos);
// 			const newToDosData = {
// 				...ToDosData,
// 				[category]: newValue instanceof DefaultValue ? [] : newValue,
// 			};
// 			set(atomToDos, newToDosData);
// 		},
// });
