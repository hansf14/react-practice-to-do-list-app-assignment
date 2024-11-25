import React, { useCallback } from "react";
import {
  ConfigProvider,
  ConfigProviderProps,
  Select as AntdSelect,
  SelectProps as AntdSelectProps,
} from "antd";
import { ExecutionProps, styled } from "styled-components";
import { merge } from "lodash-es";

const SelectBase = styled(AntdSelect)`

`;

const SelectOption = styled.div`
  white-space: break-spaces;
  word-break: break-word;

  /* .ant-select-item-option:has(&) {
    background-color: tomato;
  } */
`;

export type SelectProps = React.ComponentPropsWithoutRef<"div"> &
  ExecutionProps & {
    customProps?: {
      selectProps?: AntdSelectProps;
      configProviderProps?: ConfigProviderProps;
    };
  };

export function Select({ customProps, ...otherProps }: SelectProps) {
  const { selectProps = {}, configProviderProps = {} } = customProps ?? {};

  const onChange = useCallback((value: unknown | string) => {
    console.log(`selected ${value}`);
  }, []);

  const onSearch = useCallback((value: string) => {
    console.log("search:", value);
  }, []);

  const _configProviderProps = merge(
    {
      components: {
        Select: {
          controlHeight: 30,
          optionActiveBg: "#eee",
          // optionSelectedBg: "tomato",
        },
      },
      // token: {
      //   // Seed Token
      //   colorPrimary: '#00b96b',
      //   borderRadius: 2,
      //   // Alias Token
      //   colorBgContainer: '#f6ffed',
      // },
    } satisfies ConfigProviderProps["theme"],
    configProviderProps,
  );
  const _selectProps = merge(
    {
      showSearch: true,
      placeholder: "",
      optionFilterProp: "label",
      onChange,
      onSearch,
      optionRender: (oriOption, info) => {
        return <SelectOption>{oriOption.label}</SelectOption>;
      },
    } satisfies AntdSelectProps,
    selectProps,
  );
  const { onChange: _onChange = () => {}, onSearch: _onSearch = () => {} } =
    selectProps;

  return (
    <ConfigProvider {..._configProviderProps}>
      <SelectBase {..._selectProps} {...otherProps} />
    </ConfigProvider>
  );
}
