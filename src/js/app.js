import Layout from './layout';
import TicTacToe from './tic-tac-toe';

export default class APP {

    constructor() {
        console.info( 'Hello APP' );

        this.container = document.body.querySelector( '.main-container' );
        this.loader = document.createElement( 'div' );
        this.layout = null;
        this.game = null;

        this.createLoader();

        try {
            this.showPage();
            this.runApp();
        }
        catch ( e ) {
            console.error( `Something's wrong :( ${ e }` );
        }
    }

    createLoader() {
        console.info( 'APP.createLoader' );
        const contentLoader = document.createElement( 'div' );
        this.loader.setAttribute( 'class', 'progress' );
        contentLoader.setAttribute( 'class', 'indeterminate' );
        this.loader.appendChild( contentLoader );
    }

    displayLoader() {
        console.info( 'APP.displayLoader' );
        this.layout.listenMenuSettings( false );
        this.container.prepend( this.loader );
    }

    removeLoader() {
        console.info('APP.removeLoader');
        this.layout.listenMenuSettings( true );
        this.loader.remove();
    }

    showPage() {
        console.info( 'APP.showPage' );
        if ( !this.container ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            this.container.classList.add( 'complete' );
        }
    }

    runApp() {
        console.info( 'APP.runApp' );
        this.layout = new Layout();
        this.displayLoader();
        new TicTacToe().then( ( { tictactoeInstance, initializers } ) => {
            this.game = tictactoeInstance;
            this.removeLoader();
            const events = [ 'newGame', 'restart', 'reset' ];
            events.forEach( eventName => this.layout.on( eventName, this.onChange.bind( this ) ) );

            this.game.on( 'endGame', this.displayLoader.bind( this ) );
            this.game.on( 'ready', this.removeLoader.bind( this ) );

            console.info( '*** APP.runApp => setup finished, game is ready to play', initializers );
        } );
    }

    onChange( e ) {
        console.info( 'APP.onChange' );
        this.displayLoader();
        this.game && e.eventName && this.game[ e.eventName ]( e.data ).then( this.removeLoader.bind( this ) );
    }
}
