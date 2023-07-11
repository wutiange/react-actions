import React from "react";
import { useAction } from "./App";

const Test2 = () => {
  const { add, sub } = useAction((actions) => {
    return {
      add: actions["+"],
      sub: actions["-"]
    };
  }, "Test2");

  const addFunc = () => {
    add();
  };

  const subFunc = () => {
    sub();
  };

  return (
    <div>
      <p>在这里也可以进行改变</p>
      <div>
        <span
          onClick={subFunc}
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
          onClick={addFunc}
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

export default Test2;
