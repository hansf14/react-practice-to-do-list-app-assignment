import React, { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomCategories,
  selectorFamilyToDo,
  ToDoCategoryType,
  ToDoData,
} from "@/atoms";
import { styled } from "styled-components";
import { ButtonPrimary } from "@/components/ButtonPrimary";

const ToDoBase = styled.li`
  display: flex;
  width: 400px;
  padding: 5px;
  background-color: aliceblue;
  flex-direction: column;
  gap: 7px;

  font-size: 16px;
  color: black;
`;

const ToDoText = styled.div`
  width: 100%;
  padding: 5px;
  background-color: white;
  border: 1px solid #333;
  border-radius: 3px;
`;

const ChangeCategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const ChangeCategoryButton = styled(ButtonPrimary)``;

export function ToDo(props: ToDoData) {
  const { id, category, text } = props;
  const stateCategories = useRecoilValue(atomCategories);
  const [stateToDo, setStateToDo] = useRecoilState(
    selectorFamilyToDo({ id, category }),
  );

  const [stateText, setStateText] = useState<string>(stateToDo?.text ?? "");
  const [stateCategory, setStateCategory] =
    useState<ToDoCategoryType>(category);

  const applyEditToDoTextHandler = useCallback<
    React.FocusEventHandler<HTMLDivElement>
  >(
    (event) => {
      const newText = event.currentTarget.textContent ?? "";
      setStateText(newText);
      setStateToDo({
        ...(stateToDo ?? { id, category }),
        text: newText,
      });
    },
    [id, category, stateToDo, setStateToDo],
  );

  const changeCategoryHandler = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      const newCategory = event.currentTarget.dataset["category"];
      if (!newCategory) {
        return;
      }
      // console.log(newCategory);
      // console.log({
      //   ...(stateToDo ?? { id, text }),
      //   category: newCategory,
      // });
      setStateCategory(newCategory);
      setStateToDo({
        ...(stateToDo ?? { id, text }),
        category: newCategory,
      });
    },
    [id, text, stateToDo, setStateToDo],
  );

  const pureCategories = stateCategories.filter(
    (stateCategory) => stateCategory !== "All",
  );

  return (
    <ToDoBase>
      <ToDoText
        contentEditable
        suppressContentEditableWarning
        onBlur={applyEditToDoTextHandler}
      >
        {text}
      </ToDoText>
      <ChangeCategoryButtons>
        {pureCategories
          .filter((pureCategory) => pureCategory !== stateCategory)
          .map((otherPureCategory) => {
            return (
              <ChangeCategoryButton
                key={otherPureCategory}
                onClick={changeCategoryHandler}
                data-category={otherPureCategory}
              >
                {otherPureCategory}
              </ChangeCategoryButton>
            );
          })}
      </ChangeCategoryButtons>
    </ToDoBase>
  );
}
