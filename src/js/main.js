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
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        onOpen: function( el ) { /* Do Stuff*/ }, // A function to be called when sideNav is opened
        onClose: function( el ) { /* Do Stuff*/ }, // A function to be called when sideNav is closed
    });
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();
    new TicTacToe();
} );
