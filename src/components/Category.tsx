import React, { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { atomFamilyCategories, atomFamilyToDos } from "@/atoms";
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
const editableStateEditButtonColor = "aquamarine";

export function Category({ text, ...otherProps }: { text: string }) {
  const [stateCategories, setStateCategories] = useRecoilState(
    atomFamilyCategories(null),
  );
  const [stateToDos, setStateToDos] = useRecoilState(atomFamilyToDos(null));

  const [stateCategoryTextTmp, setStateCategoryTextTmp] = useState(text);
  const [stateCategoryText, setStateCategoryText] = useState(text);

  const [stateIsEditable, setStateIsEditable] = useState(false);
  const [stateEditButtonColor, setStateEditButtonColor] = useState(
    defaultEditButtonColor,
  );

  const startEditCategoryText = useCallback<
    React.MouseEventHandler<SVGElement>
  >(() => {
    // `All` category shouldn't be renamed.
    if (stateCategoryText === "All") {
      return;
    }

    const beforeEditCategory = stateCategoryText;
    const afterEditCategory = stateCategoryTextTmp.trim();
    if (stateIsEditable) {
      const targetIdx = stateCategories.findIndex(
        (stateCategory) => stateCategory === beforeEditCategory,
      );
      const doesNewCategoryNameAlreadyExist =
        stateCategories.findIndex(
          (stateCategory) => stateCategory === afterEditCategory,
        ) !== -1;
      if (!doesNewCategoryNameAlreadyExist) {
        setStateCategoryText(afterEditCategory);
        const categories = [...stateCategories];
        categories.splice(targetIdx, 1, afterEditCategory);
        setStateCategories(categories);

        setStateToDos((cur) => {
          const newValue = { ...cur };
          const newCategory = [...(newValue[beforeEditCategory] ?? [])];
          delete newValue[beforeEditCategory];
          return {
            ...newValue,
            afterEditCategory: newCategory,
          };
        });
      } else {
        alert(`The category named "${afterEditCategory}" already exists.`);
        setStateCategoryTextTmp(stateCategoryText);
      }
      setStateEditButtonColor(defaultEditButtonColor);
    } else {
      setStateEditButtonColor(editableStateEditButtonColor);
    }
    setStateIsEditable((cur) => !cur);
  }, [
    stateIsEditable,
    stateCategoryTextTmp,
    setStateCategories,
    stateCategories,
    stateCategoryText,
    setStateToDos,
  ]);

  const applyEditCategoryText = useCallback<
    React.FormEventHandler<HTMLSpanElement>
  >((event) => {
    setStateCategoryTextTmp(event.currentTarget.textContent ?? "");
  }, []);

  const removeCategoryText = useCallback(() => {
    const result = confirm("Are you sure want to remove this category?");
    if (!result) {
      return;
    }

    if ((stateToDos[stateCategoryText] ?? []).length !== 0) {
      alert("Category must be empty to be removed.");
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
      const newValue = { ...cur };
      delete newValue[stateCategoryText];
      return newValue;
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
    <CategoryBase {...otherProps}>
      <CategoryText
        contentEditable={stateIsEditable}
        suppressContentEditableWarning
        onBlur={applyEditCategoryText}
      >
        {text}
      </CategoryText>
      {stateCategoryText !== "All" && (
        <>
          <CategoryEditButton
            onClick={startEditCategoryText}
            color={stateEditButtonColor}
          />
          <CategoryRemoveButton onClick={removeCategoryText} color="red" />
        </>
      )}
    </CategoryBase>
  );
}
