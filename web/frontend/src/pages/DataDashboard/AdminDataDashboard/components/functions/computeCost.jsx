/**
         * API cua EVN de tinh gia dien (dua tren kWh)
         * Trang web cua ENV:
         * https://www.evn.com.vn/c3/calc/Cong-cu-tinh-hoa-don-tien-dien-9-172.aspx
         * 
         * API cua EVN:
         * `POST https://calc.evn.com.vn/TinhHoaDon/api/Calculate`
         * request body (vi du):
         * `{
                "KIMUA_CSPK": "0",
                "LOAI_DDO": "1",
                "SO_HO": 1,
                "MA_CAPDAP": "1",
                "NGAY_DKY": "03/05/2024",
                "NGAY_CKY": "03/06/2024",
                "NGAY_DGIA": "01/01/1900",
                "HDG_BBAN_APGIA": [
                    {
                        "LOAI_BCS": "KT",
                        "TGIAN_BANDIEN": "KT",
                        "MA_NHOMNN": "SHBT",
                        "MA_NGIA": "A"
                    }
                ],
                "GCS_CHISO": [
                    {
                        "BCS": "KT",
                        "SAN_LUONG": "130", <------- kWh, chac minh chi can doi cai nay thoi la ok!
                        "LOAI_CHISO": "DDK"
                    }
                ]
            }`
         * Giu nguyen cai format cua request body tren, chi can thay doi key "SAN_LUONG"
         * 
         * Ve response body cua no, minh khong can quan tam cac key khac, chi can quan tam duy
         * nhat 1 key `SO_TIEN`
         * Data["HDN_HDON"]["SO_TIEN"] --> trich xuat gia tri nay ra la co computed Cost
         */

const computeCost = async (kWh) => {
    if (kWh <= 0.01) {
        return 0.0;
    }

    const req = JSON.parse(`{
        "KIMUA_CSPK": "0",
        "LOAI_DDO": "1",
        "SO_HO": 1,
        "MA_CAPDAP": "1",
        "NGAY_DKY": "03/05/2024",
        "NGAY_CKY": "03/06/2024",
        "NGAY_DGIA": "01/01/1900",
        "HDG_BBAN_APGIA": [
            {
                "LOAI_BCS": "KT",
                "TGIAN_BANDIEN": "KT",
                "MA_NHOMNN": "SHBT",
                "MA_NGIA": "A"
            }
        ],
        "GCS_CHISO": [
            {
                "BCS": "KT",
                "SAN_LUONG": "${kWh}",
                "LOAI_CHISO": "DDK"
            }
        ]
    }`);

    const response = await fetch(
        `https://calc.evn.com.vn/TinhHoaDon/api/Calculate`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(req),
        }
    );

    const data = await response.json();

    return { raw: data, cost: data.Data.HDN_HDON[0].SO_TIEN };
};

export default computeCost;
