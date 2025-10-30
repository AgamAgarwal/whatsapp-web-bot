# WhatsApp Web Bot

Bot which can be used to automatically send messages (with optional attachments) to a list of contacts.

The messages are sent in sequence, with a set delay between each message. This is to reduce the risk of being blocked by WhatsApp.

 > [!IMPORTANT]
 > **It is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe. Run this at your own risk.**

## Usage

### Setup

Clone this repo, go to its directory and run:

```bash
$ npm install
```

### Login

The bot uses a local auth strategy and saves the login to be re-used across sessions.

To login, run the following command:

```bash
$ npm run login -- --client_id <CLIENT_ID>
```

1. This will open a new Chrome window, with WhatsApp Web open and show you a QR code.
1. Scan the QR code using WhatsApp on your phone to login.
1. Once the page has loaded completely, you can come back to your terminal running the login process and terminate it using `Ctrl+C`. This would also close the Chrome window.

You should now see a `.wwebjs_auth/session-<CLIENT_ID>` directory created.

If you try running the login command once again with the same `CLIENT_ID`, it would open a Chrome window with your WhatsApp account already logged in.

### Sending messages

Create the following files (you can create them anywhere your system):

1. *Message*: Text file with the message to be sent.
1. *Contacts*: Text file with one contact name per line. The contact name should match exactly with what is saved on your phone (case-sensitive).
1. *Attachment* (Optional): Media attachment (image, video, etc) to sent along with the text message.

Now, run the following command:

```bash
$ npm run bot -- --client_id <CLIENT_ID> --message_file <MESSAGE_FILE> --contacts_file <CONTACTS_FILE> [--attachment_file <ATTACHMENT_FILE>]
```

This will now send the message to each specified user, sequentially, spaced 20 seconds.

Note: Your phone needs to be connected to the internet while this script is running.

### Logout and cleanup

You can logout by opening WhatsApp on your phone > 3-dots menu > Linked devices > Google Chrome > Logout.

Additionally, delete the `.wwebjs_auth/session-<CLIENT_ID>` directory as it is no longer needed.

### Advanced: Multiple users

You can login with multiple users across different sessions by passing different values to the `--client_id` flag.
Each user would get their own `.wwebjs_auth/session-<CLIENT_ID>` directory.

### Advanced: Custom messaging logic

The `bot.ts` file runs a simple loop across all given contacts, sending each of them a single message.
If you need a different logic, feel free to simply edit `bot.ts` to add your logic.

Feel free to contribute to the project by sending a pull request.

Visit [WWeb.js's documentation](https://docs.wwebjs.dev/) to look at more capabilities of [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

