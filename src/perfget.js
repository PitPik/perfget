(function ( GLOBAL ) {

    'use strict';

    function Perfget() {}

    Perfget.prototype.get = (function () {
        var depthCache = {};

        function _get(path) {
            var pathParts = path.split ? (path || 'null').split('.') : path,
                currentPart = pathParts.shift(),
                result = 'return(this.' + currentPart;

            while (pathParts.length) {
                currentPart += '[\'' + pathParts.shift() + '\']';
                result += ' && ' + currentPart;
            };

            return (depthCache[path] = Function(result + ')'))();
        }

        return function(path) {
            return (depthCache[path] || _get)(path);
        }
    }());

    var perfget = new Perfget();

    perfget._get = function _get( reciever ) {
        return function ( path ) {
            return perfget.get.call( reciever, path );
        };
    };

    perfget.get_ = function get_( path ) {
        return function ( reciever ) {
            return perfget.get.call( reciever, path );
        };
    };

    perfget.factory = function () {
        return new Perfget();
    };

    if ( typeof module === 'undefined' ) {

        GLOBAL.get = perfget.get;
        GLOBAL._get = perfget._get;
        GLOBAL.get_ = perfget.get_;
        GLOBAL.perfget = perfget.factory;

    } else {

        module.exports = perfget;

    }

}( this ));