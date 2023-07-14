import React from "react";
import { Tabs } from "antd";
import Bill from "./Create Bill";
import Read from "./Read";

function App() {
  const items = [
    {
      key: "1",
      label: `Create Bill`,
      children: <Bill />,
    },
    {
      key: "2",
      label: `RUD Bill`,
      children: <Read />,
    },
  ];
  return (
    <div className="w-[80vw] m-auto pt-10">
      <Tabs items={items} />
    </div>
  );
}
export default App;
