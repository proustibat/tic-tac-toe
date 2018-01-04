class Logger {

    constructor() {
        if ( !Logger.instance ) {
            console.info( 'Create Logger' );

            // create custom console object
            [ 'log', 'info', 'error', 'warn' ].forEach( m => {
                if ( Object.prototype.hasOwnProperty.call( console, m ) && Object.prototype.hasOwnProperty.call( Logger, m ) ) {
                    Logger.customConsole = Object.assign({}, Logger.customConsole, { [ m ]: Logger[ m ] });
                }
            });

            // save original methods from console in an object
            for ( let m in Logger.customConsole ) {
                if ( Object.prototype.hasOwnProperty.call( Logger.customConsole, m ) ) {
                    Logger.savedConsole = Object.assign( {}, Logger.savedConsole, { [ m ]: console[ m ] } );
                }
            }

            Logger.instance = this;
        }
        this.enable();
        return Logger.instance;
    }

    enable() {
        console.warn( 'Logger is enabled! Use `Logger.disable()` if you don\'t wanna use this custom Logger.' );
        // Attribute custom methods to the console
        for ( let prop in Logger.customConsole ) {
            if ( Object.prototype.hasOwnProperty.call( Logger.customConsole, prop ) ) {
                console[ prop ] = Logger.customConsole[ prop ];
            }
        }
        Logger.isEnable = true;
    }

    disable() {
        // Attribute original methods to the consol
        for ( let prop in Logger.savedConsole ) {
            if ( Object.prototype.hasOwnProperty.call( Logger.savedConsole, prop ) ) {
                console[ prop ] = Logger.savedConsole[ prop ];
            }
        }
        Logger.isEnable = false;
    }

    static log() {
        const color = '#ddca7e';
        const background = '#1d1f20';
        const style = [
            `background: ${ background }`,
            `color: ${ color }`,
        ].join(';');
        Logger.write( arguments, 'log', style );
    }

    static info() {
        const color = '#96b38a';
        const background = '#1d1f20';
        const style = [
            `background: ${ background }`,
            `color: ${ color }`,
        ].join(';');
        Logger.write( arguments, 'info', style );
    }

    static warn() {
        const color = '#d0782a';
        const background = '#1d1f20';
        const style = [
            `background: ${ background }`,
            `color: ${ color }`,
            'text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.2)',
        ].join(';');
        Logger.write( arguments, 'warn', style );
    }

    static error() {
        const color = '#ffffff';
        const background = '#ff0000';
        const style = [
            `background: ${ background }`,
            `color: ${ color }`,
        ].join(';');
        Logger.write( arguments, 'error', style );
    }

    static write( params, method, style ) {

        let prefix = '';
        let suffix = '';

        if ( method === 'warn' ) {
            prefix = '⚠ ';
            suffix = ' ⚠';
        }
        if ( method === 'error' ) {
            prefix = '☠ ';
            // prefix = '☹ ';
        }
        if ( method === 'info' ) {
            prefix = 'ⓘ ';
        }
        if ( method === 'log' ) {
            // prefix = '▶ ';
            prefix = '► ';
        }

        const moreStyle = [
            'display: block',
            'padding: 3px 6px',
            'font-family: "Lucida Console", Monaco, monospace',
            'font-weight: bold',
        ].join(';');

        style = `${ style };${ moreStyle }`;

        let args = ( params.length === 1 ? [ params[ 0 ] ] : Array.apply( null, params ) );
        if ( args.some( arg => Array.isArray( arg ) ) ) {
            args = args.map( arg => Array.isArray( arg ) ? `[${ arg.join(', ') }]` : arg );
        }

        if ( args.every( arg => typeof arg === 'string' || typeof arg === 'number' ) ) {
            Logger.savedConsole[ method ]( `%c${ prefix }${ args.join(' ') }${ suffix }`, style );
        }
        else {
            args.forEach( arg => {
                typeof arg === 'string' ? Logger.savedConsole[ method ]( `%c${ prefix }${ arg }${ suffix }`, style ) : Logger.savedConsole[ method ]( arg );
            });
        }
    }

    get isEnable() {
        return Logger.isEnable;
    }

    set isEnable( value ) {
        throw new Error('You can\'t do that, please use enable or disable method!')
    }
}
window.Logger = new Logger();
