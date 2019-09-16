Person=function() {
       this.name = 123,
        this.age = 20,
        this.showAge = function () {
            console.log(this.age)
        }
}
person1 = new Person()
person1.showAge=function () {
    console.log('showAge')
}
person1.showAge()
person2=new Person()
console.log('new',new Person().__proto__)  //Person
console.log(new Person())
person2.showAge() //20
// var person2={}
// person2.__proto__=Person.prototype
// Person.call(person2)
// person2.showAge=function () {
//     console.log('person2')
// }
// person2.showAge()
//     var person3={}
//     person3.__proto__=Person.prototype
// Person.call(person3)
// person3.showAge()
// person2.showAge()
