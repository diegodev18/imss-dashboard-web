export interface User {
  id: number;
  full_name: string;
  curp: string;
  rfc: string;
  position: string;
  salary: number;
  social_security_number: string;
  status: "active" | "inactive";
}
