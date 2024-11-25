import React, { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomCategories,
  atomToDoDisplayCurrentCategory,
  atomToDos,
  //  selectorFamilyToDoList
} from "@/atoms";
import { ToDo } from "./ToDo";
import { ToDoAdder } from "./ToDoAdder";
import { useUniqueRandomIds } from "@/hooks/useUniqueRandomIds";
import { useBeforeRender } from "@/hooks/useBeforeRender";
import { styled } from "styled-components";
import { HorizontalDivider } from "@/components/HorizontalDivider";

const ToDoListBase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const ToDoListCategorySelectControl = styled.select`
  width: fit-content;
  height: 25px;
`;

const ToDoListTitle = styled.h1`
  font-size: 35px;
  color: #ffbf47;
`;

const ToDoListContentBase = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  gap: 7px;
`;

export function ToDoList() {
  // const [stateCurrentCategory, setStateCurrentCategory] =
  //   useRecoilState(atomCurrentCategory);
  // const stateSpecificCategoryToDos = useRecoilValue(
  // 	selectorSpecificCategoryToDos
  // );

  // const stateSpecificCategoryToDoList = useRecoilValue(
  //   selectorFamilyToDoList(stateCurrentCategory),
  // );

  const stateCategories = useRecoilValue(atomCategories);
  const setStateToDos = useRecoilValue(atomToDos);

  const [stateCurrentCategory, setStateCurrentCategory] = useRecoilState(
    atomToDoDisplayCurrentCategory,
  );

  const selectCategoryHandler: React.FormEventHandler<HTMLSelectElement> =
    useCallback(
      (event) => {
        setStateCurrentCategory(event.currentTarget.value);
      },
      [setStateCurrentCategory],
    );

  return (
    <ToDoListBase>
      <ToDoListTitle>List: {stateCurrentCategory}</ToDoListTitle>
      <ToDoListContentBase>
        <ToDoListCategorySelectControl
          value={stateCurrentCategory}
          onInput={selectCategoryHandler}
        >
          {stateCategories.map((stateCategory) => {
            return (
              <option key={stateCategory} value={stateCategory}>
                {stateCategory}
              </option>
            );
          })}
        </ToDoListCategorySelectControl>
        <ul>
          {/* {stateSpecificCategoryToDoList?.map((toDo) => {
          return <ToDo key={toDo.id} id={toDo.id} />;
        })} */}
          {/* {stateSpecificCategoryToDos.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} />
				))} */}
        </ul>
      </ToDoListContentBase>
    </ToDoListBase>
  );
}
