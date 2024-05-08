window.addEventListener('load', () => {
    let r
    let l
    let goin
    let goout
    let maze
    const choose = prompt('请选择迷宫生成方式（1表示随机生成，2表示从指定文件中获取）')
    if (choose == '2') {
        const name = prompt('请输入文件名')
        axios({
            url: 'http://localhost/read',
            method: 'post',
            data: {
                name
            }
        }).then(result => {
            // 从请求中获取迷宫相关信息
            const [arr1, maze1] = result.data.message
            r = arr1[0]
            l = arr1[1]
            goin = [arr1[2], arr1[3]]
            goout = [arr1[4], arr1[5]]
            maze = maze1
            console.log(maze);
            maze[arr1[2]][arr1[3]]=0
            maze[arr1[4]][arr1[5]]=0
        })
    } else if (choose == '1') {
        const ran = (a, b) => {
            let c = Math.floor(Math.random() * (b - a + 1)) + a
            return c
        }
        r = ran(5, 9)
        l = ran(5, 9)
        goin = [0, 0]
        goout = [r - 1, l - 1]
        maze = new Array(r)
        for (let i = 0; i < r; i++) {
            maze[i] = new Array(l)
            for (let j = 0; j < l; j++) {
                let a = ran(0, 2)
                if (a == 2) {
                    maze[i][j] = 1
                } else {
                    maze[i][j] = 0
                }
            }
        }
        maze[0][0] = 0
        maze[r - 1][l - 1] = 0
    }

    setTimeout(() => {
        // 初始化迷宫样式
        let mazebox = document.querySelector('.maze')
        const width = 50 * l + l
        const height = 50 * r + r
        mazebox.style.width = `${width}px`
        mazebox.style.height = `${height}px`
        console.log(maze);
        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[0].length; j++) {
                if (maze[i][j] == 0) {
                    mazebox.innerHTML += `<div class="per per${maze[i][j]}" data-id=a${i * 10 + j} style="background-color: rgb(255, 255, 255);"></div>`
                } else if (maze[i][j] == 1) {
                    mazebox.innerHTML += `<div class="per per${maze[i][j]}" data-id=a${i * 10 + j} style="background-color: rgb(0,0,0);"></div>`
                }
            }
        }
        mazebox.innerHTML += '<div class="back">BACK</div>'
        mazebox.innerHTML += '<div class="auto" style="font-size:`10px`">点击展示搜索过程</div>'
        mazebox.innerHTML += '<div class="autoshort">点击展示最短路径</div>'

        // 将每个per盒子获取出来
        let pers = document.querySelectorAll('.per')
        pers[goin[0] * l + goin[1]].innerHTML = 'in'
        pers[goout[0] * l + goout[1]].innerHTML += 'out'

        // 获取四个点击盒子
        const auto = document.querySelector('.auto')
        const back = document.querySelector('.back')
        const autoshort = document.querySelector('.autoshort')

        // 一些全局变量
        // 保存每种方法栈的数组，本质为三维数组
        let ressta = new Array()
        // 整个栈
        let allsta = new Array()
        // 表示当前遍历到全栈的下标数和当前正在处理的要变色的div及其对应的data-id属性值
        let now = 0
        let nowdiv
        let nowid
        // 最短路径的长度和最短路径在ressta中的下标
        let len, index
        // 四种方向分别用两个数组来表示
        const dx = [0, 1, 0, -1]
        const dy = [1, 0, -1, 0]

        let path = new Array(r)
        for (let i = 0; i < r; i++) {
            path[i] = new Array(l)
            for (let j = 0; j < l; j++) {
                path[i][j] = 0//0表示该向右走
            }
        }
        let pass = (px, py) => {
            if (px >= 0 && py >= 0 && px <= r - 1 && py <= l - 1 && maze[px][py] == 0) {
                return true
            }
            return false
        }
        let dfs = () => {
            let stack = []
            stack.push([goin[0], goin[1]])
            allsta.push([goin[0], goin[1]])
            maze[goin[0]][goin[1]] = 1
            while (stack.length > 0) {
                const [x, y] = stack[stack.length - 1]
                if (x == goout[0] && y == goout[1]) {
                    ressta.push([].concat(stack))
                    allsta.push(stack.pop())
                    path[x][y] = 0
                    maze[x][y] = 0
                    continue
                }
                if (path[x][y] == 4) {
                    allsta.push(stack.pop())
                    path[x][y] = 0
                    maze[x][y] = 0
                    continue
                } else {
                    while (path[x][y] <= 3) {
                        let px = x + dx[path[x][y]]
                        let py = y + dy[path[x][y]]
                        path[x][y]++
                        if (pass(px, py)) {
                            stack.push([px, py])
                            allsta.push([px, py])
                            maze[px][py] = 1
                            break
                        }
                        if (path[x][y] == 4) {
                            allsta.push(stack.pop())
                            path[x][y] = 0
                            maze[x][y] = 0
                            break
                        }
                    }
                }
            }
        }

        // 开始深搜
        dfs()
        // 如果有路径
        if (ressta.length === 0) {
            index = -1
        } else {
            // 获取最短路径长度和最短路径，分别用变量len和way表示
            len = ressta[0].length
            index = 0
            for (let i = 1; i < ressta.length; i++) {
                if (len > ressta[i].length) {
                    len = ressta[i].length
                    index = i
                }
            }
        }


        // 函数部分
        // 动画
        const show = (Sta) => {
            // 到终点的情况
            console.log(Sta[now][0], Sta[now][1]);
            if (Sta[now][0] == goout[0] && Sta[now][1] == goout[1]) {
                nowid = Sta[now][0] * 10 + Sta[now][1]
                nowdiv = document.querySelector(`[data-id=a${nowid}]`)
                if (nowdiv.style.backgroundColor == 'skyblue') {
                    nowdiv.style.backgroundColor = 'rgb(255, 255, 255)'
                } else if (nowdiv.style.backgroundColor == 'rgb(255, 255, 255)') {
                    nowdiv.style.backgroundColor = 'skyblue'
                }
            } else {
                nowid = Sta[now][0] * 10 + Sta[now][1]
                nowdiv = document.querySelector(`[data-id=a${nowid}]`)
                if (nowdiv.style.backgroundColor == 'red') {
                    nowdiv.style.backgroundColor = 'rgb(255, 255, 255)'
                } else if (nowdiv.style.backgroundColor == 'rgb(255, 255, 255)') {
                    nowdiv.style.backgroundColor = 'red'
                }
            }
        }
        // 自动展示函数
        const autofun = (Sta) => {
            now = 0
            let timer = setInterval(() => {
                if (now >= Sta.length) {
                    now = 0
                    clearInterval(timer)
                } else {
                    show(Sta)
                    now++
                }
            }, 100)
        }
        // 回到初始样式函数
        let backfun = () => {
            now = 0
            for (let i = 0; i < allsta.length; i++) {
                nowid = allsta[now][0] * 10 + allsta[now][1]
                nowdiv = document.querySelector(`[data-id=a${nowid}]`)
                now++
                nowdiv.style.backgroundColor = 'rgb(255, 255, 255)'
            }
            now = 0
        }

        // 事件监听部分
        // 自动展示整个搜索过程
        auto.addEventListener('click', () => {
            autofun(allsta)
        })
        // 回到初始样式
        back.addEventListener('click', () => {
            backfun()
        })

        // 自动展示最短路径
        autoshort.addEventListener('click', () => {
            // 如果没有路径
            if (index === -1) {
                alert('没有路径')
            }
            // 如果有路径
            else {
                console.log(ressta[index]);
                autofun(ressta[index])
            }
        })
        if (index !== -1) {
            axios({
                url: 'http://localhost/write',
                method: 'post',
                data: {
                    way: ressta[index]
                }
            }).then(result => {
                console.log(result.data.message);
            })
        }
    }, 1000)
})