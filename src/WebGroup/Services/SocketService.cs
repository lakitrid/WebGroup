using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebGroup.Models;

namespace WebGroup.Services
{
    public class SocketService
    {
        private ConcurrentDictionary<Guid, SocketConnection> _connections;

        public SocketService()
        {
            this._connections = new ConcurrentDictionary<Guid, SocketConnection>();
        }

        public async Task Accept(WebSocket socket)
        {
            SocketConnection connection = new SocketConnection { Socket = socket };
            Guid connectionId = Guid.NewGuid();
            this._connections.TryAdd(connectionId, connection);

            while (socket.State == WebSocketState.Open)
            {
                var token = CancellationToken.None;
                var buffer = new ArraySegment<Byte>(new Byte[4096]);
                var bufferOut = new ArraySegment<Byte>(new Byte[4096]);

                // Below will wait for a request message.
                var received = await socket.ReceiveAsync(buffer, token);

                switch (received.MessageType)
                {
                    case WebSocketMessageType.Text:
                        string request = Encoding.UTF8.GetString(buffer.Array,
                                                              buffer.Offset,
                                                              buffer.Count);
                        await this.ManageMessage(request, socket);
                        break;
                }
            }

            this._connections.TryRemove(connectionId, out connection);
        }

        private async Task ManageMessage(string message, WebSocket socket)
        {
            StringReader reader = new StringReader(message);

            JsonSerializer serializer = JsonSerializer.Create();
            Message data = serializer.Deserialize<Message>(new JsonTextReader(reader));

            if (data != null)
            {
                switch (data.Action)
                {
                    case "sendMessage":
                        this.ManageSendMessage(data, socket);
                        break;
                    default:
                        break;
                }
            }
        }

        private void ManageSendMessage(Message data, WebSocket socket)
        {
            data.Action = "confirmMessage";

            this.Send(socket, data).Wait();

            this._connections.Where(e => e.Value.Socket != socket).ToList().ForEach(e =>
            {
                data.Action = "sendMessage";
                this.Send(e.Value.Socket, data).Wait();
            });
        }

        private string ParseObject<T>(T data)
        {
            StringWriter writer = new StringWriter();
            JsonSerializer serializer = JsonSerializer.Create();
            serializer.Serialize(new JsonTextWriter(writer), data);

            return writer.ToString();
        }

        private async Task Send(WebSocket socket, Message data)
        {
            if (socket.State == WebSocketState.Open)
            {
                string message = this.ParseObject(data);

                var token = CancellationToken.None;
                var type = WebSocketMessageType.Text;
                var toSend = Encoding.UTF8.GetBytes(message);
                var buffer = new ArraySegment<Byte>(toSend);
                await socket.SendAsync(buffer, type, true, token);
            }
        }
    }
}
