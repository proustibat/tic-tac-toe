// Generated by workflow
import './app-info';

// css
import '../styles/main.scss';

// libs
import 'jquery'; // Materialize-css requires jQuery
import 'materialize-css/dist/js/materialize'; // Materialize
import 'spectrum-colorpicker/spectrum.js'; // Spectrum (color picker)
import './utils';

// App and Pages
import App from './app';

// Information message for development mode
if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( 'Looks like we are in development mode!' );
}

document.ready( document ).then( () => {
    // Find JS class to run depending on data-page-slug
    const selector = 'data-page-slug';
    const el = document.querySelector( `[${ selector }]` );
    const SlugClass = el ? { App }[ el.getAttribute( selector ) ] : null;

    // Instantiation if a class is found
    if ( SlugClass ) {
        new SlugClass( el );
    }
} );
