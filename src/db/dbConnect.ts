import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// {
// log: [
//   {
//     emit: "event",
//     level: "query"
//   }
// ]
// }

// prisma.$on("query", (event) => {
//   console.log("Prisma query", event.query);
//   console.log("Prisma parameters", event.params);
// });

export default prisma;
