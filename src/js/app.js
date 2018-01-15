import Layout from './layout';
import TicTacToe from './tic-tac-toe';
import { SVGLoader } from 'svg-loader-es6';

export default class APP {
    constructor () {
        console.info( 'Hello APP' );

        this.container = document.body.querySelector( '.main-container' );
        this.loader = document.createElement( 'div' );
        this.secondaryLoader = null;
        this.layout = null;
        this.game = null;

        this.createMainLoader();
        this.createSecondaryLoader();

        try {
            this.showPage();
            this.runApp();
        }
        catch ( e ) {
            console.error( `Something's wrong :( ${ e }` );
        }
    }

    createMainLoader () {
        console.info( 'APP.createMainLoader' );
        const contentLoader = document.createElement( 'div' );
        this.loader.setAttribute( 'class', 'progress' );
        contentLoader.setAttribute( 'class', 'indeterminate' );
        this.loader.appendChild( contentLoader );
    }

    displayMainLoader () {
        console.info( 'APP.displayMainLoader' );
        this.layout.listenMenuSettings( false );
        this.container.prepend( this.loader );
    }

    removeMainLoader () {
        console.info( 'APP.removeMainLoader' );
        this.layout.listenMenuSettings( true );
        this.loader.remove();
    }

    createSecondaryLoader () {
        this.secondaryLoader = new SVGLoader( {
            containerId: 'loader-container',
            size: 6,
            radius: 3,
            margin: 2,
            minOpacity: 0,
            maxOpacity: 0.8,
            color: '#000'
        } ).hide();
    }

    showPage () {
        console.info( 'APP.showPage' );
        if ( !this.container ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            this.container.classList.add( 'complete' );
        }
    }

    runApp () {
        console.info( 'APP.runApp' );
        this.layout = new Layout();
        this.displayMainLoader();
        new TicTacToe().then( ( { tictactoeInstance, initializers } ) => {
            this.game = tictactoeInstance;
            this.removeMainLoader();
            const events = [ 'newGame', 'restart', 'reset' ];
            events.forEach( eventName => this.layout.on( eventName, this.onChange.bind( this ) ) );

            this.game.on( 'endGame', this.displayMainLoader.bind( this ) );
            this.game.on( 'ready', this.removeMainLoader.bind( this ) );

            this.game.on( 'waitStart', () => {
                console.log( '########### WAIT START', this );
                this.secondaryLoader.show();
            } );

            this.game.on( 'waitEnd', () => {
                console.log( '########### WAIT END', this );
                this.secondaryLoader.hide();
            } );

            console.info( '*** APP.runApp => setup finished, game is ready to play', initializers );
        } );
    }

    onChange ( e ) {
        console.info( 'APP.onChange' );
        this.displayMainLoader();
        this.game && e.eventName && this.game[ e.eventName ]( e.data ).then( this.removeMainLoader.bind( this ) );
    }
}
