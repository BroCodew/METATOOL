const orginalValue = [
    {
        Balance:"10",
        Debt:'100',
    },
    {
        Balance:"20",
        Debt:'200',
    },
    {
        Balance:"30",
        Debt:'300',
    }
]

const value =   [
    {
        "DEBT": 625.600333808
    },
    {
        "DEBT": 7633.182397893046
    },
    {
        "DEBT": 3451.634179490012
    }
]


const changeValue = [...orginalValue,  {
    Balance:"40",
    Debt:'400',
}];

const updatedOrginalValue = orginalValue.map((item, index) => ({
    ...item,
    Debt: value[index].DEBT.toString(), // Chuyển đổi sang chuỗi nếu cần thiết
}));

console.log(updatedOrginalValue);
