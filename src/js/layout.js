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
        this._playerColors = [ '#fff', '#fff' ];
        this.initMenu();
        this.initModal();
        return this;
    }

    initMenu() {
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
        document.querySelectorAll( '.nav-wrapper .btn-js' ).forEach( btn => btn.addEventListener( 'click', this.onMenuItem.bind( this ) ) );
    }

    initModal() {
        this.submitListener = this.onSubmitModal.bind( this );
        this.resetListener = this.onResetModal.bind( this );
        this.modalSettings = $( '.modal-settings' ).modal({
            opacity: 0.9, // Opacity of modal background
            inDuration: 200, // Transition in duration
            outDuration: 200, // Transition out duration
            // Callback for Modal open. Modal and trigger parameters available.
            ready: () => {
                [ ...$( '.picker-color' ) ].forEach( ( input, i ) => {
                    $( input ).spectrum({
                        color: this.playerColors[ i ],
                        flat: false,
                        allowEmpty:false,
                        showInitial: false,
                        showInput: true,
                        chooseText: 'I want this color',
                        cancelText: 'Get out of here',
                        replacerClassName: 'picker-color-replacer',
                        preferredFormat: 'hex3',
                        // show: tinycolor => {
                        //     console.log( 'picker-color ', tinycolor );
                        // }
                    });
                } );
                document.querySelector( '.modal-footer .btn[type=submit]' ).addEventListener( 'click', this.submitListener );
                document.querySelector( '.modal-footer .btn[type=reset]' ).addEventListener( 'click', this.resetListener );
            },
            // Callback for Modal close
            complete: () => {
                $( '.picker-color' ).spectrum( 'destroy' );
                document.querySelector( '.modal-footer .btn[type=submit]' ).removeEventListener( 'click', this.submitListener );
                document.querySelector( '.modal-footer .btn[type=reset]' ).removeEventListener( 'click', this.resetListener );
            }
        });
    }

    onResetModal() {
        const pickerColors = this.modalSettings[ 0 ].querySelectorAll( 'form .picker-color' );
        pickerColors.forEach( ( input, i ) => $( input ).spectrum( 'set', this.playerColors[ i ] ) );
    }

    onSubmitModal( e ) {
        e.preventDefault();
        const form = this.modalSettings[ 0 ].querySelector( 'form' );

        // Players info
        let players = [ {}, {} ];
        for ( let i = 0; i < 2; i++ ) {
            const name = form.querySelector( `#player-${ i + 1 }-pseudo` ).value;
            if ( name.length > 0 ) {
                players[ i ].pseudo = name;
            }
            const color = `#${ $( form.querySelectorAll( '.picker-color' )[ i ] ).spectrum( 'get' ).toHex() }`;
            if ( color.length > 0 ) {
                players[ i ].color = color;
            }
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

    get playerColors() {
        return this._playerColors;
    }

    set playerColors( colors ) {
        this._playerColors = colors;
    }

}
