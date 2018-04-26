/*
    rps.js by Bill Weinman  <http://bw.org/contact/>
    created 2011-07-12
    updated 2012-07-28
    Copyright (c) 2011-2012 The BearHeart Group, LLC
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such. 
*/

var dndSupported; //Grava se o browser permite a funcionalidade "Drag and drop"
var dndEls = new Array(); //Array que guarda os elementos que podem ser arrastados (rock,paper,scissors)
var draggingElement; // Elemento que está a ser arrastado
var winners = { // Lógica do jogo ex. Rock ganha a Paper
    Rock: 'Paper',
    Paper: 'Scissors',
    Scissors: 'Rock'
};

var hoverBorderStyle = '2px dashed #999'; //Estilo do elemento quando hovered
var normalBorderStyle = '2px solid white'; //Estilo do elemento normalmente

//Deteta se o browser permite o "Drag and drop"
function detectDragAndDrop() {
	//Funcionamento especial para o internet explorer
    if (navigator.appName == 'Microsoft Internet Explorer') { 
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat( RegExp.$1 );
            if(rv >= 6.0) return true;
            }
        return false;
    }
	//Caso seja arrastável, return true, ou seja, o browser permite o "Drag and drop"
    if ('draggable' in document.createElement('span')) return true; 
    return false; //Caso contrário return false
}

// DnD support

//É um evento
//Controla os elementos quando começam a ser arrastados
function handleDragStart(e) {
    var rpsType = getRPSType(this); //Tipo do elemento ex. Rock, Paper ou Scissors
    draggingElement = this; //Grava este elemento na variável draggingE
    draggingElement.className = 'moving'; //Altera a classe do elemento
    statusMessage('Drag ' + rpsType); //Altera a mensagem do "game status"
    this.style.opacity = '0.4'; //Altera a opacidade do border do elemento
    this.style.border = hoverBorderStyle; //Altera o border do elemento
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // set the drag image

}

//Controla os elementos quando deixam de ser arrastados
function handleDragEnd(e) {
    this.style.opacity = '1.0'; //Altera a opacidade do border
    // reset ao estilo do elemento
    draggingElement.className = undefined; //Reset dos estilos css
    draggingElement = undefined; //Reset dos estilos css

    // reset a todos os elementos
    for(var i = 0; i < dndEls.length; i++) {
        dndEls[i].style.border = normalBorderStyle; //Altera a border dos elementos
    }
}

//Controla o elemento quando está a ser arrastado em cima de outro elemento
//Está sempre a ser executado (50ms a 1ms) quando a condição de cima é válida
function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle; //Altera a border do elemento

    return false;   // some browsers may need this to prevent default action
}

//Controla o elemento quando está a ser arrastado em cima de outro
//Ao contrário do handleDragOver(), apenas é executado uma vez por cada vez que a condição é verdadeira
function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement)    + ' over ' + getRPSType(this)); //Altera a mensagem do "game status"
    this.style.border = hoverBorderStyle; //Altera a border do elemento
}

//Controla o elemento quando deixa de estar a ser arrastado em cima de outro elemento
function handleDragLeave(e) {
    this.style.border = normalBorderStyle; //Altera a border do elemento
}

//Controla os elementos arrastados quando são largados em cima de outros elementos
function handleDrop(e) {
    if(e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return; //Caso o elemento que ativou o evento seja o mesmo que estava a ser arrastado sair
    else isWinner(this, draggingElement); //Verifica se ganhou o jogo
}

// utility functions
//Verifica se ganhou ou perdeu o jogo
function isWinner(under, over) {
    var underType = getRPSType(under); //Elemento que está em baixo
    var overType = getRPSType(over); //Elemento que está em cima
    if(overType == winners[underType]) { //Verifica se o elemento que está em cima ganha ao elemento que está em baixo
        statusMessage(overType + ' beats ' + underType); //Altera a mensagem do "game status"
        swapRPS(under, over); //Altera as imagens
    } else { //Caso contrário
        statusMessage(overType + ' does not beat ' + underType); //Altera a mensagem do "game status"
    }
}

//Retorna o footer (legenda) do objeto ex. Rock
function getRPSFooter(e) {
    var children = e.childNodes;
	
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

//Retorna a imagem do objeto
function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}

//Retorna o tipo do objeto
function getRPSType(e) {
	//O tipo é obtido através do "footer" da imagem ex. Rock
    var footer = getRPSFooter(e); //Verifica se possui footer
    if(footer) return footer.innerHTML; //Caso possua, devolver o footer.innerHTML
    else return undefined; //Caso contrário devolve undefined
}

//Troca as imagens de lugar
function swapRPS(a, b) {
	//Cria um objeto holding com as propriedades dos dois elementos
    var holding = Object();

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);
	
	//Altera as imagens com as propriedades do objeto holding
    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}

// Utility functions

//Variável que grava o estado do elemento
var elStatus;

//Retorna o elemento a partir do ID
function element(id) { 
return document.getElementById(id); }


//Controla o "game status" 
function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// App lifetime support

//Inicialização do jogo
function init() {
	//Caso o browser suporte a funcionalidade "Drag and drop"
    if((dndSupported = detectDragAndDrop())) {
		//Define o "game status" inicial
        statusMessage('Using HTML5 Drag and Drop'); //Altera a mensagem do "game status"
		//Cria os 3 elementos (Rock Paper Scissors)
        dndEls.push(element('rps1'), element('rps2'), element('rps3'));
		//Adiciona eventos aos elementos
        for(var i = 0; i < dndEls.length; i++) {
			//Todos os casos são semelhantes.
			//dndEls[i] devolve o elemento ex. rps1, rps2 ou rps3
			//addEventListener(event, function, useCapture)
			//A função "function" é executada quando o evento "event" ocorrer no elemento "dnsEls[i]"
			
			
			//Diferentes eventos
			//Retirado do site: https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
			
			//dragstart - This event is fired when the user starts dragging an element or text selection.
			//dragend - This event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).
			//dragover - This event is fired continuously when an element or text selection is being dragged and the mouse pointer is over
			//a valid drop target
			//dragenter - This event is fired when a dragged element or text selection enters a valid drop target.
			//dragleave - This event is fired when a dragged element or text selection leaves a valid drop target.
			//drop - This event is fired when an element or text selection is dropped on a valid drop target.
			
            dndEls[i].addEventListener('dragstart', handleDragStart, false);
            dndEls[i].addEventListener('dragend', handleDragEnd, false);
            dndEls[i].addEventListener('dragover', handleDragOver, false);
            dndEls[i].addEventListener('dragenter', handleDragEnter, false);
            dndEls[i].addEventListener('dragleave', handleDragLeave, false);
            dndEls[i].addEventListener('drop', handleDrop, false);
        }
	//Caso contrário
    } else {
        statusMessage('This browser does not support Drag and Drop'); //Altera a mensagem do "game status"
    }
}

//Assim que a página carregar executar a função init
window.onload = init;