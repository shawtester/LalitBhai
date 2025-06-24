"use client";

import { useOrdersCountsByTotalDays } from "@/lib/firestore/orders/read_count";
import CountMeter from "./components/CountMeter";
import { useEffect, useState } from "react";

export default function Page() {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    let list = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      list.push(date);
    }
    setDates(list);
  }, []);

  const { data } = useOrdersCountsByTotalDays({ dates: dates });

  return (
    <main className="flex flex-col gap-6 p-5">
      <CountMeter />
      
    </main>
  );
}