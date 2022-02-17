const vel = 1;

var vel1 = vel2 = 0; // Velocidade eixo x && Velocidade eixo y
var pos1 = 7; //Eixo X
var pos2 = 7; //Eixo y
var tamanho = 60; // Tamanho da Slime
var area = 15; // Tamanho da Arena
var posazul1 = posazul2 = Math.floor(Math.random()*area); // Posição ponto azul
var rastro = [];
var rabo = 1;
var pontuacao = 0;
var estadoatual;
var estados = {
    jogar: 0,
    jogando: 1,
}
var dificuldade = ['  Fácil','Normal',' Difícil', 'Insano'];
var escolhedificuldade = 0;
var modo = ['Normal','Slime Maluca','Chave'];
var tamanhomapa = ['Normal','Grande'];
var escolhetamanho = 0;
var escolhemodo = 0;
var seta = 0;
var seta1 = 0;
var pisca;

chave = { // Funções da Chave

    x: Math.floor(Math.random()*area),
    y: Math.floor(Math.random()*area),

    gerar: function(){ // Desenhar Chave
        contexto.fillStyle = "gold";
        contexto.fillRect(this.x*tamanho, this.y*tamanho, tamanho, tamanho);
    },

    ajustar: function(){ // Função para caso a chave saia da arena
        if (this.x < 0){
            this.x = Math.floor(Math.random()*area);
            this.y = Math.floor(Math.random()*area);
        }
        else if (this.x > area-1){
            this.x = Math.floor(Math.random()*area);
            this.y = Math.floor(Math.random()*area);
        }
        else if (this.y < 0){
            this.x = Math.floor(Math.random()*area);
            this.y = Math.floor(Math.random()*area);
        }
        else if (this.y > area-1){
            this.x = Math.floor(Math.random()*area);
            this.y = Math.floor(Math.random()*area);
        }
    },

    empurar: function(){ // Função para empurar a chave
        if(pos1 == chave.x && pos2 == chave.y && vel1 == vel){
            chave.x += 1;
        }
        else if(pos1 == chave.x && pos2 == chave.y && vel1 == -vel){
            chave.x -= 1;
        }
        else if(pos1 == chave.x && pos2 == chave.y && vel2 == vel){
            chave.y +=1;
        }
        else if(pos1 == chave.x && pos2 == chave.y && vel2 == -vel){
            chave.y -=1;
        }
    },

    reiniciar: function(){ // Função para recolocar a chave
        this.x = 1 + Math.floor(Math.random()*area-2);
        this.y = 1 + Math.floor(Math.random()*area-2);
    }
};

slime = { // Funções da Slime
    
    gerar: function(){ // Funcão do para gerar o jogo
        pos1 += vel1;
        pos2 += vel2;
        if(escolhedificuldade < 2){
            chave.ajustar();
            if (pos1 < 0){
                pos1 = area-1;
            }
            else if (pos1 > area-1){
                pos1 = 0;
            }
            else if (pos2 < 0){
                pos2 = area-1;
            }
            else if (pos2 > area-1){
                pos2 = 0;
            }
        }
        else{
            chave.ajustar();
            if (pos1 < 0){
                slime.reiniciar();
            }
            else if (pos1 > area-1){
                slime.reiniciar();
            }
            else if (pos2 < 0){
                slime.reiniciar();
            }
            else if (pos2 > area-1){
                slime.reiniciar();
            }
        }
        if(escolhemodo==2 || escolhedificuldade == 3){
            chave.gerar();
            contexto.fillStyle = "chocolate";
            contexto.fillRect(posazul1*tamanho, posazul2*tamanho, tamanho,tamanho);
        }
        else{
            contexto.fillStyle = "cyan";
            contexto.fillRect(posazul1*tamanho, posazul2*tamanho, tamanho,tamanho);
        }
        contexto.fillStyle = "lime";
        for (var i = 0; i < rastro.length; i++){
            contexto.fillRect(rastro[i].x*tamanho, rastro[i].y*tamanho, tamanho-1, tamanho-1);
            if(vel1 != 0 || vel2 != 0){
            if (escolhedificuldade != 0 && rastro[i].x == pos1 && rastro[i].y == pos2){
                slime.reiniciar();
                }
            }
        }
        
        chave.empurar();

        rastro.push({x:pos1,y:pos2 })
        while (rastro.length > rabo){
            rastro.shift();
        }

        if (posazul1==pos1 && posazul2==pos2 && escolhemodo != 2 && escolhedificuldade < 3){
            rabo++;
            pontuacao++;
            posazul1 = Math.floor(Math.random()*area);
            posazul2 = Math.floor(Math.random()*area);
            if(escolhemodo==1){
                slime.teleporta();
            }
        }
        else if(chave.x == posazul1 && chave.y == posazul2 && escolhemodo==2 && escolhedificuldade < 3){
            rabo++;
            pontuacao++;
            chave.reiniciar();
            posazul1 = Math.floor(Math.random()*area);
            posazul2 = Math.floor(Math.random()*area);
        }
        else if(escolhedificuldade == 3 && chave.x == posazul1 && chave.y == posazul2){
            rabo++;
            pontuacao++;
            chave.reiniciar();
            posazul1 = Math.floor(Math.random()*area);
            posazul2 = Math.floor(Math.random()*area);
            slime.teleporta();
        }
    },

    reiniciar: function(){ // Função para quando o jogador perder
        vel1 = vel2 = 0
        rabo=1;
        pos1=7;
        pos2=7;
        pontuacao=0;
        estadoatual=estados.jogar;
    },

    teleporta: function(){ // Função para transportar a Slime para um ponto aleatório na arena
        pos1 = 5 + Math.floor(Math.random()*area-10);
        pos2 = 5 + Math.floor(Math.random()*area-10);
    }
};

