import Layout from './layout';

const defaultOptions = {
    canvasSize: 270, //max 320,
    cellsEdge: 3,
    players: [{
        id:     'player-1',
        pseudo: 'Jane',
        color:  '#57c5ff'
    }, {
        id:     'player-2',
        pseudo: 'John',
        color:  '#ff3d5b'
    }]
};

export default class TicTacToe {

    constructor( { canvasSize = defaultOptions.canvasSize, cellsEdge = defaultOptions.cellsEdge, players = defaultOptions.players } = defaultOptions ) {
        this.layout = new Layout();

        this.cellsEdge = cellsEdge;
        this.canvasSize = canvasSize > 320 ? 320 : canvasSize;

        this.players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            this.players.push( Object.assign( {}, defaultOptions.players[ i ], players[ i ] ) );
        }

        this.canvas = document.querySelector( '.game-canvas' );
        this.ctx = this.canvas.getContext('2d');

        this.initGame();
    }

    initGame() {
        // Canvas size
        this.canvas.width = this.canvas.height = this.canvasSize;
        this.canvas.parentElement.style.width = this.canvas.parentElement.style.height = `${ this.canvasSize }px`;

        // Calculate cells sizes and coordinates
        this.initCellsSizes();


        // Grid colors for the beginning
        this.initCellsColors();

        // Players names and colors
        this.initPlayers();

        // Let's start with the first player in the list
        this.turnPlayerTo( this.players[ 0 ], true );
    }

    initCellsSizes() {
        const edge = Math.round( this.canvasSize / this.cellsEdge );

        this.cells = [];
        for ( let i = 0, l = Math.pow( this.cellsEdge, 2 ), row = 0, col; i < l; i++ ) {

            col = i % this.cellsEdge;

            this.cells.push({
                isActive: true,
                coordinates: [ edge * col, edge * row, edge, edge ],
            });

            row = col === this.cellsEdge - 1 ? row += 1 : row;

        }
    }

    initCellsColors() {
        this.cells.forEach( ( cell, i ) => {
            let color = '#fafafa';
            if ( i % 2 ) {
                color = '#eeeeee';
            }
            this.fillCell( color, cell.coordinates );
        });
    }

    initPlayers() {
        this.players.forEach( player => {
            const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
            const $name = $joystick.querySelector( '.name' );
            $name.firstChild.nodeValue = ` ${ player.pseudo }`;
            const symbol = document.createElement('i');
            symbol.style.width = '10px';
            symbol.style.height = '10px';
            symbol.style.display = 'inline-block';
            symbol.style.verticalAlign = 'middle';
            symbol.style.borderRadius = '5px';

            symbol.style.backgroundColor = player.color;
            $name.prepend(symbol);

            this.initJoystick( player.id, $joystick );
        });
    }

    initJoystick( playerId, container ) {
        // grid
        const grid = document.createElement( 'div' );
        grid.setAttribute( 'class', 'grid' );
        grid.style.setProperty( 'grid-template-columns', `repeat(${ this.cellsEdge }, 1fr)` );

        // buttons
        this.cells.forEach( ( cell, i ) => {
            const btn = document.createElement( 'a' );
            const icon = document.createElement( 'i' );
            btn.appendChild( icon );
            icon.setAttribute( 'class', 'material-icons grey-text text-darken-4' );
            icon.append( document.createTextNode( 'fiber_manual_record' ) );
            btn.setAttribute( 'class', 'btn waves-effect grey lighten-4' );
            btn.setAttribute( 'data-cell-index', i );
            btn.setAttribute( 'data-player-id', playerId );
            btn.addEventListener( 'click', this.onClick.bind( this ) );
            grid.appendChild( btn );
            return btn;
        });
        container.appendChild( grid );
    }

    turnPlayerTo( player, isInit = false ) {
        this.activePlayer = player;
        if ( isInit ) {
            document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ] .name i` ).classList.toggle( 'blink' );
        }
        else {
            this.players.forEach( p => {
                document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ] .name i` ).classList.toggle( 'blink' );
            })
        }
    }

    onClick( e ) {
        const btn = e.currentTarget;
        const playerId = btn.getAttribute( 'data-player-id' );
        const cellIndex = parseInt( btn.getAttribute( 'data-cell-index' ), 10 );
        const cellClicked = this.cells[ cellIndex ];

        if ( this.activePlayer.id === playerId ) {
            if ( cellClicked.isActive ) {
                this.fillCell( this.activePlayer.color, cellClicked.coordinates, '#212121' );
                cellClicked.isActive = false;
                this.turnPlayerTo( [ ...this.players ].find( player => player.id !== playerId ) );
                this.checkEndGame();
            }
            else {
                this.layout.alert( 'Cell is already taken!' )
            }
        }
        else {
            this.layout.alert( `${ [ ...this.players ].find( player => player.id === playerId ).pseudo }: it's not your turn!` );
        }

    }

    fillCell( color, coordinates, borderColor = '#bdbdbd' ) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect( ...coordinates );
        this.ctx.strokeStyle = borderColor;
        this.ctx.strokeRect( ...coordinates );
    }

    checkEndGame() {
        // TODO: scores
        if ( this.cells.every( cell => cell.isActive === false ) ) {
            this.layout.info( 'The game is over!', 5000 );
        }
    }
}
