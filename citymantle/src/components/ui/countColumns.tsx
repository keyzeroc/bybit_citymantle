import { ColumnDef } from "@tanstack/react-table";
import { Count } from "../GetCount";

export const columns: ColumnDef<Count>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "unlistedCount",
    header: "Unlisted Count",
  },
  {
    accessorKey: "listedCount",
    header: "Listed Count",
  },
];
