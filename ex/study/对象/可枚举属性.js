// for in  循环只能遍历可枚举属性,  对象原型属性是不可枚举属性

function Person() {
    this.name = 'gpc';
}
Person.prototype = {
    constructor:Person,
    job: 'student'
};

let p = new Person()
Object.defineProperty(p, 'sex',{
    value:'man',
    enumerabel:false
});

for(item in p) {
    console.log('item.' + item +'='+ p[item]);
}

