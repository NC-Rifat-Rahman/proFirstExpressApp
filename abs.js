function a(){
    return function(x){
        return x*x;
    }
}

const f = a();

let r = f(5);

console.log(r);

