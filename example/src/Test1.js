import React, { useEffect, useState } from "react";
import { useSubscribe } from "./App";

const Test1 = () => {
  const [count, setCount] = useState(1);
  const subscribe = useSubscribe();

  const add = () => {
    console.log("点击了假发");
    setCount((count) => count + 1);
  };

  const sub = () => {
    setCount((count) => count - 1);
  };

  useEffect(() => {
    console.log("-------Test1-----");
    subscribe("+", add);
    subscribe("-", sub);
  }, [subscribe]);

  return (
    <div>
      <h1>{count}</h1>
      <div>
        <span
          onClick={sub}
          style={{
            padding: 10,
            fontSize: 22,
            borderWidth: 1,
            borderColor: "red",
            borderStyle: "solid",
            marginRight: 10
          }}
        >
          -
        </span>
        <span
          onClick={add}
          style={{
            padding: 10,
            fontSize: 22,
            borderWidth: 1,
            borderColor: "red",
            borderStyle: "solid"
          }}
        >
          +
        </span>
      </div>
    </div>
  );
};

export default Test1;
