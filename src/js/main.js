import '../css/reset.min.css';

// Import Google Icon Font
import '../css/material-icon.css';
// Import materialize.css
import 'materialize-css/dist/css/materialize.css';

// App css
import '../css/google-fonts.css';
import '../css/tictactoe.css';

// Materialize-css: js parts (requires jQuery)
import $ from 'jquery';
import 'materialize-css/dist/js/materialize';

import TicTacToe from './tic-tac-toe';

if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( '⚠ ⟁ Looks like we are in development mode! ⚠ ⟁' );
}

document.addEventListener( 'DOMContentLoaded', () => {
    // Initialize collapse button
    $( '.button-collapse' ).sideNav({
        menuWidth: 300,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        onOpen: el => { console.log( `${el} is open` ) },
        onClose: el => { console.log( `${el} is close` ) },
    });
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();

    new TicTacToe();
} );
