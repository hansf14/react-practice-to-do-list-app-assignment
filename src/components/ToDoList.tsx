import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomFamilyCategories,
  atomFamilyToDoDisplayCurrentCategory,
  selectorAllToDos,
  selectorFamilyToDoList,
} from "@/atoms";
import { ToDo } from "./ToDo";
import { styled } from "styled-components";
import { Select, SelectProps } from "@/components/Select";
import { RequiredDeep } from "@/utils/typescriptUtils";

const ToDoListBase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const ToDoListTitle = styled.h1`
  font-size: 35px;
  color: #ffbf47;
`;

const ToDoListContent = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const ToDoListCategorySelector = styled(Select)`
  width: 234px;
`;

const ToDos = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const ToDoListHintEmpty = styled.div`
  width: 100%;
  max-width: 400px;
  height: 200px;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

export function ToDoList() {
  const [stateCurrentCategory, setStateCurrentCategory] = useRecoilState(
    atomFamilyToDoDisplayCurrentCategory(null),
  );
  const stateAllToDos = useRecoilValue(selectorAllToDos);
  const stateSpecificCategoryToDoList = useRecoilValue(
    selectorFamilyToDoList(stateCurrentCategory ?? "All"),
  );
  const stateCategories = useRecoilValue(atomFamilyCategories(null));

  const selectCategoryHandler = useCallback<
    RequiredDeep<SelectProps>["customProps"]["selectProps"]["onChange"]
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (value: string, option) => {
      setStateCurrentCategory(value);
    },
    [setStateCurrentCategory],
  );

  // const pureCategories = stateCategories.filter(
  //   (stateCategory) => stateCategory !== "All",
  // );
  // console.log(`${stateCurrentCategory}:`, stateSpecificCategoryToDoList);
  // console.log(pureCategories);

  const toDos =
    stateCurrentCategory === "All"
      ? stateAllToDos.map((toDo) => {
          return <ToDo key={toDo.id} {...toDo} />;
        })
      : (stateSpecificCategoryToDoList ?? []).map(
          (stateSpecificCategoryToDo) => {
            return (
              <ToDo
                key={stateSpecificCategoryToDo.id}
                {...stateSpecificCategoryToDo}
              />
            );
          },
        );

  return (
    <ToDoListBase>
      <ToDoListTitle>List: {stateCurrentCategory}</ToDoListTitle>
      <ToDoListContent>
        <ToDoListCategorySelector
          customProps={{
            selectProps: {
              defaultActiveFirstOption: true,
              defaultValue: stateCurrentCategory,
              value: stateCurrentCategory,
              options: stateCategories.map((stateCategory) => {
                return {
                  value: stateCategory,
                  label: stateCategory,
                };
              }),
              onSelect: selectCategoryHandler,
            },
          }}
        />
        <ToDos>{toDos}</ToDos>
        {toDos.length === 0 && <ToDoListHintEmpty>Empty!</ToDoListHintEmpty>}
      </ToDoListContent>
    </ToDoListBase>
  );
}
