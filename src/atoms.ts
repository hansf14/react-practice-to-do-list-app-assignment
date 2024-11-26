import { createKeyValueMapping } from "@/utils";
import {
  atom,
  atomFamily,
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

const defaultToDoDisplayCurrentCategory = ToDoReservedCategoryMapping["All"];

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

const recoilKeys = {
  atomFamilyCategories: "atom-family-categories",
  atomToDoAdderCurrentCategory: "atom-to-do-adder-current-category",
  atomFamilyToDoDisplayCurrentCategory:
    "atom-family-to-do-display-current-category",
  atomFamilyToDos: "atom-family-to-dos",
  selectorFamilyToDoList: "selector-family-to-do-list",
  selectorAllToDos: "selector-all-to-dos",
  selectorFamilyToDo: "selector-family-to-do",
} as const;

export const atomFamilyCategories = atomFamily<ToDoCategoryType[], null>({
  key: recoilKeys["atomFamilyCategories"],
  default: () => {
    const localStorageValue = localStorage.getItem(
      recoilKeys["atomFamilyCategories"],
    );
    // console.log(localStorageValue);
    return !!localStorageValue
      ? JSON.parse(localStorageValue)
      : [...ToDoReservedCategoryTypes];
  },
  effects_UNSTABLE: [persistAtom],
});

export const atomToDoAdderCurrentCategory = atom<ToDoCategoryType | undefined>({
  key: recoilKeys["atomToDoAdderCurrentCategory"],
  default: selector({
    key: `${recoilKeys["atomToDoAdderCurrentCategory"]}/default`,
    get: ({ get }) => {
      const localStorageValue = localStorage.getItem(
        recoilKeys["atomToDoAdderCurrentCategory"],
      );
      // console.log(localStorageValue);
      return !!localStorageValue
        ? localStorageValue
        : get(atomFamilyCategories(null)).filter(
            (stateCategory) => stateCategory !== "All",
          )[0];
    },
  }),
  effects_UNSTABLE: [persistAtom],
});

export const atomFamilyToDoDisplayCurrentCategory = atomFamily<
  ToDoCategoryType | undefined,
  null
>({
  key: recoilKeys["atomFamilyToDoDisplayCurrentCategory"],
  default: () => {
    const localStorageValue = localStorage.getItem(
      recoilKeys["atomFamilyToDoDisplayCurrentCategory"],
    );
    // console.log(localStorageValue);
    return !!localStorageValue
      ? localStorageValue
      : defaultToDoDisplayCurrentCategory;
  },
  effects_UNSTABLE: [persistAtom],
});

export const atomFamilyToDos = atomFamily<ToDosData, null>({
  key: recoilKeys["atomFamilyToDos"],
  default: () => {
    const localStorageValue = localStorage.getItem(
      recoilKeys["atomFamilyToDos"],
    );
    // console.log(localStorageValue);
    return !!localStorageValue
      ? JSON.parse(localStorageValue)
      : {
          All: [],
          "To Do": [],
          Doing: [],
          Done: [],
        };
  },
  effects_UNSTABLE: [persistAtom],
});

export const selectorFamilyToDoList = selectorFamily<
  ToDoData[] | undefined,
  ToDoCategoryType
>({
  key: recoilKeys["selectorFamilyToDoList"],
  get:
    (category) =>
    ({ get }) => {
      return get(atomFamilyToDos(null))[category];
    },
  set:
    (category) =>
    ({ set, get }, newValue) => {
      // console.log(atomToDos, {
      //   ...get(atomToDos),
      //   [category]: newValue as ToDoData[],
      //   // [category]: newValue instanceof DefaultValue ? [] : newValue,
      // });
      set(atomFamilyToDos(null), {
        ...get(atomFamilyToDos(null)),
        [category]: newValue as ToDoData[],
        // [category]: newValue instanceof DefaultValue ? [] : newValue,
      });
    },
});

export const selectorAllToDos = selector<ToDoData[]>({
  key: recoilKeys["selectorAllToDos"],
  get: ({ get }) => {
    const categories = get(atomFamilyCategories(null));
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
  key: recoilKeys["selectorFamilyToDo"],
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
        set(atomFamilyToDos(null), {
          ...get(atomFamilyToDos(null)),
          [category]: updatedOldCategoryToDoList,
          [updatedToDo.category]: updatedNewCategoryToDoList,
        });
      }
    },
});
