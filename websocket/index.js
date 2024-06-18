const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });

// In-memory storage for users and their statuses
const users = {};
const selectedGifs = {};
let round = null; // Initialize round as null
let gameStatus = 'waiting'; // Initialize game status as 'waiting'
let phraseList = {};
let userWaitingVote = 0;

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      // Handle user joining
      const { pseudo } = data;
      // Set user status to 'connected' and save WebSocket connection
      users[pseudo] = { ws };
      broadcastUserList();
    } else if (data.type === 'startRound') {
      phrase = data.phrase;
      broadcastRound(phrase);
    }else if (data.type === 'updateGameStatus') {
        const { status, timestamp } = data;
        gameStatus = status;
        round = timestamp; 
        broadcastGameStatus(status, timestamp);
      }
    else if (data.type === 'userGifSelection') {
      const { pseudo, gifUrl } = data;
      selectedGifs[pseudo] = { gifUrl };
      broadcastSelectedGifs();
    }
    else if (data.type === 'gifVote') {
      const { pseudo, gifUrl } = data;
      if (!selectedGifs[gifUrl]) {
        selectedGifs[gifUrl] = 0;
      }
      selectedGifs[gifUrl]++;
      broadcastVotedGifs();
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Find and remove the disconnected user
    for (const user in users) {
      if (users[user].ws === ws) {
        // Set user status to 'disconnected' and remove cookie
        delete users[user];
        broadcastUserList();
        break;
      }
    }
  });
});
function broadcastUserList() {
  const userList = Object.keys(users).map((pseudo) => ({
    pseudo,
    status: users[pseudo].status,
  }));
  const message = JSON.stringify({ type: 'userList', users: userList });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
function broadcastGameStatus(status, timestamp) {
  const userList = Object.keys(users).map((pseudo) => ({
    pseudo,
    status: users[pseudo].status,
  }));
  const message = JSON.stringify({ type: 'gameStatus', gameStatus: status, timestamp: timestamp });

  wss.clients.forEach((client) => { 
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
function broadcastRound(phrase) {
  const selectedPhrase = null
  const userList = Object.keys(users).map((pseudo) => ({
    pseudo,
    status: users[pseudo].status,
  }));
  userWaitingVote ++;
  if (userList.length > userWaitingVote) {
    if (phraseList[phrase] === undefined) {
      phraseList[phrase] = 0;
    }

    phraseList[phrase] ++;
  }
  else {
    if (phraseList[phrase] === undefined) {
      phraseList[phrase] = 0;
    }
    phraseList[phrase]++;
    const message = JSON.stringify({ 
      type: 'roundUpdate', 
      users: userList,
      phrase:phraseList,
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
function broadcastSelectedGifs() {
  const message = JSON.stringify({ type: 'selectedGifs', selectedGifs });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
function broadcastVotedGifs() {
  const votes = Object.keys(selectedGifs).map(gifUrl => ({
    gifUrl,
    votes: selectedGifs[gifUrl],
  }));
  const message = JSON.stringify({ type: 'votes', votes });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


console.log('WebSocket server is running on ws://localhost:4000');