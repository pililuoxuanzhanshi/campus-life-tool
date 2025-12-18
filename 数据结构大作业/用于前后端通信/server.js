const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('frontend'));
app.use(express.json());

// 路由：首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// 路由：查询路径
app.post('/api/path', (req, res) => {
    const { start, end } = req.body;
    
    // 这里应该调用C程序，但现在我们使用模拟数据
    console.log(`查询路径：${start} → ${end}`);
    
    // 模拟延迟
    setTimeout(() => {
        // 模拟结果
        const mockResult = {
            path: [start, "中间站1", "中间站2", end],
            distance: Math.floor(Math.random() * 20) + 10,
            time: Math.floor(Math.random() * 30) + 15,
            success: true
        };
        
        res.json(mockResult);
    }, 1000);
});

// 路由：获取所有站点
app.get('/api/stations', (req, res) => {
    const stations = [
        {id: 1, name: "刘园"},
        {id: 2, name: "西横堤"},
        // ... 所有站点数据
    ];
    res.json(stations);
});

// 启动服务器
app.listen(port, () => {
    console.log(`🚀 天津地铁最优路径检索系统已启动！`);
    console.log(`🌐 请访问 http://localhost:${port}`);
    console.log(`📁 前端文件目录: ${path.join(__dirname, 'frontend')}`);
});