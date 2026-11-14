import { createTaxiServiceSchema } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";

export function HomeStructuredData() {
  return <JsonLd data={createTaxiServiceSchema()} />;
}
