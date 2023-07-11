import axios from "axios";

// lấy url gốc từ biến môi trường vite
const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Tạo một instance của Axios với các cấu hình cơ bản
const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Thiết lập header Authorization với access token từ localStorage
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

// Xử lý refresh token
//Định nghĩa hàm handleRefreshToken để gửi yêu cầu refresh token lên server 
//và trả về access token mới.
const handleRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh');
    if (res && res.data) return res.data.access_token;
    else null;
}

// Thêm interceptor cho request
instance.interceptors.request.use(function (config) {
    // Thực hiện một số thay đổi trước khi gửi request
    return config;
}, function (error) {
    // Xử lý lỗi khi gửi request
    return Promise.reject(error);
});

// Header để đánh dấu request không được retry
const NO_RETRY_HEADER = 'x-no-retry'

// Thêm interceptor cho response
instance.interceptors.response.use(function (response) {
    // Xử lý response thành công
    return response && response.data ? response.data : response;
}, async function (error) {
    // Xử lý lỗi response
    // Nếu mã trạng thái là 401 và không có header x-no-retry
    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        // Gọi hàm handleRefreshToken để lấy access token mới
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            // Cập nhật header Authorization và lưu access token vào localStorage
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token)
            // Thử gửi lại request
            return instance.request(error.config);
        }
    }
    // Nếu mã trạng thái là 400 và url là '/api/v1/auth/refresh'
    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh'
    ) {
        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/login';
    }
    // Trả về dữ liệu lỗi hoặc reject promise
    return error?.response?.data ?? Promise.reject(error);
});

export default instance;