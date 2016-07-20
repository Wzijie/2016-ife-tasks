
/*
    监控js错误并上报
    wtser@sf.gg
 */
window.onerror = function(msg, url, line, col, error) {
  if (msg !== "Script error." && !url) {
    return true;
  }
  setTimeout(function() {
    var c, data, ext, f, match;
    data = {};
    col = col || (window.event && window.event.errorCharacter) || 0;
    data.userId = document.getElementById("SFUserId").getAttribute('value');
    data.url = url;
    data.line = line;
    data.col = col;
    data.msg = msg;
    data.targetUrl = location.href;
    if (!!error && !!error.stack) {
      data.msg = error.stack.toString();
    } else if (!!arguments.callee) {
      ext = [];
      f = arguments.callee.caller;
      c = 3;
      while (f && c > 0) {
        c = c - 1;
        ext.push(f.toString());
        if (f === f.caller) {
          break;
        }
        f = f.caller;
      }
      ext = ext.join(",");
      data.msg = ext || msg;
    }
    if (data.userId) {
      match = data.url.match(/\/\/[\s\S]*\//);
      if (!match) {
        return false;
      }
      if (match[0].search('segmentfault') !== -1 || match[0].search('sf-static') !== -1) {
        if (data.msg.search('https://segmentfault.com:7001/socket.io/socket.io.js') === -1) {
          console.warn(data);
          if ($) {
            return $.post('/api/log/frontend', data);
          }
        }
      }
    }
  }, 0);
  return false;
};
