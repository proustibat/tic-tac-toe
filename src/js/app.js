import Layout from './layout';
import TicTacToe from './tic-tac-toe';

const APP = (() => {

    const container = document.body.querySelector( '.main-container' );
    const loader = document.createElement( 'div' );
    let layout = null;
    let game = null;

    const createLoader = () => {
        console.info( 'APP.createLoader' );
        const contentLoader = document.createElement( 'div' );
        loader.setAttribute( 'class', 'progress' );
        contentLoader.setAttribute( 'class', 'indeterminate' );
        loader.appendChild( contentLoader );
    };

    const displayLoader = () => {
        console.info( 'APP.displayLoader' );
        layout.listenMenuSettings( false );
        container.prepend( loader );
    };
    const removeLoader = () => {
        console.info( 'APP.removeLoader' );
        layout.listenMenuSettings( true );
        loader.remove();
    };

    const showPage = () => {
        console.info( 'APP.showPage' );
        if ( !container ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            container.classList.add('complete');
        }
    };
    const onChange = ( e ) => {
        console.info( 'APP.onChange' );
        displayLoader();
        game && e.eventName && game[ e.eventName ]( e.data ).then( removeLoader );
    };

    const runApp = () => {
        console.info( 'APP.runApp' );
        layout = new Layout();
        displayLoader();
        new TicTacToe().then( ( { tictactoeInstance, initializers } ) => {
            game = tictactoeInstance;
            removeLoader();
            const events = [ 'newGame', 'restart', 'reset' ];
            events.forEach( eventName => layout.on( eventName, onChange ) );

            game.on( 'endGame', displayLoader );
            game.on( 'ready', removeLoader );

            console.info( '*** APP.runApp => setup finished, game is ready to play', initializers );
        } );
    };

    const init = () => {
        console.info( 'APP.init' );
        createLoader();
        try {
            showPage();
            runApp();
        }
        catch ( e ) {
            console.error( `Something's wrong :( ${ e }` );
        }
    };

    return { init };
})();

export default APP;
