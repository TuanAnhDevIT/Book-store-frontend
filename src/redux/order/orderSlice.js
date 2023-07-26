import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [] // thông tin cart
};


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id);//hàm findIndex sẽ trả ra index của ptu trong mảng với điều kiện trong ngoặc
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }
            //update redux
            state.carts = carts;
            message.success("Sản phẩm đã được thêm vào giỏ hàng")
        },

        doUpdateCartAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id);//hàm findIndex sẽ trả ra index của ptu trong mảng với điều kiện trong ngoặc
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }
            //update redux
            state.carts = carts;
        },

        doDeleteItemCartAction: (state, action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id);
        }
    },
});

export const { doAddBookAction, doUpdateCartAction, doDeleteItemCartAction } = orderSlice.actions;


export default orderSlice.reducer;
