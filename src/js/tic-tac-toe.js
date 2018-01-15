import Layout from './layout';
import Cells from './cells';
import Players from './players';
import EventEmitter from 'events';

const defaultOptions = {
    canvasSize: 270, // max 320,
    cellsEdge: 3,
    players: [ {
        id: 'player-1',
        pseudo: 'Player 1',
        color: '#57c5ff',
        score: 0
    }, {
        id: 'player-2',
        pseudo: 'Player 2',
        color: '#ff3d5b',
        score: 0
    } ]
};

export default class TicTacToe extends EventEmitter {
    constructor ( { canvasSize = defaultOptions.canvasSize, cellsEdge = defaultOptions.cellsEdge, players = defaultOptions.players } = defaultOptions ) {
        super();

        this.layout = new Layout();

        this.canvasSize = canvasSize > 320 ? 320 : canvasSize;

        this.canvas = document.querySelector( '.game-canvas' );
        if ( !this.canvas ) {
            throw new Error( 'This app requires a canvas element with a ".game-canvas" class!' );
        }
        this.ctx = this.canvas.getContext( '2d' );

        this.cellsInstance = new Cells( this.ctx, cellsEdge );

        this.playersInstance = new Players( defaultOptions.players, players );

        this.isFreeze = true;

        this.buttonsListener = this.onClick.bind( this );

        // Returns promise with instance
        return this.setup();
    }

    async setup () {
        return new Promise( async ( resolve ) => {
            // Let's start with the first player in the list
            this.activePlayer = this.playersInstance.players[ 0 ];
            const initializers = [
                await this.initGame(),
                // Players names and colors
                await this.playersInstance.initPlayers( this.cellsInstance.cellsEdge ),
                await this.playersInstance.turnPlayerTo( this.activePlayer, this.isFreeze, true ),
                await this.toggleFreeze()
            ];
            await resolve( { tictactoeInstance: this, initializers: initializers } );
        } );
    }

    async initGame () {
        return new Promise( async ( resolve ) => {
            // Canvas size
            this.canvas.width = this.canvas.height = await this.canvasSize;
            this.canvas.parentElement.style.width = this.canvas.parentElement.style.height = await `${ this.canvasSize }px`;

            // Declarations of every cells
            await this.cellsInstance.init();

            // Calculate cells sizes and coordinates
            const initCells = await this.cellsInstance.initCells( this.canvasSize );

            resolve( { initGame: initCells } );
        } );
    }

    async onClick ( e ) {
        this.emit( 'waitStart' );
        const btn = e.currentTarget;
        const playerId = btn.getAttribute( 'data-player-id' );
        const cellIndex = parseInt( btn.getAttribute( 'data-cell-index' ), 10 );
        const cellClicked = this.cellsInstance.cells[ cellIndex ];
        await this.toggleFreeze();

        const canContinue = await this.checkIfGameContinues( cellClicked, playerId );
        if ( !canContinue ) {
            this.emit( 'waitEnd' );
            await this.toggleFreeze();
            return false;
        }

        await this.cellsInstance.fillCell( this.activePlayer.color, cellClicked.coordinates, '#212121' );
        cellClicked.isActive = false;
        cellClicked.ownedBy = playerId;
        await this.checkEndGame();
        this.activePlayer = await [ ...this.playersInstance.players ].find( player => player.id !== playerId );
        await this.playersInstance.turnPlayerTo( this.activePlayer, this.isFreeze );
        this.emit( 'waitEnd' );
    }

    async checkIfGameContinues ( cellClicked, playerId ) {
        if ( this.activePlayer.id !== playerId ) {
            this.layout.alert( `${ [ ...this.playersInstance.players ].find( player => player.id === playerId ).pseudo }: it's not your turn!` );
            return false;
        }

        if ( !cellClicked.isActive ) {
            this.layout.alert( 'Cell is already taken!' );
            return false;
        }

        return true;
    }

    async checkEndGame () {
        return new Promise( async ( resolve ) => {
            const endedData = await this.cellsInstance.isOver( this.activePlayer );

            if ( endedData.isOver ) {
                if ( endedData.winner ) {
                    this.activePlayer.score++;
                    this.updateScore( this.activePlayer );
                    this.layout.info( `${ this.activePlayer.pseudo } wins!`, 4000, this.playAgain.bind( this, true ) );
                }
                else {
                    this.layout.info( 'The game is over with no winner!', 4000, this.playAgain.bind( this, true ) );
                }
                this.emit( 'endGame' );
            }
            else {
                this.toggleFreeze();
            }

            resolve( endedData.isOver );
        } );
    }

    async playAgain ( hadFinishedOne = false ) {
        await this.initGame();
        await this.toggleFreeze();
        if ( hadFinishedOne ) {
            this.emit( 'ready' );
        }
    }

    async reset () {
        await this.toggleFreeze();

        await Promise.all( this.playersInstance.players.map( async ( player ) => {
            player.score = 0;
            await this.updateScore( player );
            return player;
        } ) ).then( async () => {
            this.activePlayer = await this.playersInstance.players[ 0 ];
            await this.playAgain();
        } );
    }

    async restart () {
        return new Promise( async ( resolve ) => {
            await this.toggleFreeze();
            await this.playAgain();
            resolve( 'restart' );
        } );
    }

    async newGame ( data ) {
        let players = [];
        for ( let i = 0, l = defaultOptions.players.length; i < l; i++ ) {
            const player = Object.assign( {}, this.playersInstance.players[ i ], data.players[ i ] );
            player.score = 0;
            players.push( player );
        }
        this.playersInstance.players = players;

        this.cellsInstance.cellsEdge = data.playgroundSize;

        await this.toggleFreeze();
        return this.setup();
    }

    async updateScore ( player ) {
        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
        const $score = $joystick.querySelector( '.score' );
        $score.firstChild.nodeValue = `${ player.score }`;
    }

    async toggleFreeze () {
        return new Promise( async ( resolve ) => {
            this.isFreeze = !this.isFreeze;

            await Promise.all( this.playersInstance.buttons.map( async ( btn ) => {
                // listeners
                btn.classList.toggle( 'disabled' );
                btn[ this.isFreeze ? 'removeEventListener' : 'addEventListener' ]( 'click', this.buttonsListener );
                return btn;
            } ) ).then( () => {
                // TODO: should be in players.js
                // Blinking player indicator
                const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ this.activePlayer.id }" ]` );
                $joystick.classList.toggle( 'z-depth-3' );
                $joystick.classList.toggle( 'joystick-is-authorized' );
                const icon = $joystick.querySelector( '.name i' );
                icon.classList[ this.isFreeze ? 'remove' : 'toggle' ]( 'blink' );
                resolve( 'toggleFreeze' );
            } );
        } );
    }
}
