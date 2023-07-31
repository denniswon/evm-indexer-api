const { client } = require("websocket");

const _client = new client();

let state = true;

_client.on("connectFailed", (e) => {
  console.error(`[!] Failed to connect : ${e}`);
  process.exit(1);
});

// For outgoing tx(s) from account
_client.on("connect", (c) => {
  c.on("close", (d) => {
    console.log(`[!] Closed connection : ${d}`);
    process.exit(0);
  });

  c.on("message", (d) => {
    console.log(JSON.parse(d.utf8Data));
  });

  handler = (_) => {
    // from address is specified, any tx outgoing from account `0x...`
    // can be listened using this topic
    c.send(
      JSON.stringify({
        name: "transaction/0x4774fEd3f2838f504006BE53155cA9cbDDEe9f0c/*",
        type: state ? "subscribe" : "unsubscribe",
        apiKey:
          "0x8fe352dddc1f7d3aea6375bf11efdc3a75db97db8bebe8de84d39424f209d931",
      })
    );
    state = !state;
  };

  setInterval(handler, 10000);
  handler();
});

_client.connect("ws://localhost:7000/v1/ws", null);
