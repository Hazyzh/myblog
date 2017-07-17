var func = (function(){
    var a = 2, b = 3

    return {
        foo: () => {console.log(b)}
    }
})()

func.foo = () => {
    console.log(a)
}

func.foo()
