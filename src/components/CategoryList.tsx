import { useRecoilValue } from "recoil";
import { atomCategories } from "@/atoms";
import { styled } from "styled-components";
import { Category } from "@/components/Category";

const CategoryListBase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const CategoryListTitle = styled.h1`
  font-size: 35px;
  color: #ffbf47;
`;

const CategoryListContentBase = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  gap: 7px;
`;

export function CategoryList() {
  const stateCategories = useRecoilValue(atomCategories);
  // console.log(stateCategories);

  return (
    <CategoryListBase>
      <CategoryListTitle>Categories</CategoryListTitle>
      <CategoryListContentBase>
        {stateCategories.map((stateCategory) => {
          return <Category key={stateCategory} text={stateCategory} />;
        }, [])}
      </CategoryListContentBase>
    </CategoryListBase>
  );
}
