/**
 * 學測英文練習系統 - 圖表視覺化模組
 * GSAT English Practice System - Chart Visualization Module
 * 
 * 提供基本的圖表視覺化功能，無需外部依賴
 * Basic chart visualization functionality without external dependencies
 */

class GSATCharts {
    constructor() {
        this.colors = {
            primary: '#007bff',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8',
            secondary: '#6c757d'
        };

        this.gradientColors = [
            '#007bff', '#28a745', '#ffc107', '#dc3545', 
            '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'
        ];
    }

    /**
     * 創建長條圖
     */
    createBarChart(containerId, data, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            title = '',
            maxValue = Math.max(...data.map(d => d.value)),
            height = 300,
            showValues = true,
            color = this.colors.primary
        } = config;

        const chartHTML = `
            <div class="gsat-chart">
                ${title ? `<h4 class="chart-title">${title}</h4>` : ''}
                <div class="bar-chart" style="height: ${height}px;">
                    ${data.map((item, index) => {
                        const barHeight = (item.value / maxValue) * (height - 40);
                        const barColor = Array.isArray(color) ? color[index % color.length] : color;
                        
                        return `
                            <div class="bar-item" style="flex: 1; display: flex; flex-direction: column; align-items: center; margin: 0 2px;">
                                <div class="bar-container" style="height: ${height - 40}px; display: flex; align-items: flex-end; width: 100%;">
                                    <div class="bar" 
                                         style="width: 100%; height: ${barHeight}px; background: linear-gradient(45deg, ${barColor}, ${this.lightenColor(barColor, 20)}); 
                                                border-radius: 4px 4px 0 0; transition: all 0.3s ease; cursor: pointer;"
                                         title="${item.label}: ${item.value}${config.unit || ''}"
                                         onmouseover="this.style.opacity='0.8'"
                                         onmouseout="this.style.opacity='1'">
                                        ${showValues ? `<div class="bar-value" style="position: relative; top: -25px; text-align: center; font-size: 0.8rem; font-weight: bold; color: ${barColor};">${item.value}${config.unit || ''}</div>` : ''}
                                    </div>
                                </div>
                                <div class="bar-label" style="margin-top: 5px; text-align: center; font-size: 0.75rem; color: #666; word-break: break-word;">${item.label}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        container.innerHTML = chartHTML;
    }

    /**
     * 創建圓餅圖
     */
    createPieChart(containerId, data, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            title = '',
            size = 200,
            showLabels = true,
            showPercentages = true
        } = config;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        const pieSlices = data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const color = this.gradientColors[index % this.gradientColors.length];
            
            const slice = this.createPieSlice(currentAngle, angle, color, size);
            currentAngle += angle;
            
            return {
                ...item,
                percentage: percentage.toFixed(1),
                color,
                slice
            };
        });

        const chartHTML = `
            <div class="gsat-chart">
                ${title ? `<h4 class="chart-title">${title}</h4>` : ''}
                <div class="pie-chart-container" style="display: flex; align-items: center; justify-content: center; gap: 2rem;">
                    <div class="pie-chart" style="position: relative; width: ${size}px; height: ${size}px;">
                        <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
                            ${pieSlices.map(slice => slice.slice).join('')}
                        </svg>
                    </div>
                    ${showLabels ? `
                        <div class="pie-legend">
                            ${pieSlices.map(slice => `
                                <div class="legend-item" style="display: flex; align-items: center; margin: 0.25rem 0;">
                                    <div style="width: 12px; height: 12px; background: ${slice.color}; border-radius: 2px; margin-right: 0.5rem;"></div>
                                    <span style="font-size: 0.85rem;">
                                        ${slice.label}
                                        ${showPercentages ? `<span style="color: #666;">(${slice.percentage}%)</span>` : ''}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        container.innerHTML = chartHTML;
    }

    /**
     * 創建折線圖
     */
    createLineChart(containerId, data, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            title = '',
            width = 500,
            height = 300,
            showPoints = true,
            color = this.colors.primary,
            gridLines = true
        } = config;

        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const valueRange = maxValue - minValue || 1;

        const chartWidth = width - 80;
        const chartHeight = height - 80;
        const stepX = chartWidth / (data.length - 1 || 1);

        const points = data.map((item, index) => {
            const x = 40 + index * stepX;
            const y = height - 40 - ((item.value - minValue) / valueRange) * chartHeight;
            return { x, y, ...item };
        });

        const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

        const chartHTML = `
            <div class="gsat-chart">
                ${title ? `<h4 class="chart-title">${title}</h4>` : ''}
                <div class="line-chart">
                    <svg width="${width}" height="${height}" style="background: #fafafa; border: 1px solid #dee2e6; border-radius: 4px;">
                        ${gridLines ? this.createGridLines(width, height, data.length) : ''}
                        
                        <!-- 數據線 -->
                        <path d="${pathD}" 
                              stroke="${color}" 
                              stroke-width="2" 
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                        
                        <!-- 填充區域 -->
                        <path d="${pathD} L ${points[points.length-1].x},${height-40} L 40,${height-40} Z" 
                              fill="url(#gradient-${containerId})" 
                              opacity="0.1"/>
                        
                        <!-- 數據點 -->
                        ${showPoints ? points.map(point => `
                            <circle cx="${point.x}" 
                                   cy="${point.y}" 
                                   r="4" 
                                   fill="${color}" 
                                   stroke="white" 
                                   stroke-width="2"
                                   style="cursor: pointer;"
                                   title="${point.label}: ${point.value}">
                            </circle>
                        `).join('') : ''}
                        
                        <!-- X軸標籤 -->
                        ${points.map(point => `
                            <text x="${point.x}" 
                                  y="${height - 15}" 
                                  text-anchor="middle" 
                                  font-size="10" 
                                  fill="#666">
                                ${point.label}
                            </text>
                        `).join('')}
                        
                        <!-- Y軸標籤 -->
                        ${this.createYAxisLabels(minValue, maxValue, height)}
                        
                        <!-- 漸層定義 -->
                        <defs>
                            <linearGradient id="gradient-${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
                                <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        `;

        container.innerHTML = chartHTML;
    }

    /**
     * 創建進度圓圈
     */
    createProgressCircle(containerId, percentage, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            size = 120,
            strokeWidth = 8,
            color = this.colors.success,
            backgroundColor = '#e9ecef',
            showPercentage = true,
            label = ''
        } = config;

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        const chartHTML = `
            <div class="gsat-chart progress-circle" style="text-align: center;">
                <div style="position: relative; display: inline-block;">
                    <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
                        <circle cx="${size/2}" 
                               cy="${size/2}" 
                               r="${radius}"
                               stroke="${backgroundColor}" 
                               stroke-width="${strokeWidth}" 
                               fill="none"/>
                        <circle cx="${size/2}" 
                               cy="${size/2}" 
                               r="${radius}"
                               stroke="${color}" 
                               stroke-width="${strokeWidth}" 
                               fill="none"
                               stroke-dasharray="${circumference}"
                               stroke-dashoffset="${offset}"
                               stroke-linecap="round"
                               style="transition: stroke-dashoffset 0.5s ease-in-out;"/>
                    </svg>
                    ${showPercentage ? `
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: ${size/6}px; font-weight: bold; color: ${color};">
                            ${Math.round(percentage)}%
                        </div>
                    ` : ''}
                </div>
                ${label ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">${label}</div>` : ''}
            </div>
        `;

        container.innerHTML = chartHTML;
    }

    /**
     * 創建圓餅圖片段
     */
    createPieSlice(startAngle, angle, color, size) {
        const center = size / 2;
        const radius = size / 2 - 10;
        
        const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
        const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
        const endX = center + radius * Math.cos(((startAngle + angle) * Math.PI) / 180);
        const endY = center + radius * Math.sin(((startAngle + angle) * Math.PI) / 180);
        
        const largeArc = angle > 180 ? 1 : 0;
        
        return `
            <path d="M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z"
                  fill="${color}" 
                  stroke="white" 
                  stroke-width="2"
                  style="cursor: pointer; transition: opacity 0.3s ease;"
                  onmouseover="this.style.opacity='0.8'"
                  onmouseout="this.style.opacity='1'"/>
        `;
    }

    /**
     * 創建網格線
     */
    createGridLines(width, height, dataLength) {
        const gridLines = [];
        const stepY = (height - 80) / 5;
        const stepX = (width - 80) / (dataLength - 1 || 1);

        // 水平網格線
        for (let i = 0; i <= 5; i++) {
            const y = 40 + i * stepY;
            gridLines.push(`<line x1="40" y1="${y}" x2="${width-40}" y2="${y}" stroke="#e9ecef" stroke-width="1"/>`);
        }

        // 垂直網格線
        for (let i = 0; i < dataLength; i++) {
            const x = 40 + i * stepX;
            gridLines.push(`<line x1="${x}" y1="40" x2="${x}" y2="${height-40}" stroke="#e9ecef" stroke-width="1"/>`);
        }

        return gridLines.join('');
    }

    /**
     * 創建Y軸標籤
     */
    createYAxisLabels(minValue, maxValue, height) {
        const labels = [];
        const stepY = (height - 80) / 5;
        const valueStep = (maxValue - minValue) / 5;

        for (let i = 0; i <= 5; i++) {
            const y = height - 40 - i * stepY;
            const value = (minValue + i * valueStep).toFixed(1);
            labels.push(`
                <text x="30" 
                      y="${y + 4}" 
                      text-anchor="end" 
                      font-size="10" 
                      fill="#666">
                    ${value}
                </text>
            `);
        }

        return labels.join('');
    }

    /**
     * 顏色變淺
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#",""),16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    }

    /**
     * 創建多系列折線圖
     */
    createMultiLineChart(containerId, series, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            title = '',
            width = 600,
            height = 300,
            showPoints = true,
            gridLines = true
        } = config;

        // 找出所有數據的範圍
        const allValues = series.flatMap(s => s.data.map(d => d.value));
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);
        const valueRange = maxValue - minValue || 1;

        const chartWidth = width - 120;
        const chartHeight = height - 80;

        const chartHTML = `
            <div class="gsat-chart">
                ${title ? `<h4 class="chart-title">${title}</h4>` : ''}
                <div class="multi-line-chart" style="display: flex; gap: 1rem;">
                    <svg width="${width}" height="${height}" style="background: #fafafa; border: 1px solid #dee2e6; border-radius: 4px;">
                        ${gridLines ? this.createGridLines(width, height, series[0]?.data.length || 0) : ''}
                        
                        ${series.map((serie, serieIndex) => {
                            const color = this.gradientColors[serieIndex % this.gradientColors.length];
                            const stepX = chartWidth / (serie.data.length - 1 || 1);
                            
                            const points = serie.data.map((item, index) => {
                                const x = 60 + index * stepX;
                                const y = height - 40 - ((item.value - minValue) / valueRange) * chartHeight;
                                return { x, y, ...item };
                            });
                            
                            const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                            
                            return `
                                <!-- 數據線 -->
                                <path d="${pathD}" 
                                      stroke="${color}" 
                                      stroke-width="2" 
                                      fill="none"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                
                                <!-- 數據點 -->
                                ${showPoints ? points.map(point => `
                                    <circle cx="${point.x}" 
                                           cy="${point.y}" 
                                           r="3" 
                                           fill="${color}" 
                                           stroke="white" 
                                           stroke-width="1"
                                           style="cursor: pointer;"
                                           title="${serie.name}: ${point.value}">
                                    </circle>
                                `).join('') : ''}
                            `;
                        }).join('')}
                        
                        <!-- X軸標籤 -->
                        ${series[0]?.data.map((item, index) => {
                            const stepX = chartWidth / (series[0].data.length - 1 || 1);
                            const x = 60 + index * stepX;
                            return `
                                <text x="${x}" 
                                      y="${height - 15}" 
                                      text-anchor="middle" 
                                      font-size="10" 
                                      fill="#666">
                                    ${item.label}
                                </text>
                            `;
                        }).join('') || ''}
                        
                        <!-- Y軸標籤 -->
                        ${this.createYAxisLabels(minValue, maxValue, height)}
                    </svg>
                    
                    <!-- 圖例 -->
                    <div class="chart-legend" style="display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem;">
                        ${series.map((serie, index) => `
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 20px; height: 2px; background: ${this.gradientColors[index % this.gradientColors.length]};"></div>
                                <span style="font-size: 0.85rem; color: #666;">${serie.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = chartHTML;
    }
}

// 導出圖表類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSATCharts;
}