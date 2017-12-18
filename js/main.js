const defaultOptions = {
    canvasSize: 270, //max 320
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


class TicTacToe {

    constructor( { canvasSize = defaultOptions.canvasSize, players = defaultOptions.players } = defaultOptions,
    ) {

        this.canvasSize = canvasSize > 320 ? 320 : canvasSize;

        this.players = [];
        for ( let i = 0,l = defaultOptions.players.length; i < l; i++ ) {
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

        // Calculate cells
        const edge = Math.round( this.canvasSize / 3 );
        this.cells = [{
            isActive: true,
            coordinates: [ 0, 0, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ edge, 0, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ 2 * edge, 0, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ 0, edge, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ edge, edge, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ 2 * edge, edge, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ 0, 2 * edge, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ edge, 2 * edge, edge, edge ],
        }, {
            isActive: true,
            coordinates: [ 2 * edge, 2 * edge, edge, edge ],
        }];

        // Grid colors for the beginning
        this.cells.forEach( ( cell, i ) => {
            let color = '#fafafa';
            if( i % 2 ) {
                color = '#fff';
            }
            this.ctx.fillStyle = color;
            this.ctx.fillRect( ...cell.coordinates );
            this.ctx.strokeStyle = "#ebebeb";
            this.ctx.strokeRect( ...cell.coordinates );
        });

        // Players names and colors
        this.players.forEach( player => {
            const $pad = document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
            const $name = $pad.querySelector( '.name' );
            $name.firstChild.nodeValue = ` ${ player.pseudo }`;
            const symbol = document.createElement('i');
            symbol.style.width = '10px';
            symbol.style.height = '10px';
            symbol.style.display = 'inline-block';
            symbol.style.verticalAlign= 'middle';
            symbol.style.borderRadius= '5px';

            symbol.style.backgroundColor = player.color;
            $name.prepend(symbol);
        });

        // Buttons listeners
        this.buttons = document.querySelectorAll( 'button' );
        this.buttons.forEach( btn => btn.addEventListener( 'click', this.onClick.bind( this ) ) );

        // Let's start with the first player in the list
        this.turnPlayerTo( this.players[ 0 ], true );
    }

    turnPlayerTo( player, isInit = false ) {
        this.activePlayer = player;
        if(isInit) {
            document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ] .name i` ).classList.toggle( 'blink' );
        }
        else {
            this.players.forEach( p => {
                document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ] .name i` ).classList.toggle( 'blink' );
            })
        }
    }

    onClick( e ) {
        let playerId = e.currentTarget.closest( '.players-pad' ).getAttribute( 'data-tictactoe-player-id' );
        let indexBtn = Array.prototype.indexOf.call( this.buttons, e.currentTarget );

        if( indexBtn >= 9 ) indexBtn -= 9;

        if( this.activePlayer.id === playerId ) {
            if ( this.cells[ indexBtn ].isActive ) {
                this.fillCell( this.activePlayer, this.cells[ indexBtn ].coordinates );
                this.cells[ indexBtn ].isActive = false;
                this.turnPlayerTo( [ ...this.players ].find( player => player.id !== playerId ) );
                this.checkEndGame();
            }
            else {
                alert( 'Cell is already taken!' );
            }
        }
        else {
            alert( `${ [ ...this.players ].find( player => player.id === playerId ).pseudo }: it's not your turn!` );
        }

    }

    fillCell( player, coordinates ) {
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect( ...coordinates );
    }

    checkEndGame() {
        // TODO: scores
        if( this.cells.every( cell => cell.isActive === false )  ) {
            setTimeout( _ => alert( 'the game is end!' ), 100 );
        }
    }
}

document.addEventListener( 'DOMContentLoaded', _ => new TicTacToe());
