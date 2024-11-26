import React, { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomCategories,
  atomToDoDisplayCurrentCategory,
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
  padding-left: 15px;
  gap: 7px;
`;

const ToDoListCategorySelector = styled(Select)`
  width: 180px;
`;

const ToDos = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export function ToDoList() {
  const [stateCurrentCategory, setStateCurrentCategory] = useRecoilState(
    atomToDoDisplayCurrentCategory,
  );
  const stateAllToDos = useRecoilValue(selectorAllToDos);
  const stateSpecificCategoryToDoList = useRecoilValue(
    selectorFamilyToDoList(stateCurrentCategory ?? "All"),
  );
  const stateCategories = useRecoilValue(atomCategories);

  const selectCategoryHandler = useCallback<
    RequiredDeep<SelectProps>["customProps"]["selectProps"]["onChange"]
  >(
    (value: string, option) => {
      setStateCurrentCategory(value);
    },
    [setStateCurrentCategory],
  );

  const pureCategories = stateCategories.filter(
    (stateCategory) => stateCategory !== "All",
  );

  console.log(`${stateCurrentCategory}:`, stateSpecificCategoryToDoList);

  console.log(pureCategories);

  return (
    <ToDoListBase>
      <ToDoListTitle>List: {stateCurrentCategory}</ToDoListTitle>
      <ToDoListContent>
        <ToDoListCategorySelector
          customProps={{
            selectProps: {
              defaultActiveFirstOption: true,
              defaultValue: "All",
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
        <ToDos>
          {stateCurrentCategory === "All"
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
              )}
        </ToDos>
      </ToDoListContent>
    </ToDoListBase>
  );
}
