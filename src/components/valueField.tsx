import { Select, InputNumber, Form, Tag } from "antd";
import type { SelectProps } from "antd";

type TagRender = SelectProps["tagRender"];
const statusOptional = [
  {
    value: "online",
    label: "Online",
    tagColor: "green",
  },
  {
    value: "offline",
    label: "Offline",
    tagColor: "yellow",
  },
  {
    value: "rebuild",
    label: "Rebuild",
    tagColor: "blue",
  },
  {
    value: "failed",
    label: "Failed",
    tagColor: "red",
  },
  {
    value: "missing",
    label: "Missing",
    tagColor: "lime",
  },
];
const parent_idOptional = [
  {
    value: "P-0",
    label: "P-0",
  },
  {
    value: "P-1",
    label: "P-1",
  },
  {
    value: "P-2",
    label: "P-2",
  },
];
const activatedOptional = [
  {
    value: "on",
    label: "On",
  },
  {
    value: "off",
    label: "Off",
  },
];

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const colorMap = new Map([
    ["online", "green"],
    ["offline", "yellow"],
    ["rebuild", "blue"],
    ["failed", "red"],
    ["offline", "lime"],
  ]);
  return (
    <Tag
      color={colorMap.has(value) ? colorMap.get(value) : "blue"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

export function StatusSelect() {
  return (
    <Select
      style={{ width: 320 }}
      tagRender={tagRender}
      options={statusOptional}
      mode="multiple"
    />
  );
}
export function ParentSelect() {
  return (
    <Select
      style={{ width: 320 }}
      tagRender={tagRender}
      options={parent_idOptional}
      mode="multiple"
    />
  );
}
export function SizeInput(index: number, operator?: string) {
  return (
    <InputNumber
      style={{ width: 320 }}
      addonAfter={selectAfter(index)}
      addonBefore={selectBefore(index, operator)}
    />
  );
}
export function ActivatedSelect() {
  return <Select style={{ width: 320 }} options={activatedOptional} />;
}

const selectBefore = (index: number, operator?: string) => (
  <Form.Item
    name={[index, "operators"]}
    noStyle
    initialValue={operator ? operator : "ge"}
  >
    <Select
      options={[
        {
          value: "ge",
          label: "≥",
        },
        {
          value: "le",
          label: "≤",
        },
      ]}
      style={{ width: 60 }}
    ></Select>
  </Form.Item>
);
const selectAfter = (index: number) => (
  <Form.Item name={[index, "unit"]} noStyle initialValue={"GiB"}>
    <Select
      options={[
        {
          value: "MiB",
          label: "MiB",
        },
        {
          value: "GiB",
          label: "GiB",
        },
        {
          value: "TiB",
          label: "TiB",
        },
        {
          value: "PiB",
          label: "PiB",
        },
      ]}
      style={{ width: 100 }}
    ></Select>
  </Form.Item>
);
