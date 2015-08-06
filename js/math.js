

var PI2 = 2.0 * Math.PI,
    HALF_PI = Math.PI * 0.5,
    DEG2RAD = Math.PI / 180.0,
    RAD2DEG = 180.0 / Math.PI,
    EPS = 10e-6;


let math = {

    //Constants
    PI2 : PI2,
    HALF_PI : HALF_PI,
    DEG2RAD : DEG2RAD,
    RAD2DEG : RAD2DEG,
    EPS : EPS,


    /*
     * Lineary interpolates between a->b, using n as a weight
     */
    mix : function( n, a, b ){
        return a * ( 1 - n ) + b * n;
    },


    /*
     * Linearly maps n from a->b to x->y
     */
    map : function ( n, a, b, x, y ) {
        return x + ( n - a ) * ( y - x ) / ( b - a );
    },


    /*
     * Linearly maps n from a->b to 0-1
     */
    normalize : function ( n, a, b ) {
        return math.map( n, a, b, 0, 1 );
    },


    /*
     * Clamp n within range a->b
     */
    clamp: function ( n, a, b ) {
        return ( n < a ) ? a : ( ( n > b ) ? b : n );
    },


    /*
     * Returns a pseudo-random floating point number within the range a->b, if b is not supplied it
     * returns within the range 0-a
    */
    random: function(a, b) {
        return (b === undefined) ? Math.random() * a : Math.random() * (b - a) + a
    },


    /*
     * Included for completeness. This allows functional style reductions such as `numbers.reduce( max )`. 
     * `Math.max.apply( this, numbers )` alone is bound by the stack size
     */
    max: function( a, b ){
        return Math.max( a, b )
    },


    /*
     * Included for completeness. This allows functional style reductions such as `numbers.reduce( min )`. 
     * `Math.min.apply( this, numbers )` alone is bound by the stack size
     */
    min: function( a, b ){
        return Math.min( a, b )
    }

}

export default math