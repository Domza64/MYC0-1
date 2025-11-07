import { useState } from "react";
import Library from "../components/settings-tabs/Library";
import Members from "../components/settings-tabs/Members";

const TABS = [
  { id: "library", title: "Library", component: Library },
  { id: "members", title: "Members", component: Members },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("library");

  // Find the active tab component
  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b-2 border-stone-800">
        <h1 className="pb-2 mr-20">Settings</h1>
        <ul className="flex gap-8">
          {TABS.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer font-medium ${
                activeTab === tab.id
                  ? "border-b-3 px-0.5 pb-1 border-rose-600 font-semibold"
                  : ""
              }`}
            >
              {tab.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Display the active component */}
      <div className="mt-6">
        {ActiveComponent ? <ActiveComponent /> : <div>No component found</div>}
      </div>
    </div>
  );
}
