import { useEffect, useState } from "react";
import { LevelToken } from "./GetCount";
import { ComboboxDemo } from "./ui/Combobox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";

type ListBybitProps = {
  tokens: LevelToken[];
  address: string;
  privateKey: string;
};

export default function ListBybit({
  tokens,
  address,
  privateKey,
}: ListBybitProps) {
  const { toast } = useToast();
  const [selectedTokenName, setSelectedTokenName] = useState<string>("");

  useEffect(() => {
    // console.log(selectedTokenName);
  }, [selectedTokenName]);

  const onFormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address || !privateKey) {
      toast({
        title: "Oopsie!",
        description: "Wallet address and privateKey must be set to sell items!",
        duration: 3000
      });
      return;
    }
  };
  return (
    <form className="flex flex-col gap-2" onSubmit={onFormSubmitHandler}>
      <ComboboxDemo onChooseToken={setSelectedTokenName} tokens={tokens} />
      <Input min={1} type="number" placeholder="How many NFT to sell?" />
      <Button type="submit">Sell!</Button>
    </form>
  );
}
