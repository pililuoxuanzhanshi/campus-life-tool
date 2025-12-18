// 数据存储（使用localStorage）
const STORAGE_KEYS = {
    NOTICE: 'campus_notice',
    LOST: 'lost_items',
    TRADE: 'trade_items',
    SCHEDULE: 'course_schedule'
};

// 当前活动标签
let currentTab = 'notice';
let currentModalType = '';

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签页切换
    initTabs();
    
    // 加载所有模块数据
    loadAllData();
    
    // 显示项目URL
    updateProjectUrl();
});

// 标签页切换
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新活动按钮
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应的内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            currentTab = tabId;
        });
    });
}

// 加载所有模块数据
function loadAllData() {
    loadNotices();
    loadLostItems();
    loadTradeItems();
    loadSchedule();
}

// 校园通知模块
function loadNotices() {
    const container = document.getElementById('noticeList');
    const notices = getData(STORAGE_KEYS.NOTICE) || getDefaultNotices();
    
    container.innerHTML = '';
    
    notices.forEach((notice, index) => {
        const noticeEl = document.createElement('div');
        noticeEl.className = 'notice-item';
        noticeEl.innerHTML = `
            <div class="notice-title">
                <span>${notice.title}</span>
                <button class="delete-btn" onclick="deleteNotice(${index})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
            <div class="notice-date">
                <i class="far fa-clock"></i> ${notice.date} • 发布人: ${notice.publisher}
            </div>
            <div class="notice-content">${notice.content}</div>
        `;
        container.appendChild(noticeEl);
    });
}

function addNotice() {
    currentModalType = 'notice';
    showModal('发布校园通知', `
        <div class="form-group">
            <label>通知标题</label>
            <input type="text" id="noticeTitle" placeholder="例如: 图书馆临时闭馆通知" required>
        </div>
        <div class="form-group">
            <label>发布人</label>
            <input type="text" id="noticePublisher" placeholder="例如: 教务处" required>
        </div>
        <div class="form-group">
            <label>通知内容</label>
            <textarea id="noticeContent" rows="4" placeholder="请输入详细通知内容..." required></textarea>
        </div>
    `, saveNotice);
}

