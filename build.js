const chalk = require( 'chalk' );
const log   = console.log;
const util  = require( 'util' );
const fs    = require( 'fs' );

module.exports = ( () => {

    return new class Build {

        constructor() {

            this.log = {

                title: val => {
                    const prefix = '|                                ';
                    const suffix = '                                 |';
                    const charTotal = prefix.length + val.length + suffix.length;
                    let underline = '|';
                    for ( let i = 0; i < charTotal - 2; i++ ) {
                        underline += '-';
                    }
                    underline += '|';
                    log( chalk.white.bgGreen.bold( `${ underline }` ) );
                    log( chalk.white.bgGreen.bold( `${ prefix }${ val }${ suffix }` ) );
                    log( chalk.white.bgGreen.bold( `${ underline }` ) );
                    log( '\r' );
                },

                separator: () => {
                    const charTotal = 84;
                    let underline = '';
                    for ( let i = 0; i < charTotal; i++ ) {
                        underline += '-';
                    }
                    log( chalk.green( `${ underline }` ) );
                },

                congrats: msg => {
                    log( '\r' );
                    log( chalk.white.bgGreen.bold( ` ☆    ${ util.inspect( msg.toUpperCase(), false, null ) }  ☆  ` ) );
                    log( '\r' );
                },

                info: msg => log( chalk.white( ( `►  ${ util.inspect( msg, false, null ) }` ) ) ),

                done: msg => log( chalk.green( ( `✓  Done:\n ${ util.inspect( msg, false, null ) }` ) ) ),

                error: err => log( chalk.red( (`☹  Error:\n ${ util.inspect( err, false, null ) }` ) ) )
            };

            this.prepareBuild();
        }

        prepareBuild() {
            this.log.title( 'PREPARE BUILD' );

            this.log.separator();

            this.log.info( 'Load ./package.json' );
            const pkg = require( './package.json' );
            this.log.done( 'package.json is loaded' );

            this.log.separator();

            this.log.info( 'Prepare AppInfo data' );
            const timestamp = Date.now();
            const contentFile = `window.AppInfo = { name: '${ pkg.name }', version: '${ pkg.version }', build: '${ timestamp }', dateBuild: '${ new Date( timestamp ).toISOString() }' };\n`;
            this.log.done( 'AppInfo ok' );

            this.log.separator();

            this.log.info( 'Writing content into file AppInfo.js' );
            fs.writeFile( './src/js/AppInfo.js', `${ contentFile }`, err => {
                if ( err ) {
                    this.log.error( err );
                    return false;
                }
                this.log.done( 'The file is saved!' );

                this.log.separator();

                this.log.congrats( 'MAZEL TOV!' );
            });
        }

    };

} )();

