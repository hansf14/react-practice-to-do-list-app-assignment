import React, { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomFamilyCategories,
  selectorFamilyToDo,
  selectorFamilyToDoList,
  ToDoData,
} from "@/atoms";
import { styled } from "styled-components";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { XCircle } from "react-bootstrap-icons";

const ToDoBase = styled.li`
  display: flex;
  max-width: 400px;
  width: 100%;
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

const ButtonControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
`;

const ChangeCategoryButton = styled(ButtonPrimary)``;

const RemoveToDoButton = styled(XCircle)`
  flex: 0 0 30px;
  height: 25px;
  cursor: pointer;
`;

export function ToDo(props: ToDoData) {
  const { id, category, text } = props;
  const stateCategories = useRecoilValue(atomFamilyCategories(null));
  const [stateToDo, setStateToDo] = useRecoilState(
    selectorFamilyToDo({ id, category }),
  );
  const [stateToDoList, setStateToDoList] = useRecoilState(
    selectorFamilyToDoList(category),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateText, setStateText] = useState<string>(stateToDo?.text ?? "");

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
      setStateToDo({
        ...(stateToDo ?? { id, text }),
        category: newCategory,
      });
    },
    [id, text, stateToDo, setStateToDo],
  );

  const removeToDoHandler = useCallback(() => {
    const toDoList = [...(stateToDoList ?? [])].filter(
      (toDo) => toDo.id !== id,
    );
    setStateToDoList(toDoList);
  }, [id, stateToDoList, setStateToDoList]);

  const pureCategories = stateCategories.filter(
    (stateCategory) => stateCategory !== "All",
  );
  // console.log("stateCategories:", stateCategories);
  // console.log("props:", props);

  return (
    <ToDoBase>
      <ToDoText
        contentEditable
        suppressContentEditableWarning
        onBlur={applyEditToDoTextHandler}
      >
        {text}
      </ToDoText>
      <ButtonControls>
        {pureCategories
          .filter((pureCategory) => pureCategory !== category)
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
        <RemoveToDoButton onClick={removeToDoHandler} color="red" />
      </ButtonControls>
    </ToDoBase>
  );
}