function saveNotice() {
    const title = document.getElementById('noticeTitle').value;
    const publisher = document.getElementById('noticePublisher').value;
    const content = document.getElementById('noticeContent').value;
    
    if (!title || !publisher || !content) {
        alert('请填写完整信息');
        return;
    }
    
    const notices = getData(STORAGE_KEYS.NOTICE) || getDefaultNotices();
    const newNotice = {
        title,
        publisher,
        content,
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    notices.unshift(newNotice);
    saveData(STORAGE_KEYS.NOTICE, notices);
    loadNotices();
    closeModal();
}

function deleteNotice(index) {
    if (confirm('确定要删除这条通知吗？')) {
        const notices = getData(STORAGE_KEYS.NOTICE) || [];
        notices.splice(index, 1);
        saveData(STORAGE_KEYS.NOTICE, notices);
        loadNotices();
    }
}

// 失物招领模块
function loadLostItems() {
    const container = document.getElementById('lostItems');
    const items = getData(STORAGE_KEYS.LOST) || getDefaultLostItems();
    
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-card';
        itemEl.innerHTML = `
            <div class="item-image">
                <i class="fas fa-${item.icon}"></i>
            </div>
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-desc">${item.description}</div>
                <div class="item-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                    <span><i class="far fa-clock"></i> ${item.date}</span>
                </div>
                <button class="delete-btn" onclick="deleteLostItem(${index})" style="margin-top: 10px;">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

function addLostItem() {
    currentModalType = 'lost';
    showModal('发布失物招领', `
        <div class="form-group">
            <label>物品名称</label>
            <input type="text" id="lostTitle" placeholder="例如: 黑色钱包" required>
        </div>
        <div class="form-group">
            <label>物品描述</label>
            <textarea id="lostDesc" rows="3" placeholder="详细描述物品特征..." required></textarea>
        </div>
        <div class="form-group">
            <label>丢失地点</label>
            <input type="text" id="lostLocation" placeholder="例如: 教学楼A座302" required>
        </div>
        <div class="form-group">
            <label>联系人</label>
            <input type="text" id="lostContact" placeholder="例如: 张三" required>
        </div>
    `, saveLostItem);
}

function saveLostItem() {
    const title = document.getElementById('lostTitle').value;
    const description = document.getElementById('lostDesc').value;
    const location = document.getElementById('lostLocation').value;
    const contact = document.getElementById('lostContact').value;
    
    if (!title || !description || !location || !contact) {
        alert('请填写完整信息');
        return;
    }
    
    const items = getData(STORAGE_KEYS.LOST) || [];
    const icons = ['key', 'wallet', 'phone', 'book', 'glasses', 'id-card'];
    const newItem = {
        title,
        description,
        location,
        contact,
        icon: icons[Math.floor(Math.random() * icons.length)],
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    items.unshift(newItem);
    saveData(STORAGE_KEYS.LOST, items);
    loadLostItems();
    closeModal();
}

function deleteLostItem(index) {
    if (confirm('确定要删除这条信息吗？')) {
        const items = getData(STORAGE_KEYS.LOST) || [];
        items.splice(index, 1);
        saveData(STORAGE_KEYS.LOST, items);
        loadLostItems();
    }
}

// 二手交易模块
function loadTradeItems() {
    const container = document.getElementById('tradeItems');
    const items = getData(STORAGE_KEYS.TRADE) || getDefaultTradeItems();
    
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-card';
        itemEl.innerHTML = `
            <div class="item-image" style="background: linear-gradient(90deg, ${item.color});">
                <i class="fas fa-${item.icon}"></i>
            </div>
            <div class="item-info">
                <div class="item-title">${item.title} <span style="color: #ff6b6b; font-weight: bold;">¥${item.price}</span></div>
                <div class="item-desc">${item.description}</div>
                <div class="item-meta">
                    <span><i class="fas fa-user"></i> ${item.seller}</span>
                    <span><i class="fas fa-phone"></i> ${item.phone}</span>
                </div>
                <button class="delete-btn" onclick="deleteTradeItem(${index})" style="margin-top: 10px;">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

function addTradeItem() {
    currentModalType = 'trade';
    showModal('发布二手商品', `
        <div class="form-group">
            <label>商品名称</label>
            <input type="text" id="tradeTitle" placeholder="例如: 笔记本电脑" required>
        </div>
        <div class="form-group">
            <label>商品描述</label>
            <textarea id="tradeDesc" rows="3" placeholder="商品详细信息和使用情况..." required></textarea>
        </div>
        <div class="form-group">
            <label>价格(元)</label>
            <input type="number" id="tradePrice" placeholder="例如: 1200" required>
        </div>
        <div class="form-group">
            <label>卖家姓名</label>
            <input type="text" id="tradeSeller" placeholder="例如: 李四" required>
        </div>
        <div class="form-group">
            <label>联系方式</label>
            <input type="text" id="tradePhone" placeholder="例如: 138xxxx5678" required>
        </div>
    `, saveTradeItem);
}

function saveTradeItem() {
    const title = document.getElementById('tradeTitle').value;
    const description = document.getElementById('tradeDesc').value;
    const price = document.getElementById('tradePrice').value;
    const seller = document.getElementById('tradeSeller').value;
    const phone = document.getElementById('tradePhone').value;
    
    if (!title || !description || !price || !seller || !phone) {
        alert('请填写完整信息');
        return;
    }
    
    const items = getData(STORAGE_KEYS.TRADE) || [];
    const icons = ['laptop', 'book', 'bicycle', 'tshirt', 'mobile-alt', 'headphones'];
    const colors = [
        '#a8edea, #fed6e3',
        '#fad0c4, #ffd1ff',
        '#ffecd2, #fcb69f',
        '#a1c4fd, #c2e9fb',
        '#d4fc79, #96e6a1'
    ];
    const newItem = {
        title,
        description,
        price,
        seller,
        phone,
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    items.unshift(newItem);
    saveData(STORAGE_KEYS.TRADE, items);
    loadTradeItems();
    closeModal();
}

function deleteTradeItem(index) {
    if (confirm('确定要删除这个商品吗？')) {
        const items = getData(STORAGE_KEYS.TRADE) || [];
        items.splice(index, 1);
        saveData(STORAGE_KEYS.TRADE, items);
        loadTradeItems();
    }
}

// 课表查询模块
function loadSchedule() {
    const container = document.getElementById('scheduleGrid');
    const schedule = getData(STORAGE_KEYS.SCHEDULE) || getDefaultSchedule();
    
    container.innerHTML = '';
    
    // 创建25个单元格（5天×5节课）
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'course-cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => editCourse(i);
        
        const day = Math.floor(i / 5);
        const timeSlot = i % 5;
        
        // 查找这个时间是否有课程
        const course = schedule.find(c => 
            c.day === day && c.timeSlot === timeSlot
        );
        
        if (course) {
            cell.classList.add('filled');
            cell.innerHTML = `
                <strong>${course.name}</strong>
                <small>${course.teacher}</small>
                <small>${course.location}</small>
            `;
        } else {
            cell.innerHTML = '<i class="fas fa-plus"></i><br><small>点击添加</small>';
        }
        
        container.appendChild(cell);
    }
}

function addCourse() {
    currentModalType = 'schedule';
    showModal('添加课程', `
        <div class="form-group">
            <label>课程名称</label>
            <input type="text" id="courseName" placeholder="例如: JavaScript高级应用" required>
        </div>
        <div class="form-group">
            <label>授课教师</label>
            <input type="text" id="courseTeacher" placeholder="例如: 王老师" required>
        </div>
        <div class="form-group">
            <label>上课地点</label>
            <input type="text" id="courseLocation" placeholder="例如: 计算机楼201" required>
        </div>
        <div class="form-group">
            <label>上课时间</label>
            <div style="display: flex; gap: 10px;">
                <select id="courseDay" style="flex: 1;">
                    <option value="0">周一</option>
                    <option value="1">周二</option>
                    <option value="2">周三</option>
                    <option value="3">周四</option>
                    <option value="4">周五</option>
                </select>
                <select id="courseTime" style="flex: 1;">
                    <option value="0">8:00-9:40</option>
                    <option value="1">10:00-11:40</option>
                    <option value="2">14:00-15:40</option>
                    <option value="3">16:00-17:40</option>
                    <option value="4">19:00-20:40</option>
                </select>
            </div>
        </div>
    `, saveCourse);
}

function editCourse(cellIndex) {
    const day = Math.floor(cellIndex / 5);
    const timeSlot = cellIndex % 5;
    
    const schedule = getData(STORAGE_KEYS.SCHEDULE) || [];
    const existingCourse = schedule.find(c => c.day === day && c.timeSlot === timeSlot);
    
    currentModalType = 'schedule';
    showModal(existingCourse ? '编辑课程' : '添加课程', `
        <div class="form-group">
            <label>课程名称</label>
            <input type="text" id="courseName" value="${existingCourse ? existingCourse.name : ''}" required>
        </div>
        <div class="form-group">
            <label>授课教师</label>
            <input type="text" id="courseTeacher" value="${existingCourse ? existingCourse.teacher : ''}" required>
        </div>
        <div class="form-group">
            <label>上课地点</label>
            <input type="text" id="courseLocation" value="${existingCourse ? existingCourse.location : ''}" required>
        </div>
        <div class="form-group">
            <label>上课时间</label>
            <div style="display: flex; gap: 10px;">
                <select id="courseDay" style="flex: 1;">
                    <option value="0" ${day === 0 ? 'selected' : ''}>周一</option>
                    <option value="1" ${day === 1 ? 'selected' : ''}>周二</option>
                    <option value="2" ${day === 2 ? 'selected' : ''}>周三</option>
                    <option value="3" ${day === 3 ? 'selected' : ''}>周四</option>
                    <option value="4" ${day === 4 ? 'selected' : ''}>周五</option>
                </select>
                <select id="courseTime" style="flex: 1;">
                    <option value="0" ${timeSlot === 0 ? 'selected' : ''}>8:00-9:40</option>
                    <option value="1" ${timeSlot === 1 ? 'selected' : ''}>10:00-11:40</option>
                    <option value="2" ${timeSlot === 2 ? 'selected' : ''}>14:00-15:40</option>
                    <option value="3" ${timeSlot === 3 ? 'selected' : ''}>16:00-17:40</option>
                    <option value="4" ${timeSlot === 4 ? 'selected' : ''}>19:00-20:40</option>
                </select>
            </div>
        </div>
    `, () => saveCourse(cellIndex));
}

function saveCourse(cellIndex = null) {
    const name = document.getElementById('courseName').value;
    const teacher = document.getElementById('courseTeacher').value;
    const location = document.getElementById('courseLocation').value;
    const day = parseInt(document.getElementById('courseDay').value);
    const timeSlot = parseInt(document.getElementById('courseTime').value);
    
    if (!name || !teacher || !location) {
        alert('请填写完整信息');
        return;
    }
    
    const schedule = getData(STORAGE_KEYS.SCHEDULE) || [];
    
    // 如果编辑特定单元格，先删除该时间段的旧课程
    if (cellIndex !== null) {
        const oldDay = Math.floor(cellIndex / 5);
        const oldTimeSlot = cellIndex % 5;
        const oldIndex = schedule.findIndex(c => c.day === oldDay && c.timeSlot === oldTimeSlot);
        if (oldIndex !== -1) {
            schedule.splice(oldIndex, 1);
        }
    }
    
    // 删除新时间段上可能已存在的课程
    const existingIndex = schedule.findIndex(c => c.day === day && c.timeSlot === timeSlot);
    if (existingIndex !== -1) {
        schedule.splice(existingIndex, 1);
    }
    
    // 添加新课程
    schedule.push({ name, teacher, location, day, timeSlot });
    saveData(STORAGE_KEYS.SCHEDULE, schedule);
    loadSchedule();
    closeModal();
}

// 模态框功能
function showModal(title, formHTML, submitCallback) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalForm').innerHTML = formHTML + `
        <div class="form-actions">
            <button type="button" class="cancel-btn" onclick="closeModal()">取消</button>
            <button type="button" class="submit-btn" onclick="modalSubmit()">提交</button>
        </div>
    `;
    
    window.modalSubmit = submitCallback;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    window.modalSubmit = null;
}

// 数据存储辅助函数
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 默认数据
function getDefaultNotices() {
    return [
        {
            title: "图书馆系统升级通知",
            publisher: "图书馆",
            date: "2024-03-10",
            content: "图书馆管理系统将于3月15日进行升级维护，届时将暂停借还书服务，请同学们提前安排。"
        },
        {
            title: "春季校园招聘会",
            publisher: "就业指导中心",
            date: "2024-03-08",
            content: "2024年春季校园招聘会将于3月20日在体育馆举行，欢迎2024届毕业生携带简历参加。"
        }
    ];
}

function getDefaultLostItems() {
    return [
        {
            title: "黑色钱包",
            description: "内含身份证、学生卡和少量现金",
            location: "食堂二楼",
            contact: "李同学 138****1234",
            icon: "wallet",
            date: "2024-03-05"
        },
        {
            title: "无线耳机",
            description: "白色AirPods，有保护套",
            location: "教学楼B座",
            contact: "王老师",
            icon: "headphones",
            date: "2024-03-03"
        }
    ];
}

function getDefaultTradeItems() {
    return [
        {
            title: "二手自行车",
            description: "九成新，送锁和打气筒",
            price: "280",
            seller: "张同学",
            phone: "139****5678",
            icon: "bicycle",
            color: "#ffecd2, #fcb69f",
            date: "2024-03-07"
        },
        {
            title: "Java编程书籍",
            description: "《Java核心技术》第11版，几乎全新",
            price: "45",
            seller: "刘同学",
            phone: "137****3456",
            icon: "book",
            color: "#a1c4fd, #c2e9fb",
            date: "2024-03-06"
        }
    ];
}

function getDefaultSchedule() {
    return [
        { name: "JavaScript高级应用", teacher: "王老师", location: "计-201", day: 0, timeSlot: 0 },
        { name: "数据库原理", teacher: "张老师", location: "计-305", day: 1, timeSlot: 1 },
        { name: "Web前端开发", teacher: "李老师", location: "计-102", day: 2, timeSlot: 2 },
        { name: "软件工程", teacher: "赵老师", location: "计-403", day: 3, timeSlot: 3 },
        { name: "计算机网络", teacher: "刘老师", location: "计-208", day: 4, timeSlot: 4 }
    ];
}

// GitHub Pages部署功能
function updateProjectUrl() {
    // 尝试从URL获取GitHub Pages地址
    const urlElement = document.getElementById('projectUrl');
    const currentUrl = window.location.href;
    
    if (currentUrl.includes('github.io')) {
        urlElement.textContent = currentUrl;
        urlElement.style.color = "#4b6cb7";
        urlElement.style.fontWeight = "bold";
    }
}

function copyUrl() {
    const url = document.getElementById('projectUrl').textContent;
    navigator.clipboard.writeText(url).then(() => {
        alert('网址已复制到剪贴板！');
    });
}

// 初始化一些数据（如果本地存储为空）
function initDefaultData() {
    if (!getData(STORAGE_KEYS.NOTICE)) saveData(STORAGE_KEYS.NOTICE, getDefaultNotices());
    if (!getData(STORAGE_KEYS.LOST)) saveData(STORAGE_KEYS.LOST, getDefaultLostItems());
    if (!getData(STORAGE_KEYS.TRADE)) saveData(STORAGE_KEYS.TRADE, getDefaultTradeItems());
    if (!getData(STORAGE_KEYS.SCHEDULE)) saveData(STORAGE_KEYS.SCHEDULE, getDefaultSchedule());
}

// 初始化默认数据
initDefaultData();