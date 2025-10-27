import parseArgs from "minimist";
import { Client, LocalAuth } from "whatsapp-web.js";

const args = parseArgs(process.argv.slice(2));

if (!("client_id" in args)) {
  console.error("Missing required argument: client_id");
  process.exit(1);
}

const client = new Client({
  puppeteer: {
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
  authStrategy: new LocalAuth({ clientId: args["client_id"] }),
});

client.on("ready", async () => {
  console.log("Client is ready to use!");
});

client.initialize();
