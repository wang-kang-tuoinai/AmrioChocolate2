@echo off
echo 正在启动哆啦A梦道具大全网页应用...
echo.
echo 请选择启动方式：
echo 1. 直接打开HTML文件（推荐）
echo 2. 启动本地服务器（需要Python）
echo.
set /p choice=请输入选择 (1 或 2): 

if "%choice%"=="1" (
    echo 正在打开网页...
    start index.html
    echo 网页已打开！
) else if "%choice%"=="2" (
    echo 正在启动本地服务器...
    python -m http.server 8000
    echo.
    echo 服务器已启动！
    echo 请在浏览器中访问: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
) else (
    echo 无效选择，正在直接打开HTML文件...
    start index.html
)

pause 