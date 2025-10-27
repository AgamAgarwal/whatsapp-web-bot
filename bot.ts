import { Client, MessageMedia, LocalAuth, Contact } from "whatsapp-web.js";

const client = new Client({
  puppeteer: {
    headless: true,
    // Need to use Chrome for sending videos.
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
  authStrategy: new LocalAuth({ clientId: "LOCAL_CLIENT_ID" }),
});

const MESSAGE =
  "💍 With immense joy, we invite you to the wedding celebrations of Harshit ❤️ Riya, to be held from 23rd to 25th November 2025 at Anandi Magic World, Lucknow.\n\nPlease find complete celebration details in the invitation video below. ✨ Your gracious presence and blessings will mean the world to us. ✨\n\n#DilHaRiya";

const CONTACTS = ["Bhai"];

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

  async sendTextMessage(name: string, message: string) {
    const contact = this.findContact(name);

    if (!contact) {
      console.error(`Contact ${name} not found`);
      return;
    }

    const chat = await contact.getChat();
    await chat.sendMessage(message, { waitUntilMsgSent: true });

    console.log(`Message sent to ${name} successfully`);
  }

  async sendMediaMessage(name: string, media: MessageMedia, caption?: string) {
    const contact = this.findContact(name);

    if (!contact) {
      console.error(`Contact ${name} not found`);
      return;
    }

    const chat = await contact.getChat();
    await chat.sendMessage(media, {
      caption: caption,
      sendMediaAsHd: true,
      waitUntilMsgSent: true,
    });

    console.log(`Message sent to ${name} successfully`);
  }
}

async function runBot() {
  const bot = new Bot(client);
  await bot.init();

  const attachment = MessageMedia.fromFilePath("data/attachment.mp4");

  await bot.sendMediaMessage("Bhai", attachment, MESSAGE);

  process.exit(0);
}

client.on("ready", async () => {
  console.log("Client is ready!");

  await runBot();
});

client.initialize();
