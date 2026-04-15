#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量为 Support 详情页添加侧边栏导航
"""

import os
import re
from pathlib import Path

# Support 页面的侧边栏 HTML
SIDEBAR_HTML = '''    <!-- Technical Article Content with Sidebar -->
    <div class="container">
        <button class="sidebar-toggle" aria-expanded="false" aria-controls="sidebar-nav">
            <span>Support Navigation</span>
            <svg class="sidebar-toggle__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>

        <div class="sidebar-layout">
            <!-- Sidebar Navigation -->
            <aside class="sidebar-nav" id="sidebar-nav">
                <div class="sidebar-nav__header">Support Resources</div>
                <ul class="sidebar-nav__list">
                    <li class="sidebar-nav__section">Selection Guides</li>
                    <li class="sidebar-nav__item">
                        <a href="/support/selection-guides/led-selection-guide.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8v4"></path>
                                <path d="M12 16h.01"></path>
                            </svg>
                            LED Selection Guide
                        </a>
                    </li>
                    <li class="sidebar-nav__item">
                        <a href="/support/selection-guides/sic-selection.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            SiC Selection Guide
                        </a>
                    </li>
                    <li class="sidebar-nav__section">Design Guides</li>
                    <li class="sidebar-nav__item">
                        <a href="/support/design-guides/thermal-design.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                            </svg>
                            Thermal Design
                        </a>
                    </li>
                    <li class="sidebar-nav__item">
                        <a href="/support/design-guides/optical-design.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                            </svg>
                            Optical Design
                        </a>
                    </li>
                    <li class="sidebar-nav__item">
                        <a href="/support/design-guides/gate-drive-design.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                            Gate Drive Design
                        </a>
                    </li>
                    <li class="sidebar-nav__section">Application Notes</li>
                    <li class="sidebar-nav__item">
                        <a href="/support/application-notes/led-thermal-management.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            LED Thermal Management
                        </a>
                    </li>
                    <li class="sidebar-nav__item">
                        <a href="/support/application-notes/sic-gate-drive.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            SiC Gate Drive
                        </a>
                    </li>
                    <li class="sidebar-nav__section">Resources</li>
                    <li class="sidebar-nav__item">
                        <a href="/support/datasheets.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            Datasheets
                        </a>
                    </li>
                    <li class="sidebar-nav__item">
                        <a href="/support/faqs.html" class="sidebar-nav__link">
                            <svg class="sidebar-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            FAQs
                        </a>
                    </li>
                </ul>
            </aside>

            <!-- Main Content -->
            <div class="sidebar-layout__content">
'''

def get_relative_path(filepath):
    """根据文件路径确定相对路径"""
    depth = filepath.count('/') - 1  # 减去根目录
    if depth <= 0:
        return '.'
    return '/'.join(['..'] * depth)

def process_support_file(filepath):
    """处理单个 support 文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经有侧边栏
    if 'sidebar-layout' in content:
        print(f"Skipping {filepath} - already has sidebar")
        return
    
    # 获取当前文件名用于设置 active 状态
    filename = os.path.basename(filepath)
    
    # 修改侧边栏链接为相对路径
    rel_path = get_relative_path(filepath.replace('c:/Users/ymlt/Desktop/cree', ''))
    sidebar = SIDEBAR_HTML.replace('href="/support/', f'href="{rel_path}/support/')
    
    # 设置当前页面为 active
    sidebar = sidebar.replace(f'href="{rel_path}/support/', f'href="{rel_path}/support/')
    
    # 找到 <!-- Content --> 或 <!-- Technical Article Content --> 部分
    patterns = [
        r'(<!--\s*(?:Technical Article|Article|Solution|Product|Support)\s*Content\s*-->\s*<div class="container">)',
        r'(<!--\s*Content\s*-->\s*<div class="container">)',
    ]
    
    replaced = False
    for pattern in patterns:
        if re.search(pattern, content, re.IGNORECASE):
            content = re.sub(pattern, sidebar, content, flags=re.IGNORECASE, count=1)
            replaced = True
            break
    
    if not replaced:
        print(f"Could not find content marker in {filepath}")
        return
    
    # 在 </footer> 前添加结束标签
    # 找到最后一个 </section> 或 </article> 在 footer 之前
    footer_pattern = r'(</footer>)'
    closing_divs = '''            </div>
        </div>
    </div>

    <!-- Footer -->
'''
    content = re.sub(footer_pattern, closing_divs + r'<footer class="footer">', content, count=1)
    
    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Processed: {filepath}")

def main():
    base_dir = Path('c:/Users/ymlt/Desktop/cree/support')
    
    # 获取所有 HTML 文件
    html_files = list(base_dir.rglob('*.html'))
    
    # 排除 index.html
    html_files = [f for f in html_files if f.name != 'index.html']
    
    print(f"Found {len(html_files)} support detail pages to process")
    
    for filepath in html_files:
        try:
            process_support_file(str(filepath))
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    main()
