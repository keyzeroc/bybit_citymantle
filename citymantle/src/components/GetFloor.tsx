import { useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "./ui/floorColumns";
import { DataTable } from "./ui/DataTable";

export interface Listing {
  name: string;
  price: number;
}

export default function GetFloor() {
  const [floorValues, setFloorValues] = useState<Listing[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  async function getFloor() {
    setIsFetching(true);
    const floors: Listing[] = await fetch("/api/floor").then((resp) =>
      resp.json()
    );
    setIsFetching(false);
    setFloorValues(floors);
  }

  return (
    <div className="flex flex-col w-full">
      <DataTable columns={columns} data={floorValues} />
      <Button className="mt-2 p-2" onClick={getFloor}>
        {isFetching ? "Fetching info..." : "Update Floor Prices"}
      </Button>
    </div>
  );
}
