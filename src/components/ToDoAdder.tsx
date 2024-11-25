import React, { useCallback, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  atomCategories,
  atomToDoAdderCurrentCategory,
  atomToDos,
  ToDoData,
} from "@/atoms";
import { generateUniqueRandomId } from "@/utils";
import { styled } from "styled-components";
import { Select } from "@/components/Select";
import { ButtonPrimary } from "@/components/ButtonPrimary";
// import DropdownMenu, {
//   DropdownMenuBody,
//   DropdownMenuHead,
//   DropdownMenuOption,
// } from "@/components/DropdownMenu";

export interface ToDoFormData {
  toDoText: string;
}

const ToDoAdderBase = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
`;

const ToDoAdderCategorySelector = styled(Select)`
  width: 180px;

  font-family: "Source Sans 3";
  color: #333;

  &&.ant-select {
    height: 30px;
  }

  &&.ant-select-disabled {
    background-color: #ddd;
  }

  && .ant-select-selector {
    border: none;
    border-radius: 0;
    padding: 0;
  }

  && .ant-select-selection-placeholder {
    padding: 1px 36px 1px 5px;

    font-size: 17px;
    font-family: "Source Sans 3";
    color: #999;
    font-weight: normal;
  }

  &&&&& .ant-select-selection-search-input {
    padding: 1px 18px 1px 5px;

    font-size: 17px;
    font-family: "Source Sans 3";
    color: #333;
  }

  && .ant-select-selection-item {
    padding: 1px 18px 1px 5px;

    font-size: 17px;
    font-family: "Source Sans 3";
    color: #333;
  }
`;

const ToDoAdderTextInput = styled.textarea`
  height: 80px;
  width: min(460px, 100%);
  padding: calc(1px + 1px) 5px;
  border: none;
  border-radius: 0;
  /* resize: none; */

  font-size: 17px;
  font-family: "Source Sans 3";
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const ToDoAdderAddButton = styled(ButtonPrimary)`
  width: "fit-content";
`;

export function ToDoAdder() {
  const stateCategories = useRecoilValue(atomCategories);
  const setStateToDos = useSetRecoilState(atomToDos);

  // const [stateCurrentCategory, setStateCurrentCategory] =
  //   useState<ToDoCategoryType>(() => {
  //     return stateCategories.filter(
  //       (stateCategory) => stateCategory !== "All",
  //     )[0];
  //   });
  // console.log(stateCurrentCategory);
  // const stateCurrentCategory = useRecoilValue(selectorToDoAdderCurrentCategory);
  const [stateCurrentCategory, setStateCurrentCategory] = useRecoilState(
    atomToDoAdderCurrentCategory,
  );

  const { register, handleSubmit, reset } = useForm<ToDoFormData>({
    defaultValues: {
      toDoText: "",
    },
  });

  const onValid: SubmitHandler<ToDoFormData> = useCallback(
    ({ toDoText }) => {
      reset({ toDoText: "" });

      if (!stateCurrentCategory) {
        return;
      }

      const id = generateUniqueRandomId();
      setStateToDos((cur) => {
        const newToDo = {
          id,
          category: stateCurrentCategory,
          text: toDoText,
        } satisfies ToDoData;
        return {
          ...cur,
          [stateCurrentCategory]: [
            ...(cur[stateCurrentCategory] ?? []),
            newToDo,
          ],
        };
      });
    },
    [reset, setStateToDos, stateCurrentCategory],
  );

  const submitHandler = useMemo(() => {
    return handleSubmit(onValid);
  }, [handleSubmit, onValid]);

  const selectCategoryHandler: React.FormEventHandler<HTMLSelectElement> =
    useCallback(
      (event) => {
        setStateCurrentCategory(event.currentTarget.value);
      },
      [setStateCurrentCategory],
    );

  const categories = stateCategories.filter(
    (stateCategory) => stateCategory !== "All",
  );

  console.log(categories);

  return (
    <ToDoAdderBase onSubmit={submitHandler}>
      <ToDoAdderCategorySelector
        customProps={{
          selectProps: {
            disabled: categories.length === 0,
            placeholder: "Select a Category",
            options: categories.map((stateCategory) => {
              return {
                value: stateCategory,
                label: stateCategory,
              };
            }),
          },
        }}
      />
      <ToDoAdderTextInput
        placeholder="New To-do"
        disabled={stateCurrentCategory === undefined ? true : false}
        {...register("toDoText", {
          required: "Please fill in a new to-do.",
        })}
      />
      <ToDoAdderAddButton
        disabled={stateCurrentCategory === undefined ? true : false}
        type="submit"
      >
        Add
      </ToDoAdderAddButton>
    </ToDoAdderBase>
  );
}
