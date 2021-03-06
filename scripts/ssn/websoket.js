define(function(require, exports, module) {
  var Guid = require('guid');
  var type = ({}).toString;
  webSocket = function(url) {
    return new webSocket.fn.init(url);
  };
  webSocket.fn = webSocket.prototype = {
    __url : null,//websocket地址
    __webSocket : null,//websocket对象
    __shuttleCache: {},//websocket双工缓存
    __readyStateCallbackCache: [],//websocket [open]时发送之前未发送且缓存的消息
    __eventListenerCache:[],//websocket 监听的事件
    __sendMessage: function(message) {//向server发送消息
      if (this.__webSocket.readyState === 1) {
        this.__webSocket.send(message);
      } else {
        this.__readyStateCallbackCache.push(message);//websoket还未open，把要发送的消息先缓存起来，等open后执行
      }
    },
    __invokeReadyStatusCallback : function() {//invoke未发送的消息
      while (this.__readyStateCallbackCache[0]) {
        this.__webSocket.send(this.__readyStateCallbackCache.pop());
      }
      this.__webSocket.removeEventListener("open", this.__invokeReadyStatusCallback);//发送完缓存消息后移除事件
    },
    __message : function(evt) {
      try {
        var message = JSON.parse(evt.data);
        if (message && message.Status && message.Status.ACK === 1) {
          this.onServerError && this.onServerError(evt);
        }
        var callbacks = this.__shuttleCache[message.ID];
        if (message.Type !== 2) {
          //双工消息，消息返回就删除，单工（服务端事件）不删除
          delete this.__shuttleCache[message.ID];
        }
        if (type.call(callbacks) === '[object Function]') {
          callbacks(message.Body, evt);
        } else if (type.call(callbacks) === '[object Array]') {
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](message.Body, evt);//执行回调
          }
        }
      } catch (ex) {
        console.dir(ex);
        this.onsimplex && this.onsimplex(evt);
      }
    },
    init: function(url) {//初始化websocket
      __url = url;
      this.__webSocket = new window.WebSocket(__url);
      this.addEventListener('open', this.__invokeReadyStatusCallback.bind(this));
      this.addEventListener('message', this.__message.bind(this));
    },
    reConnection:function(callback){//重连接websocket
      var self = this;
      var timer = window.setInterval(function(){
        var oldSocket = self.__webSocket;
        self.__webSocket = new window.WebSocket(__url);
        //重新绑定事件
        var i,len;
        for (i = 0, len = self.__eventListenerCache.length; i < len; i++) {
          var cur = self.__eventListenerCache[i];
          if(cur){
            oldSocket.removeEventListener(cur.eventName, cur.callback);
            self.__webSocket.addEventListener(cur.eventName, cur.callback);
          }
        }
        oldSocket = null;
        var onceOpenCallback = function(){
          window.clearInterval(timer);
          self.__webSocket.removeEventListener('open', onceOpenCallback)
          callback();
        };
        callback && self.__webSocket.addEventListener('open', onceOpenCallback);
      },1000);
    },
    getReadyState:function(){//获取当前websocket状态
      if(this.__webSocket){
        return this.__webSocket.readyState;
      }
      return 0;
    },
    getUrl:function(){//获取当前websocket地址
      return __url;
    },
    getFailedConnected:function(isConnected){//获取当前websocket连接状态
      if(this.__webSocket){
        return this.__webSocket.FailedConnected;
      }
      return false;
    },
    setFailedConnected:function(isConnected){//设置当前websocket连接状态
      if(this.__webSocket){
        this.__webSocket.FailedConnected = isConnected;
      }
    },
    addMessageEvent: function(id, callback) {//增加双工消息
      this.__shuttleCache[id] = callback;
    },
    addEventListener:function(eventName, callback, capturing){//增加websocket监听事件
      this.__eventListenerCache.push({
        eventName:eventName,
        callback:callback
      });
      this.__webSocket.addEventListener(eventName, callback, capturing);
    },
    removeEventListener:function(eventName, callback){//移除websocket监听事件
      var i,len;
      if(!eventName){//clear all
        for (i = 0, len = this.__eventListenerCache.length; i < len; i++) {
          var cur = this.__eventListenerCache[i];
          if(cur){
            this.__webSocket.removeEventListener(cur.eventName, cur.callback);
          }
        }
        this.__eventListenerCache.length = 0;
      }
      else if(eventName&&!callback){ //clear eventName
        for (i = 0, len = this.__eventListenerCache.length; i < len; i++) {
          var cur = this.__eventListenerCache[i];
          if(cur.eventName === eventName){
            delete this.__eventListenerCache[i];
            this.__webSocket.removeEventListener(cur.eventName, cur.callback);
          }
        }
      }
      else{//remove special Listener
        for (i = 0, len = this.__eventListenerCache.length; i < len; i++) {
          var cur = this.__eventListenerCache[i];
          if(cur.eventName === eventName&&cur.callback === callback){
            delete this.__eventListenerCache[i];
            this.__webSocket.removeEventListener(eventName, callback);
            break;
          }
        }
      }
    },
    addEvent: function(eventName, callback) {//监听Server端事件
      if (!(this.__shuttleCache[eventName] && this.__shuttleCache[eventName].length)) {
        this.__shuttleCache[eventName] = [];
        this.__sendMessage(JSON.stringify({
          ID: Guid.raw(),
          Type: 2,
          Msg: {
            Name: "SessionHandler",
            Body: {
              EventType: 1,
              EventName: eventName
            }
          }
        }));
      }
      this.__shuttleCache[eventName].push(callback);
    },
    removeEvent: function(eventName, callback) {//移除Server端事件
      var events = this.__shuttleCache[eventName],
        len, i;
      if (!callback) { //removeAll
        events.length = 0;
      }
      if (events) {
        for (i = 0, len = events.length; i < len; i++) {
          if (callback === events[i]) {
            events.splice(i, 1);
            break;
          }
        }
      }
      if (!events || events.length === 0) {
        this.__sendMessage(JSON.stringify({
          ID: Guid.raw(),
          Type: 2,
          Msg: {
            Name: "SessionHandler",
            Body: {
              EventType: 2,
              EventName: eventName
            }
          }
        }));
      }
    },
    shuttle: function(message, callback) {//发送双工请求
      var id = Guid.raw();
      this.__shuttleCache[id] = callback;
      message = JSON.stringify({
        ID: id,
        Type: 1,
        Msg: message
      });
      this.__sendMessage(message);
    }
  };
  webSocket.fn.init.prototype = webSocket.fn;

  return webSocket;
});