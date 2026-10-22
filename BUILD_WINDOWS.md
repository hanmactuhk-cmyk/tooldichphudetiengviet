# Hướng dẫn Build File .exe Tự động trên GitHub Actions

Repository của bạn đã được cấu hình sẵn sàng toàn bộ mã nguồn Electron, Python Worker và GitHub Actions Workflow (`.github/workflows/build-windows-exe.yml`).

## Các bước để nhận file `.exe` tự động:

1. **Đẩy mã nguồn lên GitHub**:
   - Tạo một repository mới trên GitHub (ví dụ: `hn-voice-studio`).
   - Đẩy toàn bộ mã nguồn của dự án này lên repository của bạn:
     ```bash
     git init
     git add .
     git commit -m "Initial commit - HN Voice Studio v3 Turbo Offline"
     git branch -M main
     git remote add origin https://github.com/TEN_TAI_KHOAN_GITHUB/hn-voice-studio.git
     git push -u origin main
     ```

2. **Theo dõi quá trình Build tự động**:
   - Truy cập vào repository trên GitHub của bạn.
   - Nhấp vào tab **Actions**.
   - Bạn sẽ thấy workflow **"Build Windows Exe"** đang chạy tự động. GitHub Actions sẽ sử dụng máy chủ Windows để cài đặt Node.js, Python, build giao diện Vite và đóng gói thành phần mềm `.exe`.

3. **Tải file `.exe` về máy**:
   - Sau khi quá trình build hoàn tất (khoảng 3-5 phút), nhấn vào workflow chạy thành công.
   - Cuộn xuống phần **Artifacts**, tải xuống file **`HN-Voice-Studio-Windows-Installer`**.
   - Giải nén ra, bạn sẽ nhận được file cài đặt `.exe` của **HN Voice Studio** để chạy trên máy tính Windows!
