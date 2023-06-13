
        var data = [
            {
                "date": "2023-06-13",
                "result": [
                    {
                        "Asset": "btc",
                        "Total": 630
                    },
                    {
                        "Asset": "eth",
                        "Total": 1980
                    },
                    {
                        "Asset": "LTC",
                        "Total": 2340
                    }
                ]
            },
            {
                "date": "2023-06-14",
                "result": [
                    {
                        "Asset": "btc",
                        "Total": 630
                    },
                    {
                        "Asset": "eth",
                        "Total": 1980
                    },
                    {
                        "Asset": "LTC",
                        "Total": 2340
                    }
                ]
            },
            {
                "date": "2023-06-15",
                "result": [
                    {
                        "Asset": "btc",
                        "Total": 630
                    },
                    {
                        "Asset": "eth",
                        "Total": 1980
                    },
                    {
                        "Asset": "LTC",
                        "Total": 2340
                    }
                ]
            }
            //
            ,
            {
                "date": "2023-06-16",
                "result": [
                    {
                        "Asset": "btc",
                        "Total": 630
                    },
                    {
                        "Asset": "eth",
                        "Total": 1980
                    },
                    {
                        "Asset": "LTC",
                        "Total": 2340
                    }
                ]
            }
            ,
            {
                "date": "2023-06-17",
                "result": [
                    {
                        "Asset": "btc",
                        "Total": 630
                    },
                    {
                        "Asset": "eth",
                        "Total": 1980
                    },
                    {
                        "Asset": "LTC",
                        "Total": 2340
                    }
                ]
            }
            ,

        ]
  
        var ed = new Date("2023-06-13").getTime();
       var  sd = new Date("2023-06-15").getTime();
        result = data.filter(d => {var time = new Date(d.date).getTime();
        return (sd < time && time < ed);
        });
        console.log(JSON.stringify(result));
