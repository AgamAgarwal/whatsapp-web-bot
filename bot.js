const { Client, MessageMedia, LocalAuth, Contact } = require("whatsapp-web.js");

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
  contacts = [];

  constructor(client) {
    this.client = client;
  }

  async init() {
    this.contacts = await this.client.getContacts();
    console.log("Contacts initialized");
  }

  findContact(name) {
    return this.contacts.find((c) => c.name === name);
  }

  async sendTextMessage(name, message) {
    const contact = this.findContact(name);
    const chat = await contact.getChat();
    await chat.sendMessage(message);
  }

  async sendMediaMessage(name, media, caption) {
    const contact = this.findContact(name);
    const chat = await contact.getChat();
    await chat.sendMessage(media, { caption: caption, sendMediaAsHd: true });
  }
}

async function runBot() {
  const bot = new Bot(client);
  await bot.init();

  const attachment = MessageMedia.fromFilePath("data/attachment.mp4");

  await bot.sendMediaMessage("Bhaia", attachment, MESSAGE);

  console.log("message sent");
}

client.on("ready", async () => {
  console.log("Client is ready!");

  await runBot();
});

client.initialize();
