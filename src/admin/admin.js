// Admin Panel Logic - Arcane Puzzle Hub

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLogin();
  initNavigation();
  initEditor();
  initAnalytics();
  initFeedback();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
  const themeSwitch = document.getElementById('checkbox');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeSwitch.checked = false;
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateChartsTheme('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateChartsTheme('light');
    }
  });
}

/* ==========================================================================
   Login / Auth Simulation
   ========================================================================== */
function initLogin() {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const adminDashboard = document.getElementById('admin-dashboard');
  const logoutBtn = document.getElementById('logout-btn');

  // Check session
  if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const role = document.getElementById('role').value;

    // Simulate login
    sessionStorage.setItem('adminLoggedIn', 'true');
    sessionStorage.setItem('adminUser', username);
    sessionStorage.setItem('adminRole', role);
    
    showDashboard();
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminRole');
    
    adminDashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  });

  function showDashboard() {
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    
    document.getElementById('display-username').textContent = sessionStorage.getItem('adminUser') || 'Admin';
    const roleStr = sessionStorage.getItem('adminRole') || 'Administrator';
    document.getElementById('display-role').textContent = roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
    
    // Refresh charts if analytics is active
    if (!window.chartsInitialized) {
      setTimeout(renderCharts, 100);
      window.chartsInitialized = true;
    }
  }
}

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.dashboard-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.add('hidden'));

      // Add active to clicked
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
    });
  });
}

/* ==========================================================================
   Puzzle Editor Drag & Drop
   ========================================================================== */
function initEditor() {
  const draggables = document.querySelectorAll('.draggable-item');
  const canvas = document.getElementById('puzzle-canvas');
  const publishBtn = document.getElementById('publish-btn');
  const statusBadge = document.querySelector('.status-badge');

  function addElementToCanvas(type) {
    // Remove placeholder
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.remove();

    // Create element
    const el = document.createElement('div');
    el.classList.add('canvas-item');
    
    const icons = {
      'block': '🧱',
      'gem': '💎',
      'trap': '🔥',
      'portal': '🌀'
    };
    
    el.innerHTML = `
      <span class="canvas-item-icon">${icons[type] || '❔'}</span>
      <div class="remove-btn">×</div>
    `;

    // Remove logic
    el.querySelector('.remove-btn').addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the item click
      el.remove();
      if (canvas.children.length === 0) {
        canvas.innerHTML = '<div class="canvas-placeholder">Select elements to build your puzzle</div>';
      }
      statusBadge.textContent = 'Draft';
      statusBadge.className = 'status-badge draft';
    });
    
    // Shuffle logic: Clicking the block changes it to a random different type dynamically
    el.addEventListener('click', () => {
      if (el.classList.contains('shuffling')) return;
      
      el.classList.add('shuffling');

      // Change the icon exactly when it's rotated 90deg (halfway through the 0.4s animation = 0.2s)
      setTimeout(() => {
        const types = ['block', 'gem', 'trap', 'portal'];
        const availableTypes = types.filter(t => icons[t] !== el.querySelector('.canvas-item-icon').textContent);
        const newType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        el.querySelector('.canvas-item-icon').textContent = icons[newType];
        statusBadge.textContent = 'Draft';
        statusBadge.className = 'status-badge draft';
      }, 200);

      // Remove the shuffling class after animation ends
      setTimeout(() => {
        el.classList.remove('shuffling');
      }, 400);
    });

    canvas.appendChild(el);
    statusBadge.textContent = 'Draft';
    statusBadge.className = 'status-badge draft';
  }

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', draggable.dataset.type);
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
    
    // Allow clicking to add
    draggable.addEventListener('click', () => {
      addElementToCanvas(draggable.dataset.type);
    });
  });

  canvas.addEventListener('dragover', e => {
    e.preventDefault();
    canvas.style.borderColor = 'rgba(130, 140, 255, 0.5)';
  });

  canvas.addEventListener('dragleave', () => {
    canvas.style.borderColor = 'transparent';
  });

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    canvas.style.borderColor = 'transparent';
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;

    addElementToCanvas(type);
  });

  publishBtn.addEventListener('click', () => {
    if (canvas.querySelector('.canvas-placeholder')) {
      alert("Cannot publish an empty puzzle!");
      return;
    }
    statusBadge.textContent = 'Published';
    statusBadge.className = 'status-badge published';
  });

  // Board Tools
  const shuffleBtn = document.getElementById('btn-shuffle');
  const autofillBtn = document.getElementById('btn-autofill');
  const clearBtn = document.getElementById('btn-clear');

  shuffleBtn.addEventListener('click', () => {
    const items = Array.from(canvas.querySelectorAll('.canvas-item'));
    if (items.length === 0) return;
    
    // Extract current icons to shuffle them
    const currentIcons = items.map(item => item.querySelector('.canvas-item-icon').textContent);
    
    // Fisher-Yates shuffle the icons array
    for (let i = currentIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentIcons[i], currentIcons[j]] = [currentIcons[j], currentIcons[i]];
    }

    // Apply cascading 3D flip to all items
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('shuffling');

        // Swap the icon halfway through the flip
        setTimeout(() => {
          item.querySelector('.canvas-item-icon').textContent = currentIcons[index];
        }, 200);

        // Remove the shuffling class
        setTimeout(() => {
          item.classList.remove('shuffling');
        }, 400);

      }, index * 25); // 25ms stagger between each block
    });

    statusBadge.textContent = 'Draft';
    statusBadge.className = 'status-badge draft';
  });

  autofillBtn.addEventListener('click', () => {
    const items = Array.from(canvas.querySelectorAll('.canvas-item'));
    const totalSlots = 64; // 8x8 grid
    const remaining = totalSlots - items.length;
    
    if (remaining > 0) {
      const types = ['block', 'gem', 'trap', 'portal'];
      for (let i = 0; i < remaining; i++) {
        const randomType = types[Math.floor(Math.random() * types.length)];
        addElementToCanvas(randomType);
      }
    }
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire board?')) {
      canvas.innerHTML = '<div class="canvas-placeholder">Select elements to build your puzzle</div>';
      statusBadge.textContent = 'Draft';
      statusBadge.className = 'status-badge draft';
    }
  });
}

