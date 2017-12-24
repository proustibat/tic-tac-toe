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

        // Declarations of every cells
        this.cells = [];
        this.diagonals = [ [], [] ];
        this.lines = [];
        this.columns = [];
        for ( let i = 0; i < this.cellsEdge; i++ ) {
            this.lines.push( [] );
            this.columns.push( [] );
        }

        // Calculate cells sizes and coordinates
        this.initCells();

        // Players names and colors
        this.initPlayers();

        // Let's start with the first player in the list
        this.turnPlayerTo( this.players[ 0 ], true );
    }

    initCells() {
        const edge = Math.round( this.canvasSize / this.cellsEdge );

        // Create every cells
        for ( let i = 0, l = Math.pow( this.cellsEdge, 2 ), row = 0, col; i < l; i++ ) {
            col = i % this.cellsEdge;

            // Calculate coordinates
            const cell = {
                isActive: true,
                ownedBy: null,
                coordinates: [ edge * col, edge * row, edge, edge ],
            };

            this.saveCell( cell, row, col );

            // Update row number
            row = col === this.cellsEdge - 1 ? row + 1 : row;

            // Init color of the cell
            this.fillCell( i % 2 ? '#eeeeee' : '#fafafa', cell.coordinates );
        }

        this.winningCells = [ this.lines, this.columns, this.diagonals ];
    }

    saveCell( cell, row, col ) {
        // Save cell into array of all cells
        this.cells.push( cell );

        // Save cell into array of lines, array of columns and array of diagonals
        this.lines[ row ].push( cell );
        this.columns[ col ].push( cell );

        // Save cell into array of the main diagonal
        if ( row === col ) {
            this.diagonals[ 0 ].push( cell );
        }
        // Save cell into array of the second diagonal
        if ( row + col === this.cellsEdge - 1 ) {
            this.diagonals[ 1 ].push( cell ) ;
        }
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

        if ( this.activePlayer.id !== playerId ) {
            this.layout.alert( `${ [ ...this.players ].find( player => player.id === playerId ).pseudo }: it's not your turn!` );
            return false;
        }

        if ( !cellClicked.isActive ) {
            this.layout.alert( 'Cell is already taken!' );
            return false;
        }

        this.fillCell( this.activePlayer.color, cellClicked.coordinates, '#212121' );
        cellClicked.isActive = false;
        cellClicked.ownedBy = playerId;
        this.checkEndGame();
        this.turnPlayerTo( [ ...this.players ].find( player => player.id !== playerId ) );

    }

    fillCell( color, coordinates, borderColor = '#bdbdbd' ) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect( ...coordinates );
        this.ctx.strokeStyle = borderColor;
        this.ctx.strokeRect( ...coordinates );
    }

    checkEndGame() {
        // Check if the active player is the winner in each line, column or diagonal
        if ( this.winningCells.some( arr => arr.some( cells => cells.every( cell => cell.ownedBy === this.activePlayer.id ) ) ) ) {
            this.layout.info( `${ this.activePlayer.pseudo } wins!`, 5000 );
        }

        // Every cells are played
        if ( this.cells.every( cell => cell.isActive === false ) ) {
            this.layout.info( 'The game is over with no winner!', 5000 );
        }
    }
}
