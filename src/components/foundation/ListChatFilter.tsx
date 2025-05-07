import { Checkbox, Radio, Form, Button, DatePicker } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import useColor from "@/hooks/useColor";
import { useAuth } from "@/context/auth/useAuth";
import { TopicResponseModel } from "@/api/features/topic/models/TopicModel";

const { RangePicker } = DatePicker;

const FilterForm = ({
  topics,
  statusList,
  onApply,
  onReset,
  dateFilterType, 
  setDateFilterType
}: {
  topics: TopicResponseModel[];
  statusList: { value: string; label: string }[];
  onApply: (values: any) => void;
  onReset: () => void;
  dateFilterType: string;
  setDateFilterType: Dispatch<SetStateAction<string>>;
}) => {
  const { localStrings } = useAuth();
  const [form] = Form.useForm();

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onApply}
        initialValues={{
          dateFilterType: "all",
          topics: [],
          status: "",
          dateRange: [
            dayjs().startOf("day"),
            dayjs().endOf("day"),
          ],
        }}
      >
        {/* Chủ đề */}
        <Form.Item
          label={
            <span className="text-white font-bold">{localStrings.GLobals.Topic}</span>
          }
          name="topics"
        >
          <Checkbox.Group className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Checkbox
                key={topic._id}
                value={topic._id}
                className="text-white"
                style={{ color: "white" }}
              >
                {(localStrings.Topics as any)[topic.code || ""]}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        {/* Ngày tạo */}
        <Form.Item
          label={
            <span className="text-white font-bold">{localStrings.GLobals.CreatedDate}</span>
          }
          className="mb-2"
        >
          <Radio.Group
            onChange={(e) => setDateFilterType(e.target.value)}
            value={dateFilterType}
            name="dateFilterType"
          >
            <div className="flex gap-4">
              <Radio value="all" className="text-white" style={{ color: "white" }}>{localStrings.GLobals.All}</Radio>
              <Radio value="range" className="text-white" style={{ color: "white" }}>{localStrings.GLobals.DateRange}</Radio>
            </div>
          </Radio.Group>
        </Form.Item>

        {dateFilterType === "range" && (
          <Form.Item name="dateRange">
            <RangePicker
              format="DD/MM/YYYY"
              className="w-full"
              popupClassName="z-50"
              style={{ backgroundColor: "white" }}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              allowClear={false}
              allowEmpty={false}
            />
          </Form.Item>
        )}

        {/* Thời hạn */}
        <Form.Item
          label={
            <span className="text-white font-bold">{localStrings.GLobals.RemainDay}</span>
          }
          name="status"
        >
          <Radio.Group className="flex flex-wrap gap-4">
            <Radio key={""} value={""} style={{ color: "white" }}>
              {localStrings.GLobals.All}
            </Radio>
            {statusList.map((status) => (
              <Radio key={status.value} value={status.value} style={{ color: "white" }}>
                {status.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Button áp dụng */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {localStrings.GLobals.Apply}
          </Button>
        </Form.Item>

        {/* Button reset */}
        <Form.Item>
          <Button
            type="primary"
            danger
            onClick={() => {
              form.resetFields();
              onReset();
            }}
            className="w-full text-white"
          >
            {localStrings.GLobals.Delete}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterForm;
