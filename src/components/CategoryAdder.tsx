import { atomCategories, atomToDos } from "@/atoms";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { useCallback, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { styled } from "styled-components";

export interface CategoryFormData {
  categoryText: string;
}

const CategoryAdderBase = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryAdderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CategoryAdderErrorMessage = styled.div`
  padding-left: 5px;
  color: red;
`;

const NewCategoryInput = styled.input`
  width: 180px;
  height: 30px;
  padding: 1px 5px;
  border: none;
  border-radius: 0;

  font-size: 17px;
  font-family: "Source Sans 3";
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

export function CategoryAdder() {
  const [stateCategories, setStateCategories] = useRecoilState(atomCategories);
  const setStateToDos = useSetRecoilState(atomToDos);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      categoryText: "",
    },
  });

  const onValid = useCallback<SubmitHandler<CategoryFormData>>(
    ({ categoryText }) => {
      reset({ categoryText: "" });

      const newCategoryText = categoryText.trim();
      const targetIdx = stateCategories.findIndex(
        (stateCategory) => stateCategory === newCategoryText,
      );
      if (targetIdx !== -1) {
        alert(`The category "${newCategoryText}" already exists.`);
        return;
      }
      const categories = [...stateCategories, categoryText];
      setStateCategories(categories);

      setStateToDos((cur) => {
        return { ...cur, newCategoryText: [] };
      });
    },
    [reset, setStateCategories, setStateToDos, stateCategories],
  );

  const submitHandler = useMemo(() => {
    return handleSubmit(onValid);
  }, [handleSubmit, onValid]);

  return (
    <CategoryAdderBase onSubmit={submitHandler}>
      <CategoryAdderContent>
        <NewCategoryInput
          placeholder="New Category"
          {...register("categoryText", {
            required: "Please fill in a new category.",
          })}
        />
        <ButtonPrimary type="submit">Add</ButtonPrimary>
      </CategoryAdderContent>
      <CategoryAdderErrorMessage>
        {!!errors.categoryText?.message && errors.categoryText.message}
      </CategoryAdderErrorMessage>
    </CategoryAdderBase>
  );
}
