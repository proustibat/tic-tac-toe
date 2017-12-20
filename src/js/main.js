import '../css/reset.min.css';
import '../css/google-fonts.css';
import '../css/tictactoe.css';

import TicTacToe from './tic-tac-toe';

if (process.env.NODE_ENV !== 'production') {
    console.warn( '⚠ ⟁ Looks like we are in development mode! ⚠ ⟁' );
}

document.addEventListener( 'DOMContentLoaded', () => new TicTacToe() );
