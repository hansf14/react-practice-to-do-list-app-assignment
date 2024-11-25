import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { atomCategories, atomFamilyToDo, ToDoData } from "@/atoms";
import { useUniqueRandomIds } from "@/hooks/useUniqueRandomIds";
import { useBeforeRender } from "@/hooks/useBeforeRender";

export function ToDo({ id }: { id: ToDoData["id"] }) {
  const [stateToDo, setStateToDo] = useRecoilState(atomFamilyToDo(id));
  const stateCategories = useRecoilValue(atomCategories);
  const { ids: categoryKeys, keepOrExpandIds: keepOrExpandCategoryKeys } =
    useUniqueRandomIds({ count: stateCategories.length });

  useBeforeRender(() => {
    keepOrExpandCategoryKeys({ newCount: stateCategories.length });
  }, [stateCategories.length]);

  const changeCategoryHandler = useCallback(
    (newCategory: ToDoData["category"]) => {
      return () =>
        setStateToDo((curStateToDo) => {
          return {
            ...curStateToDo,
            category: newCategory,
          };
        });
    },
    [setStateToDo],
  );

  return (
    <li>
      <span>{stateToDo.text}</span>
      {stateCategories
        .filter((stateCategory) => stateCategory !== stateToDo.category)
        .map((stateCategory, idx) => {
          return (
            <button
              key={categoryKeys[idx]}
              onClick={changeCategoryHandler(stateCategory)}
            >
              {stateCategory}
            </button>
          );
        })}
      {/* {stateToDo.category !== "To Do" && (
				<button onClick={changeCategoryHandler("To Do")}>To Do</button>
			)}
			{stateToDo.category !== "Doing" && (
				<button onClick={changeCategoryHandler("Doing")}>Doing</button>
			)}
			{stateToDo.category !== "Done" && (
				<button onClick={changeCategoryHandler("Done")}>Done</button>
			)} */}
    </li>
  );
}
