import Layout from './layout';

export default class Players {

    constructor( defaultPlayers, customPlayers) {
        console.info( 'Hello Players' );
        this.layout = new Layout();
        this.buttons = [];
        this.players = [];
        for ( let i = 0, l = defaultPlayers.length; i < l; i++ ) {
            this.players.push( Object.assign( {}, defaultPlayers[ i ], customPlayers[ i ] ) );
        }
    }

    async initPlayers( cellsEdge ) {
        console.info( 'Players.initPlayers' );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                await Promise.all( this.players.map( async( player ) => {

                    const $joystick = await document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
                    const $name = await $joystick.querySelector( '.name' );

                    const initPlayerName = await this.initPlayerName( $name, player );
                    await console.info(' -- End', initPlayerName );

                    const initPlayerScore = await this.initPlayerScore( $name, player );
                    await console.info(' -- End', initPlayerScore );

                    const initJoystick = await this.initPlayerJoystick( player.id, $joystick, cellsEdge );
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
        console.info( 'Players.initPlayerName ', player.pseudo );
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

                resolve( `initPlayerName ${ player.pseudo }` );
            }, 800);
        });
    }

    async initPlayerScore( $name, player ) {
        console.info( 'Players.initPlayerScore ', player.score );
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
                resolve( `initPlayerScore ${ player.pseudo }` );
            }, 800);
        });
    }

    async initPlayerJoystick( playerId, container, cellsEdge ) {
        console.info( 'Players.initPlayerJoystick ', playerId );
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

                await grid.style.setProperty( 'grid-template-columns', `repeat(${ cellsEdge }, 1fr)` );

                // buttons
                const promises = [];
                for ( let i = 0, l = Math.pow( cellsEdge, 2 ); i < l; i++ ) {
                    const buttonCreated = await this.createJoystickButton( grid, playerId, i );
                    console.log( buttonCreated );
                    promises.push( buttonCreated );

                }

                await Promise.all( promises ).then( () => {
                    console.log( ' ALL BUTTONS CREATED FOR PLAYER ', playerId );
                    resolve( `initJoystick ${ playerId }` );
                });

            }, 800);
        });
    }

    async createJoystickButton( grid, playerId, i ) {
        console.log( `createJoystickButton ${ i } for ${ playerId }` );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
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
                console.log( `Done button ${ i } for ${ playerId } ` );
                resolve( `Done button ${ i } for ${ playerId } ` );
            }, 3000);
        });
    }

    async turnPlayerTo( player, gameIsFreeze, isInit = false ) {
        console.info( 'Players.turnPlayerTo ', player.id, player.pseudo );
        return await new Promise( async( resolve ) => {
            setTimeout( async() => {
                // activePlayer = player;
                if ( !isInit && !gameIsFreeze ) {
                    await Promise.all( this.players.map( async( p ) => {
                        const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ]` );
                        $joystick.classList.toggle( 'z-depth-3' );
                        $joystick.querySelector( '.name i' ).classList.toggle( 'blink' );
                        return p;
                    })).then( () => {
                        console.info(' -- End turnPlayerTo ', player.pseudo );
                        resolve( `turnPlayerTo ${ player.pseudo }` );
                    });
                }
                else {
                    console.info(' -- End turnPlayerTo ', player.pseudo, 'not active' );
                    resolve( `NOT TURN TO ${ player.pseudo }` );
                }
            }, 800);
        });
    }

}
