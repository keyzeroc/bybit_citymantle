import { ThemeProvider } from "@/components/theme-provider";
import "./App.css";
import Navbar from "./components/ui/Navbar";
import GetFloor from "./components/GetFloor";
import GetCount, { LevelToken } from "./components/GetCount";
import { useEffect, useState } from "react";
// import ListBybit from "./components/ListBybit";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [address, setAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [tokens, setTokens] = useState<LevelToken[]>([]);

  useEffect(() => {
    // console.log(address);
    // console.log(privateKey);
    // console.log(tokens);

  }, [tokens]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar onAddressChange={setAddress} onPrivateKeyChange={setPrivateKey} />
      <main className="p-4 flex flex-row gap-4 mt-4">
        <GetFloor />
        <GetCount address={address} onListRetrieve={setTokens} />
        {/* <div className="w-full">
          <ListBybit tokens={tokens} address={address} privateKey={privateKey}/>
        </div> */}
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
