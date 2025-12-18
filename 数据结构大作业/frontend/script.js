// 天津地铁站点数据
const stations = [
    {id: 1, name: "刘园"},
    {id: 2, name: "西横堤"},
    {id: 3, name: "果酒厂"},
    {id: 4, name: "本溪路"},
    {id: 5, name: "勤俭道"},
    {id: 6, name: "洪湖里"},
    {id: 7, name: "西站"},
    {id: 8, name: "西北角"},
    {id: 9, name: "西南角"},
    {id: 10, name: "二纬路"},
    {id: 11, name: "海光寺"},
    {id: 12, name: "鞍山道"},
    {id: 13, name: "营口道"},
    {id: 14, name: "小白楼"},
    {id: 15, name: "下瓦房"},
    {id: 16, name: "南楼"},
    {id: 17, name: "土城"},
    {id: 18, name: "陈塘庄"},
    {id: 19, name: "复兴门"},
    {id: 20, name: "华山里"},
    {id: 21, name: "财经大学"},
    {id: 22, name: "双林"},
    {id: 23, name: "李楼"},
    {id: 24, name: "空港经济区"},
    {id: 25, name: "国山路"},
    {id: 26, name: "登州路"},
    {id: 27, name: "屿东城"},
    {id: 28, name: "翠阜新村"},
    {id: 29, name: "靖江路"},
    {id: 30, name: "顺驰桥"},
    {id: 31, name: "远洋国际中心"},
    {id: 32, name: "天津站"},
    {id: 33, name: "建国道"},
    {id: 34, name: "东南角"},
    {id: 35, name: "鼓楼"},
    {id: 36, name: "天津西站"},
    {id: 37, name: "北竹林"},
    {id: 38, name: "天泰路"},
    {id: 39, name: "外院附中"},
    {id: 40, name: "新开河"}
];

// 模拟后端Dijkstra算法（实际项目中应该调用真正的后端）
function simulateDijkstra(start, end) {
    // 这里使用一个简化的路径数据库
    const pathDatabase = {
        "刘园-天津站": {
            path: ["刘园", "西横堤", "果酒厂", "本溪路", "勤俭道", "洪湖里", "西站", "天津西站", "鼓楼", "东南角", "建国道", "天津站"],
            distance: 24,
            time: 32
        },
        "刘园-营口道": {
            path: ["刘园", "西横堤", "果酒厂", "本溪路", "勤俭道", "洪湖里", "西站", "西北角", "西南角", "二纬路", "海光寺", "鞍山道", "营口道"],
            distance: 18,
            time: 25
        },
        "天津站-空港经济区": {
            path: ["天津站", "远洋国际中心", "顺驰桥", "靖江路", "翠阜新村", "屿东城", "登州路", "国山路", "空港经济区"],
            distance: 21,
            time: 28
        },
        "西站-财经大学": {
            path: ["西站", "西南角", "二纬路", "海光寺", "鞍山道", "营口道", "小白楼", "下瓦房", "南楼", "土城", "陈塘庄", "复兴门", "华山里", "财经大学"],
            distance: 22,
            time: 30
        }
    };
    
    // 检查是否有预定义的路径
    const key1 = `${start}-${end}`;
    const key2 = `${end}-${start}`;
    
    if (pathDatabase[key1]) {
        return pathDatabase[key1];
    } else if (pathDatabase[key2]) {
        // 如果是反向的，返回反向路径
        const result = pathDatabase[key2];
        return {
            path: [...result.path].reverse(),
            distance: result.distance,
            time: result.time
        };
    } else {
        // 生成一个模拟路径
        const allStations = stations.map(s => s.name);
        const startIndex = allStations.indexOf(start);
        const endIndex = allStations.indexOf(end);
        
        if (startIndex === -1 || endIndex === -1) {
            return null;
        }
        
        // 创建一个简单的模拟路径（在实际项目中应该使用真实算法）
        const path = [];
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        
        for (let i = minIndex; i <= maxIndex; i++) {
            path.push(allStations[i]);
        }
        
        if (startIndex > endIndex) {
            path.reverse();
        }
        
        const distance = Math.abs(endIndex - startIndex) * 2 + 5;
        const time = Math.abs(endIndex - startIndex) * 3 + 5;
        
        return {
            path: path,
            distance: distance,
            time: time
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 填充站点选择框
    const startSelect = document.getElementById('start-station');
    const endSelect = document.getElementById('end-station');
    const stationList = document.getElementById('station-list');
    
    stations.forEach(station => {
        // 填充起点选择框
        const startOption = document.createElement('option');
        startOption.value = station.name;
        startOption.textContent = station.name;
        startSelect.appendChild(startOption);
        
        // 填充终点选择框
        const endOption = document.createElement('option');
        endOption.value = station.name;
        endOption.textContent = station.name;
        endSelect.appendChild(endOption);
        
        // 填充站点列表
        const stationItem = document.createElement('div');
        stationItem.className = 'station-item';
        stationItem.textContent = `${station.id}. ${station.name}`;
        stationList.appendChild(stationItem);
    });
    
    // 设置默认测试数据
    startSelect.value = "刘园";
    endSelect.value = "天津站";
});

// 查询最优路径
function findShortestPath() {
    const startStation = document.getElementById('start-station').value;
    const endStation = document.getElementById('end-station').value;
    
    if (!startStation || !endStation) {
        showError("请选择起点和终点站点！");
        return;
    }
    
    if (startStation === endStation) {
        showError("起点和终点不能相同！");
        return;
    }
    
    // 显示加载动画
    const loading = document.getElementById('loading');
    const progressBar = document.getElementById('progress-bar');
    loading.style.display = 'block';
    progressBar.style.width = '0%';
    
    // 模拟加载进度
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // 模拟网络延迟
            setTimeout(() => {
                const result = simulateDijkstra(startStation, endStation);
                
                if (result) {
                    displayResult(result, startStation, endStation);
                } else {
                    showError("无法找到路径，请检查站点名称！");
                }
                
                loading.style.display = 'none';
            }, 500);
        }
    }, 100);
}

// 显示结果
function displayResult(result, start, end) {
    const resultSection = document.getElementById('result-section');
    const pathDisplay = document.getElementById('path-display');
    const totalInfo = document.getElementById('total-info');
    const errorMessage = document.getElementById('error-message');
    
    // 隐藏错误信息
    errorMessage.style.display = 'none';
    
    // 构建路径显示
    let pathHTML = '';
    result.path.forEach((station, index) => {
        pathHTML += `<span class="station">${station}</span>`;
        if (index < result.path.length - 1) {
            pathHTML += '<span class="arrow">→</span>';
        }
    });
    
    pathDisplay.innerHTML = pathHTML;
    
    // 构建总信息
    totalInfo.innerHTML = `
        <div>
            <strong>总距离：${result.distance} km</strong> | 
            <strong>预计时间：${result.time} 分钟</strong> |
            <strong>经过站点数：${result.path.length}</strong>
        </div>
        <div style="font-size: 0.9rem; margin-top: 5px;">
            从 <strong>${start}</strong> 到 <strong>${end}</strong> 的最优路径
        </div>
    `;
    
    // 显示结果区域
    resultSection.style.display = 'block';
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示错误信息
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // 隐藏结果区域
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    
    // 滚动到错误信息
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}