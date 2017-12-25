import Layout from './layout';

const defaultOptions = {
    canvasSize: 270, //max 320,
    cellsEdge: 3,
    players: [{
        id:     'player-1',
        pseudo: 'Player 1',
        color:  '#57c5ff',
        score: 0
    }, {
        id:     'player-2',
        pseudo: 'Player 2',
        color:  '#ff3d5b',
        score: 0
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
        this.ctx = this.canvas.getContext( '2d' );

        this.isFreeze = true;

        this.buttons = [];
        this.buttonsListener = this.onClick.bind( this );

        this.setup();
    }

    setup() {
        this.initGame();

        // Players names and colors
        this.initPlayers();

        // Let's start with the first player in the list
        this.turnPlayerTo( this.players[ 0 ], true );

        this.toggleFreeze();
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
        this.layout.playerColors = this.players.map( player => {
            const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
            const $name = $joystick.querySelector( '.name' );

            this.initPlayerName( $name, player );

            this.initPlayerScore( $name, player );

            this.initJoystick( player.id, $joystick );

            return player.color;
        });
    }

    initPlayerName( $name, player ) {

        while ( $name.firstChild ) {
            $name.removeChild( $name.firstChild );
        }

        let symbol;
        if ( $name.querySelector( 'i' ) ) {
            symbol = $name.querySelector( 'i' );
        }
        else {
            symbol = document.createElement( 'i' );
            symbol.style.width = '10px';
            symbol.style.height = '10px';
            symbol.style.display = 'inline-block';
            symbol.style.verticalAlign = 'middle';
            symbol.style.borderRadius = '5px';
            $name.appendChild( symbol );
        }
        symbol.style.backgroundColor = player.color;
        $name.appendChild( document.createTextNode( ` ${ player.pseudo }` ) );
    }

    initPlayerScore( $name, player ) {
        let score;
        if ( $name.querySelector( '.score' ) ) {
            score = $name.querySelector( '.score' );
        }
        else {
            score = document.createElement( 'span' );
            score.setAttribute('class', 'score badge grey-text text-lighten-5' );
            $name.appendChild( score );
        }
        score.appendChild( document.createTextNode(`${ player.score }`) );
    }

    initJoystick( playerId, container ) {
        // grid
        let grid;
        if ( container.querySelector( '.grid' ) ) {
            grid = container.querySelector( '.grid' );
            while ( grid.firstChild ) {
                grid.removeChild( grid.firstChild );
            }
        }
        else {
            grid = document.createElement( 'div' );
            grid.setAttribute( 'class', 'grid' );
            container.appendChild( grid );
        }

        grid.style.setProperty( 'grid-template-columns', `repeat(${ this.cellsEdge }, 1fr)` );

        // buttons
        this.cells.forEach( ( cell, i ) => {
            const btn = document.createElement( 'a' );
            const icon = document.createElement( 'i' );
            btn.appendChild( icon );
            icon.setAttribute( 'class', 'material-icons grey-text text-darken-4' );
            icon.append( document.createTextNode( 'fiber_manual_record' ) );
            btn.setAttribute( 'class', 'btn waves-effect waves-dark grey lighten-4 disabled' );
            btn.setAttribute( 'data-cell-index', i );
            btn.setAttribute( 'data-player-id', playerId );
            grid.appendChild( btn );
            this.buttons.push( btn );
        });
    }

    turnPlayerTo( player, isInit = false ) {
        this.activePlayer = player;
        if ( !isInit && !this.isFreeze ) {
            this.players.forEach( p => {
                const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ]` );
                $joystick.classList.toggle( 'z-depth-3' );
                $joystick.querySelector( '.name i' ).classList.toggle( 'blink' );
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
            this.toggleFreeze();
            this.activePlayer.score ++;
            this.updateScore( this.activePlayer );
            this.layout.info( `${ this.activePlayer.pseudo } wins!`, 5000, this.playAgain.bind( this ) );
            return false;
        }

        // Every cells are played
        if ( this.cells.every( cell => cell.isActive === false ) ) {
            this.toggleFreeze();
            this.layout.info( 'The game is over with no winner!', 5000, this.playAgain.bind( this ) );
            return false;
        }
    }

    playAgain() {
        this.initGame();
        this.toggleFreeze();
    }

    reset() {
        this.toggleFreeze();
        this.players.forEach( player => {
            player.score = 0;
            this.updateScore( player );
        });
        this.activePlayer = this.players[ 0 ];
        this.playAgain();
    }

    restart() {
        this.toggleFreeze();
        this.playAgain();
    }

    updateScore( player ) {
        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
        const $score = $joystick.querySelector( '.score' );
        $score.firstChild.nodeValue = `${ player.score }`;
    }

    toggleFreeze() {
        this.isFreeze = !this.isFreeze;

        // listeners
        this.buttons.forEach( btn => {
            btn.classList.toggle( 'disabled' );
            btn[ this.isFreeze ? 'removeEventListener' : 'addEventListener' ]( 'click', this.buttonsListener );
        });

        // Blinking player indicator
        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ this.activePlayer.id }" ]` );
        $joystick.classList.toggle( 'z-depth-3' );
        const icon = $joystick.querySelector( '.name i' );
        icon.classList[ this.isFreeze ? 'remove' : 'toggle' ]( 'blink' )

    }

    newGameWith( data ) {
        let players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            players.push( Object.assign( {}, this.players[ i ], data.players[ i ] ) );
        }
        this.players = players;

        this.cellsEdge = data.playgroundSize;

        this.toggleFreeze();
        this.setup();
    }
}
