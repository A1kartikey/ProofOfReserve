var d = [
    {
        "Customer_ID": "0xA1",
        "Cryptoasset": "btc",
        "Balance": "1.0122938",
        "ASOFDATE": "6/14/2023",
     
    },
    {
        "Customer_ID": "0XA2",
        "Cryptoasset": "eth",
        "Balance": "1.0122939",
        "ASOFDATE": "6/14/2023",
 
    },
]

const a = Object.keys(d[0]);


const hasValue = a.includes('a','a');

if ( hasValue ){
    console.log("yess")
}
console.log(a)