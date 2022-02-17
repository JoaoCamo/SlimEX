var imagensdojogo;
var contexto;
var altura;
var largura;
var velocidade = 5;
var maxPulos = 1;
var estadoatual;
var estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2,

}
var dificuldade = ['Fácil','Normal','Difícil','Muito difícil','💀 Floresta da Morte 💀'];
var escolhedificuldade = 0;
var velocidadedadificuldade;
var pisca;

fundo = {

    y: 0,
    x: 0,

    atualiza: function(){ // Função para atualizar o fundo
        this.x -= velocidade;
        if(this.x <= -1344){
            this.x = 0;

        }

    },

    gerar: function(){ // Desenhar o fundo
        fundodojogo.desenharsprite(this.x, this.y);
        fundodojogo.desenharsprite(this.x + fundodojogo.largura, this.y);

    }

},

chao = {

    y: 674,
    x: 0,

    atualiza: function(){ // Função para atualizar o chão
        this.x -= velocidade;
        if (this.x <= -1344){
            this.x = 0;

        }
    },

    gerar: function(){ // Desenhar chão

        spritechao.desenharsprite(this.x, this.y);
        spritechao.desenharsprite(this.x + spritechao.largura, this.y);
    }

},

slime = {

    x: 50,
    y: 0,
    altura_slime: 50,
    largura_slime: 50,
    pontuacao: 0,
    gravidade: 0.75,
    velocidade: 0,
    alturadopulo: 20,
    qntpulos: 0,

    atualiza: function(){ // Gravidade e limite de pulos
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > chao.y - this.altura_slime && estadoatual != estados.perdeu){
            this.y = chao.y - this.altura_slime;
            this.qntpulos = 0;
            this.velocidade = 0;
        }
    },

    pula: function(){ // Função para pular
        if (this.qntpulos < maxPulos){
        this.velocidade = -this.alturadopulo;
        this.qntpulos++;
        }
    },

    reiniciar: function(){ // Função para quando o jogador perder
        slime.velocidade = 0;
        slime.y = 0;
        slime.pontuacao = 0;
    },

    gerar: function(){ // Desenhar Slime
        spritepersonagem.desenharsprite(this.x, this.y);
    }

},

    obstaculo = {

        objetos: [],
        spritesobstaculos: [spritetronco1, spritetronco2],
        tempoparacolocar: 0,

        colocar: function(){ // Função para inserir os obstaculos

                x = largura;
                larguraB = 45;
                escolhetronco = this.spritesobstaculos[Math.floor(this.spritesobstaculos.length*Math.random())];
                if (escolhetronco == spritetronco1){
                    y = chao.y - 54;
                }
                else{
                    y = chao.y - 91;
                }



            this.objetos.push({
                x,
                larguraB,
                escolhetronco,
                y
            });

            this.tempoparacolocar = 60 + Math.floor(40*Math.random());

        },

        atualiza: function(){ // Função para atualizar os obstaculos, colisão e pontuação
            if(this.tempoparacolocar == 0){
                this.colocar();
            }
            else
                this.tempoparacolocar--;

            for (var i = 0, tam = this.objetos.length; i < tam; i++){
                var obs = this.objetos[i];

                obs.x -= velocidade;

            if (slime.x < obs.x + obs.larguraB && slime.x + slime.largura_slime >= obs.x && slime.y + slime.altura_slime >= obs.y){
                estadoatual = estados.perdeu;
            }

            else if (obs.x == 0){
                slime.pontuacao++;

            }

            else if (obs.x <= -obs.larguraB){
                this.objetos.splice(i, 1);
                tam--;
                i--;
                }
            
            }

        },

        limpa: function(){ // Função para remover os obstaculos
            this.objetos = [];
        },

        gerar: function(){ // Função para desenhar os obstaculos
            for (var i = 0, tam = this.objetos.length; i < tam; i++){
                var obs = this.objetos[i];
                
                obs.escolhetronco.desenharsprite(obs.x, obs.y);

            }

        }

};

function comandos(evento){ // Comandos do jogo
    
    if (estadoatual == estados.jogando){ // Dentro do jogo
        if(evento.keyCode == 87){
                slime.pula();
        }
    }
    else if (estadoatual == estados.jogar){ // Menu
        if(evento.keyCode == 39){
            if(escolhedificuldade < 4){
                escolhedificuldade++;
            }
        }
        else if(evento.keyCode == 37){
            if(escolhedificuldade > 0){
                escolhedificuldade--;
            }
        }
        else if(evento.keyCode == 13){
            velocidadedadificuldade = 2.5*escolhedificuldade;
            velocidade = velocidade + velocidadedadificuldade;
            estadoatual = estados.jogando;
        }
    }
    else if (estadoatual == estados.perdeu){
        velocidade = 5; 
        estadoatual = estados.jogar
        obstaculo.limpa();
        slime.reiniciar();
    }
}
function jogo(){

    canvas = document.getElementById("canvas");
    largura = canvas.width;
    altura = canvas.height;
    contexto = canvas.getContext("2d");

    document.addEventListener("keydown", comandos);

    imagensdojogo = new Image();
    imagensdojogo.src = "assets/assets.png";

    rodar();
}
function rodar(){

    atualiza();
    gerar();

    window.requestAnimationFrame(rodar);

}
function atualiza(){
    
    fundo.atualiza();
    if (estadoatual == estados.jogando){
        obstaculo.atualiza();
    }
    chao.atualiza();
    slime.atualiza();
  
}
function gerar(){

    fundo.gerar();

    contexto.fillStyle = "#fff";
    contexto.font = "50px Arial";
    contexto.fillText("Pontuação:", 0, 40, 200);
    contexto.fillText(slime.pontuacao, 215, 45);

    if (estadoatual == estados.jogar){
        contexto.fillStyle = "#5353ec";
        contexto.fillRect(275, 307.5, 200, 100)
        contexto.fillStyle = "white";
        contexto.fillText("Pronto?", 295, 375,  160);
        contexto.fillStyle = "white";
        contexto.fillText("Escolha a dificuldade!", 175, 500, 400);
        if(escolhedificuldade == 4){
            contexto.fillStyle = "red"
        }
        contexto.fillText(dificuldade[escolhedificuldade], 175, 570, 400);
            if(pisca>=0 && pisca<10){
                pisca = pisca + 0.1;
                contexto.fillText("Aperte Enter para iniciar", 175, 640, 400)
            }
            else if(pisca>=10 && pisca<20){
                pisca = pisca + 0.1
            }
            else{
                pisca = 0;
            }
    }
    else if (estadoatual == estados.perdeu){
        contexto.fillStyle = "red";
        contexto.fillRect(270, 307.5, 200, 100);
        contexto.fillStyle = "black";
        contexto.fillText("Perdeu!", 290, 375,  160);
        contexto.fillStyle = "white";
        contexto.fillText("Pressione qualquer tecla para reiniciar!", 175, 500,  400);
    }
    else if (estadoatual == estados.jogando){
        obstaculo.gerar();
    }

    chao.gerar();
    slime.gerar();
}

estadoatual = estados.jogar;
jogo();