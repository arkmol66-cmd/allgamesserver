// Demo JavaScript para simular funcionalidade do ALL GAMES Server
class AllGamesDemo {
    constructor() {
        this.players = [];
        this.servers = [];
        this.isConnected = false;
        this.currentUsername = '';
        
        this.initializeElements();
        this.bindEvents();
        this.startDemo();
    }

    initializeElements() {
        this.usernameInput = document.getElementById('usernameInput');
        this.connectBtn = document.getElementById('connectBtn');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.onlineCount = document.getElementById('onlineCount');
        this.serverCount = document.getElementById('serverCount');
        this.playersList = document.getElementById('playersList');
        this.serversList = document.getElementById('serversList');
    }

    bindEvents() {
        this.connectBtn.addEventListener('click', () => this.toggleConnection());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    startDemo() {
        // Adicionar alguns jogadores demo
        setTimeout(() => {
            this.addDemoPlayer('GameMaster');
        }, 2000);
        
        setTimeout(() => {
            this.addDemoPlayer('ProGamer123');
        }, 4000);
        
        setTimeout(() => {
            this.addDemoPlayer('NoobSlayer');
        }, 6000);
    }

    addDemoPlayer(username) {
        const player = {
            id: Date.now() + Math.random(),
            username: username,
            serverName: `ALL GAMES - ${username}`,
            connectedAt: new Date(),
            isDemo: true
        };

        const server = {
            id: Date.now() + Math.random(),
            name: player.serverName,
            ip: this.generateRandomIP(),
            port: this.generateRandomPort(),
            owner: username,
            players: 1,
            maxPlayers: 100
        };

        this.players.push(player);
        this.servers.push(server);
        
        this.updateUI();
        this.addChatMessage('Sistema', `${username} entrou no servidor`, true);
    }

    toggleConnection() {
        if (!this.isConnected) {
            this.connect();
        } else {
            this.disconnect();
        }
    }

    connect() {
        const username = this.usernameInput.value.trim();
        if (!username) {
            this.showStatus('Por favor, digite um nome de usuário', 'danger');
            return;
        }

        // Simular conexão
        this.currentUsername = username;
        this.isConnected = true;
        
        const player = {
            id: Date.now(),
            username: username,
            serverName: `ALL GAMES - ${username}`,
            connectedAt: new Date(),
            isDemo: false
        };

        const server = {
            id: Date.now(),
            name: player.serverName,
            ip: this.generateRandomIP(),
            port: this.generateRandomPort(),
            owner: username,
            players: 1,
            maxPlayers: 100
        };

        this.players.push(player);
        this.servers.push(server);

        this.showStatus(`Conectado como ${player.serverName}`, 'success');
        this.updateConnectionUI();
        this.updateUI();
        this.addChatMessage('Sistema', `Bem-vindo ao ALL GAMES Server, ${username}!`, true);
    }

    disconnect() {
        if (!this.isConnected) return;

        // Remover jogador atual
        this.players = this.players.filter(p => p.username !== this.currentUsername);
        this.servers = this.servers.filter(s => s.owner !== this.currentUsername);

        this.isConnected = false;
        this.currentUsername = '';
        
        this.showStatus('Desconectado do servidor', 'info');
        this.updateConnectionUI();
        this.updateUI();
        this.addChatMessage('Sistema', 'Você saiu do servidor', true);
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.isConnected) return;

        this.addChatMessage(this.currentUsername, message);
        this.messageInput.value = '';

        // Simular resposta automática ocasional
        if (Math.random() < 0.3) {
            setTimeout(() => {
                const responses = [
                    'Legal!',
                    'Concordo!',
                    'Vamos jogar!',
                    'Que servidor massa!',
                    'ALL GAMES é o melhor!'
                ];
                const randomPlayer = this.players.filter(p => p.isDemo)[Math.floor(Math.random() * this.players.filter(p => p.isDemo).length)];
                if (randomPlayer) {
                    this.addChatMessage(randomPlayer.username, responses[Math.floor(Math.random() * responses.length)]);
                }
            }, 1000 + Math.random() * 3000);
        }
    }

    updateConnectionUI() {
        if (this.isConnected) {
            this.connectBtn.textContent = 'Desconectar';
            this.connectBtn.className = 'btn btn-danger';
            this.usernameInput.disabled = true;
            this.messageInput.disabled = false;
            this.sendBtn.disabled = false;
        } else {
            this.connectBtn.innerHTML = '<i class="fas fa-plug me-1"></i>Conectar';
            this.connectBtn.className = 'btn btn-primary';
            this.usernameInput.disabled = false;
            this.messageInput.disabled = true;
            this.sendBtn.disabled = true;
        }
    }

    updateUI() {
        // Atualizar contadores
        this.onlineCount.textContent = this.players.length;
        this.serverCount.textContent = this.servers.length;

        // Atualizar lista de jogadores
        if (this.players.length === 0) {
            this.playersList.innerHTML = '<div class="text-muted">Nenhum jogador online</div>';
        } else {
            this.playersList.innerHTML = this.players.map(player => `
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-user-circle me-2 ${player.isDemo ? 'text-info' : 'text-success'}"></i>
                    <div>
                        <div class="fw-bold">${player.username}</div>
                        <small class="text-muted">${player.serverName}</small>
                    </div>
                </div>
            `).join('');
        }

        // Atualizar lista de servidores
        if (this.servers.length === 0) {
            this.serversList.innerHTML = '<div class="text-muted">Nenhum servidor ativo</div>';
        } else {
            this.serversList.innerHTML = this.servers.map(server => `
                <div class="card server-card mb-2 bg-dark bg-opacity-50">
                    <div class="card-body p-3">
                        <h6 class="card-title">${server.name}</h6>
                        <small class="text-muted">
                            <i class="fas fa-network-wired me-1"></i>${server.ip}:${server.port}<br>
                            <i class="fas fa-users me-1"></i>${server.players}/${server.maxPlayers} jogadores<br>
                            <span class="text-success">
                                <i class="fas fa-circle me-1"></i>Online
                            </span>
                        </small>
                    </div>
                </div>
            `).join('');
        }
    }

    addChatMessage(username, message, isSystem = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-2';
        
        if (isSystem) {
            messageDiv.innerHTML = `<small class="text-warning"><i class="fas fa-info-circle me-1"></i>${message}</small>`;
        } else {
            messageDiv.innerHTML = `
                <strong class="text-info">${username}:</strong>
                <span class="ms-2">${message}</span>
                <small class="text-muted ms-2">${new Date().toLocaleTimeString()}</small>
            `;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showStatus(message, type) {
        this.connectionStatus.className = `alert alert-${type}`;
        this.connectionStatus.textContent = message;
        this.connectionStatus.classList.remove('d-none');
        
        setTimeout(() => {
            this.connectionStatus.classList.add('d-none');
        }, 5000);
    }

    generateRandomIP() {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    generateRandomPort() {
        return Math.floor(Math.random() * 10000) + 50000;
    }
}

// Inicializar demo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AllGamesDemo();
});
