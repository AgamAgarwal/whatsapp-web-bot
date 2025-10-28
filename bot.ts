import { Client, MessageMedia, LocalAuth, Contact } from "whatsapp-web.js";
import parseArgs from "minimist";
import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));

if (!("client_id" in args)) {
  console.error("Missing required argument: client_id");
  process.exit(1);
}

if (!("message_file" in args)) {
  console.error("Missing required argument: message_file");
  process.exit(1);
}

if (!("contacts_file" in args)) {
  console.error("Missing required argument: contacts_file");
  process.exit(1);
}

const MESSAGE_FILE = args["message_file"];
const MESSAGE = fs.readFileSync(MESSAGE_FILE, "utf8").trimEnd();

const CONTACTS_FILE = args["contacts_file"];
const CONTACTS = fs.readFileSync(CONTACTS_FILE, "utf8").trimEnd().split("\n");

let attachment: MessageMedia | undefined;
if ("attachment_file" in args) {
  const ATTACHMENT_FILE = args["attachment_file"];
  attachment = MessageMedia.fromFilePath(ATTACHMENT_FILE);
}

const client = new Client({
  puppeteer: {
    headless: true,
    // Need to use Chrome for sending videos.
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
  authStrategy: new LocalAuth({ clientId: args["client_id"] }),
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Bot {
  private contacts: Contact[] = [];

  constructor(private readonly client: Client) {}

  async init() {
    this.contacts = await this.client.getContacts();
    console.log("Contacts initialized");
  }

  findContact(name: string) {
    return this.contacts.find((c) => c.name === name);
  }

  async sendMessage(name: string, message: string, attachment?: MessageMedia) {
    const contact = this.findContact(name);

    if (!contact) {
      console.error(`Contact ${name} not found`);
      return;
    }

    const chat = await contact.getChat();
    await chat.sendMessage(message, {
      media: attachment,
      sendMediaAsHd: true,
      waitUntilMsgSent: true,
    });

    console.log(`Message sent to ${name} successfully`);
  }
}

async function runBot() {
  const bot = new Bot(client);
  await bot.init();

  for (const name of CONTACTS) {
    await sleep(20000);
    await bot.sendMessage(name, MESSAGE, attachment);
  }

  process.exit(0);
}

client.on("qr", () => {
  console.log("QR Code received. Please login first!");

  process.exit(1);
});

client.on("ready", async () => {
  console.log("Client is ready!");

  await runBot();
});

client.initialize();
