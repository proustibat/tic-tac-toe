// Materialize-css requires jQuery
import $ from 'jquery';

import EventEmitter from 'events';

export default class Layout extends EventEmitter {

    constructor() {
        super();
        if ( !Layout.instance ) {
            this.init();
            Layout.instance = this;
        }
        return Layout.instance;
    }

    init() {
        // MENU
        // Initialize collapse button
        $( '.button-collapse' ).sideNav({
            menuWidth: 300,
            edge: 'left',
            closeOnClick: true,
            draggable: true,
            // onOpen: $el => { console.log( 'Menu is open', $el[0] ) },
            // onClose: $el => { console.log( 'Menu is close', $el[0] ) },
        });
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        //$('.collapsible').collapsible();

        // Clicks on items
        const buttons = document.querySelectorAll('.nav-wrapper .btn-js');
        buttons.forEach( btn => btn.addEventListener( 'click', this.onMenuItem.bind( this ) ) );

        Object.freeze( this );
    }

    onMenuItem( e ) {
        e.preventDefault();
        const btn = e.currentTarget;
        const role = btn.getAttribute( 'data-role' );
        this.emit( role );
    }

    alert( msg, time, onComplete = () => {} ) {
        this.toast( msg, time, 'red accent-4', onComplete );
    }

    info( msg, time, onComplete = () => {} ) {
        this.toast( msg, time, 'green accent-4', onComplete );
    }

    toast( msg, time = 3000, colorClass = null, onComplete = () => {} ) {
        if ( !msg || typeof msg !== 'string' ) {
            return false;
        }
        // message, displayLength, className, completeCallback
        Materialize.toast( msg, time, colorClass ? colorClass : '', onComplete );
    }

}
