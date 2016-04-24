﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Fleck;

namespace CEF.Lib.Helper
{
    public static class WebSocketHelper
    {
        public static int WebSocketPort 
        {
            get { return 8181; }
        }
        private static readonly Dictionary<Guid, IWebSocketConnection> AllSockets = new Dictionary<Guid, IWebSocketConnection>();

        public static void OpSocket<T>(Action<Dictionary<Guid, IWebSocketConnection>, T> handler, T data)
        {
            Monitor.Enter(AllSockets);
            handler(AllSockets, data);
            Monitor.Exit(AllSockets);
        }

        public static void OpSocket(Action<Dictionary<Guid, IWebSocketConnection>> handler)
        {
            Monitor.Enter(AllSockets);
            handler(AllSockets);
            Monitor.Exit(AllSockets);
        }

        private static WebSocketServer _server;
        static WebSocketHelper()
        {
            FleckLog.Level = LogLevel.Debug;
        }

        public static void Start()
        {
            _server = new WebSocketServer(WebSocketPort,"ws://0.0.0.0:0");
            _server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    OpSocket((map, skt) => map.Add(skt.ConnectionInfo.Id, skt), socket);
                };
                socket.OnClose = () =>
                {
                    OpSocket((map, skt) => map.Remove(skt.ConnectionInfo.Id), socket);
                };
                socket.OnMessage = message =>
                {
                    OnOnMessage(message,socket);
                };
                socket.OnError = exception =>
                {

                };
            });
        }

        public static void SendMessage(Guid socketId,string message)
        {
            OpSocket(sockets =>
            {
                if (sockets.ContainsKey(socketId))
                {
                    sockets[socketId].Send(message);
                }
            });
        }

        public static void Broadcast(string message)
        {
            AllSockets.Values.ForEachOfUnNone(socket => socket.Send(message));
        }

        public static event Action<string,IWebSocketConnection> OnMessage;

        public static void Stop()
        {
            if (_server != null)
            {
                _server.Dispose();
            }
        }


        private static void OnOnMessage(string message, IWebSocketConnection socket)
        {
            var handler = OnMessage;
            if (handler != null) handler(message, socket);
        }
    }
}
