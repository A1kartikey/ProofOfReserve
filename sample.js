var d = [
    {
        "Customer_ID": "0xA1",
        "Cryptoasset": "btc",
        "Balance": "1.0122938",
        "ASOFDATE": "6/14/2023",
        "exchange_name": "coinmetrics",
        "date": "2023-06-29",
        "_id": "6489c55e19799163f94eb73b",
        "__v": 0,
        "createdAt": "2023-06-14T13:49:18.298Z",
        "updatedAt": "2023-06-14T13:49:18.298Z"
    },
    {
        "Customer_ID": "0XA2",
        "Cryptoasset": "eth",
        "Balance": "1.0122939",
        "ASOFDATE": "6/14/2023",
        "exchange_name": "coinmetrics",
        "date": "2023-06-29",
        "_id": "6489c55e19799163f94eb73c",
        "__v": 0,
        "createdAt": "2023-06-14T13:49:18.299Z",
        "updatedAt": "2023-06-14T13:49:18.299Z"
    },
]

let dat = '';

for (let i = 0; i<d.length; i++){
    dat = d[i].ASOFDATE
}
console.log(dat)