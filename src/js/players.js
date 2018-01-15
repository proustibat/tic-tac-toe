import Layout from './layout';

export default class Players {
    constructor ( defaultPlayers, customPlayers ) {
        this.layout = new Layout();
        this.buttons = [];
        this.players = [];
        for ( let i = 0, l = defaultPlayers.length; i < l; i++ ) {
            this.players.push( Object.assign( {}, defaultPlayers[ i ], customPlayers[ i ] ) );
        }
    }

    async initPlayers ( cellsEdge ) {
        return new Promise( async ( resolve ) => {
            await Promise.all( this.players.map( async ( player ) => {
                const $joystick = await document.querySelector( `[ data-tictactoe-player-id="${ player.id }" ]` );
                const $name = await $joystick.querySelector( '.name' );

                await this.initPlayerName( $name, player );
                await this.initPlayerScore( $name, player );
                await this.initPlayerJoystick( player.id, $joystick, cellsEdge );

                return player;
            } ) ).then( ( players ) => {
                this.layout.playerColors = players.map( player => player.color );
                resolve( { initPlayers: players } );
            } );
        } );
    }

    async initPlayerName ( $name, player ) {
        return new Promise( async ( resolve ) => {
            while ( $name.firstChild ) {
                await $name.removeChild( $name.firstChild );
            }

            let symbol;
            if ( $name.querySelector( 'i' ) ) {
                symbol = $name.querySelector( 'i' );
            }
            else {
                symbol = await this.addNewEl( { tagName: 'i', appendIntoEl: $name } );
                symbol.style.width = '10px';
                symbol.style.height = '10px';
                symbol.style.display = 'inline-block';
                symbol.style.verticalAlign = 'middle';
                symbol.style.borderRadius = '5px';
            }
            symbol.style.backgroundColor = player.color;
            await $name.appendChild( document.createTextNode( ` ${ player.pseudo }` ) );

            resolve( `initPlayerName ${ player.pseudo }` );
        } );
    }

    async initPlayerScore ( $name, player ) {
        return new Promise( async ( resolve ) => {
            let score;
            if ( $name.querySelector( '.score' ) ) {
                score = await $name.querySelector( '.score' );
            }
            else {
                score = await this.addNewEl( {
                    tagName: 'span',
                    classes: [
                        'score',
                        'badge',
                        'grey-text',
                        'text-lighten-5'
                    ],
                    appendIntoEl: $name
                } );
            }
            await score.appendChild( document.createTextNode( `${ player.score }` ) );
            resolve( `initPlayerScore ${ player.pseudo }` );
        } );
    }

    async initPlayerJoystick ( playerId, container, cellsEdge ) {
        return new Promise( async ( resolve ) => {
            // grid
            let grid = await this.createGrid( container, cellsEdge );

            // buttons
            await this.createButtons( grid, playerId, cellsEdge );

            resolve( `initJoystick ${ playerId }` );
        } );
    }

    async createGrid ( container, cellsEdge ) {
        return new Promise( async ( resolve ) => {
            let grid;
            if ( container.querySelector( '.grid' ) ) {
                grid = await container.querySelector( '.grid' );
                while ( grid.firstChild ) {
                    await grid.removeChild( grid.firstChild );
                }
            }
            else {
                grid = await this.addNewEl( { tagName: 'div', classes: [ 'grid' ], appendIntoEl: container } );
            }

            await grid.style.setProperty( 'grid-template-columns', `repeat(${ cellsEdge }, 1fr)` );
            resolve( grid );
        } );
    }

    async addNewEl ( { tagName, classes = [], appendIntoEl } ) {
        const el = await document.createElement( tagName );
        classes.forEach( async ( className ) => {
            await el.classList.add( className );
        } );
        await appendIntoEl.appendChild( el );
        return el;
    }

    async createButtons ( grid, playerId, cellsEdge ) {
        const buttonsPromises = [];
        for ( let i = 0, l = Math.pow( cellsEdge, 2 ); i < l; i++ ) {
            buttonsPromises.push( await this.createJoystickButton( grid, playerId, i ) );
        }
        return Promise.all( buttonsPromises );
    }

    async createJoystickButton ( grid, playerId, i ) {
        return new Promise( async ( resolve ) => {
            const btn = await this.addNewEl( {
                tagName: 'a',
                classes: [
                    'btn',
                    'waves-effect',
                    'waves-dark',
                    'grey',
                    'lighten-4',
                    'disabled'
                ],
                appendIntoEl: grid
            } );
            btn.setAttribute( 'data-cell-index', i );
            btn.setAttribute( 'data-player-id', playerId );

            const icon = await this.addNewEl( { tagName: 'i', appendIntoEl: btn } );
            icon.setAttribute( 'class', 'material-icons grey-text text-darken-4' );
            icon.append( document.createTextNode( 'fiber_manual_record' ) );

            this.buttons.push( btn );
            resolve( `Done button ${ i } for ${ playerId } ` );
        } );
    }

    async turnPlayerTo ( player, gameIsFreeze, isInit = false ) {
        return new Promise( async ( resolve ) => {
            if ( !isInit && !gameIsFreeze ) {
                await Promise.all( this.players.map( async ( p ) => {
                    const $joystick = document.querySelector( `[ data-tictactoe-player-id="${ p.id }" ]` );
                    $joystick.classList.toggle( 'z-depth-3' );
                    $joystick.classList.toggle( 'joystick-is-authorized' );
                    $joystick.querySelector( '.name i' ).classList.toggle( 'blink' );
                    return p;
                } ) ).then( () => {
                    resolve( { [ `turnPlayerTo-${ player.id }` ]: true } );
                } );
            }
            else {
                resolve( { [ `turnPlayerTo-${ player.id }` ]: false } );
            }
        } );
    }
}