/* ==========================================================================
   Analytics Dashboard
   ========================================================================== */
let compChartInstance = null;
let funnelChartInstance = null;

function initAnalytics() {
  // Postpone rendering until dashboard is visible
  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
  Chart.defaults.font.family = "'Inter', sans-serif";
}

function renderCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#cbd5e1' : '#4b5563';

  const ctxComp = document.getElementById('completionChart');
  if (compChartInstance) compChartInstance.destroy();
  
  compChartInstance = new Chart(ctxComp, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Completion Rate (%)',
        data: [65, 59, 80, 81, 56, 55, 68],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      },
      plugins: { legend: { labels: { color: textColor } } }
    }
  });

  const ctxFunnel = document.getElementById('funnelChart');
  if (funnelChartInstance) funnelChartInstance.destroy();
  
  funnelChartInstance = new Chart(ctxFunnel, {
    type: 'bar',
    data: {
      labels: ['Started Level 1', 'Completed Lvl 1', 'Completed Lvl 2', 'Completed Lvl 3', 'Game Finished'],
      datasets: [{
        label: 'Players',
        data: [1200, 950, 600, 300, 150],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(99, 102, 241, 0.6)',
          'rgba(99, 102, 241, 0.4)',
          'rgba(99, 102, 241, 0.3)',
          'rgba(99, 102, 241, 0.2)'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function updateChartsTheme(theme) {
  if (compChartInstance && funnelChartInstance) {
    renderCharts();
  }
}

/* ==========================================================================
   Feedback Inbox
   ========================================================================== */
const mockFeedback = [
  { id: '#FB-101', type: 'bug', priority: 'high', desc: 'Game crashes on Level 3 when using portal', player: 'ShadowMage', status: 'open' },
  { id: '#FB-102', type: 'suggestion', priority: 'medium', desc: 'Add more fire traps in hard mode', player: 'PuzzleMaster99', status: 'in-progress' },
  { id: '#FB-103', type: 'bug', priority: 'low', desc: 'Typo in tutorial text', player: 'Newbie123', status: 'resolved' },
];

function initFeedback() {
  const tbody = document.getElementById('feedback-tbody');
  
  function renderTable(data) {
    tbody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.id}</strong></td>
        <td><span class="tag ${item.type}">${item.type}</span></td>
        <td><span class="tag ${item.priority}">${item.priority}</span></td>
        <td>${item.desc}</td>
        <td>${item.player}</td>
        <td>
          <select class="status-select" data-id="${item.id}">
            <option value="open" ${item.status === 'open' ? 'selected' : ''}>Open</option>
            <option value="in-progress" ${item.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn btn-outline btn-sm">View</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add listeners for status change
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const feedback = mockFeedback.find(f => f.id === id);
        if (feedback) feedback.status = e.target.value;
      });
    });

    // Add listeners for delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const index = mockFeedback.findIndex(f => f.id === id);
        if (index > -1) {
          mockFeedback.splice(index, 1);
          renderTable(mockFeedback);
        }
      });
    });
  }

  renderTable(mockFeedback);

  // Filters
  const typeFilter = document.getElementById('filter-type');
  const statusFilter = document.getElementById('filter-status');

  function applyFilters() {
    const t = typeFilter.value;
    const s = statusFilter.value;
    
    const filtered = mockFeedback.filter(f => {
      return (t === 'all' || f.type === t) && (s === 'all' || f.status === s);
    });
    renderTable(filtered);
  }

  typeFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
}
