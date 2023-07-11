import { useEffect, useState } from "react";
import { create } from '@wutiange/react-actions'
import "./styles.css";
import { useTitle } from 'ahooks'
import Test1 from "./Test1";
import Test2 from "./Test2";

export const { useSubscribe, useAction } = create();

export default function App() {
  const [text, setText] = useState("你好");
  useTitle("看看")
  const trigger = useAction((actions) => actions["text"]);
  const subscribe = useSubscribe();


  useEffect(() => {
    console.log("这里也订阅了");
    subscribe("text", setText);
  }, [subscribe]);

  const changeText = () => {
    trigger("大家好");
  };

  const newSub = () => {
    subscribe("kan", () => null);
  };

  return (
    <div className="App">
      <h1>{text}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={changeText}>改变文本</button>
      <Test1 />
      <Test2 />
      <button onClick={newSub}>测试此时新增</button>
    </div>
  );
}
