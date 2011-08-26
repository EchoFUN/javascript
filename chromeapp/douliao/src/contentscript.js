(function () {
    var container = document.querySelector('#profile .user-opt'), button,
    people, port = null, lock = false, msgRequreToken = null, lastTime = +new Date(),
    chatWindow, textbox, msgList;
    button = container.querySelector('a.mr5').cloneNode(false);
    button.innerHTML = '豆聊';
    button.style.marginLeft = '5px';
    container.insertBefore(button, document.getElementById('divac'));

    button.addEventListener('click', chatStart, false);



    function chatStart(e) {
        e.preventDefault();
        if (port !== null) {return;}
        if (!chatWindow) {
            chatWindow = createChatWindow();
            textbox = chatWindow.querySelector('textarea');
            msgList = chatWindow.querySelector('section>div');
            document.getElementById('close').addEventListener('click', function (e) {
                chatWindow.style.display = 'none';
                port.disconnect();
                port = null;
                e.stopPropagation();
            }, false);
            textbox.addEventListener('keyup', send, false);

            people = location.href.match(/\/([^\/]+)\/?$/)[1];
        }
        else {
            chatWindow.style.display = '';
        }

        port = chrome.extension.connect({name: 'dchat'});
        port.postMessage({cmd: 'receivestart', people: people});
        port.onMessage.addListener(function (msg) {
            if (msg.cmd === 'sended') {
                if (!msg.result) {
                    var captcha = addContent('<p>发送太快了亲，输入验证码</p><img src="' + msg.msg.captcha.string + '">');
                    msgRequreToken = msg.msg;
					msgRequreToken.captcha.dom = captcha;
                    lock = false;
					inputLock(textbox, false);
                }
            }
            else if (msg.cmd === 'received') {
                if (people === msg.people) {//+new Date(msg.timestamp) > lastTime && 
                    addContent('<strong>' + document.querySelector('title').innerHTML.trim() + '说</strong>: ' + msg.content);
                    lock = false;
					inputLock(textbox, false);
                }
            }
        });
    }

    function createChatWindow() {
        var aside = document.createElement('aside');
        aside.id = 'dchat';
        aside.innerHTML = '<header><h1></h1><div><img id="min" /><img id="close" /></div></header><section><div></div><div><form> <textarea id="" name="" rows="10" cols="30"></textarea></form></div></section>';
        document.body.appendChild(aside);
        document.getElementById('min').src = drawMin();
        document.getElementById('close').src = drawClose();
        aside.querySelector('h1').innerHTML = document.querySelector('title').innerHTML.trim();
        aside.querySelector('header').addEventListener('click', function () {
            var section = this.nextSibling;
            if (getComputedStyle(section, null).getPropertyValue('display') === 'block') {
                section.style.display = 'none';
            }
            else {
                section.style.display = 'block';
            }
        }, false);
        return aside;
    }

	function addContent(html) {
		var div = document.createElement('div'), scrollHeight = msgList.scrollHeight;
		div.innerHTML = html;
		msgList.appendChild(div);
		if (div.getElementsByTagName('img').length > 0) {
			scrollHeight += 41;
		}
		msgList.scrollTop = scrollHeight;
		return div;
	}

	function inputLock(textbox, status) {
		textbox.disabled = status;
		textbox.style.backgroundColor = status ? '#ddd' : '#fff';
		textbox.value = status ? '先等回复啊亲' : '';
	}

    function send(e) {
        if (e.keyCode === 13 && !lock && this.value.trim() !== '') {
            lock = true;
            if (msgRequreToken) {
                var self = this;
                port.postMessage({cmd: 'send', content: msgRequreToken.content, people: msgRequreToken.people, captcha: {token: msgRequreToken.captcha.token, string: self.value}});
				msgList.removeChild(msgRequreToken.captcha.dom);
				msgRequreToken = null;
            }
            else {
                addContent('<strong>我说</strong>: ' + this.value);
                port.postMessage({cmd: 'send', content: this.value, people: people});
            }

            this.value = '';
			inputLock(textbox, true);
            lastTime = +new Date();
			e.preventDefault();
			return false;
        }
    }

    function drawClose() {
        var canvas = document.createElement('canvas'), ctx;
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#0C7823';
        ctx.beginPath();
        ctx.moveTo(5,5);
        ctx.lineTo(95, 95);
        ctx.moveTo(95, 5);
        ctx.lineTo(5, 95);
        ctx.stroke();
        return canvas.toDataURL();
    }

    function drawMin() {
        var canvas = document.createElement('canvas'), ctx;
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#0C7823';
        ctx.beginPath();
        ctx.moveTo(5,85);
        ctx.lineTo(95, 85);
        ctx.stroke();
        return canvas.toDataURL();
    }

})();
