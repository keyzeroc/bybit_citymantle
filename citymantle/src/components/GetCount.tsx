import { useEffect, useState } from "react";
import { DataTable } from "./ui/DataTable";
import { Button } from "./ui/button";
import { columns } from "./ui/countColumns";
import { useToast } from "@/components/ui/use-toast";

type GetCountProps = {
  address: string;
  onListRetrieve: (tokens: LevelToken[]) => void;
};
export interface LevelToken {
  name: string;
  unlistedId: number[];
  listedId: number[];
}
export interface Count {
  name: string;
  unlistedCount: number;
  listedCount: number;
}

export default function GetCount({ address, onListRetrieve }: GetCountProps) {
  const [countValues, setCountValues] = useState<LevelToken[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    onListRetrieve(countValues);
  }, [countValues]);

  async function getFloor() {
    if (!address) {
      toast({
        title: "Oopsie!",
        description: "Please set a wallet address first!",
        duration: 3000,
      });
      return;
    }
    setIsFetching(true);
    const levelTokens: LevelToken[] = await fetch(
      `/api/count?address=${address}`
    )
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
    setIsFetching(false);
    setCountValues(levelTokens);
  }

  return (
    <div className="flex flex-col w-full">
      <DataTable
        columns={columns}
        data={countValues.map((token) => {
          return {
            name: token.name,
            unlistedCount: token.unlistedId.length,
            listedCount: token.listedId.length,
          };
        })}
      />

      <Button className="mt-2 p-2" onClick={getFloor}>
        {isFetching
          ? "Fetching info..."
          : "Update NFT count (may take a while)"}
      </Button>
      <Button
        className="mt-2 p-2"
        onClick={async () => {
          await navigator.clipboard.writeText(JSON.stringify(countValues));
        }}
      >
        Copy JSON of all tokens
      </Button>
    </div>
  );
}
