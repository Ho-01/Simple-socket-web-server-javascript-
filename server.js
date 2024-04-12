const net = require('net');

// 기본 HTML 페이지
const defaultPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Web Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #825f60;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            margin: 0;
        }
        #responseContainer {
            text-align: center;
        }
        #responseText {
            color: black;
            font-size: 24px;
        }
        #responseText.red {
            color: red;
        }
        #centerbox {
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 20px;
            height: 40vh;
            width : 60vh;
        }
    </style>
</head>
<body>
    <div id="centerbox">
    <h1>Simple Web Server</h1>
    <h4>By 32190789 김승호</h4>
    <form id="userForm" action="/submit" method="post">
        <label for="userInput">Enter Text:</label><br>
        <input type="text" id="userInput" name="userInput"><br>
        <input type="submit" value="Submit">
    </form>
    <p id="response"></p> <!-- 응답을 표시할 곳 -->
    </div>
    <h6>cloud computing HW</h6>
    <script>
        // 폼 제출 이벤트 리스너
        document.getElementById('userForm').addEventListener('submit', function(event) {
            event.preventDefault(); // 기본 제출 이벤트 중지
            const userInput = document.getElementById('userInput').value; // 사용자 입력
            const xhr = new XMLHttpRequest(); // XMLHttpRequest 객체 생성
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // 서버로부터 받은 응답을 <p> 태그에 표시
                        document.getElementById('response').innerText = xhr.responseText;
                    } else {
                        // 오류 메시지 표시
                        document.getElementById('response').innerText = 'Error: ' + xhr.status;
                    }
                }
            };
            xhr.open('POST', '/submit', true); // POST 요청 설정
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('userInput=' + encodeURIComponent(userInput)); // 사용자 입력을 서버로 전송
        });
    </script>
</body>
</html>
`;

// 소켓 서버 생성
const server = net.createServer(socket => {
    socket.on('data', data => {
        const request = data.toString(); // 받은 요청을 문자열로 변환

        // HTTP GET 요청 처리
        if (request.startsWith('GET')) {
            // 기본 페이지 응답 전송
            const response = `HTTP/1.1 200 OK
Content-Type: text/html
Connection: close
${defaultPage}`;
            socket.write(response);
        }
        // HTTP POST 요청 처리
        else if (request.startsWith('POST')) {
            // 요청된 URL이 '/submit'인 경우 입력 받은 데이터를 응답으로 전송
            if (request.includes('/submit')) {
                // POST 요청에서 입력 받은 데이터 추출
                const userInput = decodeURIComponent(request.split('\r\n\r\n')[1].split('=')[1]);
                const responseText = `입력받은 텍스트 : ${userInput}`;

                // 응답 생성 및 전송
                const response = `${responseText}`;
                socket.write(response);
            }
        }

        // 소켓 연결 종료
        socket.end();
    });
});

// 80번 포트에서 서버 시작
server.listen(80, () => {
    console.log('Server is listening on port 80');
});
