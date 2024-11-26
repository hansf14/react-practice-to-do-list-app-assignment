import React, { useCallback, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { atomFamilyCategories, atomFamilyToDos, ToDoData } from "@/atoms";
import { styled } from "styled-components";
import { PencilSquare, XCircle } from "react-bootstrap-icons";

const CategoryBase = styled.li`
  display: flex;
  font-size: 25px;
  gap: 10px;
`;

const CategoryText = styled.span`
  word-break: break-word;
`;

const CategoryEditButton = styled(PencilSquare)`
  flex: 0 0 25px;
  height: 25px;
  cursor: pointer;
`;

const CategoryRemoveButton = styled(XCircle)`
  flex: 0 0 25px;
  height: 25px;
  cursor: pointer;
`;

const defaultEditButtonColor = "yellow";
const applyEditEditButtonColor = "aquamarine";

export function Category({ text }: { text: string }) {
  const [stateCategories, setStateCategories] = useRecoilState(
    atomFamilyCategories(null),
  );
  const [stateToDos, setStateToDos] = useRecoilState(atomFamilyToDos(null));
  const [stateCategoryText, setStateCategoryText] = useState(text);

  const refCategoryText = useRef<HTMLSpanElement>(null);
  const [stateIsEditing, setStateIsEditing] = useState(false);
  const [stateEditButtonColor, setStateEditButtonColor] = useState(
    defaultEditButtonColor,
  );

  const startOrEndEditCategoryText = useCallback<
    React.MouseEventHandler<SVGElement>
  >(() => {
    // `All` category shouldn't be renamed.
    if (stateCategoryText === "All" || !refCategoryText.current) {
      return;
    }

    setStateIsEditing((cur) => !cur);
    if (!stateIsEditing) {
      setStateEditButtonColor(applyEditEditButtonColor);
    } else {
      setStateEditButtonColor(defaultEditButtonColor);

      // Apply edit
      const currentEditStateCategoryText = refCategoryText.current.textContent;
      if (!currentEditStateCategoryText) {
        return;
      }

      const beforeEditApplyCategoryText = stateCategoryText;
      const afterEditApplyCategoryText = currentEditStateCategoryText.trim();
      const targetIdx = stateCategories.findIndex(
        (stateCategory) => stateCategory === beforeEditApplyCategoryText,
      );
      const doesNewCategoryNameAlreadyExist =
        stateCategories.findIndex(
          (stateCategory) => stateCategory === afterEditApplyCategoryText,
        ) !== -1;

      if (doesNewCategoryNameAlreadyExist) {
        alert(
          `The category named "${afterEditApplyCategoryText}" already exists.`,
        );
        refCategoryText.current.textContent = beforeEditApplyCategoryText;
        return;
      }

      setStateCategoryText(afterEditApplyCategoryText);
      const categories = [...stateCategories];
      categories.splice(targetIdx, 1, afterEditApplyCategoryText);
      setStateCategories(categories);

      setStateToDos((cur) => {
        const toDos = { ...cur };
        const newCategoryToDoList: ToDoData[] = [
          ...(toDos[beforeEditApplyCategoryText] ?? []),
        ].map((toDo) => {
          return {
            id: toDo.id,
            category: afterEditApplyCategoryText,
            text: toDo.text,
          };
        });
        delete toDos[beforeEditApplyCategoryText];
        // console.log("toDoList:", newCategoryToDoList);
        // console.log("toDos:", toDos);
        // console.log({
        //   ...toDos,
        //   [afterEditApplyCategoryText]: newCategoryToDoList,
        // });
        return {
          ...toDos,
          [afterEditApplyCategoryText]: newCategoryToDoList,
        };
      });
    }
  }, [
    stateIsEditing,
    stateCategoryText,
    stateCategories,
    setStateCategories,
    setStateToDos,
  ]);

  const removeCategoryText = useCallback(() => {
    const result = confirm("Are you sure want to remove this category?");
    if (!result) {
      return;
    }

    if ((stateToDos[stateCategoryText] ?? []).length !== 0) {
      alert("There shouldn't remain to-dos of the category to be removed.");
      return;
    }

    const targetIdx = stateCategories.findIndex(
      (stateCategory) => stateCategory === stateCategoryText,
    );
    if (targetIdx === -1) {
      return;
    }
    const categories = [...stateCategories];
    categories.splice(targetIdx, 1);
    setStateCategories(categories);

    setStateToDos((cur) => {
      const newToDos = { ...cur };
      delete newToDos[stateCategoryText];
      return newToDos;
    });
  }, [
    setStateCategories,
    setStateToDos,
    stateCategories,
    stateCategoryText,
    stateToDos,
  ]);

  // console.log(stateCategoryText);
  // console.log(stateToDos);
  // console.log(stateCategories);

  return (
    <CategoryBase>
      <CategoryText
        ref={refCategoryText}
        contentEditable={stateIsEditing}
        suppressContentEditableWarning
      >
        {text}
      </CategoryText>
      {stateCategoryText !== "All" && (
        <>
          <CategoryEditButton
            onClick={startOrEndEditCategoryText}
            color={stateEditButtonColor}
          />
          <CategoryRemoveButton onClick={removeCategoryText} color="red" />
        </>
      )}
    </CategoryBase>
  );
}
