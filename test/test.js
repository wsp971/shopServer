const dish = [{
  a: 1
}, { a: 2 }];
dish.forEach(d => {
  d.c = 1;
})

console.log(dish);