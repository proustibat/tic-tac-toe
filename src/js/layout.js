// Materialize-css requires jQuery
import $ from 'jquery';

import EventEmitter from 'events';

export default class Layout extends EventEmitter {

    constructor() {
        super();
        if ( !Layout.instance ) {
            Layout.instance = this.init();
        }
        return Layout.instance;
    }

    init() {
        /**
         *  MENU
         */
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
        const buttons = document.querySelectorAll( '.nav-wrapper .btn-js' );
        buttons.forEach( btn => btn.addEventListener( 'click', this.onMenuItem.bind( this ) ) );

        /**
         *  MODAL
         */
        // the "href" attribute of the modal trigger must
        // specify the modal ID that wants to be triggered
        this.submitListener = this.onSubmitModal.bind( this );
        this.modalSettings = $( '.modal-settings' ).modal({
            // dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0.9, // Opacity of modal background
            // inDuration: 300, // Transition in duration
            // outDuration: 200, // Transition out duration
            // startingTop: '4%', // Starting top style attribute
            // endingTop: '10%', // Ending top style attribute
            // Callback for Modal open. Modal and trigger parameters available.
            ready: () => {
                document.querySelector( '.modal-footer .btn[type=submit]' ).addEventListener( 'click', this.submitListener );
            },
            // Callback for Modal close
            complete: () => {
                document.querySelector( '.modal-footer .btn[type=submit]' ).removeEventListener( 'click', this.submitListener );
            }
        });


        // prevents new properties from being added to the singleton;
        // prevents existing properties from being removed;
        // and prevents existing properties, or their enumerability, configurability, or writability,
        // from being changed,
        // it also prevents the prototype from being changed
        return Object.freeze( this );
    }


    onSubmitModal( e ) {
        e.preventDefault();
        const form = this.modalSettings[ 0 ].querySelector( 'form' );

        // Players info
        let players = [ {}, {} ];
        for ( let i = 0; i < 2; i++ ) {
            const playerName = form.querySelector( `#player-${ i + 1 }-pseudo` ).value;
            const playerColor = form.querySelector( `#player-${ i + 1 }-color` ).value;

            players[ i ].pseudo = playerName;
            players[ i ].color = playerColor;
        }

        // Playground
        const playgroundSize = form.querySelector( '#playground-range' ).value;

        form.reset();

        this.emit( 'submit:settings', {
            players,
            playgroundSize
        });

        this.modalSettings.modal( 'close' );
    }

    onMenuItem( e ) {
        e.preventDefault();
        const btn = e.currentTarget;
        const role = btn.getAttribute( 'data-role' );
        if ( role === 'settings' ) {
            this.modalSettings.modal( 'open' );
            return false;
        }

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
