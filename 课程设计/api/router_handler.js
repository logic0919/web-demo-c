const fs = require('fs')

const read = (req, res) => {
    const name = req.body.name
    fs.readFile(`../${name}.txt`, (err, data) => {
        if (err)
            console.log(err);
        else {
            const str = data.toString()
            const str1 = str.split('/')
            const arr1 = JSON.parse(str1[0].slice(1))
            const arr2 = JSON.parse(str1[1].slice(0, str1[1].length - 3))
            res.send({
                status: 0,
                message: [arr1, arr2]
            })
        }
    })
}

const write = (req, res) => {
    fs.writeFile('../result.txt', req.body.way.toString(), (err) => {
        if (err)
            console.log(err);
        else {
            res.send({
                status: 0,
                message: '写入成功'
            })
        }
    })
}
module.exports = { read, write }