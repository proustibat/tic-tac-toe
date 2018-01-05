import Layout from './layout';
import Cells from './cells';
import Players from './players';
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

        this.canvasSize = canvasSize > 320 ? 320 : canvasSize;

        this.canvas = document.querySelector( '.game-canvas' );
        if (!this.canvas) {
            throw new Error( 'This app requires a canvas element with a ".game-canvas" class!' );
        }
        this.ctx = this.canvas.getContext( '2d' );

        this.cellsInstance = new Cells( this.ctx, cellsEdge );

        this.playersInstance = new Players( defaultOptions.players, players );

        // this.players = [];
        // for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
        //     this.players.push( Object.assign( {}, defaultOptions.players[ i ], players[ i ] ) );
        // }

        this.isFreeze = true;

        // this.buttons = [];
        this.buttonsListener = this.onClick.bind( this );

        // Return promise with instance
        return this.setup();
        // return this;
    }

    async setup() {
        console.info( 'TicTacToe.setup' );
        return await new Promise( async( resolve ) => {
            // Let's start with the first player in the list
            this.activePlayer = this.playersInstance.players[ 0 ];
            const initializers = [
                await this.initGame(),
                // Players names and colors
                await this.playersInstance.initPlayers( this.cellsInstance.cellsEdge ),
                // await this.initPlayers(),
                await this.playersInstance.turnPlayerTo( this.activePlayer, this.isFreeze, true ),
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
            await this.cellsInstance.init();

            // Calculate cells sizes and coordinates
            const initCells = await this.cellsInstance.initCells( this.canvasSize );

            console.info(' -- End', initCells );
            resolve( `initGame [${ initCells }]` );
        });
    }

    async onClick( e ) {
        console.info( 'TicTacToe.onClick' );
        const btn = e.currentTarget;
        const playerId = btn.getAttribute( 'data-player-id' );
        const cellIndex = parseInt( btn.getAttribute( 'data-cell-index' ), 10 );
        const cellClicked = this.cellsInstance.cells[ cellIndex ];
        await this.toggleFreeze();

        if ( this.activePlayer.id !== playerId ) {
            this.layout.alert( `${ [ ...this.playersInstance.players ].find( player => player.id === playerId ).pseudo }: it's not your turn!` );
            await this.toggleFreeze();
            return false;
        }

        if ( !cellClicked.isActive ) {
            this.layout.alert( 'Cell is already taken!' );
            await this.toggleFreeze();
            return false;
        }

        await this.cellsInstance.fillCell( this.activePlayer.color, cellClicked.coordinates, '#212121' );
        cellClicked.isActive = false;
        cellClicked.ownedBy = playerId;
        const isEnd = await this.checkEndGame();
        if ( isEnd ) {
            // TODO: useful when you'll refacto checkEndGame method !
            console.log( 'IS END', isEnd );
        }
        else {
            console.log( 'NOT END', isEnd );
            await this.toggleFreeze();
        }
        this.activePlayer = await [ ...this.playersInstance.players ].find( player => player.id !== playerId );
        await this.playersInstance.turnPlayerTo( this.activePlayer, this.isFreeze );
    }

    // TODO: refacto to put in Cells instance that return just true or false with maybe some data
    async checkEndGame() {
        return await new Promise( async( resolve ) => {

            setTimeout( async() => {

                console.info( 'TicTacToe.checkEndGame' );
                // Check if the active player is the winner in each line, column or diagonal
                if ( this.cellsInstance.winningCells.some( arr => arr.some( cells => cells.every( cell => cell.ownedBy === this.activePlayer.id ) ) ) ) {
                    this.emit( 'endGame' );
                    // await this.toggleFreeze();
                    this.activePlayer.score ++;
                    await this.updateScore( this.activePlayer );
                    this.layout.info( `${ this.activePlayer.pseudo } wins!`, 5000, this.playAgain.bind( this, true ) );
                    // return false;
                    resolve( true );
                }

                // Every cells are played
                if ( this.cellsInstance.cells.every( cell => cell.isActive === false ) ) {
                    this.emit( 'endGame' );
                    // await this.toggleFreeze();
                    this.layout.info( 'The game is over with no winner!', 5000, this.playAgain.bind( this, true ) );
                    // return false;
                    resolve( true );
                }

                resolve( false );

            }, 3000 );

        });

    }

    async playAgain( hadFinishedOne = false ) {
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

        await Promise.all( this.playersInstance.players.map( async( player ) => {
            player.score = 0;
            await this.updateScore( player );
            return player;
        })).then( async() => {
            this.activePlayer = await this.playersInstance.players[ 0 ];
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
        let players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            const player = Object.assign( {}, this.playersInstance.players[ i ], data.players[ i ] );
            player.score = 0;
            players.push( player );
        }
        this.playersInstance.players = players;

        this.cellsInstance.cellsEdge = data.playgroundSize;

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

                await Promise.all( this.playersInstance.buttons.map( async( btn ) => {
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
            }, 200);
        });
    }
}
