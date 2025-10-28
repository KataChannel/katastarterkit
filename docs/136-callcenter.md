API_URL= https://pbx01.onepos.vn:8080/api/v2/cdrs?domain=tazaspa102019&limit=200&from=2025-09-01%2000:00:00&to=2025-09-11%2023:59:59&offset=0

result = {
  "status": "success",
  "result_in_page": 200,
  "start_offset": "0",
  "next_offset": 200,
  "data": [
    {
      "uuid": "2d4cd1f6-8efb-11f0-ac6e-e3cd36bb494f",
      "direction": "outbound",
      "caller_id_number": "1036",
      "outbound_caller_id_number": "842871220655",
      "destination_number": "0336626159",
      "start_epoch": "1757586989",
      "end_epoch": "1757587081",
      "answer_epoch": "1757587015",
      "duration": "92",
      "billsec": "66",
      "sip_hangup_disposition": "by_caller",
      "record_path": "/tazaspa102019/archive/2025/Sep/11/2d4cd1f6-8efb-11f0-ac6e-e3cd36bb494f.mp3",
      "call_status": "ANSWER"
    },
    {
      "uuid": "e32dda66-8efa-11f0-ab45-e3cd36bb494f",
      "direction": "outbound",
      "caller_id_number": "1062",
      "outbound_caller_id_number": "842871220753",
      "destination_number": "0868393821",
      "start_epoch": "1757586865",
      "end_epoch": "1757586923",
      "answer_epoch": "0",
      "duration": "58",
      "billsec": "0",
      "sip_hangup_disposition": "by_callee",
      "record_path": null,
      "call_status": "CANCELED"
    },
    {
      "uuid": "c327aada-8efa-11f0-aa45-e3cd36bb494f",
      "direction": "outbound",
      "caller_id_number": "1062",
      "outbound_caller_id_number": "842871220456",
      "destination_number": "0868393821",
      "start_epoch": "1757586811",
      "end_epoch": "1757586859",
      "answer_epoch": "0",
      "duration": "48",
      "billsec": "0",
      "sip_hangup_disposition": "by_callee",
      "record_path": null,
      "call_status": "CANCELED"
    }]
}