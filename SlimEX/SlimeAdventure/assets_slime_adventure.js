function sprite(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;

    this.desenharsprite = function(xCanvas, yCanvas) {
        contexto.drawImage(imagensdojogo, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);

    }
}

var fundodojogo = new sprite(0, 0, 1344, 700);
var spritepersonagem = new sprite(1860, 66, 78, 57);
var spritechao = new sprite(2, 814, 1437, 77);
var spritetronco1 = new sprite(1875,322,45,54);
var spritetronco2 = new sprite(1871,171,45,91);