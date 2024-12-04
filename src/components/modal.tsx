import { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import { FilterTwoTone, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import convertToBytes, { reverse } from "../lib/convertToBytes";
import handleValueFieldChange from "../lib/handleValueFieldChange";
interface filterField {
  key: string;
  value: string[] | number | string | undefined;
  operators?: string;
  unit?: string;
}

export default function AntdFilterModal() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyOptional, setKeyOptional] = useState([
    { value: "status", label: "Status", disabled: false },
    { value: "parent_id", label: "Parent ID", disabled: false },
    { value: "size", label: "Size", disabled: false },
    {
      value: "activated",
      label: "Activated",
      disabled: false,
    },
  ]);

  // const [conditions, setConditions] = useState(() => {
  //   const filterParam = searchParams.get("filters");
  //   if (!filterParam) {
  //     return null;
  //   }
  //   try {
  //     return JSON.parse(decodeURIComponent(filterParam));
  //   } catch (error) {
  //     console.error("Failed to parse filters:", error);
  //   }
  //   return null;
  // });
  const [valueOptionals, setValueOptionals] = useState(() => {
    const filtersParam = searchParams.get("filters");

    if (!filtersParam) {
      return null;
    }
    try {
      const filtersObject = JSON.parse(decodeURIComponent(filtersParam));
      return Object.entries(filtersObject).map(
        ([key, filter]: [string, any], index) =>
          key === "size"
            ? handleValueFieldChange(key, index, filter.operator)
            : handleValueFieldChange(key, index)
      );
    } catch (error) {
      console.error("Failed to parse filters:", error);
      return null;
    }
  });
  const [initForm, setInitForm] = useState(() => {
    const filtersParam = searchParams.get("filters");

    if (!filtersParam) {
      return [];
    }
    try {
      const filtersObject = JSON.parse(decodeURIComponent(filtersParam));
      return Object.entries(filtersObject).map(
        ([key, filter]: [string, any]) => {
          if (key === "size") {
            const { value, unit } = reverse(filter.values);
            return {
              key,
              value: value,
              operator: filter.operator,
              unit: unit,
            };
          }
          if (key === "activated") {
            return {
              key,
              value: filter.values ? "on" : "off",
              operator: filter.operator,
            };
          }
          return {
            key,
            value: filter.values,
            operator: filter.operator,
          };
        }
      );
    } catch (error) {
      console.error("Failed to parse filters:", error);
      return [];
    }
  });

  const showModal = () => {
    const options = keyOptional;
    const updateedOptional = options.map((option) => {
      const isDisabled = initForm.some((f) => {
        if (f === undefined) return undefined;
        return f.key === option.value;
      });
      return { ...option, disabled: isDisabled };
    });
    setKeyOptional(updateedOptional);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const onFinish = (values: any) => {
    console.log(values);
    const filters = values.filter.reduce((acc, item) => {
      const { key, value, operators, unit } = item;

      if (Array.isArray(value) && key !== "size" && value.length > 0) {
        acc[key] = {
          operator: "in",
          values: value,
        };
      } else if (key === "size" && value != undefined) {
        const sizeInBytes = convertToBytes(value, unit);
        acc[key] = {
          operator: operators,
          values: sizeInBytes,
        };
      } else if (key === "activated" && value != undefined) {
        acc[key] = {
          operator: "in",
          values: value === "on" ? true : false,
        };
      }

      return acc;
    }, {});
    const removeUndefined = values.filter.filter(
      (item) => item.value !== undefined
    );
    form.setFieldsValue({ filter: removeUndefined });
    handleApplyFilters(filters);
    setInitForm(removeUndefined);

    setIsModalOpen(false);
  };

  const handleKeyValueChange = (_: any, all: { filter: filterField[] }) => {
    const options = keyOptional;
    const updateedOptional = options.map((option) => {
      const isDisabled = all.filter.some((f: filterField) => {
        if (f === undefined) return undefined;
        return f.key === option.value;
      });
      return { ...option, disabled: isDisabled };
    });

    const vs = all.filter.map((op, index) => {
      if (op === undefined) return;
      return handleValueFieldChange(op.key, index);
    });

    setKeyOptional(updateedOptional);
    setValueOptionals(vs);
  };
  const handleApplyFilters = (filters: object) => {
    const encodedFilters = encodeURIComponent(JSON.stringify(filters));
    navigate(`/?filters=${encodedFilters}`);
  };
  return (
    <>
      <Button onClick={showModal} icon={<FilterTwoTone />}></Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        footer={[
          <Button
            key={"ClearAll"}
            type="text"
            onClick={() => {
              navigate(window.location.pathname, { replace: true });
              setInitForm([]);
              setValueOptionals(null);
              form.setFieldsValue({ filter: [] });
              setIsModalOpen(false);
            }}
          >
            Clear all
          </Button>,
          <Button key={"Cancel"} onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key={"Confirm"} type="primary" onClick={handleOk}>
            Confirm
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="filter"
          onValuesChange={handleKeyValueChange}
          onFinish={onFinish}
        >
          <Form.List name="filter" initialValue={initForm}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item {...restField} name={[name, "key"]}>
                      <Select
                        style={{ width: 120 }}
                        options={keyOptional}
                        onChange={() => {
                          // reset value field when key field change
                          const getField = form.getFieldValue("filter");
                          getField[name].value = undefined;
                          form.setFieldValue("filter", getField);
                        }}
                      />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]}>
                      {valueOptionals && valueOptionals[name] === undefined ? (
                        <Select style={{ width: 320 }} disabled={true} />
                      ) : (
                        valueOptionals && valueOptionals[name]
                      )}
                    </Form.Item>
                    <Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Form.Item>
                  </Space>
                ))}
                <Form.Item>
                  {fields.length >= 4 ? (
                    <></>
                  ) : (
                    <Button
                      type="link"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      disabled={fields.length >= 4}
                    >
                      Add filter
                    </Button>
                  )}
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
