function delay(ms) {
  return new Promise(r => {
    setTimeout(r, ms);
  });
}

const SMALL_DELAY = 100;
const LARGE_DELAY = 1000;

async function switchTo(query) {
  const searchBox = document.querySelector('[aria-label="Search input textbox"]');

  searchBox.focus();
  await delay(SMALL_DELAY);

  document.execCommand('insertText', false, query);

  await delay(SMALL_DELAY);
  searchBox.dispatchEvent(new KeyboardEvent(
    "keydown", {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
    }));
}

async function sendMessage(message) {
    document.querySelector('[aria-label^="Type to"]').click();
    await delay(SMALL_DELAY);
    document.execCommand('insertText', false, message);
    await delay(SMALL_DELAY);
    document.querySelector('[aria-label="Send"').click();
}

function hexToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }
  const uint8Array = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    const byteString = hexString.substring(i, i + 2);
    uint8Array[i / 2] = parseInt(byteString, 16);
  }

  return uint8Array;
}

function getFiles() { 
  const fileName = 'attachment.png';
  const file = new File([hexToUint8Array(FILE_CONTENT)], fileName, { type: 'image/png' });

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  return dataTransfer.files;
}

function fileToDataTransfer(file) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  return dataTransfer.files;
}

async function sendAttachment(attachment) {
  document.querySelector('[aria-label="Attach"]').click();
  await delay(SMALL_DELAY);
  const fileInput = document.querySelectorAll('input')[1];
  fileInput.files = attachment;
  await delay(SMALL_DELAY);
  fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  // Wait for file to upload
  await delay(LARGE_DELAY);
  document.querySelector('[aria-label="Send"').click();
}

async function bulkSend(contacts, message) {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  
  const attachment = fileToDataTransfer(file);

  console.log('Starting in 5 seconds. Please click on the page to avoid issues');
  await delay(5000);

  for (const contact of contacts) {
    await switchTo(contact);
    await delay(SMALL_DELAY);
    await sendMessage(message);
    await sendAttachment(attachment);
    await delay(LARGE_DELAY);
  }
}

const MESSAGE = "Test message";
const CONTACTS = [];

await bulkSend(CONTACTS, MESSAGE);
