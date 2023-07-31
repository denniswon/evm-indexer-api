const { client } = require("websocket");

const _client = new client();

let state = true;

_client.on("connectFailed", (e) => {
  console.error(`[!] Failed to connect : ${e}`);
  process.exit(1);
});

// For listening to any event being emitted by any smart contract
_client.on("connect", (c) => {
  c.on("close", (d) => {
    console.log(`[!] Closed connection : ${d}`);
    process.exit(0);
  });

  c.on("message", (d) => {
    console.log(JSON.parse(d.utf8Data));
  });

  handler = (_) => {
    c.send(
      JSON.stringify({
        name: "event/*/*/*/*/*",
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
