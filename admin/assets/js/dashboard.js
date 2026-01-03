/* =========================================
   ADMIN DASHBOARD - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== REVENUE CHART =====
    const revenueChartCtx = document.getElementById('revenueChart');
    if (revenueChartCtx) {
        new Chart(revenueChartCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
                    borderColor: ChartColors.primary,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: ChartColors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [5, 5],
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ===== STATUS CHART =====
    const statusChartCtx = document.getElementById('statusChart');
    if (statusChartCtx) {
        new Chart(statusChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [45, 12, 35, 8],
                    backgroundColor: [
                        ChartColors.success,
                        ChartColors.warning,
                        ChartColors.primary,
                        ChartColors.danger
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // ===== ANIMATE STATS ON LOAD =====
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (element.textContent.includes('$')) {
                element.textContent = '$' + value.toLocaleString();
            } else if (element.textContent.includes('%')) {
                element.textContent = value + '%';
            } else {
                element.textContent = value.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        const value = parseInt(text.replace(/[^0-9]/g, ''));
        if (value) {
            stat.textContent = text.includes('$') ? '$0' : (text.includes('%') ? '0%' : '0');
            setTimeout(() => {
                animateValue(stat, 0, value, 1500);
            }, 100);
        }
    });

    // ===== REAL-TIME CLOCK =====
    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        console.log(dateString + ' - ' + timeString);
    };

    setInterval(updateClock, 1000);

    // ===== REFRESH DATA =====
    const refreshButton = document.querySelector('[data-refresh]');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            AdminUtils.showToast('Dashboard data refreshed', 'success');
            location.reload();
        });
    }

    // ===== TABLE ROW CLICK =====
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                console.log('Row clicked:', row);
            }
        });
    });

    console.log('%c📊 Dashboard Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});