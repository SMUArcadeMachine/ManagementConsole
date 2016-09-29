Array.prototype.join_and = function(){
    var A = this;
    if(A.length == 1) return A[0];
    if(A.length == 2) return A[0] + ' and ' + A[1];
    var end = A[A.length-1];
    var sliced = A.slice(0, A.length-1);
    return sliced.join(', ') + ', and ' + end;
};