import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { staticServer } from "../hello_deno/staticServer.js";
import { spriteChat } from "./spriteChat.js";

// change working directory to directory of this file
const dirName = new URL(".", Deno.mainModule).pathname;
Deno.chdir(dirName);

const app = new Application();
const router = new Router();

app.use(staticServer);

router.post("/spriteChat", spriteChat);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on http://localhost:8000`);
await app.listen({ port: 8000 });
