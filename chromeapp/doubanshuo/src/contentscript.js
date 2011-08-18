(function () {
    var container = document.querySelector('#profile .user-opt'), button,
	people, port = null, lock = false, lastTime = +new Date(),
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
	    document.getElementById('close').addEventListener('click', function () {
		chatWindow.style.display = 'none';
		//port.postMessage({cmd: 'receivestop', people: people});
		port.disconnect();
		port = null;
	    }, false);
	    textbox.addEventListener('keyup', send, false);
	    msgList.addEventListener('scroll', function () {
		this.scrollTop = this.scrollHeight;
	    }, false);

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
		    msgList.querySelector('div:last-of-type').appendChild(createCaptcha());
		}
	    }
	    else if (msg.cmd === 'received') {
		if (+new Date(msg.timestamp) > lastTime && people === msg.people) {
		    var item = document.createElement('div');
		    item.innerHTML = '<strong>' + document.querySelector('title').innerHTML.trim() + '说</strong>: ' + msg.content;
		    msgList.appendChild(item);
		    lock = false;
		}
	    }
	});
    }

    function createChatWindow() {
	var aside = document.createElement('aside');
	aside.id = 'dchat';
	aside.innerHTML = '<header><h1></h1><div><img id="close" /></div></header><section><div></div><div><form> <textarea id="" name="" rows="10" cols="30"></textarea></form></div></section>';
	aside.style.top = window.innerHeight - 255 + 'px';
	document.body.appendChild(aside);
	document.getElementById('close').src = drawClose();
	aside.querySelector('h1').innerHTML = document.querySelector('title').innerHTML.trim();
	return aside;
    }

    function createCaptcha() {
	var div = document.createElement('div'), p, img;
	p = document.createElement('p');
	p.innerHTML = '发送太快了亲，输入验证码';
	img = document.createElement('img');
	img.src = /captcha_url=(.+)$/.exec(msg.captcha);//=(.+?)&amp;
	div.appendChild(p);
	div.appendChild(img);
	return div;
    }

    function send(e) {
	if (e.keyCode !== 13) {return;}
	if (lock) {
	    var log = document.createElement('p');
	    log.innerHTML = '别着急, 先等回复啊亲';
	    msgList.querySelector('div:last-of-type').appendChild(log);
	}
	else {
	    lock = true;
	    var item = document.createElement('div');
	    item.innerHTML = '<strong>我说</strong>: ' + this.value;
	    msgList.appendChild(item);
	    port.postMessage({cmd: 'send', content: this.value, people: people});
	    this.value = '';
	    lastTime = +new Date();
	}
	e.preventDefault();
	return false;
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
    
})();
