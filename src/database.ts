import { createConnection } from "typeorm";

export const databaseConfig = async () => {
  const entities = [__dirname + "/entity/**/*.*"];
  await createConnection({
    type: "mysql",
    host: "",
    port: 3306,
    username: "admin",
    password: "",
    database: "teelabs",
    entities: entities,
    synchronize: true,
  });
};
