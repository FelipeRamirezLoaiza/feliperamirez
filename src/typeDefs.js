import { fileURLToPath } from "url";
import * as fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = [
  fs.readFileSync(path.join(__dirname, "./users/schema.graphql"), "utf8"),
  fs.readFileSync(path.join(__dirname, "./products/schema.graphql"), "utf8"),
  fs.readFileSync(path.join(__dirname, "./categories/schema.graphql"), "utf8"),
  fs.readFileSync(path.join(__dirname, "./orders/schema.graphql"), "utf8"),
];

export { typeDefs };