function comandos(evento){ // Comandos do jogo

    if(estadoatual==estados.jogando){ // Dentro do jogo
        switch (evento.keyCode) {
            case 65: // Esquerda
                if (vel1==vel){
                    break;
                }
                else if (vel1!=vel){
                    vel1 = -vel;
                    vel2 = 0;
                    break;
                }
            case 87: // Cima
                if (vel2==vel){
                    break;
                }
                else if (vel2!=vel){
                    vel1 = 0;
                    vel2 = -vel;
                    break;
                }
            case 68: // Direita
                if (vel1==-vel){
                    break;
                }
                else if(vel1!=-vel){
                    vel1 = vel;
                    vel2 = 0;
                    break;
                } 
            case 83: // Baixo
                if(vel2==-vel){
                    break;
                }
                else if(vel2!=-vel){
                    vel1 = 0;
                    vel2 = vel;
                    break;
                }
            default:
                break;
            }
        }
    else if (estadoatual == estados.jogar){ // Menu
        if(evento.keyCode == 39){
            if(seta==0){
                if(escolhedificuldade < 3){
                    escolhedificuldade++;
                }
            }
            else if(seta==55){
                if(escolhemodo < 2){
                    escolhemodo++;
                }
            }
            else if(seta==110){
                if(escolhetamanho < 1){
                    escolhetamanho++;
                }
            }
        }
        else if(evento.keyCode == 37){
            if(seta==0){
                if(escolhedificuldade > 0){
                    escolhedificuldade--;
                }
            }
            else if(seta==55){
                if(escolhemodo > 0){
                    escolhemodo--;
                }
            }
            else if(seta==110){
                if(escolhetamanho > 0){
                    escolhetamanho--;
                }
            }
        }
        if(evento.keyCode == 40){
            if(seta1 < 2){
                seta1++;
                seta+=55;
            }
        }
        if(evento.keyCode == 38){
            if(seta1 > 0){
                seta1--;
                seta-=55;
            }
        }
        else if(evento.keyCode == 13){
            estadoatual = estados.jogando;
        }
    }
}

function jogo(){
    canvas = document.getElementById("canvas");
    contexto = canvas.getContext("2d");

    document.addEventListener("keydown", comandos);

    rodar();
    }

function rodar(){
    gerar();
    setInterval(gerar,60);
}

function gerar(){

    contexto.fillStyle = "#fff";
    contexto.font = "50px Arial";
    contexto.fillStyle = "grey";
    contexto.fillRect(0,0, canvas.width, canvas.height);
    contexto.fillStyle = "white"
    contexto.fillText(pontuacao, 430, 40);
    
    if(estadoatual==estados.jogar){
        contexto.fillStyle = "darkgreen";
        contexto.fillRect(200, 400, 500, 100);
        contexto.fillStyle = "white";
        contexto.fillText("Pressione Enter para jogar!", 200, 465, 500);
        contexto.fillText("Escolha a dificuldade", 225, 550, 450);
        contexto.fillText(dificuldade[escolhedificuldade], 362.5, 610, 175);
        contexto.fillText("Modo:", 300, 665, 500);
        contexto.fillText(modo[escolhemodo], 450, 665, 500);
        contexto.fillText("Mapa:", 300, 720, 500);
        contexto.fillText(tamanhomapa[escolhetamanho], 450, 720, 500);
        if(pisca>=0 && pisca<10){
            pisca = pisca + 1;
            contexto.fillText(">", 240, 610+seta);
        }
        else if(pisca>=10 && pisca<20){
            pisca = pisca + 1;
        }
        else{
            pisca = 0;
        }
    }
    
    if (estadoatual==estados.jogando){
        tamanho=60/(escolhetamanho+1);
        area=15*(escolhetamanho+1);
        slime.gerar();
    }
}

estadoatual=estados.jogar
jogo();