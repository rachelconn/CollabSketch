# About
This is a web app that allows users to collaboratively draw using WebSockets for communication.
You can switch to the brush tool by pressing 1, and the eraser tool by pressing 2.

# Server Setup
Before clients will be able to connect, you must host the provided WebSocket server.
This can be done with the following steps:
- Install python 3.6 or higher (this was tested with 3.8.5)
- Use a virtual environment if you want, and run `pip install websocketserver/requirements.txt`.
- Run the server with `websocketserver/run_sketch_server.py`.

# Client Setup
This project uses npm for dependency management, follow these steps:
- Run `cd src`
- Run `npm i`
- Run `npm run build` to build for production, or `npm run dev` to make a development build.
- Open `index.html`. As long as the sketch server is running, you should be able to share drawings
between clients on different tabs, browsers, and computers.
