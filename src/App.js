import { useEffect, useState } from "react";
import Form from "./page/Form";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [publicKey, setPublicKey] = useState("");

  window.addEventListener(
    "message",
    function (e) {
      if (e.data.messageType === "send_app_info") {
        setData(e.data.value);
      }
    },
    false
  );

  useEffect(() => {
    axios
      .get("https://crmbe.vinhnd.dev/api/internet-form/config/get-public-key")
      .then((res) => {
        setPublicKey(res.data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return <Form dataTranfer={data} publicKey={publicKey} />;
}

export default App;
