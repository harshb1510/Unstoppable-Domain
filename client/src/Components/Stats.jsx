import React from "react";

const stats = [
  {
    id: "stats-1",
    title: "User Active",
    value: "3800+",
  },
  {
    id: "stats-2",
    title: "Trusted by Company",
    value: "230+",
  },
  {
    id: "stats-3",
    title: "Transaction",
    value: "$230M+",
  },
];

const Stats = () => (
  <section className="flex flex-row flex-wrap justify-center items-center bg-gray-100 py-10">
    {stats.map((stat) => (
      <div
        key={stat.id}
        className="flex-1 max-w-xs m-4 p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl"
      >
        <h4 className="font-poppins font-semibold text-[40px] text-center text-black mb-2">
          {stat.value}
        </h4>
        <p className="font-poppins font-semibold text-[20px] text-center text-gray-700 uppercase">
          {stat.title}
        </p>
      </div>
    ))}
  </section>
);

export default Stats;
