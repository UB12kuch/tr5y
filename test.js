var snack = 'Meow Mix';
this.snack = 'idly';
function getFood(food) {
    if (food) {
        var snack = 'Friskies';
        return snack;
    }
    //console.log(this);
   console.log(this.snack);
    return snack;
}

getFood(true); // undefined