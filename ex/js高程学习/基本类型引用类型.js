//  基本类型 undefine null boolean string number  复制值   独立
//引用类型复制地址  ,不独立

var a = 1;
var b= {}
b.name='name1'
function changeNum(num) {
    num = 10
}
var boolens = new Boolean()
var num= new Number()
var num2=123
var str= new String()
console.log('str',str)  // ''
console.log('num',num)  // 0
console.log('bolen',boolens)  // false
console.log('max',Number.MAX_VALUE)
console.log(isNaN(Number.MAX_VALUE))
console.log(typeof num2)

function chgangeObj(obj) {
obj.name = 'name2'
}
changeNum(a)
chgangeObj(b)
console.log(a,b)