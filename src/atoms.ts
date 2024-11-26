import { createKeyValueMapping } from "@/utils";
import {
  atom,
  // atomFamily,
  // DefaultValue,
  selector,
  selectorFamily,
} from "recoil";
import { recoilPersist } from "recoil-persist";

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

export interface ToDoQueryParams {
  id: ToDoData["id"];
  category: ToDoCategoryType;
  [_: string]: string;
}

const { persistAtom } = recoilPersist({
  key: "recoil-persist", // this key is using to store data in local storage
  storage: localStorage, // configure which storage will be used to store the data
  converter: JSON, // configure how values will be serialized/deserialized in storage
});

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
});

export const atomToDoDisplayCurrentCategory = atom<
  ToDoCategoryType | undefined
>({
  key: "atom-to-do-display-current-category",
  default: "All",
});

export const atomToDos = atom<ToDosData>({
  key: "atom-to-dos",
  default: {
    All: [],
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const selectorFamilyToDoList = selectorFamily<
  ToDoData[] | undefined,
  ToDoCategoryType
>({
  key: "selector-family-to-do-list",
  get:
    (category) =>
    ({ get }) => {
      return get(atomToDos)[category];
    },
  set:
    (category) =>
    ({ set, get }, newValue) => {
      // console.log(atomToDos, {
      //   ...get(atomToDos),
      //   [category]: newValue as ToDoData[],
      //   // [category]: newValue instanceof DefaultValue ? [] : newValue,
      // });
      set(atomToDos, {
        ...get(atomToDos),
        [category]: newValue as ToDoData[],
        // [category]: newValue instanceof DefaultValue ? [] : newValue,
      });
    },
});

export const selectorAllToDos = selector<ToDoData[]>({
  key: "selector-all-to-dos",
  get: ({ get }) => {
    const categories = get(atomCategories);
    const allToDos: ToDoData[] = [];
    categories.forEach((category) => {
      allToDos.push(...(get(selectorFamilyToDoList(category)) ?? []));
    });
    return allToDos;
  },
});

export const selectorFamilyToDo = selectorFamily<
  ToDoData | undefined,
  ToDoQueryParams
>({
  key: "selector-family-to-do",
  get:
    ({ category, id }) =>
    ({ get }) => {
      const toDoList = get(selectorFamilyToDoList(category)) ?? [];
      return toDoList.find((toDo) => toDo.id === id);
    },
  set:
    ({ category, id }) =>
    ({ set, get }, newValue) => {
      if (newValue === undefined) {
        return;
      }

      const toDoList = get(selectorFamilyToDoList(category));
      if (toDoList === undefined) {
        return;
      }
      const targetIdx = toDoList.findIndex((toDo) => toDo.id === id);
      if (targetIdx === -1) {
        return;
      }

      const updatedToDo = newValue as ToDoData;
      if (category === updatedToDo.category) {
        const newToDoList = [...toDoList];
        newToDoList[targetIdx] = updatedToDo;
        set(selectorFamilyToDoList(category), newToDoList);
      } else {
        const updatedOldCategoryToDoList = toDoList.filter(
          (_, idx) => idx !== targetIdx,
        );
        // console.log("updatedOldCategoryToDoList:", updatedOldCategoryToDoList);
        // set(selectorFamilyToDoList(category), updatedOldCategoryToDoList);
        // A -> B

        const newCategoryToDoList =
          get(selectorFamilyToDoList(updatedToDo.category)) ?? [];
        const updatedNewCategoryToDoList = [
          updatedToDo,
          ...newCategoryToDoList,
        ];
        // console.log("updatedNewCategoryToDoList:", updatedNewCategoryToDoList);
        // set(
        //   selectorFamilyToDoList(updatedToDo.category),
        //   updatedNewCategoryToDoList,
        // );
        // It should be B -> C but actually this goes A -> C

        // Fix: A -> C
        set(atomToDos, {
          ...get(atomToDos),
          [category]: updatedOldCategoryToDoList,
          [updatedToDo.category]: updatedNewCategoryToDoList,
        });
      }
    },
});
