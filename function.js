const a = function (params) {
    a()
    return {x: 10, y: 20}
}


const sum = function (n) {
    if(n === 1) {
        return 1;
    }
    return n + sum(n-1);
}

console.log(sum(5));
