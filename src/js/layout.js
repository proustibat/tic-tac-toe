// Materialize-css requires jQuery
import $ from 'jquery';

export default class Layout {

    constructor() {
        if ( !Layout.instance ) {
            this.init();
            Layout.instance = this;
        }
        return Layout.instance;
    }

    init() {
        // Initialize collapse button
        $( '.button-collapse' ).sideNav({
            menuWidth: 300,
            edge: 'left',
            closeOnClick: true,
            draggable: true,
            onOpen: $el => { console.log( 'Menu is open', $el[0] ) },
            onClose: $el => { console.log( 'Menu is close', $el[0] ) },
        });
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        //$('.collapsible').collapsible();
        Object.freeze( this );
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
