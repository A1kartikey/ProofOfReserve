var a = ["vin", "kar", "vip"];

var d = [
  {
    name: "vin",
    balance: "1",
  },
  {
    name: "vin",
    balance: "2",
  },
  {
    name: "kar",
    balance: "1",
  },
  {
    name: "vip",
    balance: "1",
  },
];

let ass;
let total = [];
for (let j = 0; j < a.length; j++) {
  //  console.log(a[j])
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    //console.log(d[i]);

    if (d[i].name == a[j]) {
      //console.log("11",d[i])
      sum = sum + parseFloat(d[i].balance);

      ass = {
        name: d[i].name,
        sums: sum,
      };
    }
  }
  //console.log("ss",ass)
  total.push(ass);
}

console.log("ssss", total);
//console.log(d[i].name)
