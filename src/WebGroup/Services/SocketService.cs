using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
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
                var bufferOut= new ArraySegment<Byte>(new Byte[4096]);

                // Below will wait for a request message.
                var received = await socket.ReceiveAsync(buffer, token);

                switch (received.MessageType)
                {
                    case WebSocketMessageType.Text:
                        var request = Encoding.UTF8.GetString(buffer.Array,
                                                              buffer.Offset,
                                                              buffer.Count);

                        await this.Send(socket);
                        break;
                }
            }
            
            this._connections.TryRemove(connectionId, out connection);
        }

        private async Task Send(WebSocket socket)
        {
            var token = CancellationToken.None;
            var type = WebSocketMessageType.Text;
            var data = Encoding.UTF8.GetBytes("{ \"result\": \"toto\" }");
            var buffer = new ArraySegment<Byte>(data);
            await socket.SendAsync(buffer, type, true, token);
        }
    }
}
