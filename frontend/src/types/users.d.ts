export interface User {
  id: number;
  name: string;
  curp: string;
  rfc: string;
  position: string;
  salary: number;
  status: "active" | "inactive";
}
