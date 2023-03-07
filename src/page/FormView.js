import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import axios from "axios";
import JSEncrypt from "jsencrypt";

import { Form, Input, InputNumber, DatePicker, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const FormView = ({ active, publicKey, dataMess, setActive }) => {
  const [config, setConfig] = useState({});
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  useEffect(() => {
    if (
      encryptor.encrypt(JSON.stringify(dataMess)) &&
      Object.entries(config).length === 0
    ) {
      axios
        .post(
          "https://lab.connect247.vn/ucrmapi-sso/internet-form/config/display",
          {
            data: encryptor.encrypt(JSON.stringify(dataMess)),
          }
        )
        .then((res) => {
          setConfig(res.data.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    //eslint-disable-next-line
  }, [dataMess]);

  useEffect(() => {
    if (Object.entries(config).length > 0) {
      window.parent.postMessage(
        {
          messageType: "send_data_from_modal",
          value: {
            is_access: config.is_access,
            is_click: config.is_click,
            is_not_interact: config.is_not_interact,
            is_scroll: config.is_scroll,
            time_access: config.time_access,
            time_not_interact: config.time_not_interact,
            id_click: config.id_click,
            id_config: config._id,
            scroll_option: config.scroll_option,
            time_display: config.time_display,
            apply_for: config.apply_for,
            is_apply_all: config.is_apply_all,
            list_website: config.list_website,
            display_frequency: config.display_frequency,
            status: config.status,
          },
        },
        dataMess.outer_domain
      );
    }
    //eslint-disable-next-line
  }, [config]);
  const [form] = Form.useForm();

  const handleCloseModal = () => {
    let tem = active.filter((item) => item !== dataMess._id);
    setActive(tem);
    form.resetFields();
  };

  const renderForm = (listField) => {
    return listField.map((field, index) => {
      if (field.field_type === "number") {
        return (
          <Form.Item
            key={index}
            label={field.name}
            name={field.id}
            rules={[
              { required: field.required, message: "This field is required!" },
            ]}
          >
            <InputNumber placeholder={"Please input"} />
          </Form.Item>
        );
      } else if (field.field_type === "date") {
        return (
          <Form.Item
            key={index}
            label={field.name}
            name={field.id}
            rules={[
              { required: field.required, message: "This field is required!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
        );
      } else if (field.field_type === "textarea") {
        return (
          <Form.Item
            key={index}
            label={field.name}
            name={field.id}
            rules={[
              { required: field.required, message: "This field is required!" },
            ]}
          >
            <TextArea rows={2} placeholder={"Please input"} />
          </Form.Item>
        );
      } else if (field.field_type === "select") {
        return (
          <Form.Item
            key={index}
            label={field.name}
            name={field.id}
            rules={[
              { required: field.required, message: "This field is required!" },
            ]}
          >
            <Select placeholder={"Please select"}>
              {field.field_options.map((op, index) => (
                <Option key={index} value={op}>
                  {op}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            key={index}
            label={field.name}
            name={field.id}
            rules={[
              { required: field.required, message: "This field is required!" },
            ]}
          >
            <Input placeholder={"Please input"} />
          </Form.Item>
        );
      }
    });
  };

  const handleFinish = (value) => {
    handleCloseModal();
  };
  return (
    <>
      {Object.entries(config).length > 0 && (
        <WrapForm
          isActive={active.includes(config._id)}
          dark_screen={config.dark_screen}
        >
          <Wrap className={config.position_display} config={config}>
            <FromWrap>
              <IntroWrap>
                {config.form_name && <Name>{config.form_name}</Name>}
                {config.form_description && (
                  <Description>{config.form_description}</Description>
                )}
              </IntroWrap>
              <Form
                onFinish={handleFinish}
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                {renderForm(config.list_field)}
              </Form>
              <ButtonWrap>
                <CustomButton onClick={() => form.submit()}>
                  {config.form_save}
                </CustomButton>
                <CustomButton onClick={() => handleCloseModal()}>
                  {config.form_cancel}
                </CustomButton>
              </ButtonWrap>
            </FromWrap>
          </Wrap>
        </WrapForm>
      )}
    </>
  );
};

export default React.memo(FormView);

const WrapForm = styled.div`
  display: ${(props) => (props.isActive ? "block" : "none")};
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: ${(props) =>
    props.dark_screen ? "rgba(0, 0, 0, 0.45)" : "transparent"};
  line-height: 22px;
`;

const Wrap = styled.div`
  padding: ${(props) =>
    `${props.config.desktop_top}px ${props.config.desktop_right}px ${props.config.desktop_bottom}px ${props.config.desktop_left}px`};
  width: ${(props) => props.config.desktop_width}px;
  height: ${(props) => props.config.desktop_height}px;

  label {
    font-size: ${(props) => `${props.config.font_desktop}px`} !important;
    color: ${(props) => props.config.font_color};
    font-style: ${(props) =>
      props.config.font_style === "italic" ? "italic" : "normal"} !important;
    font-weight: ${(props) =>
      props.config.font_style === "bold" ? "500" : 400};
    position: relative;
    ::before {
      position: absolute;
      right: -12px;
      top: 5px;
    }
  }
  background: #fff;
  background-image: ${(props) =>
    props.config.background ? `url(${props.config.background_url})` : ""};
  max-width: 90%;
  max-height: 90%;
  position: absolute;
  border-radius: ${(props) => (props.config.rounded ? "5px" : "0px")};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: ${(props) => props.config.background_position};
  overflow: auto;
  z-index: 100;
`;

const FromWrap = styled.div`
  max-width: 100%;
  max-height: 100%;

  overflow: auto;
  background: #fff;
  padding: 16px;
  .ant-col-24.ant-form-item-label {
    padding: 2px;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #fff;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d8d6d6;
    border-radius: 20px;
  }
  .ant-form-item {
    margin-bottom: 12px !important;
  }
  .ant-input-number,
  .ant-picker {
    width: 100%;
  }
  .ant-input-number:hover,
  .ant-input-number:focus,
  .ant-input-number-focused,
  .ant-picker-focused,
  .ant-picker:hover,
  .ant-select:not(.ant-select-disabled):hover .ant-select-selector,
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(
      .ant-select-customize-input
    )
    .ant-select-selector,
  .ant-input:focus,
  .ant-input-focused,
  .ant-input:hover {
    border-color: #00ab55 !important;
    box-shadow: none !important;
  }
`;

const IntroWrap = styled.div``;
const Name = styled.div`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.div`
  text-align: center;
  margin-bottom: 8px;
  font-size: 16px;
`;

const ButtonWrap = styled.div`
  width: 100%;
`;
const CustomButton = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: all 0.5s;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  background: #fff;
  :hover {
    background: #079e52 !important;
    color: #fff;
    border: #079e52;
  }

  :nth-child(1) {
    background: #00ab55;
    color: #fff;
    border: #00ab55;
    margin-bottom: 12px;
  }
`;
