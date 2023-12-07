import React from "react";

const numberOfItems = 5;

// Sử dụng Array.from với hàm map để tạo mảng số thứ tự từ 1 đến numberOfItems
const indexArray = Array.from({ length: numberOfItems }, (_, index) => index + 1);

console.log(indexArray);

{Array.from({ length: 20 }, (_, i) => i + 1).map((num, key) => (
    <td className="tdInfo">
            {num}
    </td>
))}