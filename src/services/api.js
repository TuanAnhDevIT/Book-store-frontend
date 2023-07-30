import axios from '../utils/axios-customize';

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const callDeleteUser = (userId) => {
    return axios.delete(`api/v1/user/${userId}`)
}

// export const callDeleteUser = (id) => {
//     return axios.delete(`api/v1/user/${id}`)
// }

export const callCreateAUser = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user', { fullName, email, password, phone })
}

export const callBulkCreateUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put('/api/v1/user', { _id, fullName, phone })
}

///////////////
export const callFetchListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const callDeleteBook = (bookId) => {
    return axios.delete(`api/v1/book/${bookId}`)
}

export const callCreateABook = (mainText, author, price, category, quantity, sold, thumbnail, slider) => {
    return axios.post('/api/v1/book', { mainText, author, price, category, quantity, sold, thumbnail, slider })
}

export const callFetchCategory = (data) => {
    return axios.get('/api/v1/database/category', data)
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData(); bodyFormData.append('fileImg', fileImg); return axios({
        method: 'post',
        url: '/api/v1/file/upload', data: bodyFormData, headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

export const callUpdateBook = (_id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.put(`/api/v1/book/${_id}`, { _id, thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const callFetchBookById = (id) => {
    return axios.get(`/api/v1/book/${id}`)
}

export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/order', {
        ...data
    })
}

/////////////
export const callHistory = () => {
    return axios.get('/api/v1/history')
}

/////

export const callUpdateAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar" // Xóa dấu nháy đơn cuối cùng ở đây
        }
    });
}

export const callUpdateUserInfo = (_id, phone, fullName, avatar) => {
    return axios.put(`/api/v1/user`, {
        _id, phone, fullName, avatar
    })
}

export const callUpdatePassword = (email, oldpass, newpass) => {
    return axios.post(`/api/v1/user/change-password`, {
        email, oldpass, newpass
    })
}
//////
export const callFetchDashboard = () => {
    return axios.get('/api/v1/database/dashboard')
}

/////
export const callFetchListOrder = (query) => {
    return axios.get(`/api/v1/order?${query}`)
}