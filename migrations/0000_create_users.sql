-- Migration number: 0000 	 2023-02-01T22:42:40.045Z
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text,
    marks text,
    email text,
    password text,
    status number,
    phoneNumer number
    createdAt text default CURRENT_TIMESTAMP

)

