import { ModeToggle } from "../mode-toggle";
import { Input } from "@/components/ui/input";

type Props = {
  onAddressChange: (address: string) => void;
  onPrivateKeyChange: (privateKey: string) => void;
};

export default function Navbar({ onAddressChange, onPrivateKeyChange }: Props) {
  return (
    <nav className="w-full border-b flex p-4 gap-4 items-end">
      <Input
        type="text"
        placeholder="set your wallet address to retrieve NFT information"
        onChangeCapture={(e) => onAddressChange(e.currentTarget.value)}
      />
      <Input
        type="text"
        placeholder="set your private key to be able to sell tokens"
        onChangeCapture={(e) => onPrivateKeyChange(e.currentTarget.value)}
      />
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </nav>
  );
}
