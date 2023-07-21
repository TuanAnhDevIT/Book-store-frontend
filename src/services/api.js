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

// export const callUpdateBook = (_id, fullName, phone) => {
//     return axios.put('/api/v1/user', { _id, fullName, phone })
// }