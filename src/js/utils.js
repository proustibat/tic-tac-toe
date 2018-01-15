HTMLDocument.prototype.ready = () => new Promise( resolve => document.readyState === 'complete' ? resolve() : new Promise( resolve => ( document.onreadystatechange = () => document.readyState === 'complete' && resolve() ) ).then( resolve() ) );

/**
 * Utility Functions
 * @type {{getMap: function(*=, *=)}}
 */
const Util = {
    getMap: ( length, data = null ) => {
        if ( !length ) return [];
        return Array.from( { length: length }, () => data );
    }
};

export default Util;
