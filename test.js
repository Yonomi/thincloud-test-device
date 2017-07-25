'use strict';

class Test {
  constructor(){
    this._counter = 0;
  }

  get counter(){
    return this._counter = this._counter + 1;
  }

  set counter(val){
    this._counter = val
  }

  run(){
    let _this = this;
    setInterval(()=>{
      console.log(_this.counter)
    }, 1000)
  }
}

let test = new Test();
test.run()
