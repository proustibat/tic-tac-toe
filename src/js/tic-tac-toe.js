import Layout from './layout';
import EventEmitter from 'events';

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

export default class TicTacToe extends EventEmitter {

    constructor( { canvasSize = defaultOptions.canvasSize, cellsEdge = defaultOptions.cellsEdge, players = defaultOptions.players } = defaultOptions ) {
        super();
        console.info( 'Hello TicTacToe' );

        this.layout = new Layout();

        this.cellsEdge = cellsEdge;
        this.canvasSize = canvasSize > 320 ? 320 : canvasSize;

        this.players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            this.players.push( Object.assign( {}, defaultOptions.players[ i ], players[ i ] ) );
        }

        this.canvas = document.querySelector( '.game-canvas' );
        if (!this.canvas) {
            throw new Error( 'This app requires a canvas element with a ".game-canvas" class!' );
        }
        this.ctx = this.canvas.getContext( '2d' );

        this.isFreeze = true;

        this.buttons = [];
        this.buttonsListener = this.onClick.bind( this );

        // Return promise with instance
        return this.setup();
        // return this;
    }

    async setup() {
        console.info( 'TicTacToe.setup' );
        return await new Promise( async( resolve ) => {
            const initializers = [
                await this.initGame(),
                // Players names and colors
                await this.initPlayers(),
                // Let's start with the first player in the list
                await this.turnPlayerTo( this.players[ 0 ], true ),
                await this.toggleFreeze()
            ];
            // this.emit( 'ready' );
            await resolve( { tictactoeInstance:this, initializers: initializers } );
        });
    }

    async initGame() {
        console.info( 'TicTacToe.initGame' );
        return await new Promise( async( resolve ) => {
            // Canvas size
            this.canvas.width = this.canvas.height = await this.canvasSize;
            this.canvas.parentElement.style.width = this.canvas.parentElement.style.height = await `${ this.canvasSize }px`;

            // Declarations of every cells
            this.cells = await [];
            this.diagonals = await [ [], [] ];
            this.lines = await [];
            this.columns = await [];
            for ( let i = 0; i < this.cellsEdge; i++ ) {
                await this.lines.push( [] );
                await this.columns.push( [] );
            }

            // Calculate cells sizes and coordinates
            const initCells = await this.initCells();
            console.info(' -- End', initCells );
            resolve( `initGame [${ initCells }]` );
        });
    }

    async initCells() {
        console.info( 'TicTacToe.initCells' );
        return await new Promise( async( resolve ) => {

            await setTimeout( async() => {
                const edge = await Math.round( this.canvasSize / this.cellsEdge );

                const saveCellsArr = await [];
                const fillCellsArr = await [];
                // Create every cells
                for ( let i = 0, l = Math.pow( this.cellsEdge, 2 ), row = 0, col; i < l; i++ ) {
                    col = i % this.cellsEdge;

                    // Calculate coordinates
                    const cell = {
                        isActive: true,
                        ownedBy: null,
                        coordinates: [ edge * col, edge * row, edge, edge ],
                    };

                    const saveCell = await this.saveCell( cell, row, col );
                    console.info(' -- End', saveCell );
                    saveCellsArr.push( saveCell );

                    // Update row number
                    row = col === this.cellsEdge - 1 ? row + 1 : row;

                    // Init color of the cell
                    const fillCell =  await this.fillCell( i % 2 ? '#eeeeee' : '#fafafa', cell.coordinates );
                    console.info(' -- End', fillCell );
                    fillCellsArr.push( fillCell );
                }

                this.winningCells = await [ this.lines, this.columns, this.diagonals ];

                resolve( `initCells [${saveCellsArr}, ${saveCellsArr}]` );

            }, 800);
        });
    }

    async saveCell( cell, row, col ) {
        return await new Promise( async( resolve ) => {
            await setTimeout( async() => {
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

                resolve( `saveCell [${row}, ${col}]` );

            }, 200);
        });
    }

    async fillCell( color, coordinates, borderColor = '#bdbdbd' ) {
        return await new Promise( async( resolve ) => {
            await setTimeout( async() => {

                this.ctx.fillStyle = await color;
                await this.ctx.fillRect( ...coordinates );
                this.ctx.strokeStyle = await borderColor;
                await this.ctx.strokeRect( ...coordinates );

                resolve( `fillCell ${coordinates}` );

            }, 200);
        });
    }

    async initPlayers() {
        console.info( 'TicTacToe.initPlayers' );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                await Promise.all( this.players.map( async( player ) => {

                    const $joystick = await document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
                    const $name = await $joystick.querySelector( '.name' );

                    const initPlayerName = await this.initPlayerName( $name, player );
                    await console.info(' -- End', initPlayerName );

                    const initPlayerScore = await this.initPlayerScore( $name, player );
                    await console.info(' -- End', initPlayerScore );

                    const initJoystick = await this.initPlayerJoystick( player.id, $joystick );
                    await console.info(' -- End', initJoystick );

                    return player.color;
                })).then( ( colors ) => {
                    console.info(' -- End initPlayers ' );
                    this.layout.playerColors = colors;
                    resolve( 'initPlayers' );
                });
            }, 800);
        });
    }

    async initPlayerName( $name, player ) {
        console.info( 'TicTacToe.initPlayerName ', player.pseudo );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {

                while ( $name.firstChild ) {
                    await $name.removeChild( $name.firstChild );
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
                    await $name.appendChild( symbol );
                }
                symbol.style.backgroundColor = player.color;
                await $name.appendChild( document.createTextNode( ` ${ player.pseudo }` ) );

                resolve( `initPlayerName ${player.pseudo}` );
            }, 800);
        });
    }

    async initPlayerScore( $name, player ) {
        console.info( 'TicTacToe.initPlayerScore ', player.score );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                let score;
                if ( $name.querySelector( '.score' ) ) {
                    score = await $name.querySelector( '.score' );
                }
                else {
                    score = await document.createElement( 'span' );
                    await score.setAttribute('class', 'score badge grey-text text-lighten-5' );
                    await $name.appendChild( score );
                }
                await score.appendChild( document.createTextNode(`${ player.score }`) );
                resolve( `initPlayerScore ${player.pseudo}` );
            }, 800);
        });
    }

    async initPlayerJoystick( playerId, container ) {
        console.info( 'TicTacToe.initPlayerJoystick ', playerId );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                // grid
                let grid;
                if ( container.querySelector( '.grid' ) ) {
                    grid = await container.querySelector( '.grid' );
                    while ( grid.firstChild ) {
                        await grid.removeChild( grid.firstChild );
                    }
                }
                else {
                    grid = await document.createElement( 'div' );
                    await grid.setAttribute( 'class', 'grid' );
                    await container.appendChild( grid );
                }

                await grid.style.setProperty( 'grid-template-columns', `repeat(${ this.cellsEdge }, 1fr)` );

                // buttons
                await this.cells.forEach( ( cell, i ) => {
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

                resolve( `initJoystick ${playerId}` );

            }, 800);
        });


    }

    async turnPlayerTo( player, isInit = false ) {
        console.info( 'TicTacToe.turnPlayerTo ', player.id, player.pseudo );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                this.activePlayer = player;
                if ( !isInit && !this.isFreeze ) {
                    await Promise.all( this.players.map( async( p ) => {
                        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ]` );
                        $joystick.classList.toggle( 'z-depth-3' );
                        $joystick.querySelector( '.name i' ).classList.toggle( 'blink' );
                        return p;
                    })).then( () => {
                        console.info(' -- End turnPlayerTo ', player.pseudo );
                        resolve( `turnPlayerTo ${player.pseudo}` );
                    });
                }
                else {
                    console.info(' -- End turnPlayerTo ', player.pseudo, 'not active' );
                    resolve( `NOT TURN TO ${player.pseudo}` );
                }
            }, 800);
        });
    }

    async onClick( e ) {
        console.info( 'TicTacToe.onClick' );
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

        await this.fillCell( this.activePlayer.color, cellClicked.coordinates, '#212121' );
        cellClicked.isActive = false;
        cellClicked.ownedBy = playerId;
        await this.checkEndGame();
        await this.turnPlayerTo( [ ...this.players ].find( player => player.id !== playerId ) );
    }

    async checkEndGame() {
        console.info( 'TicTacToe.checkEndGame' );
        // Check if the active player is the winner in each line, column or diagonal
        if ( this.winningCells.some( arr => arr.some( cells => cells.every( cell => cell.ownedBy === this.activePlayer.id ) ) ) ) {
            this.emit( 'endGame' );
            this.toggleFreeze();
            this.activePlayer.score ++;
            this.updateScore( this.activePlayer );
            this.layout.info( `${ this.activePlayer.pseudo } wins!`, 5000, this.playAgain.bind( this, true ) );
            return false;
        }

        // Every cells are played
        if ( this.cells.every( cell => cell.isActive === false ) ) {
            this.emit( 'endGame' );
            this.toggleFreeze();
            this.layout.info( 'The game is over with no winner!', 5000, this.playAgain.bind( this, true ) );
            return false;
        }
    }

    async playAgain(hadFinishedOne = false) {
        console.info( 'TicTacToe.playAgain' );
        await this.initGame();
        await this.toggleFreeze();
        if ( hadFinishedOne ) {
            this.emit( 'ready' );
        }
    }

    async reset() {
        console.info( 'TicTacToe.reset' );
        // this.emit( 'loading' );
        await this.toggleFreeze();

        await Promise.all( this.players.map( async( player ) => {
            player.score = 0;
            await this.updateScore( player );
            return player;
        })).then( async() => {
            this.activePlayer = await this.players[ 0 ];
            await this.playAgain();
        });
    }

    async restart() {
        console.info( 'TicTacToe.restart' );
        // this.emit( 'loading' );
        return new Promise( async(resolve) => {
            await this.toggleFreeze();
            await this.playAgain();
            resolve( 'restart' );
        })
    }

    async newGame( data ) {
        console.info( 'TicTacToe.newGame ', data );
        // this.emit( 'loading' );
        let players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            const player = Object.assign( {}, this.players[ i ], data.players[ i ] );
            player.score = 0;
            players.push( player );
        }
        this.players = players;

        this.cellsEdge = data.playgroundSize;

        await this.toggleFreeze();
        return await this.setup();
    }

    async updateScore( player ) {
        console.info( 'TicTacToe.updateScore ', player.id, player.pseudo );
        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
        const $score = $joystick.querySelector( '.score' );
        $score.firstChild.nodeValue = `${ player.score }`;
    }

    async toggleFreeze() {
        console.info( 'TicTacToe.toggleFreeze ' );
        return await new Promise( resolve => {
            setTimeout( async() => {
                this.isFreeze = !this.isFreeze;

                await Promise.all( this.buttons.map( async( btn ) => {
                    // listeners
                    btn.classList.toggle( 'disabled' );
                    btn[ this.isFreeze ? 'removeEventListener' : 'addEventListener' ]( 'click', this.buttonsListener );
                    return btn;
                })).then( () => {
                    // Blinking player indicator
                    const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ this.activePlayer.id }" ]` );
                    $joystick.classList.toggle( 'z-depth-3' );
                    const icon = $joystick.querySelector( '.name i' );
                    icon.classList[ this.isFreeze ? 'remove' : 'toggle' ]( 'blink' );
                    console.info( '-- End toggleFreeze' );
                    resolve( 'toggleFreeze' );
                });
            }, 800);
        });
    }
}
