import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ConfigProvider,
  ConfigProviderProps,
  RefSelectProps,
  Select as AntdSelect,
  SelectProps as AntdSelectProps,
} from "antd";
import { ExecutionProps, styled } from "styled-components";
import { merge } from "lodash-es";

const SelectBase = styled(AntdSelect)`
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

export type SelectHandle = Omit<RefSelectProps, "nativeElement"> & {
  nativeElement: RefSelectProps["nativeElement"] | undefined;
  clear: () => void;
  selectedValue: string | undefined;
};

export const Select = React.memo(
  React.forwardRef<SelectHandle, SelectProps>(
    ({ customProps, ...otherProps }, ref) => {
      const refBase = useRef<RefSelectProps>();

      const [stateSelectedValue, setStateSelectedValue] = useState<
        string | undefined
      >(undefined);

      useImperativeHandle(ref, () => {
        if (refBase.current) {
          return {
            blur: refBase.current.blur,
            focus: refBase.current.focus,
            clear: () => {
              setStateSelectedValue(undefined);
            },
            selectedValue: stateSelectedValue,
            nativeElement: refBase.current.nativeElement,
            scrollTo: refBase.current.scrollTo,
          };
        } else {
          return {
            blur: () => {},
            focus: () => {},
            clear: () => {},
            selectedValue: undefined,
            nativeElement: undefined,
            scrollTo: () => {},
          };
        }
      });

      const { selectProps = {}, configProviderProps = {} } = customProps ?? {};
      const {
        onChange = () => {},
        onSelect = () => {},
        onSearch = () => {},
        ...otherSelectProps
      } = selectProps;

      const _onChange = useCallback<NonNullable<AntdSelectProps["onChange"]>>(
        (value: string, option) => {
          // console.log(`onChange: "${value}"`);
          onChange(value, option);
        },
        [onChange],
      );

      const _onSelect = useCallback<NonNullable<AntdSelectProps["onSelect"]>>(
        (value: string, option) => {
          console.log(`onSelect: "${value}"`);
          onSelect(value, option);
          setStateSelectedValue(value);
        },
        [onSelect],
      );

      const _onSearch = useCallback<NonNullable<AntdSelectProps["onSearch"]>>(
        (value: string) => {
          // console.log("onSearch:", "value");
          onSearch(value);
        },
        [onSearch],
      );

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
          value: stateSelectedValue,
          showSearch: true,
          placeholder: "",
          optionFilterProp: "label",
          onChange: _onChange,
          onSelect: _onSelect,
          onSearch: _onSearch,
          optionRender: (oriOption, info) => {
            return <SelectOption>{oriOption.label}</SelectOption>;
          },
        } satisfies AntdSelectProps,
        otherSelectProps,
      );

      return (
        <ConfigProvider {..._configProviderProps}>
          <SelectBase ref={refBase} {..._selectProps} {...otherProps} />
        </ConfigProvider>
      );
    },
  ),
);
