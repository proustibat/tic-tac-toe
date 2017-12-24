// CSS
// Reset
import '../css/reset.min.css';
// Materialize
import '../css/material-icon.css';
import 'materialize-css/dist/css/materialize.css';
// App
import '../css/google-fonts.css';
import '../css/utilities.css';
import '../css/tictactoe.css';

// JS
// Materialize
import 'materialize-css/dist/js/materialize';
// App
import TicTacToe from './tic-tac-toe';
import Layout from './layout';

import './AppInfo';

if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( '⟁ ⚠ Looks like we are in development mode! ⚠ ⟁' );
}

document.addEventListener( 'DOMContentLoaded', () => {
    const layout = new Layout();
    const game = new TicTacToe();

    layout.on( 'restart', () => game.restart() );
    layout.on( 'reset', () => game.reset() );

} );
