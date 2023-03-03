import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import FormView from "./FormView";
const Form = ({ dataTranfer, publicKey }) => {
  const [active, setActive] = useState([]);

  useEffect(() => {
    const changeState = (e) => {
      if (e.data.messageType === "send_active_modal") {
        console.log("receive", e.data._id);
        if (!active.includes(e.data._id)) {
          setActive((prev) => {
            let tem = prev.filter(
              (item, index) => prev.indexOf(item) === index
            );
            tem.push(e.data._id);
            return tem;
          });
        }
      }
    };

    window.addEventListener("message", changeState, false);

    return () => {
      window.removeEventListener("message", () => setActive([]), false);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("active", active);
  }, [active]);
  useEffect(() => {
    if (active.length === 0) {
      window.parent.postMessage(
        {
          messageType: "close_iframe",
        },
        dataTranfer.outer_domain
      );
    }
  }, [active, dataTranfer]);
  const renderListModal = (data) => {
    return data.listForm.map((config, index) => (
      <FormView
        key={index}
        publicKey={publicKey}
        dataMess={{
          ...config,
          device: data.device,
          outer_domain: data.outer_domain,
          access_count: 1,
        }}
        active={active}
        setActive={setActive}
      />
    ));
  };
  return (
    <Wrap>
      hellooo
      {Object.entries(dataTranfer).length > 0 && renderListModal(dataTranfer)}
    </Wrap>
  );
};

const Wrap = styled.div`
  /* width: 100%;
  height: 100%; */
  position: relative;
  .top_left {
    top: 20px;
    left: 20px;
  }
  .top_center {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .top_right {
    top: 20px;
    right: 20px;
  }
  .center_left {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  .center_center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .center_right {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  .bottom_left {
    left: 20px;
    bottom: 20px;
  }
  .bottom_center {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .bottom_right {
    right: 20px;
    bottom: 20px;
  }
`;

export default React.memo(Form);
